"""Append-only successful history and independently replaceable UI drafts."""

from contextlib import contextmanager
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import sqlite3
import time

from .errors import BackendError

DEFAULT_STATE = {"selected_id": None, "draft": "", "cursor": 0, "result_scroll": 1, "direction": "en-zh"}
BUSY_TIMEOUT_MS = 15000


def _enable_wal(connection):
    # Concurrent DELETE -> WAL transitions can return SQLITE_BUSY immediately,
    # without invoking SQLite's busy handler, including BUSY_RECOVERY. Retry only
    # this statement's BUSY primary code, under one deadline; other SQL is unchanged.
    deadline = time.monotonic() + BUSY_TIMEOUT_MS / 1000
    connection.execute("PRAGMA busy_timeout=0")
    try:
        while True:
            try:
                connection.execute("PRAGMA journal_mode=WAL").fetchone()
                return
            except sqlite3.OperationalError as exc:
                remaining = deadline - time.monotonic()
                if (exc.sqlite_errorcode & 0xFF) != sqlite3.SQLITE_BUSY or remaining <= 0:
                    raise
                time.sleep(min(0.01, remaining))
    finally:
        connection.execute(f"PRAGMA busy_timeout={BUSY_TIMEOUT_MS}")


def validate_direction(direction):
    if not isinstance(direction, str) or direction not in ("en-zh", "zh-en"):
        raise BackendError("direction 仅支持 en-zh 或 zh-en。")
    return direction


def validate_state(state):
    if not isinstance(state, dict):
        raise BackendError("state 必须是对象。")
    result = {key: state.get(key, default) for key, default in DEFAULT_STATE.items()}
    validate_direction(result["direction"])
    selected = result["selected_id"]
    if selected is not None and (type(selected) is not int or selected <= 0):
        raise BackendError("selected_id 必须是正整数或 null。")
    if not isinstance(result["draft"], str):
        raise BackendError("draft 必须是字符串。")
    for key, minimum in (("cursor", 0), ("result_scroll", 1)):
        if type(result[key]) is not int or result[key] < minimum:
            raise BackendError("cursor 必须是非负整数，result_scroll 必须是正整数。")
    return result


class Storage:
    def __init__(self, path):
        self.path = Path(path)

    @contextmanager
    def connection(self):
        connection = None
        try:
            self.path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
            try:
                descriptor = os.open(self.path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
            except FileExistsError:
                pass
            else:
                os.close(descriptor)
            connection = sqlite3.connect(self.path, timeout=BUSY_TIMEOUT_MS / 1000)
            connection.row_factory = sqlite3.Row
            _enable_wal(connection)
            # Serialize schema inspection and migration across backend processes.
            # Existing rows retain their IDs/timestamps and gain the old default.
            connection.execute("BEGIN IMMEDIATE")
            connection.execute("""CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                created_at TEXT NOT NULL,
                result_json TEXT NOT NULL,
                direction TEXT NOT NULL DEFAULT 'en-zh'
            )""")
            columns = {row["name"] for row in connection.execute("PRAGMA table_info(entries)")}
            if "direction" not in columns:
                connection.execute("ALTER TABLE entries ADD COLUMN direction TEXT NOT NULL DEFAULT 'en-zh'")
            connection.execute("CREATE INDEX IF NOT EXISTS entries_text_direction ON entries(text, direction, id DESC)")
            connection.execute("""CREATE TABLE IF NOT EXISTS app_state (
                singleton INTEGER PRIMARY KEY CHECK(singleton=1), state_json TEXT NOT NULL
            )""")
            connection.commit()
            yield connection
        except (sqlite3.Error, OSError):
            raise BackendError("无法读写本地历史数据库，请检查权限、可用空间或稍后重试。") from None
        finally:
            if connection is not None:
                connection.close()

    @staticmethod
    def _entry(row):
        if row is None:
            return None
        try:
            result = json.loads(row["result_json"])
        except ValueError:
            raise BackendError("本地历史数据损坏，请保留数据库备份后检查。") from None
        return {"id": row["id"], "text": row["text"], "created_at": row["created_at"],
                "direction": row["direction"], "result": result}

    def cached(self, text, direction="en-zh"):
        validate_direction(direction)
        with self.connection() as connection:
            return self._entry(connection.execute(
                "SELECT * FROM entries WHERE text=? AND direction=? ORDER BY id DESC LIMIT 1", (text, direction),
            ).fetchone())

    def save_success(self, text, result, *, force=False, direction="en-zh"):
        validate_direction(direction)
        with self.connection() as connection:
            # Serialize the final cache check and insert so simultaneous identical
            # lookups cannot append duplicate rows unless explicitly forced.
            connection.execute("BEGIN IMMEDIATE")
            if not force:
                existing = self._entry(connection.execute(
                    "SELECT * FROM entries WHERE text=? AND direction=? ORDER BY id DESC LIMIT 1", (text, direction),
                ).fetchone())
                if existing:
                    connection.commit()
                    return existing, True
            created_at = datetime.now(timezone.utc).isoformat(timespec="microseconds")
            cursor = connection.execute(
                "INSERT INTO entries(text,created_at,result_json,direction) VALUES(?,?,?,?)",
                (text, created_at, json.dumps(result, ensure_ascii=False), direction),
            )
            entry = self._entry(connection.execute("SELECT * FROM entries WHERE id=?", (cursor.lastrowid,)).fetchone())
            connection.commit()
            return entry, False

    def load(self):
        with self.connection() as connection:
            # The state and complete history come from one SQLite snapshot.
            connection.execute("BEGIN")
            entries = [self._entry(row) for row in connection.execute("SELECT * FROM entries ORDER BY id DESC")]
            row = connection.execute("SELECT state_json FROM app_state WHERE singleton=1").fetchone()
            try:
                state = validate_state(json.loads(row[0])) if row else dict(DEFAULT_STATE)
            except (ValueError, BackendError):
                raise BackendError("本地草稿状态损坏，请保留数据库备份后检查。") from None
            return entries, state

    def save_state(self, state):
        state = validate_state(state)
        with self.connection() as connection:
            connection.execute(
                "INSERT INTO app_state(singleton,state_json) VALUES(1,?) "
                "ON CONFLICT(singleton) DO UPDATE SET state_json=excluded.state_json",
                (json.dumps(state, ensure_ascii=False),),
            )
            connection.commit()

"""SQLite history and UI state. Searches use Unicode casefold, never SQL LIKE."""

from contextlib import closing
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import sqlite3

from .messages import visible_text


DEFAULT_STATE = {
    "selected_id": None,
    "session_id": None,
    "draft": "",
    "cursor": [1, 0],  # Neovim row is 1-based; column is a 0-based BYTE offset.
    "result_scroll": 1,
    "web_search": False,
    "history_query": "",
}


def normalize_state(state: dict) -> dict:
    if not isinstance(state, dict):
        raise ValueError("state 必须是对象")
    result = dict(DEFAULT_STATE)
    for key in DEFAULT_STATE:
        if key in state:
            result[key] = state[key]
    if result["selected_id"] is not None and not isinstance(result["selected_id"], (str, int)):
        raise ValueError("selected_id 必须是历史 id 或 null")
    if result["session_id"] is not None and not isinstance(result["session_id"], str):
        raise ValueError("session_id 必须是字符串或 null")
    for key in ("draft", "history_query"):
        if not isinstance(result[key], str):
            raise ValueError(f"state.{key} 必须是字符串")
    cursor = result["cursor"]
    if not isinstance(cursor, list) or len(cursor) != 2 or any(type(i) is not int for i in cursor) or cursor[0] < 1 or cursor[1] < 0:
        raise ValueError("cursor 必须是 [row>=1, bytecol>=0]")
    if type(result["result_scroll"]) is not int or result["result_scroll"] < 1:
        raise ValueError("result_scroll 必须是正整数")
    if not isinstance(result["web_search"], bool):
        raise ValueError("state.web_search 必须是布尔值")
    return result


class Store:
    def __init__(self, path: Path):
        self.path = path
        path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        try:
            descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        except FileExistsError:
            pass
        else:
            os.close(descriptor)
        with closing(self.connect()) as connection, connection:
            connection.execute("""CREATE TABLE IF NOT EXISTS history (
                id TEXT PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL,
                web_search INTEGER NOT NULL, sources TEXT NOT NULL, created_at TEXT NOT NULL,
                provider TEXT, model TEXT
            )""")
            connection.execute("CREATE TABLE IF NOT EXISTS ui_state (id INTEGER PRIMARY KEY CHECK(id=1), value TEXT NOT NULL)")
            connection.execute("""CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY, path TEXT NOT NULL UNIQUE, cwd TEXT NOT NULL,
                title TEXT NOT NULL, web_search INTEGER NOT NULL, updated_at TEXT NOT NULL,
                history_text TEXT NOT NULL DEFAULT ''
            )""")

    @property
    def session_dir(self):
        path = self.path.resolve().parent / "sessions"
        path.mkdir(parents=True, exist_ok=True, mode=0o700)
        path.chmod(0o700)
        return path

    def connect(self):
        connection = sqlite3.connect(self.path, timeout=5)
        connection.row_factory = sqlite3.Row
        return connection

    def entries(self):
        with closing(self.connect()) as connection:
            rows = connection.execute("SELECT * FROM history ORDER BY rowid DESC").fetchall()
        result = []
        for row in rows:
            entry = dict(row)
            entry["web_search"] = bool(entry["web_search"])
            entry["sources"] = json.loads(entry["sources"])
            for field in ("provider", "model"):
                if entry[field] is None:
                    del entry[field]
            result.append(entry)
        return result

    def add(self, entry):
        with closing(self.connect()) as connection, connection:
            connection.execute(
                "INSERT INTO history VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (entry["id"], entry["question"], entry["answer"], entry["web_search"],
                 json.dumps(entry["sources"], ensure_ascii=False), entry["created_at"],
                 entry.get("provider"), entry.get("model")),
            )

    def load_state(self):
        with closing(self.connect()) as connection:
            row = connection.execute("SELECT value FROM ui_state WHERE id=1").fetchone()
        return normalize_state(json.loads(row[0]) if row else {})

    def save_state(self, state):
        state = normalize_state(state)
        with closing(self.connect()) as connection, connection:
            connection.execute(
                "INSERT INTO ui_state VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET value=excluded.value",
                (json.dumps(state, ensure_ascii=False),),
            )

    def session(self, session_id):
        with closing(self.connect()) as connection:
            row = connection.execute("SELECT * FROM sessions WHERE id=?", (session_id,)).fetchone()
        if row is None:
            raise ValueError("找不到该会话，请刷新历史记录")
        result = dict(row)
        result.pop("history_text")
        result["web_search"] = bool(result["web_search"])
        return result

    def index_session(self, path, web_search=None, session_id=None, cwd=None):
        """Index full persisted branches, never only Pi's compacted get_messages."""
        path = Path(path)
        if not path.is_absolute():
            raise ValueError("Pi 会话路径必须是绝对路径")
        header, texts, title = {}, [], ""
        try:
            with path.open("rb") as stream:
                for line in stream:
                    try:
                        entry = json.loads(line)
                    except (ValueError, UnicodeError):
                        continue  # A live JSONL writer may have an incomplete last line.
                    if not isinstance(entry, dict):
                        continue
                    if entry.get("type") == "session":
                        header = entry
                    message = entry.get("message", {})
                    if entry.get("type") == "message" and isinstance(message, dict) and message.get("role") in ("user", "assistant"):
                        text = visible_text(message)
                        texts.append(text)
                        if not title and message["role"] == "user":
                            title = " ".join(text.split())[:100]
            updated_at = datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).isoformat()
            if path.is_relative_to(self.session_dir):
                path.chmod(0o600)
        except FileNotFoundError:
            # Native sessions may not be written until the first message.
            updated_at = datetime.now(timezone.utc).isoformat()
        session_id = header.get("id") or session_id
        cwd = header.get("cwd") or cwd
        if not isinstance(session_id, str) or not isinstance(cwd, str):
            return None
        with closing(self.connect()) as connection, connection:
            previous = connection.execute("SELECT * FROM sessions WHERE id=?", (session_id,)).fetchone()
            mode = bool(web_search) if web_search is not None else bool(previous["web_search"]) if previous else False
            if not path.exists() and previous is None:
                return {"id": session_id, "path": str(path), "cwd": cwd, "title": "新会话",
                        "web_search": mode, "updated_at": updated_at}
            connection.execute("""INSERT INTO sessions VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET path=excluded.path, cwd=excluded.cwd,
                title=excluded.title, web_search=excluded.web_search, updated_at=excluded.updated_at,
                history_text=excluded.history_text""",
                (session_id, str(path), cwd, title or (previous["title"] if previous else "新会话"), mode,
                 updated_at, "\n".join(texts) if header else previous["history_text"] if previous else ""))
        return self.session(session_id)

    def refresh_sessions(self):
        with closing(self.connect()) as connection:
            paths = {row[0] for row in connection.execute("SELECT path FROM sessions")}
        paths.update(str(path.resolve()) for path in self.session_dir.rglob("*.jsonl"))
        for path in paths:
            try:
                self.index_session(path)
            except OSError:
                continue  # Keep the last index if a historical file is unavailable.

    def sessions(self):
        self.refresh_sessions()
        with closing(self.connect()) as connection:
            ids = [row[0] for row in connection.execute("SELECT id FROM sessions ORDER BY updated_at DESC")]
        return [self.session(session_id) for session_id in ids]

    def search(self, query):
        if not isinstance(query, str):
            raise ValueError("query 必须是字符串")
        needle = query.casefold()
        self.refresh_sessions()
        entries = []
        with closing(self.connect()) as connection:
            rows = connection.execute("SELECT * FROM sessions ORDER BY updated_at DESC").fetchall()
        for row in rows:
            if needle in row["history_text"].casefold() or needle in row["title"].casefold():
                entry = self.session(row["id"])
                entry.update(kind="session", question=entry["title"], search_snippet=answer_snippet(row["history_text"], needle))
                entries.append(entry)
        for entry in self.entries():
            if needle in (entry["question"] + "\n" + entry["answer"]).casefold():
                entry["kind"] = "legacy"
                entry["search_snippet"] = answer_snippet(entry["answer"], needle)
                entries.append(entry)
        return entries


def answer_snippet(answer, needle, width=180):
    """Map a casefold match back to original text (including expanding ß → ss)."""
    found = answer.casefold().find(needle) if needle else -1
    start = 0
    if found >= 0:
        folded_offset = 0
        for index, char in enumerate(answer):
            folded_offset += len(char.casefold())
            if folded_offset > found:
                start = max(0, index - 45)
                break
    snippet = answer[start:start + width]
    return ("…" if start else "") + snippet + ("…" if start + width < len(answer) else "")

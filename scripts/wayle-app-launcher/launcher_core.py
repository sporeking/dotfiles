from __future__ import annotations

import json
import os
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Collection, Iterable, Sequence


STATE_VERSION = 1


class LauncherStateError(RuntimeError):
    """Raised when launcher state is missing, malformed, or inconsistent."""


@dataclass(frozen=True, slots=True)
class AppRecord:
    desktop_id: str
    name: str
    generic_name: str = ""
    app_info: object | None = None


def _validate_favorite_id(value: object, index: int) -> str:
    if not isinstance(value, str) or not value.strip():
        raise LauncherStateError(
            f"favorites[{index}] must be a non-empty desktop-entry ID"
        )
    return value


def validate_favorites(
    payload: object,
    available_ids: Collection[str],
) -> list[str]:
    if not isinstance(payload, dict):
        raise LauncherStateError("favorites state must be a JSON object")
    if set(payload) != {"version", "favorites"}:
        raise LauncherStateError(
            "favorites state must contain only 'version' and 'favorites'"
        )
    if payload["version"] != STATE_VERSION:
        raise LauncherStateError(
            f"unsupported favorites state version: {payload['version']!r}"
        )
    values = payload["favorites"]
    if not isinstance(values, list):
        raise LauncherStateError("favorites must be an array")

    available = set(available_ids)
    result: list[str] = []
    seen: set[str] = set()
    for index, value in enumerate(values):
        desktop_id = _validate_favorite_id(value, index)
        if desktop_id in seen:
            raise LauncherStateError(
                f"favorites[{index}] duplicates desktop-entry ID {desktop_id!r}"
            )
        if desktop_id not in available:
            raise LauncherStateError(
                f"favorites[{index}] references unavailable desktop-entry ID "
                f"{desktop_id!r}"
            )
        seen.add(desktop_id)
        result.append(desktop_id)
    return result


def load_favorites(path: Path, available_ids: Collection[str]) -> list[str]:
    path = Path(path)
    if not path.exists():
        if path.is_symlink():
            raise LauncherStateError(f"favorites path is a broken symlink: {path}")
        return []
    if not path.is_file():
        raise LauncherStateError(f"favorites path is not a regular file: {path}")

    try:
        with path.open("r", encoding="utf-8") as stream:
            payload = json.load(stream)
    except json.JSONDecodeError as exc:
        raise LauncherStateError(f"invalid JSON in favorites file {path}: {exc}") from exc
    except OSError as exc:
        raise LauncherStateError(f"cannot read favorites file {path}: {exc}") from exc
    return validate_favorites(payload, available_ids)


def save_favorites(
    path: Path,
    favorite_ids: Sequence[str],
    available_ids: Collection[str],
) -> None:
    path = Path(path)
    payload = {"version": STATE_VERSION, "favorites": list(favorite_ids)}
    validated = validate_favorites(payload, available_ids)
    parent = path.parent
    temporary_path: Path | None = None

    try:
        parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
            delete=False,
        ) as stream:
            temporary_path = Path(stream.name)
            json.dump(
                {"version": STATE_VERSION, "favorites": validated},
                stream,
                ensure_ascii=False,
                indent=2,
            )
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary_path, path)
        temporary_path = None
    except OSError as exc:
        raise LauncherStateError(f"cannot write favorites file {path}: {exc}") from exc
    finally:
        if temporary_path is not None:
            try:
                temporary_path.unlink(missing_ok=True)
            except OSError as cleanup_error:
                raise LauncherStateError(
                    f"cannot remove temporary favorites file {temporary_path}: "
                    f"{cleanup_error}"
                ) from cleanup_error


def search_records(records: Sequence[AppRecord], query: str) -> list[AppRecord]:
    normalized = query.strip().casefold()
    if not normalized:
        return list(records)

    return [
        record
        for record in records
        if normalized in record.name.casefold()
        or normalized in record.generic_name.casefold()
        or normalized in record.desktop_id.casefold()
    ]


def favorite_records(
    records: Sequence[AppRecord],
    favorite_ids: Iterable[str],
) -> list[AppRecord]:
    by_id: dict[str, AppRecord] = {}
    for record in records:
        if record.desktop_id in by_id:
            raise LauncherStateError(
                f"application discovery returned duplicate desktop-entry ID "
                f"{record.desktop_id!r}"
            )
        by_id[record.desktop_id] = record

    result: list[AppRecord] = []
    seen: set[str] = set()
    for desktop_id in favorite_ids:
        if desktop_id in seen:
            raise LauncherStateError(
                f"favorite list contains duplicate desktop-entry ID {desktop_id!r}"
            )
        if desktop_id not in by_id:
            raise LauncherStateError(
                f"favorite list references unavailable desktop-entry ID "
                f"{desktop_id!r}"
            )
        seen.add(desktop_id)
        result.append(by_id[desktop_id])
    return result

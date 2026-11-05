"""One JSON request on stdin; ask streams NDJSON, other actions return one JSON."""

from datetime import datetime, timezone
import json
from pathlib import Path
import signal
import sys
import uuid

from .config import db_path, load_config
from .pi import PiError, ask
from .store import Store


def emit(value):
    print(json.dumps(value, ensure_ascii=False), flush=True)


def main():
    action = None
    cancelled = False

    def cancel(_signal, _frame):
        nonlocal cancelled
        cancelled = True

    for signum in (signal.SIGINT, signal.SIGTERM):
        signal.signal(signum, cancel)
    try:
        if sys.argv[1:] == ["serve"]:
            action = "serve"
            from .server import serve
            return serve(load_config(), Store(db_path()), emit)
        request = json.load(sys.stdin)
        if not isinstance(request, dict):
            raise ValueError("请求必须是 JSON 对象")
        action = request.get("action", request.get("op"))
        config = load_config()
        store = Store(db_path())
        if action == "load":
            emit({"ok": True, "entries": store.entries(), "sessions": store.sessions(), "state": store.load_state(),
                  "config": {"input_method": config.input_method,
                             "workspace": str(Path(config.workspace).expanduser().resolve())}})
        elif action == "save_state":
            store.save_state(request.get("state"))
            emit({"ok": True})
        elif action == "search":
            emit({"ok": True, "entries": store.search(request.get("query", ""))})
        elif action == "ask":
            question = request.get("question")
            web_search = request.get("web_search", False)
            if not isinstance(question, str) or not question.strip():
                raise ValueError("问题不能为空")
            if not isinstance(web_search, bool):
                raise ValueError("web_search 必须是布尔值")
            result = ask(config, question, web_search, emit, lambda: cancelled)
            if cancelled:
                raise PiError("已取消回答")
            entry = {"id": str(uuid.uuid4()), "question": question, **result,
                     "web_search": web_search,
                     "created_at": datetime.now(timezone.utc).isoformat()}
            store.add(entry)
            emit({"event": "done", "entry": entry})
        else:
            raise ValueError("未知 action；支持 load、save_state、search、ask")
        return 0
    except BrokenPipeError:
        # A closing editor must not leave a model/tool process behind.
        return 1
    except (ValueError, OSError, PiError) as error:
        if action in ("ask", "serve"):
            emit({"event": "error", "error": str(error)})
        else:
            emit({"ok": False, "error": str(error)})
        return 1
    except Exception:
        # Avoid dumping subprocess environments or raw provider diagnostic data.
        if action in ("ask", "serve"):
            emit({"event": "error", "error": "后端处理失败"})
        else:
            emit({"ok": False, "error": "后端处理失败"})
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

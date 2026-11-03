"""JSON stdin/stdout entrypoint: python3 -m translator_backend."""

import json
import sys

from .app import handle_request
from .errors import BackendError

MAX_REQUEST_BYTES = 2 * 1024 * 1024


def main():
    try:
        raw = sys.stdin.buffer.readline(MAX_REQUEST_BYTES + 1)
        if len(raw) > MAX_REQUEST_BYTES:
            raise BackendError("请求过大，请缩短输入。")
        try:
            request = json.loads(raw.decode("utf-8"))
        except (UnicodeError, ValueError):
            raise BackendError("请求不是有效的 UTF-8 JSON。") from None
        response = handle_request(request)
    except BackendError as exc:
        response = {"ok": False, "error": str(exc)}
    except Exception:
        # Arbitrary exceptions may contain URLs, credentials, server response
        # bodies or private config contents. Never print/log the exception.
        response = {"ok": False, "error": "后端处理失败，请检查配置或本地数据库后重试。"}
    sys.stdout.write(json.dumps(response, ensure_ascii=False) + "\n")
    sys.stdout.flush()


if __name__ == "__main__":
    main()

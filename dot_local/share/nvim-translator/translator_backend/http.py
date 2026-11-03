"""Small bounded HTTP client; never expose URLs, headers or server error bodies."""

import json
import socket
import urllib.error
import urllib.request

from .errors import BackendError

MAX_RESPONSE_BYTES = 4 * 1024 * 1024


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        # Never forward an Authorization/x-api-key header to another endpoint.
        return None


def request_json(url, *, timeout, service, payload=None, headers=None):
    request_headers = {"Accept": "application/json", "User-Agent": "nvim-translator/1.0"}
    request_headers.update(headers or {})
    body = None
    if payload is not None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        request_headers["Content-Type"] = "application/json"
    try:
        request = urllib.request.Request(url, data=body, headers=request_headers)
        with urllib.request.build_opener(_NoRedirect()).open(request, timeout=timeout) as response:
            raw = response.read(MAX_RESPONSE_BYTES + 1)
        if len(raw) > MAX_RESPONSE_BYTES:
            raise BackendError(f"{service}响应过大，请缩短输入或稍后重试。")
    except urllib.error.HTTPError as exc:
        code = exc.code
        exc.close()
        if code in (401, 403):
            detail = "认证或访问被拒绝，请检查配置或稍后重试"
        elif code == 429:
            detail = "请求过于频繁或配额不足，请稍后重试"
        elif 300 <= code < 400:
            detail = "发生重定向，请检查 API 根地址"
        else:
            detail = "服务请求失败，请稍后重试"
        raise BackendError(f"{service} HTTP {code}：{detail}。") from None
    except (TimeoutError, socket.timeout):
        raise BackendError(f"{service}网络超时，请稍后重试。") from None
    except (urllib.error.URLError, OSError, ValueError):
        raise BackendError(f"{service}网络连接失败，请检查网络和服务地址。") from None
    try:
        result = json.loads(raw.decode("utf-8-sig"))
    except (UnicodeError, ValueError):
        raise BackendError(f"{service}返回的不是有效 JSON，请稍后重试。") from None
    if not isinstance(result, dict):
        raise BackendError(f"{service}返回了异常数据结构，请稍后重试。")
    if result.get("error") or result.get("error_code"):
        raise BackendError(f"{service}返回服务错误，请检查配置或稍后重试。")
    return result

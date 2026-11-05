"""One-request backend API shared by CLI and tests."""

from .config import database_path, load_config
from .dictionary import clearly_sentence, lookup_dictionary, normalize_text
from .errors import BackendError
from .llm import translate
from .storage import Storage, validate_direction

MAX_TEXT_CHARACTERS = 100_000


def handle_request(request, *, config=None, storage=None):
    """Process a request; callers may inject isolated config/storage in tests.

    Expected failures raise BackendError. The CLI is the credential-safe boundary
    for unexpected failures and never emits exception representations/tracebacks.
    """
    if not isinstance(request, dict):
        raise BackendError("请求必须是 JSON 对象。")
    operation = request.get("op")
    if operation not in ("load", "config", "save_state", "lookup"):
        raise BackendError("未知操作；支持 load、lookup、save_state 和 config。")
    if operation == "lookup":
        direction = validate_direction(request.get("direction", "en-zh"))
    if operation == "save_state":
        store = storage or Storage(database_path())
        store.save_state(request.get("state"))
        return {"ok": True}
    configuration = config or load_config()
    if operation == "config":
        return {"ok": True, "config": configuration.public()}
    store = storage or Storage(database_path())
    if operation == "load":
        entries, state = store.load()
        return {"ok": True, "entries": entries, "state": state, "config": configuration.public()}
    text = request.get("text")
    if not isinstance(text, str):
        raise BackendError("查询 text 必须是字符串。")
    if len(text) > MAX_TEXT_CHARACTERS:
        raise BackendError("输入过长，请分段翻译（每次最多 100000 字符）。")
    text = normalize_text(text)
    if not text:
        raise BackendError("请输入要翻译的单词、短语或句子。")
    force = request.get("force", False)
    if not isinstance(force, bool):
        raise BackendError("force 必须是 true 或 false。")
    if not force:
        existing = store.cached(text, direction=direction)
        if existing:
            return {"ok": True, "entry": existing, "cached": True}
    result = None
    if direction == "en-zh" and configuration.dictionary_enabled and not clearly_sentence(text):
        result = lookup_dictionary(text, timeout=configuration.dictionary_timeout,
                                   examples=configuration.ui["examples"])
    if result is None:
        # A dictionary failure propagates; only a real lexical miss, sentence,
        # dictionary-disabled setting or explicit zh-en request uses the LLM.
        result = translate(text, configuration, direction=direction)
    entry, cached = store.save_success(text, result, force=force, direction=direction)
    return {"ok": True, "entry": entry, "cached": cached}

"""Private TOML configuration; only UI options may be exposed by the API."""

from dataclasses import dataclass, field
import math
import os
from pathlib import Path
import tomllib
from urllib.parse import urlsplit

from .errors import BackendError


ROOTS = {
    "openai": "https://api.openai.com/v1",
    "openai-responses": "https://api.openai.com/v1",
    "anthropic": "https://api.anthropic.com/v1",
    "gemini": "https://generativelanguage.googleapis.com/v1beta",
}
UI_DEFAULTS = {
    "auto_pronounce": True,
    "accent": "us",
    "examples": True,
    "input_method": True,
}


@dataclass(frozen=True)
class Config:
    # repr must never print credentials, including a credential-bearing URL.
    protocol: str = "openai"
    base_url: str = field(default=ROOTS["openai"], repr=False)
    model: str = ""
    api_key: str = field(default="", repr=False)
    llm_timeout: float = 45
    dictionary_enabled: bool = True
    dictionary_timeout: float = 8
    ui: dict = field(default_factory=lambda: dict(UI_DEFAULTS))

    def public(self):
        return {key: self.ui[key] for key in UI_DEFAULTS}


def config_path():
    root = Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config")
    return Path(os.environ.get("TRANSLATOR_CONFIG") or root / "nvim-translator/config.toml").expanduser()


def database_path():
    root = Path(os.environ.get("XDG_DATA_HOME") or Path.home() / ".local/share")
    return Path(os.environ.get("TRANSLATOR_DB") or root / "nvim-translator/history.sqlite3").expanduser()


def _timeout(value):
    if isinstance(value, bool) or not isinstance(value, (float, int)):
        raise BackendError("配置中的 timeout 必须是正数。")
    if not math.isfinite(value) or not 0 < value <= 600:
        raise BackendError("配置中的 timeout 必须大于 0 且不超过 600 秒。")
    return float(value)


def _boolean(value):
    if not isinstance(value, bool):
        raise BackendError("配置中的开关必须使用 true 或 false。")
    return value


def _string(value):
    if not isinstance(value, str):
        raise BackendError("配置中的文本字段必须是字符串。")
    return value.strip()


def _read_toml(path):
    try:
        with path.open("rb") as stream:
            return tomllib.load(stream)
    except FileNotFoundError:
        return {}
    except (OSError, ValueError):
        # TOML exceptions may quote a private api_key line. Never echo them.
        raise BackendError("无法读取配置：请检查 TOML 格式和文件权限。") from None


def _merge_tables(base, override):
    merged = dict(base)
    for key, value in override.items():
        if isinstance(merged.get(key), dict) and isinstance(value, dict):
            merged[key] = _merge_tables(merged[key], value)
        else:
            merged[key] = value
    return merged


def load_config(path=None):
    """Overlay foo.local.toml on foo.toml, then apply credential environment.

    The optional local file stays beside the configured path (including symlinks),
    letting the public TOML be tracked without tracking machine-local credentials.
    Both files use the same validation and credential-safe error handling.
    """
    path = Path(path or config_path())
    local_path = path.with_name(path.stem + ".local" + path.suffix)
    raw = _merge_tables(_read_toml(path), _read_toml(local_path))
    sections = [raw.get(name, {}) for name in ("llm", "dictionary", "ui")]
    if not all(isinstance(section, dict) for section in sections):
        raise BackendError("配置中的 llm、dictionary 和 ui 必须是 TOML 节。")
    llm, dictionary, ui_raw = sections
    protocol = _string(llm.get("protocol", "openai"))
    if protocol not in ROOTS:
        raise BackendError("不支持的 LLM 协议；可用 openai、openai-responses、anthropic、gemini。")
    base_url = _string(llm.get("base_url", ROOTS[protocol])).rstrip("/")
    try:
        parts = urlsplit(base_url)
        valid = (parts.scheme in ("http", "https") and parts.hostname and
                 not parts.username and not parts.password and not parts.query and not parts.fragment)
        parts.port  # Validate malformed/non-numeric ports without echoing the URL.
    except ValueError:
        valid = False
    if not valid:
        raise BackendError("LLM base_url 必须是 http(s) API 根地址，不能含凭据、查询参数或片段。")
    model = _string(llm.get("model", ""))
    env_name = _string(llm.get("api_key_env", "TRANSLATOR_API_KEY"))
    local_key = _string(llm.get("api_key", ""))
    api_key = (os.environ.get(env_name, "").strip() if env_name else "") or local_key
    if any(char in api_key for char in "\r\n\x00"):
        raise BackendError("LLM 凭据含非法控制字符，请重新配置。")
    public = dict(UI_DEFAULTS)
    for key in ("auto_pronounce", "examples", "input_method"):
        public[key] = _boolean(ui_raw.get(key, public[key]))
    public["accent"] = _string(ui_raw.get("accent", "us"))
    if public["accent"] not in ("us", "uk"):
        raise BackendError("ui.accent 仅支持 us 或 uk。")
    return Config(
        protocol=protocol, base_url=base_url, model=model, api_key=api_key,
        llm_timeout=_timeout(llm.get("timeout", 45)),
        dictionary_enabled=_boolean(dictionary.get("enabled", True)),
        dictionary_timeout=_timeout(dictionary.get("timeout", 8)), ui=public,
    )

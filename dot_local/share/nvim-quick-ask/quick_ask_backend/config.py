"""Application settings; Pi alone owns provider credentials and model defaults."""

from dataclasses import dataclass
import math
import os
from pathlib import Path
import tomllib


@dataclass(frozen=True)
class Config:
    command: str = "pi"
    provider: str = ""
    model: str = ""
    thinking: str = "off"
    timeout: float = 180
    web_extension: str = ""
    input_method: bool = True


def config_path() -> Path:
    return Path(os.environ.get("QUICK_ASK_CONFIG") or "~/.config/nvim-quick-ask/config.toml").expanduser()


def db_path() -> Path:
    return Path(os.environ.get("QUICK_ASK_DB") or "~/.local/share/nvim-quick-ask/history.sqlite3").expanduser()


def load_config() -> Config:
    path = config_path()
    if not path.exists():
        return Config()
    with path.open("rb") as stream:
        data = tomllib.load(stream)
    pi, ui = data.get("pi", {}), data.get("ui", {})
    if not isinstance(pi, dict) or not isinstance(ui, dict):
        raise ValueError("配置中的 pi 和 ui 必须是表")
    values = {}
    for key in ("command", "provider", "model", "thinking", "web_extension"):
        value = pi.get(key, getattr(Config(), key))
        if not isinstance(value, str) or "\x00" in value:
            raise ValueError(f"pi.{key} 必须是字符串")
        values[key] = value
    if not values["command"].strip():
        raise ValueError("pi.command 不能为空")
    if values["thinking"] not in ("off", "minimal", "low", "medium", "high", "xhigh", "max"):
        raise ValueError("pi.thinking 无效")
    # A provider-only override would leave Pi with an ambiguous/default model.
    if values["provider"] and not values["model"]:
        raise ValueError("指定 pi.provider 时也须指定 pi.model")
    timeout = pi.get("timeout", 180)
    if isinstance(timeout, bool) or not isinstance(timeout, (int, float)) or not math.isfinite(timeout) or timeout <= 0:
        raise ValueError("pi.timeout 必须是正数（秒）")
    input_method = ui.get("input_method", True)
    if not isinstance(input_method, bool):
        raise ValueError("ui.input_method 必须是布尔值")
    return Config(**values, timeout=timeout, input_method=input_method)

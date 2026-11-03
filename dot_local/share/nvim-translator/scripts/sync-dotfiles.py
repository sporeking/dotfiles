#!/usr/bin/env python3
"""Copy the translator's public source/config into an existing chezmoi checkout."""
import argparse
import json
from pathlib import Path
import subprocess
import tomllib
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
FIELDS = {
    "llm": ("protocol", "base_url", "model", "api_key_env", "timeout"),
    "dictionary": ("enabled", "timeout"),
    "ui": ("auto_pronounce", "accent", "examples", "input_method"),
}


def public_config(path):
    source = path if path.is_file() else ROOT / "config.toml.example"
    with source.open("rb") as stream:
        config = tomllib.load(stream)
    lines = ["# Public settings managed by chezmoi.",
             "# Credentials: TRANSLATOR_API_KEY or untracked config.local.toml.", ""]
    for section, names in FIELDS.items():
        lines.append(f"[{section}]")
        for name in names:
            value = config.get(section, {}).get(name)
            if value is None:
                continue
            if name == "base_url":
                url = urlsplit(value)
                if url.username or url.password or url.query or url.fragment:
                    raise ValueError("Refusing to sync a credential-bearing API URL")
            if not isinstance(value, (str, bool, int, float)):
                raise ValueError("Unsupported public configuration value")
            lines.append(f"{name} = {json.dumps(value, ensure_ascii=False)}")
        lines.append("")
    return "\n".join(lines).encode("utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dotfiles", type=Path, help="chezmoi source directory (default: chezmoi source-path)")
    parser.add_argument("--config", type=Path, default=Path.home() / ".config/nvim-translator/config.toml")
    args = parser.parse_args()
    repo = args.dotfiles or Path(subprocess.check_output(["chezmoi", "source-path"], text=True).strip())
    repo = repo.expanduser().resolve()
    if not (repo / ".git").exists():
        parser.error("--dotfiles must be an existing Git checkout/worktree")
    package = repo / "dot_local/share/nvim-translator"
    files = [Path(name) for name in (
        "README.md", "INTERFACE.md", "config.toml.example", "bin/translator",
        "tests/test_backend.py", "tests/test_launcher.py", "tests/test_sync_dotfiles.py", "tests/desktop_smoke.py",
        "tests/nvim_smoke.lua", "scripts/sync-dotfiles.py",
    )]
    for directory, pattern in (("translator_backend", "*.py"), ("nvim", "**/*.lua"), ("hyprland", "*.lua")):
        files.extend(path.relative_to(ROOT) for path in (ROOT / directory).glob(pattern) if path.is_file())
    outputs = {}
    for relative in files:
        installed = Path("bin/executable_translator") if relative == Path("bin/translator") else relative
        outputs[package / installed] = (ROOT / relative).read_bytes()
    outputs[repo / "dot_local/bin/executable_translator"] = (
        '#!/bin/sh\nexec python3 "${HOME:?}/.local/share/nvim-translator/bin/translator" "$@"\n'
    ).encode()
    outputs[repo / "dot_config/nvim-translator/private_config.toml"] = public_config(args.config)
    changed = 0
    for path, content in outputs.items():
        previous = path.read_bytes() if path.exists() else None
        if previous == content:
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        changed += 1
    print(f"Synced {len(outputs)} public files ({changed} changed) into {repo}")
    print("Private overrides, credentials, history, caches and logs were not copied.")


if __name__ == "__main__":
    main()

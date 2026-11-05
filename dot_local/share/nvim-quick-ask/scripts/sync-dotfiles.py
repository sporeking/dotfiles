#!/usr/bin/env python3
"""Sync only public quick-ask source and settings into a chezmoi checkout."""
import argparse
import json
from pathlib import Path
import subprocess
import tomllib

ROOT = Path(__file__).resolve().parents[1]
FIELDS = {"pi": ("command",), "agent": ("workspace",)}
# Only obsolete public program files; never databases, native sessions or config overrides.
RETIRED_FILES = (
    "quick_ask_backend/__init__.py", "quick_ask_backend/__main__.py",
    "quick_ask_backend/config.py", "quick_ask_backend/store.py", "quick_ask_backend/pi.py",
    "quick_ask_backend/agent.py", "quick_ask_backend/messages.py", "quick_ask_backend/server.py",
    "nvim/init.lua", "nvim/lua/quick_ask/init.lua", "extensions/web-search.ts",
    "tests/test_backend.py", "tests/test_agent.py", "tests/nvim_smoke.lua", "tests/desktop_pi.py",
)


def public_config(path):
    source = path if path.is_file() else ROOT / "config.toml.example"
    with source.open("rb") as stream:
        config = tomllib.load(stream)
    with (ROOT / "config.toml.example").open("rb") as stream:
        defaults = tomllib.load(stream)
    lines = ["# Public quick-ask settings. Pi owns model credentials; none are copied here.", ""]
    for section, fields in FIELDS.items():
        lines.append(f"[{section}]")
        for name in fields:
            value = config.get(section, {}).get(name, defaults.get(section, {}).get(name))
            if value is None:
                continue
            if not isinstance(value, (str, bool, int, float)):
                raise ValueError("Unsupported public setting")
            lines.append(f"{name} = {json.dumps(value, ensure_ascii=False)}")
        lines.append("")
    return "\n".join(lines).encode()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dotfiles", type=Path)
    parser.add_argument("--config", type=Path, default=Path.home() / ".config/nvim-quick-ask/config.toml")
    args = parser.parse_args()
    repo = args.dotfiles or Path(subprocess.check_output(["chezmoi", "source-path"], text=True).strip())
    repo = repo.expanduser().resolve()
    if not (repo / ".git").exists():
        parser.error("--dotfiles must be a Git checkout/worktree")
    package = repo / "dot_local/share/nvim-quick-ask"
    files = [Path(name) for name in ("README.md", "INTERFACE.md", "config.toml.example", "bin/quick-ask", "scripts/sync-dotfiles.py")]
    files.extend(Path(name) for name in ("extensions/vim-navigation.ts", "kitty/copy.conf", "kitty/copy.lua", "tests/test_launcher.py", "tests/native_pi_smoke.py", "tests/desktop_smoke.py"))
    files.extend(path.relative_to(ROOT) for path in (ROOT / "hyprland").glob("*.lua") if path.is_file())
    for relative in RETIRED_FILES:
        retired = package / relative
        if retired.exists():
            if not retired.resolve().is_relative_to(package.resolve()) or not retired.is_file():
                raise ValueError(f"Unexpected retired source target: {retired}")
            retired.unlink()
    outputs = {}
    for relative in files:
        # The public CLI wrapper invokes this Python source explicitly; keeping
        # its name also keeps documentation links valid before/after chezmoi.
        outputs[package / relative] = (ROOT / relative).read_bytes()
    outputs[repo / "dot_local/bin/executable_quick-ask"] = (
        '#!/bin/sh\nexec python3 "${HOME:?}/.local/share/nvim-quick-ask/bin/quick-ask" "$@"\n'
    ).encode()
    outputs[repo / "dot_config/nvim-quick-ask/private_config.toml"] = public_config(args.config)
    # Both entry points use the same physical extension, which Pi deduplicates.
    outputs[repo / "dot_pi/agent/extensions/symlink_vim-navigation.ts"] = b"../../../.local/share/nvim-quick-ask/extensions/vim-navigation.ts\n"
    outputs[repo / "dot_config/kitty/symlink_pi-copy.conf"] = b"../../.local/share/nvim-quick-ask/kitty/copy.conf\n"
    changed = 0
    for path, content in outputs.items():
        if path.exists() and path.read_bytes() == content:
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        changed += 1
    print(f"Synced {len(outputs)} public files ({changed} changed) into {repo}")
    print("Pi credentials, local overrides, history and runtime files were not copied.")


if __name__ == "__main__":
    main()

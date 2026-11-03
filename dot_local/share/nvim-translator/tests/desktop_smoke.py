"""Opt-in real desktop check. Uses only the dedicated translator app-id.

Run from a desktop session: python3 tests/desktop_smoke.py
All subprocesses remain under this supervisor, including sandboxed runs.
"""
import json
import os
from pathlib import Path
import shlex
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
(ROOT / ".runtime").mkdir(exist_ok=True)
DATA = Path(tempfile.mkdtemp(prefix="desktop-", dir=ROOT / ".runtime"))
CONFIG = DATA / "config.toml"
CONFIG.write_text('[ui]\nauto_pronounce=false\ninput_method=false\n', encoding="utf-8")
OVERRIDES = {
    "TRANSLATOR_RUNTIME_DIR": str(DATA / "control"), "TRANSLATOR_DB": str(DATA / "history.sqlite3"),
    "TRANSLATOR_CONFIG": str(CONFIG), "XDG_STATE_HOME": str(DATA / "state"),
    "XDG_DATA_HOME": str(DATA / "data"), "XDG_CACHE_HOME": str(DATA / "cache"),
}
ENV = os.environ | OVERRIDES
SOCKET = DATA / "control/nvim.sock"


def run(command):
    result = subprocess.run(command, cwd=ROOT, env=ENV, text=True, capture_output=True, timeout=20)
    if result.returncode:
        raise RuntimeError(f"{command[:3]}: {result.stdout} {result.stderr}")
    return result.stdout.strip()


def ctl(action):
    return run(["python3", str(ROOT / "bin/translator"), action])


def rpc(code):
    return run(["nvim", "--headless", "--server", str(SOCKET), "--remote-expr", "luaeval(" + json.dumps(code) + ")"])


def wait_for(check, description, seconds=20):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        if check():
            return
        time.sleep(0.1)
    raise AssertionError("Timed out: " + description)


def desktop_toggle(expected_visible):
    # Exercise the actual compositor/keybind launch environment. A remote Neovim
    # client can otherwise enter TUI mode and send its result to stderr here,
    # even though a direct subprocess test from a terminal succeeds.
    command = shlex.join(["env", *[f"{k}={v}" for k, v in OVERRIDES.items()],
                          "python3", str(ROOT / "bin/translator"), "toggle"])
    run(["hyprctl", "eval", "hl.dispatch(hl.dsp.exec_cmd(" + json.dumps(command) + "))"])
    wait_for(lambda: json.loads(ctl("status"))["visible"] == expected_visible,
             "compositor shortcut toggle")
    if expected_visible:
        wait_for(lambda: json.loads(run(["hyprctl", "-j", "activewindow"])).get("class") == "nvim-translator",
                 "translator keyboard focus")


def windows():
    return json.loads(run(["hyprctl", "-j", "clients"]))


def translator_windows():
    return [c for c in windows() if c.get("class") == "nvim-translator"]


def query(text):
    code = "(function() local m=require('translator'); vim.api.nvim_buf_set_lines(m.state.input_buf,0,-1,false,{" + json.dumps(text) + "}); m.submit(); return 1 end)()"
    rpc(code)
    wait_for(lambda: rpc("require('translator').state.loading") == "false", "dictionary lookup")
    actual = rpc("(function() local s=require('translator').state; for _,e in ipairs(s.entries) do if e.id==s.selected_id then return e.text end end; return s.message end)()")
    assert actual == text, actual


if translator_windows():
    raise SystemExit("Close the existing translator before the opt-in desktop test")
baseline = {c["address"]: {key: c.get(key) for key in ("at", "size", "workspace", "floating")}
            for c in windows()}
try:
    ctl("start")
    state = json.loads(ctl("status"))
    assert state["running"] and not state["visible"], state
    client = translator_windows()[0]
    assert client["floating"] and client["size"] == [900, 600], client
    assert client["workspace"]["name"] == "special:translator", client
    print("PASS: silent startup, dedicated floating workspace, 900x600", flush=True)
    desktop_toggle(True)
    desktop_toggle(False)
    desktop_toggle(True)
    print("PASS: compositor shortcut environment toggles window and keyboard focus", flush=True)
    query("hello")
    query("take for granted")
    rpc("(function() require('translator').history(1); return 1 end)()")
    assert rpc("vim.api.nvim_get_current_line()") == "hello"
    rpc("(function() require('translator').history(-1); return 1 end)()")
    assert rpc("vim.api.nvim_get_current_line()") == "take for granted"
    assert rpc("#require('translator').state.entries") == "2"
    print("PASS: real online dictionary, two entries, k/j cached browsing", flush=True)
    rpc("(function() local s=require('translator').state; vim.api.nvim_buf_set_lines(s.input_buf,0,-1,false,{'unsubmitted draft'}); vim.api.nvim_win_set_cursor(s.input_win,{1,4}); return 1 end)()")
    run(["nvim", "--headless", "--server", str(SOCKET), "--remote-send", "<C-\\><C-N>:q<CR>"])
    wait_for(lambda: not json.loads(ctl("status"))["visible"], ":q hides workspace")
    assert rpc("require('translator').state.initialized") == "true"
    ctl("hide")
    assert not json.loads(ctl("status"))["visible"]
    ctl("show")
    assert rpc("vim.api.nvim_get_current_line()") == "unsubmitted draft"
    assert rpc("vim.api.nvim_win_get_cursor(0)[2]") == "4"
    assert rpc("vim.api.nvim_get_mode().mode") == "n"
    print("PASS: :q hides without quitting, idempotent hide, same draft and cursor", flush=True)
    ctl("stop")
    assert not translator_windows(), "stop must finish before immediate restart"
    ctl("start")
    assert rpc("vim.api.nvim_get_current_line()") == "unsubmitted draft"
    assert rpc("#require('translator').state.entries") == "2"
    print("PASS: process restart restores database history and draft", flush=True)
    current = {c["address"]: c for c in windows()}
    for address, geometry in baseline.items():
        if address in current:
            actual = {key: current[address].get(key) for key in geometry}
            assert actual == geometry, (address, geometry, actual)
    print("PASS: existing windows keep their workspace, position and dimensions", flush=True)
    print("Test data: " + str(DATA), flush=True)
finally:
    ctl("stop")

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
    log = DATA / "desktop-toggle.log"
    command += " >" + shlex.quote(str(log)) + " 2>&1"
    run(["hyprctl", "eval", "hl.dispatch(hl.dsp.exec_cmd(" + json.dumps(command) + "))"])
    try:
        wait_for(lambda: json.loads(ctl("status"))["visible"] == expected_visible,
                 "compositor shortcut toggle")
        if expected_visible:
            wait_for(lambda: json.loads(run(["hyprctl", "-j", "activewindow"])).get("class") == "nvim-translator",
                     "translator keyboard focus")
    except AssertionError as error:
        detail = log.read_text() if log.exists() else "launcher log was not created"
        locked = run(["hyprctl", "-j", "locked"])
        raise AssertionError(str(error) + ": " + detail + "; session lock: " + locked) from error


def windows():
    return json.loads(run(["hyprctl", "-j", "clients"]))


def translator_windows():
    return [c for c in windows() if c.get("class") == "nvim-translator"]


def dispatch(code):
    result = run(["hyprctl", "eval", code])
    assert result == "ok", result


def fits_monitor(monitor):
    client = translator_windows()[0]
    if client["monitor"] != monitor["id"]:
        return False
    width, height = monitor["width"], monitor["height"]
    if monitor.get("transform", 0) % 2:
        width, height = height, width
    left, top, right, bottom = monitor.get("reserved", [0, 0, 0, 0])
    x0, y0 = monitor["x"] + left, monitor["y"] + top
    x1 = monitor["x"] + width / monitor["scale"] - right
    y1 = monitor["y"] + height / monitor["scale"] - bottom
    x, y = client["at"]
    width, height = client["size"]
    return (x0 <= x and y0 <= y and x + width <= x1 and y + height <= y1
            and abs(x + width / 2 - (x0 + x1) / 2) <= 2
            and abs(y + height / 2 - (y0 + y1) / 2) <= 2)


def check_monitor_switching():
    monitors = json.loads(run(["hyprctl", "-j", "monitors"]))
    for monitor in monitors + monitors[:1]:
        ctl("hide")
        dispatch("hl.dispatch(hl.dsp.focus({monitor=" + json.dumps(monitor["name"]) + "}))")
        desktop_toggle(True)
        wait_for(lambda: fits_monitor(monitor), "centered inside " + monitor["name"])
        geometry = {key: translator_windows()[0][key] for key in ("at", "size")}
        print("PASS: monitor " + monitor["name"] + " " + json.dumps(geometry), flush=True)
    ctl("hide")


def query(text):
    code = "(function() local m=require('translator'); vim.api.nvim_buf_set_lines(m.state.input_buf,0,-1,false,{" + json.dumps(text) + "}); m.submit(); return 1 end)()"
    rpc(code)
    wait_for(lambda: rpc("require('translator').state.loading") == "false", "dictionary lookup")
    actual = rpc("(function() local s=require('translator').state; for _,e in ipairs(s.entries) do if e.id==s.selected_id then return e.text end end; return s.message end)()")
    assert actual == text, actual


if json.loads(run(["hyprctl", "-j", "locked"])).get("locked"):
    raise SystemExit("Unlock the desktop before the opt-in desktop test; session lock blocks keyboard focus")
if translator_windows():
    raise SystemExit("Close the existing translator before the opt-in desktop test")
baseline = {c["address"]: {key: c.get(key) for key in ("at", "size", "workspace", "floating")}
            for c in windows()}
original_focus = json.loads(run(["hyprctl", "-j", "activewindow"])).get("address")
original_cursor = json.loads(run(["hyprctl", "-j", "cursorpos"]))
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
    rpc("(function() local s=require('translator').state; vim.api.nvim_win_set_cursor(s.input_win,{1,4}); return 1 end)()")
    run(["nvim", "--headless", "--server", str(SOCKET), "--remote-send", "<Tab>"])
    wait_for(lambda: rpc("require('translator').state.direction") == "zh-en", "Normal Tab switches direction")
    assert rpc("vim.api.nvim_get_current_line()") == "take for granted"
    assert rpc("vim.api.nvim_win_get_cursor(0)[2]") == "4"
    assert "ZH→EN" in rpc("require('translator').statusline()")
    run(["nvim", "--headless", "--server", str(SOCKET), "--remote-send", "i<Tab>"])
    wait_for(lambda: rpc("require('translator').state.direction") == "en-zh", "Insert Tab switches direction")
    assert rpc("vim.api.nvim_get_mode().mode").startswith("i")
    assert rpc("vim.api.nvim_get_current_line()") == "take for granted"
    assert rpc("vim.api.nvim_win_get_cursor(0)[2]") == "4"
    # Same text as a cached EN→ZH entry must request the other direction. The
    # isolated config has no model/key, so this produces a local error, no LLM call.
    run(["nvim", "--headless", "--server", str(SOCKET), "--remote-send", "<Tab><C-c>"])
    wait_for(lambda: "LLM" in rpc("require('translator').state.message"), "reverse direction requires configured LLM")
    assert rpc("require('translator').state.direction") == "zh-en"
    assert rpc("#require('translator').state.entries") == "2"
    print("PASS: Normal/Insert Tab, preserved draft/cursor/mode, reverse cache isolation", flush=True)
    rpc("(function() local s=require('translator').state; vim.api.nvim_buf_set_lines(s.input_buf,0,-1,false,{'unsubmitted draft'}); vim.api.nvim_win_set_cursor(s.input_win,{1,4}); return 1 end)()")
    run(["nvim", "--headless", "--server", str(SOCKET), "--remote-send", "<C-\\><C-N>:q<CR>"])
    wait_for(lambda: not json.loads(ctl("status"))["visible"], ":q hides workspace")
    assert rpc("require('translator').state.initialized") == "true"
    ctl("hide")
    assert not json.loads(ctl("status"))["visible"]
    ctl("show")
    assert rpc("vim.api.nvim_get_current_line()") == "unsubmitted draft"
    assert rpc("require('translator').state.direction") == "zh-en"
    assert rpc("vim.api.nvim_win_get_cursor(0)[2]") == "4"
    assert rpc("vim.api.nvim_get_mode().mode") == "n"
    print("PASS: :q hides without quitting, idempotent hide, same draft and cursor", flush=True)
    ctl("stop")
    assert not translator_windows(), "stop must finish before immediate restart"
    ctl("start")
    assert rpc("vim.api.nvim_get_current_line()") == "unsubmitted draft"
    assert rpc("require('translator').state.direction") == "zh-en"
    assert rpc("#require('translator').state.entries") == "2"
    print("PASS: process restart restores database history and draft", flush=True)
    check_monitor_switching()
    current = {c["address"]: c for c in windows()}
    for address, geometry in baseline.items():
        if address in current:
            actual = {key: current[address].get(key) for key in geometry}
            assert actual == geometry, (address, geometry, actual)
    print("PASS: existing windows keep their workspace, position and dimensions", flush=True)
    print("Test data: " + str(DATA), flush=True)
finally:
    ctl("stop")
    if original_focus and any(c["address"] == original_focus for c in windows()):
        dispatch("hl.dispatch(hl.dsp.focus({window=" + json.dumps("address:" + original_focus) + "}))")
    dispatch("hl.dispatch(hl.dsp.cursor.move({x=" + str(original_cursor["x"]) + ",y=" + str(original_cursor["y"]) + "}))")

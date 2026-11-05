#!/usr/bin/env python3
"""Opt-in native Pi desktop regression with synthetic history; never calls a model."""
import datetime
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import tempfile
import time
import uuid

ROOT = Path(__file__).resolve().parents[1]
(ROOT / '.runtime').mkdir(exist_ok=True, mode=0o700)
DATA = Path(tempfile.mkdtemp(prefix='native-desktop-', dir=ROOT / '.runtime'))
DATA.chmod(0o700)
WORKSPACE = DATA / 'workspace'
WORKSPACE.mkdir(mode=0o700)
SESSIONS = DATA / 'sessions'
SESSIONS.mkdir(mode=0o700)
CONFIG = DATA / 'config.toml'
shim = DATA / 'pi'
shim.write_text('#!/bin/sh\nexec ' + shlex.quote(shutil.which('pi')) + ' --offline --no-extensions --no-mcp --no-skills --no-context-files "$@"\n')
shim.chmod(0o700)
CONFIG.write_text('[pi]\ncommand = ' + json.dumps(str(shim)) + '\n[agent]\nworkspace = ' + json.dumps(str(WORKSPACE)) + '\n')
OVERRIDES = {'QUICK_ASK_CONFIG': str(CONFIG), 'QUICK_ASK_DB': str(DATA / 'archive.sqlite3'),
             'QUICK_ASK_RUNTIME_DIR': str(DATA / 'control')}
ENV = os.environ | OVERRIDES
CTL = ['python3', str(ROOT / 'bin/quick-ask')]
SOCKET = DATA / 'control/kitty.sock'
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
session_id = str(uuid.uuid4())
session = SESSIONS / ('2026-11-05T00-00-00-000Z_' + session_id + '.jsonl')
rows = [{'type': 'session', 'version': 3, 'id': session_id, 'timestamp': now, 'cwd': str(WORKSPACE)},
        {'type': 'message', 'id': 'user', 'parentId': None, 'timestamp': now,
         'message': {'role': 'user', 'content': [{'type': 'text', 'text': 'Synthetic desktop navigation test. No model request.'}], 'timestamp': 1}},
        {'type': 'message', 'id': 'assistant', 'parentId': 'user', 'timestamp': now,
         'message': {'role': 'assistant', 'content': [{'type': 'text', 'text': '```text\n' + '\n'.join('NATIVE%03d' % i for i in range(80)) + '\n```'}],
                     'api': 'openai-completions', 'provider': 'opencode-go', 'model': 'deepseek-v4.1-flash', 'stopReason': 'stop', 'timestamp': 2,
                     'usage': dict(input=0, output=0, cacheRead=0, cacheWrite=0, totalTokens=0, cost=dict(input=0, output=0, cacheRead=0, cacheWrite=0, total=0))}}]
session.write_text(''.join(json.dumps(row) + '\n' for row in rows))
session.chmod(0o600)


def run(args): return subprocess.check_output(args, env=ENV, text=True, timeout=15).strip()
def query(kind): return json.loads(run(['hyprctl', '-j', kind]))
def windows(): return [c for c in query('clients') if c.get('class') == 'nvim-quick-ask']
def ctl(action): return run(CTL + [action])
def status(): return json.loads(ctl('status'))
def dispatch(code): assert run(['hyprctl', 'eval', code]) == 'ok'
def remote(*args): return run(['kitty', '@', '--to', 'unix:' + str(SOCKET), '--use-password', 'never', *args])
def screen(): return remote('get-text', '--match', 'all', '--extent', 'screen')
def key(value): remote('send-key', '--match', 'all', value)
def text(value): remote('send-text', '--match', 'all', value)
def process(): return json.loads(remote('ls'))[0]['tabs'][0]['windows'][0]['pid']


def wait_for(predicate, label, timeout=15):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if predicate(): return
        time.sleep(.1)
    raise AssertionError('Timed out: ' + label)


def desktop_toggle(visible):
    command = shlex.join(['env', *[k + '=' + v for k, v in OVERRIDES.items()], *CTL, 'toggle'])
    dispatch('hl.dispatch(hl.dsp.exec_cmd(' + json.dumps(command) + '))')
    wait_for(lambda: status()['visible'] == visible, 'visibility')
    if visible and not query('locked').get('locked'):
        wait_for(lambda: query('activewindow').get('class') == 'nvim-quick-ask', 'keyboard focus')


def fits(monitor):
    client = windows()[0]
    assert client['monitor'] == monitor['id'] and client['floating']
    width, height = monitor['width'], monitor['height']
    if monitor.get('transform', 0) % 2: width, height = height, width
    left, top, right, bottom = monitor.get('reserved', [0, 0, 0, 0])
    x, y = monitor['x'] + left, monitor['y'] + top
    width, height = width / monitor['scale'] - left - right, height / monitor['scale'] - top - bottom
    cx, cy = client['at']; cw, ch = client['size']
    assert x <= cx and y <= cy and cx + cw <= x + width and cy + ch <= y + height
    assert abs(cx + cw / 2 - (x + width / 2)) <= 2 and abs(cy + ch / 2 - (y + height / 2)) <= 2


if windows(): raise SystemExit('Stop existing quick-ask before isolated native desktop test')
original_focus = query('activewindow').get('address')
original_cursor = query('cursorpos')
baseline = {c['address']: (c['at'], c['size'], c['workspace']) for c in query('clients')}
try:
    ctl('start')
    wait_for(lambda: 'INSERT' in screen() and 'NATIVE079' in screen(), 'native Pi editor/continued session', 20)
    assert not status()['visible']
    print('PASS: native Pi starts hidden and resumes existing JSONL history', flush=True)
    for monitor in query('monitors'):
        ctl('hide')
        dispatch('hl.dispatch(hl.dsp.focus({monitor=' + json.dumps(monitor['name']) + '}))')
        desktop_toggle(True); fits(monitor)
        print('PASS: native window placement/focus on ' + monitor['name'], flush=True)
    text('pending_jk')
    wait_for(lambda: 'pending_jk' in screen(), 'native draft')
    key('escape')
    wait_for(lambda: 'NORMAL' in screen(), 'browse mode')
    text('gg')
    wait_for(lambda: 'NATIVE000' in screen(), 'native history top')
    text('G')
    wait_for(lambda: 'NATIVE079' in screen(), 'native history bottom')
    before_pid = process()
    desktop_toggle(False)
    assert process() == before_pid
    assert 'NORMAL' in screen() and 'pending_jk' in screen()
    desktop_toggle(True)
    assert process() == before_pid
    text('i')
    wait_for(lambda: 'INSERT' in screen() and 'pending_jk' in screen(), 'return to native input')
    print('PASS: native Vim browse, draft and Pi process retained across hiding/showing', flush=True)
    key('ctrl+u')
    text('!printf started > hidden-start; sleep 2; printf done > hidden-proof; printf OUTSIDE > ../ordinary-user-proof; printf HIDDEN_WORK_FINISHED')
    key('enter')
    wait_for(lambda: (WORKSPACE / 'hidden-start').exists(), 'native shell command started')
    ctl('hide')
    assert not status()['visible']
    wait_for(lambda: (WORKSPACE / 'hidden-proof').exists(), 'native shell command finishes while hidden')
    assert not status()['visible'] and process() == before_pid
    assert (DATA / 'ordinary-user-proof').read_text() == 'OUTSIDE'
    assert (DATA / 'ordinary-user-proof').stat().st_uid == os.getuid()
    desktop_toggle(True)
    wait_for(lambda: 'HIDDEN_WORK_FINISHED' in screen(), 'native shell output')
    print('PASS: native shell finishes while hidden; ordinary-user access outside starting folder', flush=True)
    ctl('stop'); assert not windows()
    ctl('start')
    wait_for(lambda: 'INSERT' in screen() and 'HIDDEN_WORK_FINISHED' in screen(), 'native conversation restart', 20)
    assert not status()['visible'] and session.is_file()
    assert not (DATA / 'archive.sqlite3').exists(), 'Native launcher unexpectedly created a history database'
    print('PASS: native conversation resumes after real stop/start; no custom database or backend', flush=True)
    current = {c['address']: (c['at'], c['size'], c['workspace']) for c in query('clients') if c.get('class') != 'nvim-quick-ask'}
    assert all(current.get(address) == value for address, value in baseline.items()), 'Other window layout changed'
    print('PASS: translator and other windows unchanged; synthetic data isolated at ' + str(DATA), flush=True)
finally:
    ctl('stop')
    if original_focus:
        dispatch('hl.dispatch(hl.dsp.focus({window=' + json.dumps('address:' + original_focus) + '}))')
    dispatch('hl.dispatch(hl.dsp.cursor.move({x=' + str(original_cursor['x']) + ',y=' + str(original_cursor['y']) + '}))')

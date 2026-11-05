#!/usr/bin/env python3
"""Opt-in desktop agent test. Simulated Pi by default; --live uses real tools/model.

Stop the existing quick-ask instance first. All conversations, test files and config
are isolated under .runtime; the translator and other window geometry are checked.
"""
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from quick_ask_backend.store import Store
LIVE = '--live' in sys.argv
(ROOT / '.runtime').mkdir(exist_ok=True, mode=0o700)
DATA = Path(tempfile.mkdtemp(prefix='agent-desktop-', dir=ROOT / '.runtime'))
DATA.chmod(0o700)
WORKSPACE = DATA / 'workspace'
WORKSPACE.mkdir(mode=0o700)
CONFIG = DATA / 'config.toml'
configuration = '[agent]\nworkspace = ' + json.dumps(str(WORKSPACE)) + '\n[ui]\ninput_method = false\n'
if not LIVE:
    fake = DATA / 'pi'
    fake.write_bytes((ROOT / 'tests/desktop_pi.py').read_bytes())
    fake.chmod(0o700)
    configuration += '[pi]\ncommand = ' + json.dumps(str(fake)) + '\n'
CONFIG.write_text(configuration)
OVERRIDES = {'QUICK_ASK_CONFIG': str(CONFIG), 'QUICK_ASK_DB': str(DATA / 'history.sqlite3'),
             'QUICK_ASK_RUNTIME_DIR': str(DATA / 'control')}
ENV = os.environ | OVERRIDES
CTL = ['python3', str(ROOT / 'bin/quick-ask')]
SOCKET = str(DATA / 'control/nvim.sock')
Store(DATA / 'history.sqlite3').add({'id': 'legacy-fixture', 'question': '旧问答测试',
    'answer': '旧记录保留测试 legacy-only-needle', 'web_search': False,
    'sources': [], 'created_at': '2026-11-05T00:00:00Z'})


def run(args):
    return subprocess.check_output(args, env=ENV, text=True, timeout=15).strip()


def query(kind): return json.loads(run(['hyprctl', '-j', kind]))
def windows(): return [c for c in query('clients') if c.get('class') == 'nvim-quick-ask']
def ctl(action): return run(CTL + [action])
def dispatch(code): assert run(['hyprctl', 'eval', code]) == 'ok'
def rpc(body):
    expression = 'luaeval(' + json.dumps('(function() ' + body + ' end)()') + ')'
    return run(['nvim', '--headless', '--server', SOCKET, '--remote-expr', expression])


def wait_for(predicate, label, timeout=15):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if predicate(): return
        time.sleep(.1)
    raise AssertionError('Timed out: ' + label)


def state():
    return json.loads(rpc("local s=require('quick_ask').state; return vim.json.encode({initialized=s.initialized,loading=s.loading,message=s.message,session_id=s.session_id or vim.NIL,selected=s.selected_id or vim.NIL,messages=s.messages or {},web_search=s.web_search,draft=table.concat(vim.api.nvim_buf_get_lines(s.input_buf,0,-1,false),'\\n'),cursor=vim.api.nvim_win_get_cursor(s.input_win),search_count=s.search and s.search.entries and #s.search.entries or -1})"))


def set_draft(text):
    encoded = json.dumps(json.dumps(text.split('\n'), ensure_ascii=False), ensure_ascii=False)
    rpc("local s=require('quick_ask').state;vim.api.nvim_buf_set_lines(s.input_buf,0,-1,false,vim.json.decode(" + encoded + '));return 1')


def submit(text):
    set_draft(text)
    rpc("require('quick_ask').submit();return 1")


def history(term):
    rpc("return vim.api.nvim_input('/')")
    rpc('return vim.api.nvim_input(' + json.dumps('<C-U>' + term + '<CR>', ensure_ascii=False) + ')')
    wait_for(lambda: state()['search_count'] >= 1, 'history match')
    rpc("return vim.api.nvim_input('<CR>')")
    wait_for(lambda: state()['search_count'] == -1, 'history selection')


def desktop_toggle(visible):
    command = shlex.join(['env', *[k + '=' + v for k, v in OVERRIDES.items()], *CTL, 'toggle'])
    command += ' >' + shlex.quote(str(DATA / 'launcher.log')) + ' 2>&1'
    dispatch('hl.dispatch(hl.dsp.exec_cmd(' + json.dumps(command) + '))')
    wait_for(lambda: json.loads(ctl('status'))['visible'] == visible, 'workspace visibility')
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
    assert abs(cx + cw / 2 - (x + width / 2)) <= 2
    assert abs(cy + ch / 2 - (y + height / 2)) <= 2


if windows(): raise SystemExit('Stop existing quick-ask before the isolated desktop test')
original_focus = query('activewindow').get('address')
original_cursor = query('cursorpos')
baseline = {c['address']: (c['at'], c['size'], c['workspace']) for c in query('clients')}
try:
    ctl('start')
    wait_for(lambda: state().get('initialized'), 'editor initialized')
    assert not json.loads(ctl('status'))['visible']
    for monitor in query('monitors'):
        ctl('hide')
        dispatch('hl.dispatch(hl.dsp.focus({monitor=' + json.dumps(monitor['name']) + '}))')
        desktop_toggle(True); fits(monitor)
        print('PASS: placement/focus on ' + monitor['name'], flush=True)
    question = '在当前工作目录创建 agent-smoke.txt，内容严格为一行 quick-agent-first（行末换行）。请实际写文件并读回验证，简短报告结果。'
    submit(question)
    wait_for(lambda: state()['loading'], 'task starts')
    set_draft('任务运行时保留的草稿\nsecond line')
    rpc("local s=require('quick_ask').state;vim.api.nvim_win_set_cursor(s.input_win,{2,3});return 1")
    desktop_toggle(False)
    wait_for(lambda: not state()['loading'], 'hidden task completion', 210 if LIVE else 15)
    target = WORKSPACE / 'agent-smoke.txt'
    assert target.read_text() == 'quick-agent-first\n', state()['message']
    assert state()['draft'] == '任务运行时保留的草稿\nsecond line'
    session_id = state()['session_id']; assert session_id
    print('PASS: task writes/reads file while hidden; editing preserves task and draft', flush=True)
    desktop_toggle(True)
    submit('给刚才那个文件追加一行 quick-agent-second，然后运行命令统计行数，简短告诉我文件内容和行数。')
    wait_for(lambda: state()['loading'], 'follow-up starts')
    wait_for(lambda: not state()['loading'], 'follow-up completion', 210 if LIVE else 15)
    assert state()['session_id'] == session_id
    assert target.read_text() == 'quick-agent-first\nquick-agent-second\n', state()['message']
    assert any(message.get('role') == 'tool' for message in state()['messages']), state()['messages']
    print('PASS: same-session follow-up edits prior file and executes command ' + ('(LIVE)' if LIVE else '(FAKE PI)'), flush=True)
    if not LIVE:
        submit('slow task')
        wait_for(lambda: state()['loading'], 'slow task starts')
        submit('尚未执行的排队消息')
        wait_for(lambda: state()['draft'] == '', 'follow-up accepted')
        set_draft('仍未提交的草稿')
        rpc("require('quick_ask').control_c();return 1")
        wait_for(lambda: not state()['loading'], 'abort')
        wait_for(lambda: '尚未执行的排队消息' in state()['draft'], 'cleared queue restored')
        assert '仍未提交的草稿' in state()['draft']
        print('PASS: Ctrl+C stops task/queue and restores pending text without losing draft', flush=True)
    rpc("vim.cmd('NewChat');return 1")
    wait_for(lambda: state()['session_id'] != session_id and not state()['loading'], 'new conversation')
    history('quick-agent-first' if LIVE else '只在答案中的关键词')
    wait_for(lambda: state()['session_id'] == session_id, 'native session restored')
    assert target.read_text().splitlines() == ['quick-agent-first', 'quick-agent-second']
    history('legacy-only-needle')
    wait_for(lambda: state()['selected'] == 'legacy-fixture' and state()['draft'] == '旧问答测试', 'legacy record restored')
    history('quick-agent-first')
    wait_for(lambda: state()['session_id'] == session_id and state()['selected'] is None, 'back to native conversation')
    print('PASS: history searches full conversation/answers, resumes context, retains legacy history', flush=True)
    set_draft('重启后的多行草稿\nsecond line')
    rpc("local s=require('quick_ask').state;vim.api.nvim_win_set_cursor(s.input_win,{2,3});return 1")
    ctl('hide'); before = state(); ctl('stop'); ctl('start')
    wait_for(lambda: state().get('initialized') and state()['session_id'] == session_id and len(state()['messages']) >= len(before['messages']), 'native session restart')
    after = state()
    for field in ('draft', 'cursor', 'session_id', 'web_search', 'messages'):
        assert before[field] == after[field], 'Restore mismatch: ' + field
    assert not json.loads(ctl('status'))['visible']
    print('PASS: native context, tools, multiline draft, byte cursor and mode survive restart', flush=True)
    current = {c['address']: (c['at'], c['size'], c['workspace']) for c in query('clients') if c.get('class') != 'nvim-quick-ask'}
    assert all(current.get(address) == value for address, value in baseline.items()), 'Other window layout changed'
    print('PASS: translator and other windows unchanged; data isolated at ' + str(DATA), flush=True)
    if query('locked').get('locked'): print('NOTE: locked session skipped compositor keyboard focus assertions', flush=True)
finally:
    ctl('stop')
    if original_focus:
        dispatch('hl.dispatch(hl.dsp.focus({window=' + json.dumps('address:' + original_focus) + '}))')
    dispatch('hl.dispatch(hl.dsp.cursor.move({x=' + str(original_cursor['x']) + ',y=' + str(original_cursor['y']) + '}))')

#!/usr/bin/env python3
"""Opt-in Hyprland/Kitty integration. Fake Pi by default; --live calls real Pi."""
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
LIVE = '--live' in sys.argv
DATA = Path(tempfile.mkdtemp(prefix='desktop-', dir=ROOT / '.runtime'))
DATA.chmod(0o700)
CONFIG = DATA / 'config.toml'
if not LIVE:
    fake = DATA / 'pi'
    fake.write_text('''#!/usr/bin/env python3
import json,sys,time
q=sys.stdin.read().strip()
web='--extension' in sys.argv
answer='这是隔离桌面测试的模拟回答。' + ('web fixture' if web else '只在答案中的关键词')
def emit(value): print(json.dumps(value,ensure_ascii=False),flush=True)
if web:
    emit({'type':'tool_execution_start','toolName':'web_search'})
    emit({'type':'tool_execution_end','toolName':'web_search','isError':False,'result':{'details':{'sources':[{'title':'Isolated test fixture','url':'https://example.com/'}]}}})
for chunk in (answer[:8],answer[8:]):
    emit({'type':'message_update','assistantMessageEvent':{'type':'text_delta','delta':chunk}})
    time.sleep(.08)
emit({'type':'message_end','message':{'role':'assistant','content':[{'type':'text','text':answer}],'stopReason':'stop','provider':'desktop-fixture','model':'fake-pi'}})
emit({'type':'agent_settled','aborted':False})
''')
    fake.chmod(0o700)
    CONFIG.write_text('[pi]\ncommand = ' + json.dumps(str(fake)) + '\n[ui]\ninput_method = false\n')
else:
    CONFIG.write_text('[ui]\ninput_method = false\n')
OVERRIDES = {'QUICK_ASK_CONFIG': str(CONFIG), 'QUICK_ASK_DB': str(DATA / 'history.sqlite3'),
             'QUICK_ASK_RUNTIME_DIR': str(DATA / 'control')}
ENV = os.environ | OVERRIDES
CTL = ['python3', str(ROOT / 'bin/quick-ask')]
SOCKET = str(DATA / 'control/nvim.sock')


def run(args):
    return subprocess.check_output(args, env=ENV, text=True, timeout=12).strip()


def query(kind): return json.loads(run(['hyprctl', '-j', kind]))
def windows(): return [c for c in query('clients') if c.get('class') == 'nvim-quick-ask']
def ctl(action): return run(CTL + [action])
def dispatch(code): assert run(['hyprctl', 'eval', code]) == 'ok'
def rpc(body):
    expression = 'luaeval(' + json.dumps('(function() ' + body + ' end)()') + ')'
    return run(['nvim', '--headless', '--server', SOCKET, '--remote-expr', expression])


def wait_for(predicate, label, timeout=12):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if predicate(): return
        time.sleep(.1)
    raise AssertionError('Timed out: ' + label)


def state():
    return json.loads(rpc("local s=require('quick_ask').state; return vim.json.encode({initialized=s.initialized,loading=s.loading,message=s.message,selected=s.selected_id,web_search=s.web_search,entries=s.entries,draft=table.concat(vim.api.nvim_buf_get_lines(s.input_buf,0,-1,false),'\\n'),cursor=vim.api.nvim_win_get_cursor(s.input_win),search_count=s.search and s.search.entries and #s.search.entries or -1})"))


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
    print('PASS: dedicated hidden startup', flush=True)
    monitors = query('monitors')
    for monitor in monitors + monitors[:1]:
        ctl('hide')
        dispatch('hl.dispatch(hl.dsp.focus({monitor=' + json.dumps(monitor['name']) + '}))')
        desktop_toggle(True); fits(monitor)
        print('PASS: fits monitor ' + monitor['name'], flush=True)
    questions = [('HTTP是什么？一句话。', False), ('请联网查Python官网，简述Python的用途并附来源。', True)]
    for index, (question, web) in enumerate(questions):
        rpc("local m=require('quick_ask'); local s=m.state; vim.api.nvim_buf_set_lines(s.input_buf,0,-1,false,{" + json.dumps(question, ensure_ascii=False) + "}); if s.web_search ~= " + str(web).lower() + " then m.toggle_web() end; m.submit(); return 1")
        wait_for(lambda: not state()['loading'], 'answer completion', 210 if LIVE else 12)
        s = state()
        assert len(s['entries']) == index + 1, s['message']
        assert s['entries'][0]['web_search'] == web and s['entries'][0]['answer']
        if web: assert s['entries'][0]['sources'], 'Web answer needs actual source results'
    print('PASS: ordinary/web answers, streamed results and persisted sources' + (' (LIVE)' if LIVE else ' (FAKE PI)'), flush=True)
    rpc("return vim.api.nvim_input('/')")
    term = 'HTTP是什么' if LIVE else '只在答案中的关键词'
    rpc('return vim.api.nvim_input(' + json.dumps('<C-U>' + term + '<CR>', ensure_ascii=False) + ')')
    wait_for(lambda: state()['search_count'] == 1, 'full-history search')
    rpc("return vim.api.nvim_input('<CR>')")
    wait_for(lambda: state()['draft'] == questions[0][0] and state()['search_count'] == -1, 'history selection')
    print('PASS: / searches history and Enter restores record without another request', flush=True)
    rpc("local m=require('quick_ask'); local s=m.state; vim.api.nvim_buf_set_lines(s.input_buf,0,-1,false,{'桌面草稿','second line'}); vim.api.nvim_win_set_cursor(s.input_win,{2,3}); if not s.web_search then m.toggle_web() end; return 1")
    ctl('hide'); before = state(); ctl('stop'); ctl('start')
    wait_for(lambda: state().get('initialized'), 'restart initialization')
    after = state()
    for field in ('draft', 'cursor', 'selected', 'web_search', 'entries'):
        assert before[field] == after[field], 'Restore mismatch: ' + field
    assert not json.loads(ctl('status'))['visible']
    print('PASS: restart restores multiline draft, byte cursor, mode and history', flush=True)
    current = {c['address']: (c['at'], c['size'], c['workspace']) for c in query('clients') if c.get('class') != 'nvim-quick-ask'}
    assert all(current.get(address) == value for address, value in baseline.items()), 'Other window layout changed'
    print('PASS: existing translator and other windows unchanged', flush=True)
    if query('locked').get('locked'): print('NOTE: session locked; compositor keyboard focus assertions were skipped', flush=True)
finally:
    ctl('stop')
    if original_focus:
        dispatch('hl.dispatch(hl.dsp.focus({window=' + json.dumps('address:' + original_focus) + '}))')
    dispatch('hl.dispatch(hl.dsp.cursor.move({x=' + str(original_cursor['x']) + ',y=' + str(original_cursor['y']) + '}))')

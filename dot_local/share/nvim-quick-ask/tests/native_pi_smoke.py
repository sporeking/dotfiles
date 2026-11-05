#!/usr/bin/env python3
"""Exercise real Pi fullscreen navigation in a PTY, with synthetic history; no API calls."""
import datetime
import fcntl
import json
import os
from pathlib import Path
import pty
import re
import select
import signal
import struct
import sys
import tempfile
import termios
import time
import uuid

ROOT = Path(__file__).resolve().parents[1]
(ROOT / '.runtime').mkdir(exist_ok=True, mode=0o700)
DATA = Path(tempfile.mkdtemp(prefix='native-vim-', dir=ROOT / '.runtime'))
DATA.chmod(0o700)
WORKSPACE = DATA / 'workspace'
WORKSPACE.mkdir(mode=0o700)
STATE = DATA / 'view.json'
OBSERVER = DATA / 'observer.ts'
OBSERVER.write_text('''import {writeFileSync} from 'node:fs';
export default function(pi) {
 let tui;
 pi.on('session_start', (_,ctx)=>{
   const previous=ctx.ui.getEditorComponent();
   ctx.ui.setEditorComponent((t,theme,kb)=>{tui=t;return previous(t,theme,kb)});
 });
 pi.registerShortcut('ctrl+alt+t',{description:'Test snapshot',handler:ctx=>{
   const scroll=tui.getPrimaryScrollView();writeFileSync(process.env.QUICK_ASK_SMOKE_STATE,JSON.stringify({draft:ctx.ui.getEditorText(),screen:tui.getScreenLines(),scrollTop:scroll.scrollTop}));
 }});
}
''')
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
session = DATA / 'fixture.jsonl'
records = [{'type': 'session', 'version': 3, 'id': str(uuid.uuid4()), 'timestamp': now, 'cwd': str(WORKSPACE)}]
records += [{'type': 'message', 'id': 'prompt', 'parentId': None, 'timestamp': now,
             'message': {'role': 'user', 'content': [{'type': 'text', 'text': 'Synthetic navigation fixture; never send to a model.'}], 'timestamp': 1}}]
records += [{'type': 'message', 'id': 'answer', 'parentId': 'prompt', 'timestamp': now,
             'message': {'role': 'assistant', 'content': [{'type': 'text', 'text': '```text\n' + '\n'.join('NATIVE%03d' % i for i in range(80)) + '\n```'}],
                         'api': 'openai-completions', 'provider': 'opencode-go', 'model': 'deepseek-v4.1-flash',
                         'usage': dict(input=0, output=0, cacheRead=0, cacheWrite=0, totalTokens=0,
                                       cost=dict(input=0, output=0, cacheRead=0, cacheWrite=0, total=0)),
                         'stopReason': 'stop', 'timestamp': 2}}]
session.write_text(''.join(json.dumps(row) + '\n' for row in records))
session.chmod(0o600)

pid, fd = pty.fork()
if pid == 0:
    os.chdir(WORKSPACE)
    os.environ.update(QUICK_ASK_SMOKE_STATE=str(STATE), TERM='xterm-256color', PI_OFFLINE='1')
    navigation = [] if '--global' in sys.argv else ['--tui-mode', 'fullscreen', '--no-extensions', '-e', str(ROOT / 'extensions/vim-navigation.ts')]
    os.execvp('pi', ['pi', *navigation, '--no-mcp', '--no-skills', '--no-context-files',
                     '--session', str(session), '-e', str(OBSERVER)])
fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', 32, 100, 0, 0))
raw = bytearray()
reaped = False


def pump(seconds=.15):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        if select.select([fd], [], [], min(.05, max(0, deadline - time.monotonic())))[0]:
            try:
                data = os.read(fd, 65536)
            except OSError:
                break
            if not data: break
            raw.extend(data)


def send(data):
    os.write(fd, data)
    pump()


def view():
    previous = STATE.stat().st_mtime_ns if STATE.exists() else 0
    send(b'\x1b[116;7u')
    deadline = time.monotonic() + 4
    while not STATE.exists() or STATE.stat().st_mtime_ns == previous:
        assert time.monotonic() < deadline, 'Snapshot shortcut failed; terminal tail: ' + repr(bytes(raw[-1800:]))
        pump()
    return json.loads(STATE.read_text())


def screen(state): return '\n'.join(state['screen'])
def markers(state): return [int(value) for value in re.findall(r'NATIVE(\d{3})', screen(state))]


try:
    deadline = time.monotonic() + 10
    while b'INSERT' not in raw:
        assert time.monotonic() < deadline, 'Native editor not initialized: ' + repr(bytes(raw[-1800:]))
        pump()
    print('Native Pi initialized', flush=True)
    before = view()
    assert 79 in markers(before), screen(before)
    send(b'jk')
    assert view()['draft'] == 'jk', 'Insert-mode j/k must type normally'
    send(b'\x1b')
    before = view()
    assert 'NORMAL' in screen(before)
    send(b'kkk')
    up = view()
    assert min(markers(up)) < min(markers(before)), (markers(before), markers(up))
    send(b'jjj')
    down = view()
    assert min(markers(down)) > min(markers(up))
    send(b'\x15')  # Ctrl+U, half-page up
    half = view()
    assert min(markers(half)) < min(markers(up))
    assert half['draft'] == 'jk'
    send(b'\x04')  # Ctrl+D in Normal scrolls, never exits/deletes draft
    assert min(markers(view())) > min(markers(half))
    send(b'gg')
    top = view()
    # Global resource/startup headers can occupy the entire first viewport.
    assert top['scrollTop'] == 0, 'gg must reach beginning'
    send(b'G')
    assert 79 in markers(view()), 'G must follow transcript end'
    send(b'/NATIVE010\r\x1b')
    search = view()
    assert 10 in markers(search), 'Native transcript search must navigate to match'
    send(b'i')
    inserted = view()
    assert 'INSERT' in screen(inserted) and 79 in markers(inserted)
    assert inserted['draft'] == 'jk'
    # Native Insert-mode clear/exit shortcuts retain their original behavior.
    send(b'\x15\x04')
    deadline = time.monotonic() + 5
    while True:
        found, status = os.waitpid(pid, os.WNOHANG)
        if found:
            reaped = True
            assert os.waitstatus_to_exitcode(status) == 0, status
            break
        assert time.monotonic() < deadline, 'Native graceful shutdown shortcut timed out'
        pump()
    print('PASS: real Pi native fullscreen j/k, half-page, gg/G, search, draft preservation and graceful exit; no model calls')
    print('Private fixture:', DATA)
finally:
    if not reaped:
        try: os.kill(pid, signal.SIGTERM)
        except ProcessLookupError: pass
        cleanup_deadline = time.monotonic() + 2
        while True:
            found, _ = os.waitpid(pid, os.WNOHANG)
            if found: break
            if time.monotonic() >= cleanup_deadline:
                os.kill(pid, signal.SIGKILL)
                os.waitpid(pid, 0)
                break
            pump(.1)
    os.close(fd)

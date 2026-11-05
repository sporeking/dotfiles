"""Native RPC agent tests: no model, credentials, production files or network."""

import json
import os
from pathlib import Path
import queue
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch

from quick_ask_backend.agent import TOOLS, agent_command
from quick_ask_backend.config import Config, load_config
from quick_ask_backend.store import Store

ROOT = Path(__file__).resolve().parents[1]
FAKE_RPC = r'''#!/usr/bin/env python3
import json, os, pathlib, subprocess, sys, threading, time, uuid
args = sys.argv[1:]
write_lock = threading.Lock()
state_lock = threading.RLock()
abort = threading.Event()
active, busy, queued, compacted = [], False, [], False
session_id = str(uuid.uuid4())
if '--session' in args:
    path = pathlib.Path(args[args.index('--session')+1])
    records = [json.loads(line) for line in path.read_bytes().split(b'\n') if line]
    header = records[0]
    session_id = header['id']
    os.chdir(header['cwd'])
    active = [entry['message'] for entry in records if entry.get('type') == 'message']
else:
    path = pathlib.Path(args[args.index('--session-dir')+1]) / (session_id + '.jsonl')
    header = {'type': 'session', 'version': 3, 'id': session_id, 'cwd': os.getcwd()}

def observe(value):
    with open(os.environ['FAKE_RPC_LOG'], 'a') as stream:
        stream.write(json.dumps(value) + '\n')
observe({'argv': args, 'cwd': os.getcwd(), 'pid': os.getpid(), 'session': session_id})

def output(value):
    data = (json.dumps(value, ensure_ascii=False) + '\n').encode()
    with write_lock:
        for offset in range(0, len(data), 7):
            os.write(1, data[offset:offset+7])

def persist(message):
    if not path.exists():
        path.write_text(json.dumps(header) + '\n')
    with path.open('a') as stream:
        stream.write(json.dumps({'type':'message', 'message':message}, ensure_ascii=False) + '\n')
    active.append(message)

if not os.environ.get('FAKE_LAZY') and not path.exists():
    path.write_text(json.dumps(header) + '\n')

def response(command, data=None, success=True):
    output({'type':'response', 'command':command['type'], 'id':command.get('id'),
            'success':success, 'data':data or {}, 'error':'PRIVATE_PROVIDER_ERROR secret-token'})

def message(role, text, reason='stop'):
    value = {'role':role, 'content':[{'type':'text','text':text}], 'stopReason':reason}
    if role == 'assistant':
        value['content'].insert(0, {'type':'thinking', 'thinking':'PRIVATE_THOUGHT'})
    with state_lock:
        persist(value)
    output({'type':'message_end','message':value})

def run(text):
    global busy, compacted
    output({'type':'agent_start'})
    message('user', text)
    output({'type':'message_start', 'message':{'role':'assistant'}})
    output({'type':'message_update','assistantMessageEvent':{'type':'thinking_delta','delta':'PRIVATE_THOUGHT'}})
    tool_call = {'role':'assistant','stopReason':'toolUse','content':[{'type':'toolCall','id':'call-1',
                 'name':'bash','arguments':{'command':'sleep 90' if text == 'hold' else 'printf one; printf two'}}]}
    with state_lock:
        persist(tool_call)
    output({'type':'message_end','message':tool_call})
    if text == 'hold':
        child = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(90)'])
        observe({'child': child.pid})
        output({'type':'tool_execution_start','toolCallId':'call-1','toolName':'bash','args':{'command':'sleep 90'}})
        abort.wait(90)
    else:
        if text == 'retry':
            message('assistant', 'PRIVATE_PROVIDER_ERROR', 'error')
            output({'type':'agent_end', 'willRetry':True})
            output({'type':'auto_retry_start', 'errorMessage':'PRIVATE_PROVIDER_ERROR'})
            time.sleep(.1)
            output({'type':'agent_start'})
        if text == 'dialog':
            output({'type':'extension_ui_request','id':'dialog-id','method':'confirm','message':'unsupported'})
        output({'type':'tool_execution_start','toolCallId':'call-1','toolName':'bash','args':{'command':'printf one; printf two'}})
        for text_output in ('one\n', 'one\ntwo\n'):
            output({'type':'tool_execution_update','toolCallId':'call-1','toolName':'bash',
                    'partialResult':{'content':[{'type':'text','text':text_output}]}})
        output({'type':'tool_execution_end','toolCallId':'call-1','toolName':'bash', 'isError':False,
                'result':{'content':[{'type':'text','text':'one\ntwo\n'}]}})
        output({'type':'message_update','assistantMessageEvent':{'type':'text_delta','delta':'draft answer'}})
        time.sleep(.08)
    with state_lock:
        stopped = abort.is_set()
        tool_result = {'role':'toolResult','toolCallId':'call-1','toolName':'bash',
                       'content':[{'type':'text','text':'Cancelled tool' if stopped else 'one\ntwo\n'}], 'isError':stopped}
        persist(tool_result)
        output({'type':'message_end','message':tool_result})
        message('assistant', 'Cancelled' if stopped else 'authoritative\u2028answer: ' + text,
                'aborted' if stopped else 'stop')
        output({'type':'agent_end'})
        if text == 'compact':
            compacted = True
            output({'type':'compaction_start'})
            with path.open('a') as stream:
                stream.write(json.dumps({'type':'compaction', 'summary':'summary'})+'\n')
            output({'type':'compaction_end'})
        if queued and not stopped:
            following = queued.pop(0)
            abort.clear()
            threading.Thread(target=run, args=(following,), daemon=True).start()
        else:
            busy = False
            output({'type':'agent_settled', 'aborted':stopped})

for raw in sys.stdin.buffer:
    command = json.loads(raw)
    observe({'command': command})
    kind = command.get('type')
    with state_lock:
        if kind == 'get_state':
            response(command, {'sessionId':session_id, 'sessionFile':str(path), 'isStreaming':busy,
                               'pendingMessageCount':len(queued), 'model':{'id':'fake','provider':'mock'}, 'thinkingLevel':'off'})
        elif kind == 'get_messages':
            response(command, {'messages':active[-2:] if compacted else active})
        elif kind == 'prompt':
            text = command['message']
            if text == 'stall':
                output({'type':'agent_start'})
                continue
            if text == 'malformed':
                os.write(1, b'not json\n')
                continue
            if text == 'reject':
                response(command, success=False)
            elif text == 'handled':
                response(command, {'disposition':'handled'})
            elif busy:
                assert command['streamingBehavior'] == 'followUp'
                queued.append(text)
                response(command, {'disposition':'queued'})
            else:
                busy = True
                abort.clear()
                response(command, {'disposition':'started'})
                threading.Thread(target=run, args=(text,), daemon=True).start()
        elif kind == 'clear_queue':
            previous = list(queued)
            queued.clear()
            response(command, {'steering':[], 'followUp':previous})
        elif kind == 'abort':
            abort.set()
            response(command)
        elif kind == 'extension_ui_response':
            assert command.get('cancelled') is True
        else:
            response(command, success=False)
observe({'eof':True})
# Deliberately leave a live tool child: caller must clean the owned process group.
'''


class AgentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='quick-agent-test-')
        self.directory = Path(self.temp.name)
        self.command = self.directory / 'pi-rpc'
        self.command.write_text(FAKE_RPC)
        self.command.chmod(0o700)
        self.config = self.directory / 'config.toml'
        self.workspace = self.directory / 'workspace'
        self.log = self.directory / 'rpc-log.jsonl'
        self.db = self.directory / 'history.sqlite3'
        self.extension = self.directory / 'extension.ts'
        self.extension.write_text('// fake, never loaded')
        self.write_config()
        self.environment = {**os.environ, 'QUICK_ASK_CONFIG':str(self.config), 'QUICK_ASK_DB':str(self.db),
                            'FAKE_RPC_LOG':str(self.log), 'PYTHONPATH':str(ROOT)}
        self.process = None
        self.events = []

    def write_config(self, timeout=5):
        self.config.write_text('[pi]\ncommand=' + json.dumps(str(self.command)) + '\ntimeout=' + str(timeout) +
                               '\nweb_extension=' + json.dumps(str(self.extension)) +
                               '\n[agent]\nworkspace=' + json.dumps(str(self.workspace)) + '\n')

    def start(self):
        self.process = subprocess.Popen([sys.executable, '-m', 'quick_ask_backend', 'serve'],
                                        cwd=ROOT, env=self.environment, stdin=subprocess.PIPE,
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        self.received = queue.Queue()
        def read():
            for line in self.process.stdout:
                self.received.put(json.loads(line))
            self.received.put({'event':'test_eof'})
        self.reader = threading.Thread(target=read, daemon=True)
        self.reader.start()

    def send(self, op, **data):
        self.process.stdin.write((json.dumps({'op':op, **data}, ensure_ascii=False)+'\n').encode())
        self.process.stdin.flush()

    def until(self, event, request_id=None, timeout=6):
        deadline = time.monotonic() + timeout
        while True:
            value = self.received.get(timeout=max(.001, deadline - time.monotonic()))
            self.events.append(value)
            if value['event'] == event and (request_id is None or value.get('id') == request_id):
                return value
            if value['event'] == 'test_eof':
                self.fail('unexpected EOF: ' + repr(self.events))

    def opened(self):
        self.start()
        self.send('open', id=1, session_id=None, web_search=False)
        return self.until('snapshot', 1)

    def prompt(self, text, request_id=2):
        self.send('prompt', id=request_id, question=text)
        return self.until('accepted', request_id)

    def finish(self):
        self.until('settled')
        return self.until('snapshot')

    def observations(self):
        return [json.loads(line) for line in self.log.read_text().splitlines()]

    def stop(self, eof=False):
        if self.process is None:
            return
        if self.process.poll() is None:
            if eof:
                self.process.stdin.close()
            else:
                self.send('shutdown', id='bye')
            self.until('closed')
            self.process.wait(timeout=4)
        self.reader.join(timeout=1)
        self.assertEqual(self.process.returncode, 0)
        self.assertEqual(self.process.stderr.read(), b'')
        for stream in (self.process.stdin, self.process.stdout, self.process.stderr):
            stream.close()
        self.process = None

    def tearDown(self):
        try:
            self.stop()
        finally:
            if self.process and self.process.poll() is None:
                self.process.kill()
                self.process.wait()
            self.temp.cleanup()

    def test_multiturn_authoritative_snapshots_and_native_flags(self):
        first = self.opened()
        self.assertEqual(first['session']['cwd'], str(self.workspace))
        self.assertEqual(self.prompt('first')['disposition'], 'started')
        settled = self.finish()
        self.assertEqual(settled['messages'][-1]['text'], 'authoritative\u2028answer: first')
        self.assertNotIn('draft answer', str(settled))
        self.prompt('second', 3)
        second = self.finish()
        self.assertEqual([m['text'] for m in second['messages'] if m['role']=='user'], ['first','second'])
        self.assertFalse(second['loading'])
        self.assertEqual(second['session']['id'], first['session']['id'])
        updates = [event['text'] for event in self.events if event['event']=='tool_update']
        self.assertEqual(updates[:2], ['one\n','one\ntwo\n'])
        self.assertNotIn('PRIVATE_THOUGHT', str(self.events))
        observations = self.observations()
        self.assertEqual(len([o for o in observations if 'argv' in o]), 1)
        args = observations[0]['argv']
        self.assertEqual(args[args.index('--mode')+1], 'rpc')
        self.assertEqual(args[args.index('--tools')+1], TOOLS)
        self.assertEqual(args[args.index('--session-dir')+1], str(self.directory/'sessions'))
        for flag in ('--no-session','--no-builtin-tools','--print','--no-tools'):
            self.assertNotIn(flag, args)
        for flag in ('--no-context-files','--no-skills','--no-mcp','--no-extensions','--no-approve'):
            self.assertIn(flag, args)
        path = Path(second['session']['path'])
        self.assertEqual(path.stat().st_mode & 0o777, 0o600)
        self.assertEqual(path.parent.stat().st_mode & 0o777, 0o700)

    def test_acceptance_busy_queue_clear_before_abort_and_keep_session(self):
        original = self.opened()['session']['id']
        self.prompt('hold')
        self.until('tool_start')
        self.assertEqual(self.prompt('pending', 3)['disposition'], 'queued')
        self.assertEqual(self.prompt('handled', 'handled-busy')['disposition'], 'handled')
        for op in ('new','open','mode'):
            self.send(op, id=op, web_search=True)
            self.assertIn('任务正在执行', self.until('error', op)['error'])
        self.send('prompt', id='wrong-mode', question='x', web_search=True)
        self.until('error', 'wrong-mode')
        self.send('abort', id=4)
        self.assertEqual(self.until('queue_cleared', 4)['messages'], ['pending'])
        self.until('settled')
        snapshot = self.until('snapshot')
        self.assertEqual(snapshot['session']['id'], original)
        self.assertFalse(snapshot['loading'])
        tools = [row for row in snapshot['messages'] if row['role'] == 'tool']
        self.assertEqual(tools[-1]['text'], 'Cancelled tool')
        self.assertTrue(tools[-1]['is_error'])
        commands = [item['command']['type'] for item in self.observations() if 'command' in item]
        self.assertLess(commands.index('clear_queue'), commands.index('abort'))
        self.prompt('after abort', 5)
        self.finish()

    def test_retry_agent_end_is_not_completion_and_errors_are_private(self):
        self.opened()
        self.prompt('retry')
        snapshot = self.finish()
        self.assertEqual(sum(event['event']=='settled' for event in self.events), 1)
        self.assertIn('正在重试', str(self.events))
        self.assertNotIn('PRIVATE_PROVIDER_ERROR', str(self.events))
        self.assertNotIn('secret-token', str(self.events))
        self.assertEqual(snapshot['messages'][-1]['text'], 'authoritative\u2028answer: retry')
        self.send('prompt', id=4, question='reject')
        self.until('error', 4)
        self.assertNotIn('PRIVATE_PROVIDER_ERROR', str(self.events))
        self.assertEqual(self.prompt('handled', 5)['disposition'], 'handled')
        self.until('snapshot')

    def test_resume_absolute_path_restore_cwd_new_workspace_and_idle_mode(self):
        original = self.opened()['session']['id']
        self.prompt('remember')
        saved = self.finish()['session']
        self.stop()
        self.workspace = self.directory / 'other-workspace'
        self.write_config()
        self.start()
        self.send('open', id=10, session_id=original, web_search=False)
        resumed = self.until('snapshot', 10)
        self.assertEqual(resumed['session']['cwd'], saved['cwd'])
        self.assertIn('remember', str(resumed['messages']))
        self.send('mode', id=11, web_search=True)
        switched = self.until('snapshot', 11)
        self.assertEqual(switched['session']['id'], original)
        self.assertTrue(switched['web_search'])
        process_args = [item['argv'] for item in self.observations() if 'argv' in item]
        for args in process_args[1:]:
            self.assertEqual(args[args.index('--session')+1], saved['path'])
        self.assertIn('web_search', process_args[-1][process_args[-1].index('--tools')+1])
        self.send('new', id=12, web_search=False)
        fresh = self.until('snapshot', 12)
        self.assertEqual(fresh['session']['cwd'], str(self.workspace))
        self.assertNotEqual(fresh['session']['id'], original)
        self.assertEqual(fresh['messages'], [])

    def test_full_jsonl_search_before_compaction_and_legacy_retained(self):
        store = Store(self.db)
        store.add({'id':'legacy','question':'old','answer':'old Straße_%', 'sources':[], 'web_search':False, 'created_at':'old'})
        self.opened()
        self.prompt('Straße_% original')
        self.finish()
        self.prompt('compact', 3)
        snapshot = self.finish()
        self.assertNotIn('original', str(snapshot['messages']))
        self.assertEqual(len(store.search('STRASSE_%')), 2)
        self.assertEqual({e['kind'] for e in store.search('STRASSE_%')}, {'session','legacy'})
        self.assertEqual(store.search('STRASSE _%'), [])
        self.assertEqual(len(store.entries()), 1)
        self.assertEqual(store.load_state()['session_id'], None)

    def test_unsupported_dialog_gets_cancelled_without_blocking(self):
        self.opened()
        self.prompt('dialog')
        self.finish()
        responses = [o['command'] for o in self.observations() if o.get('command',{}).get('type')=='extension_ui_response']
        self.assertEqual(responses, [{'type':'extension_ui_response','id':'dialog-id','cancelled':True}])

    def test_eof_cleans_live_children_and_long_run_has_no_legacy_timeout(self):
        self.write_config(timeout=.2)
        self.opened()
        self.prompt('hold')
        self.until('tool_start')
        # A task may run far beyond the command-response timeout.
        time.sleep(.35)
        self.send('prompt', id=3, question='still running')
        self.assertEqual(self.until('accepted', 3)['disposition'], 'queued')
        child = next(item['child'] for item in self.observations() if 'child' in item)
        self.stop(eof=True)
        try:
            stat = Path(f'/proc/{child}/stat').read_text()
        except FileNotFoundError:
            pass
        else:
            self.assertEqual(stat.split(') ',1)[1][0], 'Z')
        self.assertTrue(any(item.get('eof') for item in self.observations()))

    def test_lazy_empty_session_not_indexed_until_native_file_exists(self):
        self.environment['FAKE_LAZY'] = '1'
        snapshot = self.opened()
        self.assertFalse(Path(snapshot['session']['path']).exists())
        self.assertEqual(Store(self.db).sessions(), [])
        self.prompt('first persisted turn')
        self.finish()
        self.assertEqual(len(Store(self.db).sessions()), 1)

    def test_native_followups_run_before_single_settlement(self):
        self.opened()
        self.prompt('retry')
        self.assertEqual(self.prompt('follow-up turn', 3)['disposition'], 'queued')
        snapshot = self.finish()
        users = [row['text'] for row in snapshot['messages'] if row['role'] == 'user']
        self.assertEqual(users, ['retry', 'follow-up turn'])
        self.assertEqual(sum(event['event'] == 'settled' for event in self.events), 1)
        self.assertFalse(snapshot['loading'])

    def test_immediate_prompt_after_settled_cannot_receive_stale_idle_snapshot(self):
        self.opened()
        self.prompt('first')
        self.until('settled')
        self.send('prompt', id=3, question='immediate second')
        prior = self.until('snapshot')
        self.assertEqual(prior['messages'][-1]['text'], 'authoritative\u2028answer: first')
        self.until('accepted', 3)
        latest = self.finish()
        self.assertEqual(latest['messages'][-1]['text'], 'authoritative\u2028answer: immediate second')

    def test_split_utf8_client_framing_unicode_jsonl_index_and_invalid_request_recovery(self):
        self.opened()
        self.process.stdin.write(b'not json\n')
        self.process.stdin.flush()
        self.until('error')
        question = '中文\u2028separator\u2029Straße_%'
        request = (json.dumps({'op':'prompt','id':4,'question':question}, ensure_ascii=False) + '\n').encode()
        for offset in range(0, len(request), 2):
            self.process.stdin.write(request[offset:offset+2])
            self.process.stdin.flush()
        self.until('accepted', 4)
        snapshot = self.finish()
        self.assertEqual(snapshot['messages'][0]['text'], question)
        hits = Store(self.db).search('STRASSE_%')
        self.assertEqual(len(hits), 1)
        self.assertIn(question, hits[0]['search_snippet'])
        self.assertEqual(Store(self.db).search('PRIVATE_THOUGHT'), [])

    def test_native_edit_arguments_and_tool_results_survive_public_projection(self):
        from quick_ask_backend.messages import public_messages
        from quick_ask_backend.server import Server
        edits = {'path':'example.txt','edits':[{'oldText':'before','newText':'after'}]}
        rows = public_messages([
            {'role':'assistant','content':[{'type':'thinking','thinking':'secret'},
                {'type':'toolCall','id':'edit-1','name':'edit','arguments':edits}]},
            {'role':'toolResult','toolCallId':'edit-1','toolName':'edit','isError':False,
             'content':[{'type':'text','text':'Replaced one occurrence'}]},
        ])
        self.assertEqual(rows, [{'role':'tool','tool_call_id':'edit-1','name':'edit','args':edits,
                                'text':'Replaced one occurrence','is_error':False}])
        events = []
        server = Server(Config(), Store(self.db), events.append)
        server.runtime = type('FakeRuntime', (), {'token':'current'})()
        server.native('current', {'type':'tool_execution_start','toolCallId':'edit-1','toolName':'edit','args':edits})
        self.assertEqual(events[0]['args'], edits)
        self.assertEqual(events[0]['event'], 'tool_start')

    def test_eof_interrupts_unresponsive_rpc_without_waiting_for_command_deadline(self):
        self.opened()
        self.send('prompt', id=2, question='stall')
        time.sleep(.1)
        before = time.monotonic()
        self.stop(eof=True)
        self.assertLess(time.monotonic() - before, 2.5)

    def test_malformed_native_protocol_fails_closed_and_can_reopen(self):
        self.opened()
        self.send('prompt', id=2, question='malformed')
        self.until('error', 2)
        self.until('error')  # Transport exit is independent of command failure.
        self.send('new', id=3)
        self.until('snapshot', 3)
        self.prompt('recovered', 4)
        self.finish()

    def test_config_workspace_validation(self):
        with patch.dict(os.environ, {'QUICK_ASK_CONFIG':str(self.config)}):
            self.assertEqual(load_config().workspace, str(self.workspace))
            self.config.write_text('[agent]\nworkspace=42\n')
            with self.assertRaises(ValueError):
                load_config()
        args, _ = agent_command(Config(command='fake'), False, self.directory)
        self.assertEqual(args[args.index('--tools')+1], TOOLS)


if __name__ == '__main__':
    unittest.main()

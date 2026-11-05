#!/usr/bin/env python3
"""Explicit simulated Pi RPC for the opt-in desktop test. Never calls a model."""
import json
import os
from pathlib import Path
import sys
import threading
import time
import uuid

out_lock = threading.Lock()
state_lock = threading.RLock()
stop = threading.Event()
idle = threading.Event()
idle.set()
queue = []
messages = []
entries = []
busy = False
worker = None
session_path = None
session_id = None
cwd = os.getcwd()


def option(name):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else None


def emit(value):
    with out_lock:
        print(json.dumps(value, ensure_ascii=False), flush=True)


def response(request, data=None):
    emit({'type': 'response', 'id': request.get('id'), 'command': request['type'],
          'success': True, 'data': data})


def open_session(path=None):
    global session_path, session_id, cwd, messages, entries
    if path:
        session_path = Path(path)
        records = [json.loads(line) for line in session_path.read_text().split('\n') if line]
        header, entries = records[0], records[1:]
        session_id, cwd = header['id'], header['cwd']
        messages = [record['message'] for record in entries if record.get('type') == 'message']
    else:
        session_id = str(uuid.uuid4())
        directory = Path(option('--session-dir') or (Path.cwd() / 'sessions'))
        directory.mkdir(parents=True, exist_ok=True)
        session_path = directory / (session_id + '.jsonl')
        session_path.write_text(json.dumps({'type': 'session', 'version': 3, 'id': session_id,
                                          'cwd': cwd, 'timestamp': '2026-11-05T00:00:00Z'}) + '\n')
        session_path.chmod(0o600)
        messages, entries = [], []


def record(message):
    with state_lock:
        message.setdefault('timestamp', int(time.time() * 1000))
        entry = {'type': 'message', 'id': uuid.uuid4().hex[:8],
                 'parentId': entries[-1]['id'] if entries else None,
                 'timestamp': '2026-11-05T00:00:00Z', 'message': message}
        messages.append(message)
        entries.append(entry)
        with session_path.open('a') as output:
            output.write(json.dumps(entry, ensure_ascii=False) + '\n')
    emit({'type': 'message_end', 'message': message})


def assistant(text):
    emit({'type': 'message_start', 'message': {'role': 'assistant', 'content': []}})
    for chunk in (text[:5], text[5:]):
        emit({'type': 'message_update', 'assistantMessageEvent': {'type': 'text_delta', 'contentIndex': 0, 'delta': chunk}})
    record({'role': 'assistant', 'content': [{'type': 'text', 'text': text}],
            'stopReason': 'stop', 'provider': 'desktop-fixture', 'model': 'fake-pi'})


def tool(name, arguments, action):
    call_id = uuid.uuid4().hex
    record({'role': 'assistant', 'content': [{'type': 'toolCall', 'id': call_id, 'name': name, 'arguments': arguments}], 'stopReason': 'toolUse'})
    emit({'type': 'tool_execution_start', 'toolCallId': call_id, 'toolName': name, 'args': arguments})
    time.sleep(.25)
    text = action()
    for snapshot in (text[:4], text):
        emit({'type': 'tool_execution_update', 'toolCallId': call_id, 'toolName': name, 'args': arguments,
              'partialResult': {'content': [{'type': 'text', 'text': snapshot}]}})
    result = {'content': [{'type': 'text', 'text': text}]}
    emit({'type': 'tool_execution_end', 'toolCallId': call_id, 'toolName': name, 'result': result, 'isError': False})
    record({'role': 'toolResult', 'toolCallId': call_id, 'toolName': name, **result, 'isError': False})


def run_turns(question):
    global busy
    try:
        while True:
            record({'role': 'user', 'content': question})
            emit({'type': 'agent_start'})
            if 'slow' in question.lower():
                stop.wait(12)
                if stop.is_set():
                    break
                assistant('模拟长任务完成。')
            else:
                target = Path(cwd) / 'agent-smoke.txt'
                first = not target.exists()
                content = 'quick-agent-first\n' if first else 'quick-agent-first\nquick-agent-second\n'
                def write():
                    target.write_text(content)
                    return '文件已写入。'
                tool('write' if first else 'edit', {'path': 'agent-smoke.txt'}, write)
                if first:
                    tool('read', {'path': 'agent-smoke.txt'}, target.read_text)
                else:
                    tool('bash', {'command': 'wc -l agent-smoke.txt'}, lambda: '2 agent-smoke.txt\n')
                assistant('隔离模拟：已创建并读回文件。只在答案中的关键词。' if first else '隔离模拟：已追加一行，文件共 2 行。')
            emit({'type': 'agent_end', 'messages': list(messages), 'willRetry': False})
            with state_lock:
                if stop.is_set() or not queue:
                    break
                question = queue.pop(0)
    finally:
        with state_lock:
            busy = False
            emit({'type': 'agent_settled', 'aborted': stop.is_set()})
            idle.set()


open_session(option('--session'))
try:
    for line in sys.stdin:
        request = json.loads(line)
        command = request['type']
        if command == 'get_state':
            response(request, {'sessionId': session_id, 'sessionFile': str(session_path), 'isStreaming': busy,
                               'isCompacting': False, 'messageCount': len(messages), 'pendingMessageCount': len(queue),
                               'model': {'provider': 'desktop-fixture', 'id': 'fake-pi'}, 'thinkingLevel': 'off'})
        elif command == 'get_messages':
            response(request, {'messages': list(messages)})
        elif command == 'get_entries':
            response(request, {'entries': list(entries), 'leafId': entries[-1]['id'] if entries else None})
        elif command in ('prompt', 'follow_up', 'steer'):
            with state_lock:
                if busy:
                    queue.append(request['message'])
                    response(request, {'disposition': 'queued'})
                else:
                    busy = True
                    stop.clear(); idle.clear()
                    response(request, {'disposition': 'started'})
                    worker = threading.Thread(target=run_turns, args=(request['message'],), daemon=True)
                    worker.start()
        elif command == 'clear_queue':
            with state_lock:
                cleared = list(queue); queue.clear()
            response(request, {'steering': [], 'followUp': cleared})
        elif command == 'abort':
            stop.set(); idle.wait(3)
            response(request)
        elif command in ('new_session', 'switch_session'):
            open_session(request.get('sessionPath'))
            response(request, {'cancelled': False})
        else:
            emit({'type': 'response', 'id': request.get('id'), 'command': command, 'success': False, 'error': 'Unsupported fixture command'})
finally:
    stop.set()
    if worker:
        worker.join(3)

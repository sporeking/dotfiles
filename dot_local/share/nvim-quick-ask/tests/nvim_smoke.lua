-- nvim --headless -u NONE -l /absolute/quick-ask/tests/nvim_smoke.lua
-- Isolated deterministic protocol server: no Pi/model, auth, network, user
-- history, desktop, or real input-method calls are used.
local api = vim.api
local root = vim.fs.dirname(vim.fs.dirname(vim.fn.fnamemodify(debug.getinfo(1, 'S').source:sub(2), ':p')))
local temporary = vim.fn.tempname()
vim.fn.mkdir(temporary, 'p')
local function write(name, text, executable)
  local path = temporary .. '/' .. name
  vim.fn.writefile(vim.split(text, '\n', { plain = true }), path)
  if executable then vim.fn.setfperm(path, 'rwx------') end
  return path
end
local function read(name)
  local path = temporary .. '/' .. name
  return vim.fn.filereadable(path) == 1 and table.concat(vim.fn.readfile(path), '\n') or ''
end
local function check(value, message) if not value then error(message, 2) end end
local function equal(actual, expected, message)
  check(vim.deep_equal(actual, expected), (message or 'values differ') .. ': ' .. vim.inspect(actual) .. ' ~= ' .. vim.inspect(expected))
end
local function await(predicate, message, timeout)
  check(vim.wait(timeout or 5000, predicate, 10), message)
end
write('quick_ask_backend.py', [=[
import json, os, pathlib, sys, threading, time
root = pathlib.Path(__file__).parent
lock = threading.RLock()
def log(name, value):
    with (root / name).open('a') as f: f.write(json.dumps(value, ensure_ascii=False) + '\n')
def legacy():
    result = [{'kind': 'legacy', 'id': n, 'question': 'old question ' + str(n),
               'answer': 'answer ' + str(n), 'web_search': False, 'sources': []}
              for n in range(1101, 0, -1)]
    result[1]['answer'] = '\n'.join('line %d **markdown**' % i for i in range(70))
    result[1]['web_search'] = True
    result[-1].update(question='old archive', answer='padding ' * 40 + 'Straße [a.b] Unicode match!')
    return result
def saved_sessions():
    path = root / 'sessions.json'
    return json.loads(path.read_text()) if path.exists() else {
        'saved-chat': {'session': {'id': 'saved-chat', 'title': 'saved native conversation',
            'question': 'saved native conversation', 'cwd': '/fixture/original-workspace',
            'path': '/fixture/saved.jsonl', 'web_search': True, 'updated_at': '2026-01-01'},
            'messages': [{'role': 'user', 'text': 'earlier user'},
                         {'role': 'assistant', 'text': 'earlier assistant Straße'}]}}
if sys.argv[1:] != ['serve']:
    req = json.load(sys.stdin)
    log('requests.jsonl', req)
    op = req['op']
    if op == 'load':
        path = root / 'state.json'
        state = json.loads(path.read_text()) if path.exists() else {
            'selected_id': 1100, 'session_id': None, 'draft': 'first\n中abc\nthird',
            'cursor': [2, 3], 'result_scroll': 5, 'web_search': False, 'history_query': ''}
        print(json.dumps({'ok': True, 'entries': legacy(),
            'sessions': [x['session'] for x in saved_sessions().values()], 'state': state,
            'config': {'input_method': not (root / 'no-im').exists(), 'workspace': '~/agent-workspace'}}))
    elif op == 'save_state':
        if (root / 'fail-save').exists():
            print(json.dumps({'ok': False, 'error': 'state save refused'})); sys.exit(1)
        (root / 'state.json').write_text(json.dumps(req['state']))
        print(json.dumps({'ok': True}))
    elif op == 'search':
        query = req['query'].casefold()
        results = []
        for item in saved_sessions().values():
            full = '\n'.join(m['text'] for m in item['messages'])
            if query in (item['session']['title'] + full).casefold():
                results.append(dict(item['session'], kind='session', search_snippet=full))
        for item in legacy():
            if query in (item['question'] + item['answer']).casefold():
                item['search_snippet'] = item['answer'][-120:]
                results.append(item)
        print(json.dumps({'ok': True, 'entries': results}))
    else: raise AssertionError(op)
    sys.exit(0)
log('servers.jsonl', {'pid': os.getpid()})
sessions = saved_sessions()
active = None
busy = False
pending = []
cancel = threading.Event()
serial = 0
def emit(value, split=False):
    data = (json.dumps(value, ensure_ascii=False) + '\n').encode()
    with lock:
        if split and '你'.encode() in data:
            first = data.index('你'.encode()) + 1
            second = data.index('🙂'.encode()) + 2
            for chunk in (data[:first], data[first:second], data[second:]):
                sys.stdout.buffer.write(chunk); sys.stdout.buffer.flush(); time.sleep(.01)
        else:
            sys.stdout.buffer.write(data); sys.stdout.buffer.flush()
def snapshot(req=None):
    emit(dict(event='snapshot', id=req, session=active['session'], messages=active['messages'],
              loading=busy, web_search=active['session']['web_search']))
def persist():
    (root / 'sessions.json').write_text(json.dumps(sessions))
def work(req):
    global busy
    while req:
        question = req['question']
        with lock:
            user = {'role': 'user', 'text': question}
            active['messages'].append(user)
            emit({'event': 'message_end', 'message': user})
            emit({'event': 'message_start', 'role': 'assistant'})
            emit({'event': 'delta', 'text': '你好🙂 streamed'}, split=True)
            for _ in range(80): emit({'event': 'delta', 'text': '.'})
            emit({'event': 'status', 'text': 'fixture working ' + question})
        if question.startswith('slow'):
            while not cancel.wait(.01) and not (root / ('release-' + question)).exists(): pass
        with lock:
            aborted = cancel.is_set()
            answer = {'role': 'assistant', 'text': ('aborted ' if aborted else 'final ') + question}
            emit({'event': 'message_end', 'message': answer})
            active['messages'].append(answer)
            if not aborted and question == 'tools':
                for name in ('read', 'edit', 'write', 'bash'):
                    call = {'tool_call_id': 'call-' + name, 'name': name,
                            'args': {'command': 'printf example', 'path': '/fixture/note.txt'}}
                    emit(dict(call, event='tool_start'))
                    emit(dict(call, event='tool_update', text='first'))
                    emit(dict(call, event='tool_update', text='first\nsecond'))
                    if name == 'read':
                        emit({'event': 'status', 'text': 'tool previews ready'})
                        while not (root / 'release-tools').exists(): time.sleep(.01)
                    output = 'first\nsecond\n' + 'output line\n' * 1000
                    emit(dict(call, event='tool_end', text=output))
                    active['messages'].append(dict(call, role='tool', text=output))
            if pending and not aborted:
                req = pending.pop(0)
            else:
                req = None
                busy = False
                persist()
                # Settlement and authoritative snapshot are one serial boundary.
                emit({'event': 'settled', 'aborted': aborted})
                snapshot()
for raw in sys.stdin:
    req = json.loads(raw)
    log('requests.jsonl', dict(req, pid=os.getpid()))
    op = req['op']
    with lock:
        if op in ('open', 'new', 'mode'):
            if busy:
                emit({'event': 'error', 'id': req['id'], 'error': 'busy; wait'}); continue
            if op == 'open' and req.get('session_id') == 'missing':
                emit({'event': 'error', 'id': req['id'], 'error': 'session unavailable'}); continue
            if op == 'mode':
                active['session']['web_search'] = req['web_search']
            elif op == 'open' and req.get('session_id'):
                active = sessions[req['session_id']]
            else:
                serial += 1
                identity = 'chat-%s-%s' % (os.getpid(), serial)
                active = {'session': {'id': identity, 'title': 'fixture chat', 'cwd': '/fixture/agent-workspace',
                    'path': '/fixture/' + identity + '.jsonl', 'web_search': req['web_search'],
                    'updated_at': '2026-01-01'}, 'messages': []}
                sessions[identity] = active
            persist(); snapshot(req['id'])
        elif op == 'prompt':
            if req['question'] == 'crash':
                print('PRIVATE PROVIDER SECRET', file=sys.stderr, flush=True)
                os._exit(3)
            if req['question'] == 'error':
                emit({'event': 'error', 'id': req['id'], 'error': 'expected friendly failure'}); continue
            if req['question'] == 'race':
                while not (root / 'accept-race').exists(): time.sleep(.01)
            emit({'event': 'accepted', 'id': req['id'], 'disposition': 'queued' if busy else 'started'})
            if busy: pending.append(req)
            else:
                busy = True; cancel.clear()
                threading.Thread(target=work, args=(req,), daemon=True).start()
        elif op == 'abort':
            cleared = [item['question'] for item in pending]
            pending.clear(); cancel.set()
            emit({'event': 'queue_cleared', 'messages': cleared})
            emit({'event': 'accepted', 'id': req['id'], 'disposition': 'handled'})
        elif op == 'shutdown':
            pending.clear(); cancel.set()
            log('shutdown.jsonl', {'pid': os.getpid(), 'busy': busy})
            emit({'event': 'closed'})
            break
        else: raise AssertionError(op)
]=])
write('fcitx5-remote', [=[#!/usr/bin/env python3
import pathlib, sys
root = pathlib.Path(__file__).parent
state = root / 'im-state'
args = sys.argv[1:]
with (root / 'im.log').open('a') as out: out.write(' '.join(args) + '\n')
if not args: print(state.read_text() if state.exists() else '2')
elif args == ['-c']: state.write_text('1')
elif args == ['-o']: state.write_text('2')
]=], true)
local control = write('control.py', [=[
import pathlib, sys
(pathlib.Path(__file__).parent / 'launcher.log').write_text(' '.join(sys.argv[1:]))
]=])
vim.env.QUICK_ASK_ROOT, vim.env.QUICK_ASK_CTL = temporary, control
vim.env.QUICK_ASK_PYTHON, vim.env.PYTHONPATH = 'python3', temporary
vim.env.PATH = temporary .. ':' .. vim.env.PATH
vim.env.NVIM_APPNAME = 'nvim-quick-ask-smoke'
vim.env.NVIM_LOG_FILE = temporary .. '/nvim.log'
vim.opt.shadafile, vim.opt.lines, vim.opt.columns = 'NONE', 24, 90
-- Retain actual callback closures to exercise hostile late output from an old
-- job after a replacement has been started, rather than merely checking timers.
local original_system, captured = vim.system, {}
vim.system = function(command, options, callback)
  if command[#command] == 'serve' then captured[#captured + 1] = { options = options, exit = callback } end
  return original_system(command, options, callback)
end
dofile(root .. '/nvim/init.lua')
local ui, s = require('quick_ask'), require('quick_ask').state
local function draft(text) api.nvim_buf_set_lines(s.input_buf, 0, -1, false, vim.split(text, '\n', { plain = true })) end
local function input() return table.concat(api.nvim_buf_get_lines(s.input_buf, 0, -1, false), '\n') end
local function result() return table.concat(api.nvim_buf_get_lines(s.result_buf, 0, -1, false), '\n') end
local function scroll() return api.nvim_win_call(s.result_win, function() return vim.fn.winsaveview().topline end) end
local function keys(text) api.nvim_feedkeys(api.nvim_replace_termcodes(text, true, false, true), 'xt', false) end
local function records(name)
  local found = {}
  for _, raw in ipairs(vim.split(read(name), '\n', { trimempty = true })) do found[#found + 1] = vim.json.decode(raw) end
  return found
end
local function requests(op)
  local found = {}
  for _, item in ipairs(records('requests.jsonl')) do if item.op == op then found[#found + 1] = item end end
  return found
end
local function saved() return vim.json.decode(read('state.json')) end
local original_input = vim.ui.input
local function prompt_with(query)
  vim.ui.input = function(options, callback) equal(options.prompt, '历史 / ', 'search prompt'); callback(query) end
end
local function view()
  return { draft = input(), cursor = api.nvim_win_get_cursor(s.input_win), selected = s.selected_id,
    session = s.session_id, web = s.web_search, result = result(), scroll = scroll(), query = s.history_query }
end
local function idle() await(function() return not s.loading and not s.switching end, 'agent settles') end
local function start_slow(name)
  api.nvim_set_current_win(s.input_win)
  draft('slow ' .. name); ui.submit()
  await(function() return s.message == 'fixture working slow ' .. name end, 'slow task started: ' .. name)
  check(s.loading, 'slow task busy')
end
local function release(name)
  write('release-slow ' .. name, '1'); idle()
end
local ok, failure = xpcall(function()
  equal(#api.nvim_tabpage_list_wins(0), 2, 'two windows')
  equal(api.nvim_win_get_height(s.input_win), 3, 'three-row input')
  check(api.nvim_win_get_position(s.input_win)[1] < api.nvim_win_get_position(s.result_win)[1], 'input above transcript')
  check(vim.bo[s.result_buf].readonly and not vim.bo[s.result_buf].modifiable, 'readonly transcript')
  equal(vim.bo[s.result_buf].filetype, 'markdown', 'built-in Markdown')
  check(vim.wo[s.result_win].wrap and vim.wo[s.result_win].linebreak, 'wrapped result')
  equal(input(), 'first\n中abc\nthird', 'multiline draft restore')
  equal(api.nvim_win_get_cursor(s.input_win), { 2, 3 }, 'UTF-8 byte column restore')
  equal(s.selected_id, 1100, 'legacy selected id')
  equal(scroll(), 5, 'legacy scroll restore')
  equal(#s.entries, 1101, 'entire legacy history loaded')
  equal(#s.sessions, 1, 'native session metadata loaded')
  equal(#requests('prompt'), 0, 'startup never prompts')
  equal(read('im.log'), '', 'startup never touches IM')
  ui.on_show(); equal(read('im-state'), '1', 'show captures Chinese and selects English Normal')
  local before = view()
  keys('<Tab>'); check(s.web_search, 'Normal Tab toggles dedicated web search')
  equal(input(), before.draft, 'Tab preserves draft'); equal(result(), before.result, 'Tab preserves legacy result')
  equal(api.nvim_win_get_cursor(s.input_win), before.cursor, 'Tab preserves cursor')
  equal(vim.fn.mode(), 'n', 'Normal Tab preserves mode'); keys('<Tab>')
  local samples = {}
  vim.keymap.set('i', '<F12>', function()
    samples[#samples + 1] = { mode = vim.fn.mode(), web = s.web_search, input = input(),
      cursor = api.nvim_win_get_cursor(s.input_win), im = read('im-state') }
  end, { buffer = s.input_buf })
  keys('i<F12><Tab><F12><Tab><F12><Esc>')
  equal(#samples, 3, 'Insert survives Tabs')
  for _, sample in ipairs(samples) do
    equal(sample.mode, 'i', 'Tab retains Insert'); equal(sample.input, before.draft, 'Insert Tab draft')
    equal(sample.cursor, samples[1].cursor, 'Insert Tab byte cursor'); equal(sample.im, '2', 'Insert restores Chinese')
  end
  check(samples[2].web and not samples[3].web, 'Insert toggles both ways')
  vim.keymap.del('i', '<F12>', { buffer = s.input_buf })
  equal(read('im-state'), '1', 'Esc enters English Normal')
  api.nvim_win_set_cursor(s.input_win, { 1, 0 }); keys('jjk')
  equal(api.nvim_win_get_cursor(s.input_win)[1], 2, 'native multiline j/k')
  keys('0wciwchanged<Esc>u'); equal(input(), before.draft, 'native edit/undo')
  draft('one\ntwo'); api.nvim_win_set_cursor(s.input_win, { 2, 0 }); keys('o三<Esc>')
  equal(input(), 'one\ntwo\n三', 'native o adds a line')
  api.nvim_paste('paste\nsecond\nthird', false, -1)
  check(api.nvim_buf_line_count(s.input_buf) >= 5, 'multiline paste')
  draft('first\n中abc\nthird'); api.nvim_win_set_cursor(s.input_win, { 2, 3 })
  ui.scroll(1); check(ui.save_state(), 'save succeeds'); equal(saved().cursor, { 2, 3 }, 'saved byte cursor')

  -- Literal Unicode/full-history search and mixed native/legacy selection.
  before = view(); prompt_with('STRASSE'); keys('/')
  equal(#s.search.entries, 2, 'casefold finds native and oldest of >1000 legacy records')
  check(result():find('Straße', 1, true), 'backend match snippet shown')
  keys('<Esc>'); equal(view(), before, 'cancel restores complete draft and view')
  prompt_with('[a.b]'); ui.open_history(); equal(#s.search.entries, 1, 'literal special characters')
  keys('<CR>'); equal(s.selected_id, 1, 'legacy selection'); equal(input(), 'old archive', 'legacy question restored')
  check(not s.session_id and result():find('Straße', 1, true), 'legacy answer displayed without agent context')
  equal(#requests('prompt'), 0, 'search/selection never asks')
  draft('unsubmitted draft'); prompt_with('saved native'); ui.open_history(); keys('<CR>'); idle()
  equal(s.session_id, 'saved-chat', 'session selection resumes native id')
  equal(input(), 'unsubmitted draft', 'session snapshot never replaces draft')
  equal(#s.messages, 2, 'session conversation restored')
  check(ui.statusline():find('/fixture/original-workspace', 1, true), 'native cwd in status')
  before = view(); prompt_with('does not exist'); ui.open_history(); keys('<CR><Esc>')
  equal(view(), before, 'empty selector is harmless')
  prompt_with(nil); ui.open_history(); equal(view(), before, 'prompt cancel')
  local stale_prompt
  vim.ui.input = function(_, callback) stale_prompt = callback end
  ui.open_history(); draft('new edit during prompt'); check(not s.search, 'editing dismisses selector')
  stale_prompt('STRASSE'); equal(input(), 'new edit during prompt', 'stale prompt cannot undo draft')
  -- Legacy re-ask MUST start fresh instead of injecting into saved-chat.
  prompt_with('[a.b]'); ui.open_history(); ui.select_history()
  keys('<CR>'); await(function() return s.session_id and s.session_id ~= 'saved-chat' end, 'fresh legacy re-ask session'); idle()
  local legacy_session = s.session_id
  equal(#s.messages, 2, 'legacy re-ask isolated transcript')
  equal(s.messages[1].text, 'old archive', 'legacy prompt sent in fresh session')
  equal(input(), '', 'accepted clears unchanged submitted draft')

  -- Streaming and authoritative final, sequential turns, correlated tool output.
  local writes = 0
  api.nvim_buf_attach(s.result_buf, false, { on_lines = function() writes = writes + 1 end })
  draft('multi\n中🙂 question'); keys('<CR>'); check(s.loading, 'Enter starts task'); idle()
  equal(s.session_id, legacy_session, 'next turn retains conversation')
  equal(#s.messages, 4, 'two chronological turns')
  equal(s.messages[3].text, 'multi\n中🙂 question', 'multiline UTF-8 user message')
  equal(s.messages[4].text, 'final multi\n中🙂 question', 'authoritative assistant replaces stream')
  check(not result():find('streamed', 1, true), 'stream placeholder replaced')
  check(writes < 15, '80-event stream is throttled: ' .. writes)
  draft('tools'); ui.submit()
  await(function() return s.message == 'tool previews ready' end, 'tool update stage before settlement')
  equal(#s.messages, 7, 'one correlated tool row for start and repeated updates')
  equal(s.messages[7].text, 'first\nsecond', 'cumulative progress REPLACES previous tool text before snapshot')
  check(s.messages[7].running, 'tool progress marked running')
  await(function() return result():find('first\nsecond', 1, true) end, 'live tool update rendered')
  write('release-tools', '1'); idle()
  for index, name in ipairs({ 'read', 'edit', 'write', 'bash' }) do
    local message = s.messages[6 + index]
    equal(message.role, 'tool', 'tool chronological role'); equal(message.name, name, 'native tool trace')
    check(message.text:find('first\nsecond', 1, true), 'cumulative tool output preserved')
    check(not message.text:find('firstfirst', 1, true), 'tool update replaces rather than appends')
  end
  check(#result() < 12000 and result():find('完整输出保存在会话中', 1, true), 'large tool output has bounded previews')
  equal(#records('servers.jsonl'), 1, 'all turns share persistent server')

  -- Acceptance arrives after an edit: preserve newer draft by changedtick, even
  -- if the user later restores exactly the submitted text.
  draft('race'); ui.submit(); draft('newer draft'); draft('race')
  write('accept-race', '1'); idle(); equal(input(), 'race', 'changedtick guards same-text newer draft')
  start_slow('edit'); local server = s.server
  check(s.messages[#s.messages].text:find('你好🙂 streamed', 1, true), 'split UTF-8 delta is reconstructed during stream')
  draft('unsent\nnew draft'); keys('i<Esc>')
  check(s.loading and s.server == server, 'editing/Insert never cancels task')
  local mode = s.web_search
  keys('<Tab>'); equal(s.web_search, mode, 'busy Tab rejected')
  ui.new_chat(); equal(s.session_id, legacy_session, 'busy NewChat rejected')
  prompt_with('saved native'); ui.open_history(); check(not s.search, 'busy history switch rejected')
  equal(#requests('abort'), 0, 'editing/mode/history do not abort')
  release('edit'); equal(input(), 'unsent\nnew draft', 'settlement snapshot preserves next draft')

  -- Enter while busy uses native follow-up queuing. Ctrl+C is the ONLY task
  -- cancellation path; cleared queued texts are appended after newer draft.
  start_slow('queue')
  draft('queued one'); keys('<CR>'); await(function() return s.queued == 1 end, 'follow-up queued')
  equal(input(), '', 'accepted queued draft clears')
  draft('queued two'); ui.submit(); await(function() return s.queued == 2 end, 'second queued follow-up')
  draft('newer unsubmitted'); keys('<C-c>'); idle()
  equal(input(), 'newer unsubmitted\n\nqueued one\n\nqueued two', 'abort restores queue without losing draft')
  equal(s.server, server, 'abort keeps runtime alive')
  equal(s.messages[#s.messages].text, 'aborted slow queue', 'aborted history retained')
  local prompts = #requests('prompt')
  equal(#requests('abort'), 1, 'Ctrl+C sends one abort and never resubmits')
  start_slow('followup'); draft('actual follow-up'); ui.submit()
  await(function() return s.queued == 1 end, 'follow-up acceptance'); release('followup')
  equal(s.messages[#s.messages - 1].text, 'actual follow-up', 'queued user gets own chronological turn')
  equal(s.messages[#s.messages].text, 'final actual follow-up', 'queued follow-up completes natively')
  check(#requests('prompt') == prompts + 2, 'follow-up uses prompt protocol')
  draft('idle control'); keys('<C-c>'); idle(); equal(s.messages[#s.messages].text, 'final idle control', 'idle Ctrl+C submits')

  -- Hiding saves drafts/cursor/IM and leaves the very same job running.
  start_slow('hide'); draft('persist this\n中draft'); api.nvim_win_set_cursor(s.input_win, { 2, 3 })
  write('fail-save', '1'); equal(ui.before_hide(), 0, 'save failure prevents hide'); check(s.visible, 'failed hide remains visible')
  equal(s.message, 'state save refused', 'save error surfaced'); vim.fn.delete(temporary .. '/fail-save')
  equal(ui.before_hide(), 1, 'hide succeeds'); equal(read('im-state'), '2', 'hide restores captured Chinese')
  check(s.loading and s.server == server, 'hide keeps running server')
  equal(saved().session_id, legacy_session, 'session id persisted')
  equal(saved().draft, 'persist this\n中draft', 'hide persists multiline draft'); equal(saved().cursor, { 2, 3 }, 'hide persists byte cursor')
  local imlog = read('im.log'); ui.before_hide(); equal(read('im.log'), imlog, 'repeated hide no extra IM call')
  release('hide'); check(result():find('final slow hide', 1, true), 'hidden task continues updating')
  ui.on_show(); equal(input(), 'persist this\n中draft', 'show preserves next draft')
  start_slow('quit-hide'); keys(':q<CR>')
  await(function() return read('launcher.log') == 'hide' end, ':q invokes hide'); check(s.loading, ':q preserves running task')
  release('quit-hide'); write('launcher.log', ''); ui.on_show()
  keys(':q!<CR>'); await(function() return read('launcher.log') == 'hide' end, ':q! hides without exit')
  check(api.nvim_buf_is_valid(s.input_buf), 'editor still alive')

  -- Mode switch resumes same session, preserving transcript/draft/cursor/mode.
  ui.on_show(); local count = #s.messages; local current_id = s.session_id
  draft('mode draft\n中abc'); api.nvim_win_set_cursor(s.input_win, { 2, 3 })
  keys('<Tab>'); idle(); check(s.web_search ~= mode, 'idle server mode switched')
  equal(s.session_id, current_id, 'mode preserves session'); equal(#s.messages, count, 'mode preserves native context')
  equal(input(), 'mode draft\n中abc', 'mode snapshot preserves draft'); equal(api.nvim_win_get_cursor(s.input_win), { 2, 3 }, 'mode preserves byte cursor')
  keys('i<Tab><Esc>'); idle(); equal(s.web_search, mode, 'Insert Tab changes server tools')
  keys(':NewChat<CR>'); idle(); check(s.session_id ~= current_id, 'NewChat creates new conversation')
  equal(#s.messages, 0, 'NewChat clears only transcript'); equal(input(), 'mode draft\n中abc', 'NewChat preserves draft')
  current_id = s.session_id
  -- Crash is a genuine old-process boundary, then restart resumes by session id.
  draft('error'); ui.submit(); idle(); equal(s.message, 'expected friendly failure', 'recoverable error shown')
  check(s.server ~= nil, 'recoverable error keeps server alive')
  local old = captured[#captured]
  draft('crash'); ui.submit(); await(function() return s.server == nil end, 'unexpected exit releases ownership')
  check(not s.message:find('PRIVATE', 1, true), 'raw provider stderr hidden')
  -- A failed dependent open may not send its draft to any previous session.
  local prompt_count = #requests('prompt')
  s.session_id = 'missing'; draft('must stay unsent'); ui.submit(); idle()
  equal(s.message, 'session unavailable', 'failed resume reported')
  equal(#requests('prompt'), prompt_count, 'failed open never dispatches dependent prompt')
  equal(input(), 'must stay unsent', 'failed open preserves draft')
  s.session_id = current_id
  draft('restarted'); ui.submit(); idle(); check(s.server ~= server, 'restart creates new owned job')
  before = view(); local old_messages = vim.deepcopy(s.messages)
  old.options.stdout(nil, vim.json.encode({ event = 'delta', text = 'STALE OUTPUT' }) .. '\n')
  old.options.stdout(nil, vim.json.encode({ event = 'snapshot', session = { id = 'stale' }, messages = {}, loading = true }) .. '\n')
  old.exit({ code = 99, stderr = 'STALE PRIVATE' })
  vim.wait(80, function() return false end, 10)
  equal(view(), before, 'old stdout/exit cannot overwrite new server UI'); equal(s.messages, old_messages, 'old callback cannot mutate messages')

  -- Persist/restore native session in a separate editor without any prompt.
  ui.save_state()
  local child = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua local q=require("quick_ask"); assert(vim.wait(3000,function() return not q.state.switching end,10)); assert(q.state.session_id); assert(#q.state.messages>0); assert(vim.api.nvim_buf_get_lines(q.state.input_buf,0,-1,false)[1]=="")',
    '-c', 'qa!' }, { text = true }):wait(5000)
  equal(child.code, 0, 'separate editor resumes session: ' .. (child.stderr or ''))
  equal(read('launcher.log'), 'hide', 'qa! bypasses hide interception')

  -- Native Pi allocates an empty session id before creating/indexing its file.
  -- A restart must preserve the draft and avoid an endless unknown-id resume.
  write('state.json', vim.json.encode({ session_id = 'unpersisted-empty-id', selected_id = 1,
    draft = 'keep empty chat draft\n中abc', cursor = { 2, 3 }, web_search = false }))
  local opens = #requests('open')
  child = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua local q=require("quick_ask"); assert(q.state.session_id==nil); assert(q.state.selected_id==1); assert(q.state.server==nil); assert(vim.api.nvim_buf_get_lines(q.state.input_buf,0,-1,false)[1]=="keep empty chat draft"); assert(vim.deep_equal(vim.api.nvim_win_get_cursor(q.state.input_win),{2,3}))',
    '-c', 'qa!' }, { text = true }):wait(5000)
  equal(child.code, 0, 'unpersisted empty session restore: ' .. (child.stderr or ''))
  equal(#requests('open'), opens, 'unknown unindexed empty id never sent to backend')
  ui.save_state()

  -- input_method=false forbids even a query, including startup and exit.
  imlog = read('im.log'); write('no-im', '1')
  child = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua local q=require("quick_ask"); vim.wait(3000,function() return not q.state.switching end,10); q.on_show(); q.toggle_web(); vim.wait(3000,function() return not q.state.switching end,10); vim.api.nvim_exec_autocmds("InsertEnter",{buffer=q.state.input_buf}); vim.ui.input=function(_,cb) cb("") end; q.open_history(); q.cancel_history(); q.before_hide()',
    '-c', 'qa!' }, { text = true }):wait(5000)
  equal(child.code, 0, 'IM-disabled child: ' .. (child.stderr or ''))
  equal(read('im.log'), imlog, 'input_method=false makes zero fcitx calls')
  vim.fn.delete(temporary .. '/no-im')

  -- qa! while active must actually send shutdown and wait for owned server exit.
  write('launcher.log', '')
  child = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua local q=require("quick_ask"); vim.wait(3000,function() return not q.state.switching end,10); vim.api.nvim_buf_set_lines(q.state.input_buf,0,-1,false,{"slow exit"}); q.submit(); assert(vim.wait(3000,function() return q.state.message=="fixture working slow exit" end,10)); vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(":qa!<CR>",true,false,true),"xt",false)' }, { text = true }):wait(6000)
  equal(child.code, 0, 'busy qa! exits cleanly: ' .. (child.stderr or ''))
  equal(read('launcher.log'), '', 'qa! never calls hide')
  local shutdowns = records('shutdown.jsonl'); check(shutdowns[#shutdowns].busy, 'busy quit sends graceful shutdown')
end, debug.traceback)
vim.ui.input = original_input
ui.shutdown()
s.initialized = false
vim.system = original_system
api.nvim_clear_autocmds({ group = 'QuickAskUI', event = 'VimLeavePre' })
if not ok then
  io.stderr:write(failure .. '\nFixture directory: ' .. temporary .. '\n')
  vim.cmd('cquit 1')
end
-- Delete only this test's own temporary directory, after every process exits.
vim.fn.delete(temporary, 'rf')
print('Neovim quick-ask agent smoke: PASS')
vim.cmd('qa!')

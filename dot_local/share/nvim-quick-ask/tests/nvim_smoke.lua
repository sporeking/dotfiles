-- nvim --headless -u NONE -l /absolute/quick-ask/tests/nvim_smoke.lua
-- Every backend/desktop call uses this test's own temporary directory. No Pi,
-- network, real fcitx state, user history, or translator configuration is used.
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
import json, os, pathlib, signal, sys, time
root = pathlib.Path(__file__).parent
request = json.load(sys.stdin)
with (root / 'requests.jsonl').open('a') as stream:
    stream.write(json.dumps(request) + '\n')
def entry(number, question=None, answer=None, web=False):
    return {'id': number, 'question': question or 'question ' + str(number),
            'answer': answer or ('answer ' + str(number)), 'web_search': web,
            'sources': [{'title': 'Fixture reference', 'url': 'https://example.test/reference'}],
            'created_at': '2026-01-01T00:00:00Z'}
def entries():
    result = [entry(i, web=i % 2 == 0) for i in range(1101, 0, -1)]
    result[1]['answer'] = '\n'.join('line %d **markdown**' % i for i in range(70))
    result[-1]['question'] = 'old archive'
    result[-1]['answer'] = 'padding ' * 40 + 'Straße [a.b] Unicode match! ' + 'trailing ' * 30
    saved = root / 'entries.json'
    return (json.loads(saved.read_text()) if saved.exists() else []) + result
op = request['op']
if op == 'load':
    path = root / 'state.json'
    state = json.loads(path.read_text()) if path.exists() else {
        'selected_id': 1100, 'draft': 'first\n中abc\nthird', 'cursor': [2, 3],
        'result_scroll': 5, 'web_search': False, 'history_query': ''}
    print(json.dumps({'ok': True, 'entries': entries(), 'state': state,
                      'config': {'input_method': not (root / 'no-im').exists()}}))
elif op == 'save_state':
    if (root / 'fail-save').exists():
        print(json.dumps({'ok': False, 'error': 'state save refused'})); sys.exit(1)
    (root / 'state.json').write_text(json.dumps(request['state']))
    print(json.dumps({'ok': True}))
elif op == 'search':
    query = request['query'].casefold()
    matches = []
    for item in entries():
        if query in (item['question'] + '\n' + item['answer']).casefold():
            # Map folded indexes back to original characters (ß -> ss).
            answer = item['answer']
            folded = answer.casefold()
            offset = folded.find(query) if query else 0
            origin = []
            for index, char in enumerate(answer): origin.extend([index] * len(char.casefold()))
            start = max(0, (origin[offset] if offset >= 0 and origin else 0) - 25)
            item['search_snippet'] = ('…' if start else '') + answer[start:start + 120]
            matches.append(item)
    print(json.dumps({'ok': True, 'entries': matches}))
elif op == 'ask':
    question = request['question']
    assert isinstance(request['web_search'], bool)
    record = entry('answer-uuid-2000', question, '你好🙂 **回答**\n\n```lua\nprint("ok")\n```', request['web_search'])
    def emit(event):
        sys.stdout.buffer.write((json.dumps(event, ensure_ascii=False) + '\n').encode())
        sys.stdout.buffer.flush()
    def cancelled(*_):
        with (root / 'terminated.log').open('a') as out: out.write(question + '\n')
        # Deliberately hostile late output: front-end ownership must be gone.
        emit({'event': 'delta', 'text': 'STALE OUTPUT'})
        emit({'event': 'done', 'entry': entry(9999, 'stale', 'STALE OUTPUT')})
        sys.exit(0)
    signal.signal(signal.SIGTERM, cancelled)
    emit({'event': 'status', 'text': 'fixture generating'})
    if question.startswith('slow'):
        emit({'event': 'delta', 'text': 'partial'})
        time.sleep(0.8)
    if question == 'error':
        emit({'event': 'error', 'error': 'expected generation error'}); sys.exit(1)
    if question == 'invalid':
        print('not JSON', flush=True); sys.exit(0)
    if question == 'missingdone':
        print('fixture process failed', file=sys.stderr); sys.exit(3)
    payload = (json.dumps({'event': 'delta', 'text': record['answer']}, ensure_ascii=False) + '\n').encode()
    # Split the NDJSON line inside the UTF-8 bytes of 你 and the emoji.
    first = payload.index('你'.encode()) + 1
    second = payload.index('🙂'.encode()) + 2
    for part in (payload[:first], payload[first:second], payload[second:]):
        sys.stdout.buffer.write(part); sys.stdout.buffer.flush(); time.sleep(0.015)
    for _ in range(80): emit({'event': 'delta', 'text': '.'})
    time.sleep(0.12)
    path = root / 'entries.json'
    old = json.loads(path.read_text()) if path.exists() else []
    path.write_text(json.dumps([record] + [item for item in old if item['id'] != record['id']]))
    # No trailing newline exercises EOF parsing too.
    sys.stdout.buffer.write(json.dumps({'event': 'done', 'entry': record}, ensure_ascii=False).encode())
    sys.stdout.buffer.flush()
else:
    raise AssertionError(op)
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
vim.env.QUICK_ASK_ROOT = temporary
vim.env.QUICK_ASK_CTL = control
vim.env.QUICK_ASK_PYTHON = 'python3'
vim.env.PYTHONPATH = temporary
vim.env.PATH = temporary .. ':' .. vim.env.PATH
vim.env.NVIM_APPNAME = 'nvim-quick-ask-smoke'
vim.env.NVIM_LOG_FILE = temporary .. '/nvim.log'
vim.opt.shadafile = 'NONE'
vim.opt.lines = 24
vim.opt.columns = 90

dofile(root .. '/nvim/init.lua')
local ui = require('quick_ask')
local s = ui.state
local function draft(text) api.nvim_buf_set_lines(s.input_buf, 0, -1, false, vim.split(text, '\n', { plain = true })) end
local function input() return table.concat(api.nvim_buf_get_lines(s.input_buf, 0, -1, false), '\n') end
local function result() return table.concat(api.nvim_buf_get_lines(s.result_buf, 0, -1, false), '\n') end
local function scroll() return api.nvim_win_call(s.result_win, function() return vim.fn.winsaveview().topline end) end
local function keys(text) api.nvim_feedkeys(api.nvim_replace_termcodes(text, true, false, true), 'xt', false) end
local function requests(op)
  local found = {}
  for _, raw in ipairs(vim.split(read('requests.jsonl'), '\n', { trimempty = true })) do
    local item = vim.json.decode(raw)
    if item.op == op then found[#found + 1] = item end
  end
  return found
end
local function saved() return vim.json.decode(read('state.json')) end
local original_input = vim.ui.input
local function prompt_with(query)
  vim.ui.input = function(options, callback)
    equal(options.prompt, '历史 / ', 'search prompt')
    equal(read('im-state'), s.config.input_method ~= false and '2' or read('im-state'), 'search restores captured IM')
    callback(query)
  end
end
local function snapshot()
  return { draft = input(), cursor = api.nvim_win_get_cursor(s.input_win), selected = s.selected_id,
    web = s.web_search, result = result(), scroll = scroll(), query = s.history_query }
end
local function assert_snapshot(before, label)
  equal(snapshot(), before, label)
end
local ok, failure = xpcall(function()
  equal(#api.nvim_tabpage_list_wins(0), 2, 'two windows')
  equal(api.nvim_win_get_height(s.input_win), 3, 'three-row input')
  check(api.nvim_win_get_position(s.input_win)[1] < api.nvim_win_get_position(s.result_win)[1], 'input above answer')
  check(vim.bo[s.result_buf].readonly and not vim.bo[s.result_buf].modifiable, 'answer readonly')
  equal(vim.bo[s.result_buf].filetype, 'markdown', 'built-in Markdown filetype')
  equal(vim.bo[s.result_buf].syntax, 'markdown', 'built-in Markdown highlighting')
  check(vim.wo[s.result_win].wrap and vim.wo[s.result_win].linebreak, 'answer wraps')
  equal(input(), 'first\n中abc\nthird', 'restore multiline draft')
  equal(api.nvim_win_get_cursor(s.input_win), { 2, 3 }, 'restore row and UTF-8 byte column')
  equal(s.selected_id, 1100, 'restore selected id')
  check(not s.web_search and result():find('[联网]', 1, true), 'draft mode independent of answer mode')
  equal(scroll(), 5, 'restore answer scroll')
  equal(#s.entries, 1101, 'load retains entire history')
  equal(#requests('ask'), 0, 'startup never asks')
  equal(read('im.log'), '', 'startup does not touch global IM')
  equal(ui.on_show(), 1, 'show acknowledgement')
  equal(read('im-state'), '1', 'show captures Chinese then enters English Normal')
  local before = snapshot()
  keys('<Tab>')
  check(s.web_search, 'Normal Tab toggles web mode')
  equal(input(), before.draft, 'Tab preserves multiline draft')
  equal(api.nvim_win_get_cursor(s.input_win), before.cursor, 'Tab preserves cursor')
  equal(result(), before.result, 'Tab preserves original answer and its label')
  equal(scroll(), before.scroll, 'Tab preserves answer scroll')
  equal(vim.fn.mode(), 'n', 'Normal Tab preserves mode')
  equal(read('im-state'), '1', 'web mode does not change Normal input language')
  keys('<Tab>')
  local samples = {}
  vim.keymap.set('i', '<F12>', function()
    samples[#samples + 1] = { mode = vim.fn.mode(), web = s.web_search, input = input(),
      cursor = api.nvim_win_get_cursor(s.input_win), im = read('im-state') }
  end, { buffer = s.input_buf })
  keys('i<F12><Tab><F12><Tab><F12><Esc>')
  equal(#samples, 3, 'Insert remains active through Tabs')
  for index, sample in ipairs(samples) do
    equal(sample.mode, 'i', 'Insert Tab retains actual mode ' .. index)
    equal(sample.input, before.draft, 'Insert Tab preserves draft ' .. index)
    equal(sample.cursor, samples[1].cursor, 'Insert Tab preserves cursor ' .. index)
    equal(sample.im, '2', 'Insert restores captured language independently of web ' .. index)
  end
  check(samples[2].web and not samples[3].web, 'Insert Tab toggles both ways')
  equal(read('im-state'), '1', 'Esc returns to English Normal')
  equal(#requests('ask'), 0, 'Esc and Tab never submit')
  vim.keymap.del('i', '<F12>', { buffer = s.input_buf })
  api.nvim_win_set_cursor(s.input_win, { 1, 0 })
  keys('jjk')
  equal(api.nvim_win_get_cursor(s.input_win)[1], 2, 'input j/k retain native multiline motion')
  equal(s.selected_id, 1100, 'input j/k never browse history')
  keys('0w')
  keys('ciwchanged<Esc>u')
  equal(input(), before.draft, 'native edit and undo')
  equal(#requests('ask'), 0, 'native Escape never asks')
  -- Normal o and paste still create genuine multiline questions.
  draft('one\ntwo')
  api.nvim_win_set_cursor(s.input_win, { 2, 0 })
  keys('o三<Esc>')
  equal(input(), 'one\ntwo\n三', 'native o creates a new question row')
  api.nvim_paste('paste\nsecond\nthird', false, -1)
  check(api.nvim_buf_line_count(s.input_buf) >= 5, 'paste retains multiple lines')
  draft('first\n中abc\nthird')
  api.nvim_win_set_cursor(s.input_win, { 2, 3 })
  ui.scroll(1)
  ui.toggle_web()
  check(ui.save_state(), 'save state succeeds')
  equal(saved().cursor, { 2, 3 }, 'persist native row/bytecol')
  check(saved().web_search, 'persist draft web mode')
  local restore = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua local s=require("quick_ask").state; assert(s.web_search); assert(s.selected_id==1100); assert(vim.api.nvim_buf_get_lines(s.input_buf,0,-1,false)[2]=="中abc"); assert(vim.deep_equal(vim.api.nvim_win_get_cursor(s.input_win),{2,3})); assert(vim.api.nvim_win_call(s.result_win,function() return vim.fn.winsaveview().topline end)>1)',
    '-c', 'qa!' }, { text = true }):wait(5000)
  equal(restore.code, 0, 'separate process restores draft/cursor/mode/id/scroll: ' .. (restore.stderr or ''))

  -- Full history search, including an answer-only Unicode-casefold match in the
  -- oldest of >1000 entries. The snippet must show the actual match, not a prefix.
  local search_before = snapshot()
  local ask_count = #requests('ask')
  prompt_with('STRASSE')
  keys('/')
  check(s.search and #s.search.entries == 1, 'slash searches entire Unicode casefold history')
  equal(s.search.entries[1].id, 1, 'oldest entry not truncated from full search')
  check(result():find('Straße', 1, true) and result():find('[普通]', 1, true), 'answer hit snippet and mode shown')
  equal(api.nvim_get_current_win(), s.result_win, 'selector focuses lower window')
  equal(read('im-state'), '1', 'selector restores English Normal after prompt')
  keys('<Esc>')
  assert_snapshot(search_before, 'Esc restores draft/cursor/mode/selection/answer/scroll/query')
  prompt_with('[a.b]')
  api.nvim_set_current_win(s.result_win)
  keys('/')
  equal(#s.search.entries, 1, 'result slash searches literal special characters')
  keys('<Esc>')
  prompt_with('')
  api.nvim_set_current_win(s.input_win)
  keys(':History<CR>')
  equal(#s.search.entries, 1101, 'empty History lists every entry')
  keys('jjk')
  equal(s.search.index, 2, 'j/k navigate lower selector')
  equal(input(), search_before.draft, 'selection preview does not rewrite draft')
  keys('<Esc>')
  assert_snapshot(search_before, 'cancel empty selector restores view')
  prompt_with('does not exist')
  ui.open_history()
  check(result():find('没有匹配', 1, true), 'no matches shown')
  keys('<CR><Esc>')
  assert_snapshot(search_before, 'no-match Enter is harmless')
  prompt_with(nil)
  ui.open_history()
  assert_snapshot(search_before, 'prompt cancellation restores state')
  prompt_with('STRASSE')
  ui.open_history()
  keys('<CR>')
  equal(s.selected_id, 1, 'Enter restores historical entry')
  equal(input(), 'old archive', 'history restores question without asking')
  check(not s.web_search, 'history restores original web mode')
  check(result():find('Straße', 1, true) and not s.search, 'history restores full original answer')
  equal(#requests('ask'), ask_count, 'search and history restore never ask')
  equal(s.history_query, 'STRASSE', 'accepted history query retained')
  vim.ui.input = original_input
  -- Exercise the real default vim.ui.input too, in the mapped key stream.
  keys('/<C-u>STRASSE<CR><Esc>')
  check(not s.search, 'real input prompt can search and cancel')
  equal(s.selected_id, 1, 'real prompt cancel preserves selection')
  local editing_before = snapshot()
  local stale_prompt
  vim.ui.input = function(_, callback) stale_prompt = callback end
  ui.open_history()
  ui.select_history()
  ui.history_move(1)
  check(s.search and not s.search.entries, 'pending prompt ignores premature selector keys')
  draft('edit while prompt pending')
  check(not s.search, 'editing dismisses an asynchronous prompt session')
  await(function() return result() == editing_before.result end, 'editing restores answer instead of selector')
  stale_prompt('STRASSE')
  equal(input(), 'edit while prompt pending', 'stale prompt callback cannot undo newer edit')
  prompt_with('')
  ui.open_history()
  api.nvim_set_current_win(s.input_win)
  keys('A!<Esc>')
  check(not s.search, 'editing question dismisses lower selector')
  await(function() return result() == editing_before.result end, 'dismissed selector restores previous answer')
  equal(input(), 'edit while prompt pending!', 'dismissing selector retains native edit')
  equal(#requests('ask'), ask_count, 'editing during history never asks')
  vim.ui.input = original_input

  -- Parsing is byte-safe and rendering is throttled despite an 80-event burst.
  draft('multi\n中🙂 question')
  local writes = 0
  api.nvim_buf_attach(s.result_buf, false, { on_lines = function() writes = writes + 1 end })
  keys('<CR>')
  check(s.loading, 'Enter starts async ask')
  await(function() return not s.loading end, 'stream done completes')
  local asks = requests('ask')
  equal(asks[#asks].question, 'multi\n中🙂 question', 'ask preserves multiline UTF-8')
  equal(asks[#asks].web_search, false, 'ask declares explicit web_search boolean')
  check(result():find('你好🙂 **回答**', 1, true), 'split UTF-8 NDJSON is reconstructed')
  check(result():find('Fixture reference', 1, true), 'completed answer includes sources')
  equal(s.selected_id, 'answer-uuid-2000', 'done selects saved UUID entry')
  check(writes < 15, 'stream burst is throttled: ' .. writes .. ' redraws')
  equal(input(), 'multi\n中🙂 question', 'done preserves draft')
  -- Ctrl+C while idle submits; while active cancels without another ask.
  draft('slow control')
  keys('<C-c>')
  await(function() return s.message == 'fixture generating' end, 'slow provider started')
  local count = #requests('ask')
  keys('<C-c>')
  check(not s.loading and s.active == nil, 'generating Ctrl+C cancels immediately')
  equal(#requests('ask'), count, 'cancel Ctrl+C never resubmits')
  local after_cancel = result()
  await(function() return read('terminated.log'):find('slow control', 1, true) end, 'cancel sends SIGTERM')
  equal(result(), after_cancel, 'SIGTERM late output cannot render')
  check(s.selected_id ~= 9999, 'SIGTERM late done cannot select')

  draft('slow replace')
  ui.submit()
  await(function() return s.message == 'fixture generating' end, 'replacement provider started')
  keys('<CR>')
  await(function() return #requests('ask') >= count + 2 end, 'Enter replaces generation with a new ask')
  check(s.loading, 'replacement still active')
  ui.cancel()
  await(function() return read('terminated.log'):find('slow replace', 1, true) end, 'replacement cancels previous process')

  -- Each ownership-changing action must reject both stale delta and done.
  local function start_slow(label)
    api.nvim_set_current_win(s.input_win)
    draft('slow ' .. label)
    ui.submit()
    await(function() return s.message == 'fixture generating' end, label .. ' provider ready')
  end
  start_slow('edit')
  draft('new unsent\nquestion')
  local edited_result = result()
  await(function() return read('terminated.log'):find('slow edit', 1, true) end, 'edit cancels old request')
  check(not s.loading and ui.statusline():find('已取消生成 · 编辑草稿', 1, true),
    'text edit cancellation updates displayed status instead of claiming generation continues')
  equal(result(), edited_result, 'edited changedtick rejects old stdout')
  equal(input(), 'new unsent\nquestion', 'old stdout cannot replace draft')
  start_slow('tab')
  local old_result = result()
  keys('<Tab>')
  await(function() return read('terminated.log'):find('slow tab', 1, true) end, 'Tab cancels old request')
  equal(result(), old_result, 'old mode cannot overwrite answer')
  start_slow('search')
  prompt_with('STRASSE')
  ui.open_history()
  local selector = result()
  await(function() return read('terminated.log'):find('slow search', 1, true) end, 'search cancels old request')
  equal(result(), selector, 'old stdout cannot replace history selector')
  ui.select_history()
  equal(s.selected_id, 1, 'history owns selection after cancellation')
  start_slow('insert')
  keys('i<Esc>')
  await(function() return read('terminated.log'):find('slow insert', 1, true) end, 'entering edit invalidates generation')
  check(not s.loading and ui.statusline():find('已取消生成 · 编辑草稿', 1, true),
    'InsertEnter cancellation also leaves an accurate status after returning to Normal')
  equal(#requests('ask'), count + 6, 'Escape does not accidentally resubmit')
  for _, name in ipairs({ 'error', 'invalid', 'missingdone' }) do
    draft(name)
    ui.submit()
    await(function() return not s.loading end, name .. ' completes with error')
    local expected = ({ error = 'expected generation error', invalid = '无效 NDJSON', missingdone = 'fixture process failed' })[name]
    check(s.message:find(expected, 1, true), name .. ' error detail surfaced: ' .. tostring(s.message))
  end
  draft('insert control')
  keys('A!<C-c>')
  await(function() return not s.loading and requests('ask')[#requests('ask')].question == 'insert control!' end, 'Insert Ctrl+C submits')

  start_slow('hide')
  draft('persist this\n中draft')
  api.nvim_win_set_cursor(s.input_win, { 2, 3 })
  write('fail-save', '1')
  equal(ui.before_hide(), 0, 'save failure blocks hide')
  check(s.visible, 'failed hide remains visible')
  equal(s.message, 'state save refused', 'save error shown')
  equal(read('im-state'), '1', 'failed hide does not restore IM early')
  vim.fn.delete(temporary .. '/fail-save')
  equal(ui.before_hide(), 1, 'hide acknowledgement')
  equal(read('im-state'), '2', 'hide restores captured global Chinese IM')
  equal(saved().draft, 'persist this\n中draft', 'hide persists multiline draft')
  equal(saved().cursor, { 2, 3 }, 'hide persists UTF-8 byte cursor')
  local im_log = read('im.log')
  ui.before_hide()
  equal(read('im.log'), im_log, 'repeated hide has no extra IM restore')
  await(function() return read('terminated.log'):find('slow hide', 1, true) end, 'hidden request terminated')
  check(not result():find('STALE OUTPUT', 1, true), 'hidden stale output never renders')
  -- Explicit show recaptures the current global state each time.
  write('im-state', '1')
  ui.on_show()
  keys('i<Esc>')
  equal(read('im-state'), '1', 'English capture stays English on Insert')
  ui.before_hide()
  equal(read('im-state'), '1', 'hide restores newly captured English state')
  write('im-state', '2')
  ui.on_show()
  local callback
  vim.ui.input = function(_, cb) callback = cb end
  local before_prompt_hide = snapshot()
  ui.open_history()
  ui.before_hide()
  callback('STRASSE')
  check(not s.search, 'late asynchronous prompt callback ignored after hide')
  equal(input(), before_prompt_hide.draft, 'late prompt does not change hidden draft')
  equal(read('im-state'), '2', 'hide during prompt restores global IM')
  vim.ui.input = original_input

  -- input_method=false forbids even query calls, from setup through exit.
  local no_im_log = read('im.log')
  write('no-im', '1')
  local disabled = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua local q=require("quick_ask"); q.on_show(); q.toggle_web(); vim.api.nvim_exec_autocmds("InsertEnter",{buffer=q.state.input_buf}); vim.ui.input=function(_,cb) cb("") end; q.open_history(); q.cancel_history(); q.before_hide()',
    '-c', 'qa!' }, { text = true }):wait(5000)
  equal(disabled.code, 0, 'IM-disabled process: ' .. (disabled.stderr or ''))
  equal(read('im.log'), no_im_log, 'input_method=false makes zero fcitx calls')
  vim.fn.delete(temporary .. '/no-im')
  s.config.input_method = false
  ui.on_show()
  keys('<Tab>i<Tab><Esc>')
  prompt_with('')
  ui.open_history()
  ui.cancel_history()
  ui.before_hide()
  equal(read('im.log'), no_im_log, 'all runtime IM paths disabled')
  s.config.input_method = true
  vim.ui.input = original_input

  ui.on_show()
  keys(':q<CR>')
  await(function() return read('launcher.log') == 'hide' end, ':q calls launcher hide')
  check(api.nvim_buf_is_valid(s.input_buf), ':q leaves Neovim alive')
  write('launcher.log', '')
  ui.on_show()
  keys(':q!<CR>')
  await(function() return read('launcher.log') == 'hide' end, ':q! calls launcher hide')
  write('launcher.log', '')
  local child = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(":qa!<CR>",true,false,true),"xt",false)' },
    { text = true }):wait(5000)
  equal(child.code, 0, ':qa! exits child normally: ' .. (child.stderr or ''))
  equal(read('launcher.log'), '', ':qa! bypasses hide interception')
end, debug.traceback)

vim.ui.input = original_input
ui.before_hide()
s.initialized = false
api.nvim_clear_autocmds({ group = 'QuickAskUI', event = 'VimLeavePre' })
if not ok then
  io.stderr:write(failure .. '\nFixture directory: ' .. temporary .. '\n')
  vim.cmd('cquit 1')
end
-- Delete only the directory created and retained by this test, after all checks.
vim.fn.delete(temporary, 'rf')
print('Neovim quick-ask smoke: PASS')
vim.cmd('qa!')

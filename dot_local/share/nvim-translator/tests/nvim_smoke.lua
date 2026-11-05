-- Run from any cwd: nvim --headless -u NONE -l /absolute/root/tests/nvim_smoke.lua
-- Uses a temporary Python backend and fake desktop/audio executables: no network,
-- real history/config/IM changes, or host Neovim configuration are involved.
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
local function check(condition, message)
  if not condition then error(message, 2) end
end
local function equal(actual, expected, message)
  check(vim.deep_equal(actual, expected), (message or 'values differ') .. ': ' .. vim.inspect(actual) .. ' ~= ' .. vim.inspect(expected))
end
local function await(predicate, message, timeout)
  check(vim.wait(timeout or 4000, predicate, 10), message)
end

write('translator_backend.py', [=[
import json, pathlib, sys, time
root = pathlib.Path(__file__).parent
request = json.load(sys.stdin)
with (root / 'requests.jsonl').open('a') as stream:
    stream.write(json.dumps(request) + '\n')
def entry(number, text, direction='en-zh'):
    record = {'id': number, 'text': text, 'created_at': '2026-01-%02d' % number,
              'direction': direction,
            'result': {'kind': 'dictionary', 'source': 'test',
                       'phonetics': {'us': 'test'}, 'audio': {'us': 'https://audio.test/' + text},
                       'meanings': [{'pos': 'n.', 'definitions': ['meaning']}],
                       'examples': [{'en': 'Example ' + str(i), 'zh': '例句', 'source': 'dictionary'} for i in range(40)]}}
    if number == 2:  # Legacy history records did not carry a direction.
        record.pop('direction')
    return record
op = request['op']
if op == 'load':
    state_file = root / 'state.json'
    state = json.loads(state_file.read_text()) if state_file.exists() else {'selected_id': 2, 'draft': 'draft word', 'cursor': 3, 'result_scroll': 4}
    response = {'ok': True, 'entries': [entry(3, 'newest', 'zh-en'), entry(2, 'middle'), entry(1, 'oldest')],
                'state': state, 'config': {'auto_pronounce': True, 'accent': 'us', 'input_method': True}}
elif op == 'save_state':
    if (root / 'fail-save').exists():
        print(json.dumps({'ok': False, 'error': 'state save refused'})); sys.exit(1)
    (root / 'state.json').write_text(json.dumps(request['state']))
    response = {'ok': True}
elif op == 'lookup':
    text = request['text']
    direction = request['direction']
    assert direction in ('en-zh', 'zh-en')
    time.sleep(0.35 if text in ('slow', 'hidden', 'direction slow') else 0.04)
    if text == 'error':
        response = {'ok': False, 'error': 'expected lookup error'}
    elif text == 'exiterror':
        print(json.dumps({'ok': False, 'error': 'expected exit-1 detail'})); sys.exit(1)
    elif text == 'invalid':
        print('not json'); sys.exit(0)
    else:
        number = 6 if text == 'direction slow' else (4 if text in ('slow', 'hidden') else 5)
        if direction == 'zh-en':
            number += 10
        response = {'ok': True, 'entry': entry(number, text, direction), 'cached': text == 'cached'}
print(json.dumps(response))
]=])
write('fcitx5-remote', [=[#!/usr/bin/env python3
import pathlib, sys
root = pathlib.Path(__file__).parent
state = root / 'im-state'
args = sys.argv[1:]
with (root / 'im.log').open('a') as stream: stream.write(' '.join(args) + '\n')
if not args:
    print(state.read_text() if state.exists() else '2')
elif args == ['-c']:
    state.write_text('1')
elif args == ['-o']:
    state.write_text('2')
]=], true)
write('mpv', [=[#!/usr/bin/env python3
import pathlib, sys
with (pathlib.Path(__file__).parent / 'audio.log').open('a') as stream:
    stream.write(' '.join(sys.argv[1:]) + '\n')
]=], true)
local launcher = write('control.py', [=[
import pathlib, sys
(pathlib.Path(__file__).parent / 'launcher.log').write_text(' '.join(sys.argv[1:]))
]=])
vim.env.TRANSLATOR_ROOT = temporary
vim.env.TRANSLATOR_CTL = launcher
vim.env.PYTHONPATH = temporary
vim.env.PATH = temporary .. ':' .. vim.env.PATH
vim.env.NVIM_APPNAME = 'nvim-translator-smoke'
vim.env.NVIM_LOG_FILE = temporary .. '/nvim.log'
-- Prevent host config/state pollution, including any startup state writer.
vim.opt.shadafile = 'NONE'
vim.opt.lines = 18
vim.opt.columns = 90

dofile(root .. '/nvim/init.lua')
local ui = require('translator')
local s = ui.state
local function draft(text)
  api.nvim_buf_set_lines(s.input_buf, 0, -1, false, { text })
end
local function line()
  return api.nvim_buf_get_lines(s.input_buf, 0, 1, false)[1]
end
local function result()
  return table.concat(api.nvim_buf_get_lines(s.result_buf, 0, -1, false), '\n')
end
local function requests(op)
  local found = {}
  for _, raw in ipairs(vim.split(read('requests.jsonl'), '\n', { trimempty = true })) do
    local item = vim.json.decode(raw)
    if item.op == op then found[#found + 1] = item end
  end
  return found
end
local function keys(text)
  api.nvim_feedkeys(api.nvim_replace_termcodes(text, true, false, true), 'xt', false)
end

local ok, failure = xpcall(function()
  equal(#api.nvim_tabpage_list_wins(0), 2, 'two windows')
  equal(api.nvim_win_get_height(s.input_win), 1, 'input has one row')
  check(api.nvim_win_get_position(s.input_win)[1] < api.nvim_win_get_position(s.result_win)[1], 'input above results')
  check(not vim.bo[s.result_buf].modifiable, 'results are readonly')
  equal(line(), 'draft word', 'restore unsubmitted draft')
  equal(api.nvim_win_get_cursor(s.input_win)[2], 3, 'restore byte cursor')
  equal(s.selected_id, 2, 'restore selected history id')
  equal(s.direction, 'en-zh', 'legacy state defaults to English-to-Chinese')
  check(result():find('[EN→ZH]', 1, true), 'legacy result direction defaults to English-to-Chinese')
  equal(api.nvim_win_call(s.result_win, function() return vim.fn.winsaveview().topline end), 4, 'restore scroll')
  equal(#requests('lookup'), 0, 'startup does not lookup')
  equal(read('audio.log'), '', 'startup does not pronounce')

  ui.on_show()
  local bar = api.nvim_eval_statusline(vim.wo[s.input_win].statusline, { winid = s.input_win }).str
  check(bar:find('NORMAL', 1, true) and bar:find('EN→ZH', 1, true) and bar:find('2/3', 1, true), 'statusline gives mode, direction and position')
  equal(read('im-state'), '1', 'show forces Normal-mode English after capturing Chinese state')
  local before_tab = { draft = line(), cursor = api.nvim_win_get_cursor(s.input_win), result = result(), scroll = api.nvim_win_call(s.result_win, function() return vim.fn.winsaveview().topline end) }
  keys('<Tab>')
  equal(s.direction, 'zh-en', 'real Normal Tab switches to Chinese-to-English')
  equal(vim.fn.mode(), 'n', 'Normal Tab retains Normal mode')
  equal(line(), before_tab.draft, 'Normal Tab preserves draft without inserting tab')
  equal(api.nvim_win_get_cursor(s.input_win), before_tab.cursor, 'Normal Tab preserves cursor')
  equal(result(), before_tab.result, 'Normal Tab leaves rendered result unchanged')
  equal(api.nvim_win_call(s.result_win, function() return vim.fn.winsaveview().topline end), before_tab.scroll, 'Normal Tab preserves results scroll')
  check(ui.statusline():find('ZH→EN', 1, true), 'statusline reflects current direction')
  check(result():find('[EN→ZH]', 1, true), 'result retains its own previous direction')
  equal(read('im-state'), '1', 'Chinese direction in Normal keeps English IM for navigation')
  keys('<Tab>')
  equal(s.direction, 'en-zh', 'Normal Tab toggles back')

  -- Observe mode/cursor inside the actual Insert key stream. feedkeys("x")
  -- otherwise exits Insert on an empty queue and could mask an accidental exit.
  local insert_samples = {}
  vim.keymap.set('i', '<F12>', function()
    insert_samples[#insert_samples + 1] = {
      direction = s.direction, mode = vim.fn.mode(), draft = line(),
      cursor = api.nvim_win_get_cursor(s.input_win), result = result(), im = read('im-state'),
    }
  end, { buffer = s.input_buf })
  keys('i<F12><Tab><F12><Tab><F12><Tab><C-\\><C-n>')
  equal(s.direction, 'zh-en', 'leaving Insert preserves query direction')
  equal(read('im-state'), '1', 'InsertLeave switches back to English for hjkl')
  api.nvim_win_set_cursor(s.input_win, before_tab.cursor)
  keys('i<F12><C-\\><C-n>')
  equal(read('im-state'), '1', 'leaving Chinese Insert returns to English')
  keys('<Tab>')
  vim.keymap.del('i', '<F12>', { buffer = s.input_buf })
  equal(#insert_samples, 4, 'Insert key stream remains active through Tabs and re-entry')
  for i, sample in ipairs(insert_samples) do
    equal(sample.mode, 'i', 'Tab preserves actual Insert mode ' .. i)
    equal(sample.draft, before_tab.draft, 'Insert Tab preserves draft ' .. i)
    equal(sample.cursor, before_tab.cursor, 'Insert Tab preserves cursor ' .. i)
    equal(sample.result, before_tab.result, 'Insert Tab preserves rendered result ' .. i)
  end
  equal(insert_samples[2].direction, 'zh-en', 'real Insert Tab switches direction')
  equal(insert_samples[2].im, '2', 'Insert Tab activates Chinese IM')
  equal(insert_samples[3].direction, 'en-zh', 'second Insert Tab switches back')
  equal(insert_samples[3].im, '1', 'Insert Tab deactivates Chinese IM for English')
  equal(insert_samples[4].direction, 'zh-en', 'Chinese direction survives Insert re-entry')
  equal(insert_samples[4].im, '2', 'InsertEnter activates Chinese IM in Chinese direction')
  equal(#requests('lookup'), 0, 'Tab in either mode never requests translation: ' .. vim.inspect(requests('lookup')))
  equal(read('audio.log'), '', 'Tab never pronounces')
  keys('0w')
  equal(api.nvim_win_get_cursor(s.input_win)[2], 6, 'native w')
  keys('b')
  equal(api.nvim_win_get_cursor(s.input_win)[2], 0, 'native b')
  -- Ctrl+[ leaves insert mode natively, allowing a pure undo test without lookup.
  keys('ciwchanged<C-\\><C-n>')
  equal(line(), 'changed word', 'native ciw')
  keys('u')
  equal(line(), 'draft word', 'native undo')
  equal(read('im-state'), '1', 'entering insert switches global IM to English')
  equal(#requests('lookup'), 0, 'native Ctrl+[ edit does not query')

  keys('k')
  equal(s.selected_id, 1, 'k selects earlier history')
  equal(line(), 'oldest', 'history replaces draft')
  keys('jj')
  equal(s.direction, 'zh-en', 'newer history restores Chinese-to-English direction')
  check(result():find('[ZH→EN]', 1, true), 'Chinese history result labels its own direction')
  keys('k')
  equal(s.direction, 'en-zh', 'legacy history restores default English-to-Chinese direction')
  equal(s.selected_id, 2, 'rapid history follows latest key')
  equal(line(), 'middle', 'rapid history input stays consistent')
  equal(#requests('lookup'), 0, 'history never queries')
  equal(read('audio.log'), '', 'history never pronounces')
  keys('<Esc>')
  equal(#requests('lookup'), 0, 'submitting selected history uses local result')
  equal(read('audio.log'), '', 'submitting selected history does not pronounce')
  keys('<C-d>')
  check(api.nvim_win_call(s.result_win, function() return vim.fn.winsaveview().topline end) > 1, 'Ctrl+D scrolls results')
  keys('<C-u>')
  equal(api.nvim_get_current_win(), s.input_win, 'scroll keeps input focus')

  draft(' 中abc  ')
  api.nvim_win_set_cursor(s.input_win, { 1, 4 })
  ui.scroll(1)
  keys('<Tab>')
  ui.save_state()
  equal(vim.json.decode(read('state.json')).direction, 'zh-en', 'save current draft direction independently of selected entry')
  local restore = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua local s=require("translator").state; assert(s.selected_id==2); assert(s.direction=="zh-en"); assert((s.entries[2].direction or "en-zh")=="en-zh"); assert(vim.api.nvim_buf_get_lines(s.input_buf,0,1,false)[1]==" 中abc  "); assert(vim.api.nvim_win_get_cursor(s.input_win)[2]==4); assert(vim.api.nvim_win_call(s.result_win,function() return vim.fn.winsaveview().topline end)>1)',
    '-c', 'qa!' }, { text = true }):wait(5000)
  equal(restore.code, 0, 'separate process restores direction, draft, UTF-8 byte cursor, id and scroll: ' .. (restore.stderr or ''))
  keys('<Tab>')

  -- Both paste API and ordinary multiline puts collapse to a single line.
  api.nvim_paste('paste\nsecond\r\nthird', false, -1)
  equal(api.nvim_buf_line_count(s.input_buf), 1, 'paste stays single-line')
  check(line():find('paste second third', 1, true), 'paste joins newline as spaces')
  api.nvim_buf_set_lines(s.input_buf, 0, -1, false, { 'one', 'two' })
  api.nvim_exec_autocmds('TextChanged', { buffer = s.input_buf })
  equal(line(), 'one two', 'multiline edits are joined')
  equal(api.nvim_buf_line_count(s.input_buf), 1, 'one line after text change')

  draft('slow')
  ui.submit()
  check(s.loading, 'lookup starts asynchronously')
  ui.history(1)
  ui.history(-1)
  ui.history(1)
  local history_id = s.selected_id
  await(function() return #s.entries == 4 end, 'slow response eventually collected')
  equal(s.selected_id, history_id, 'old response cannot override history')
  equal(line(), 'oldest', 'old response cannot override current input')
  check(result():find('oldest', 1, true), 'old response cannot override rendered history')
  equal(read('audio.log'), '', 'abandoned lookup does not pronounce')

  draft('slow')
  ui.submit()
  draft('fast')
  ui.submit()
  await(function() return not s.loading end, 'latest lookup completes')
  equal(s.selected_id, 5, 'newest query owns selected id')
  check(result():find('fast', 1, true), 'latest lookup rendered')
  await(function() return read('audio.log') ~= '' end, 'new lookup pronounces')
  local audio = read('audio.log')
  vim.wait(450, function() return false end, 20)
  equal(s.selected_id, 5, 'late slow query does not override faster query')
  check(result():find('fast', 1, true), 'late slow response does not render')
  equal(read('audio.log'), audio, 'late slow response does not pronounce')

  draft('edited while waiting')
  ui.submit()
  draft('unsubmitted edit')
  vim.wait(180, function() return false end, 10)
  equal(line(), 'unsubmitted edit', 'pending response preserves newer draft')
  check(result():find('fast', 1, true), 'pending response does not replace results while editing')

  draft('cached')
  ui.submit()
  await(function() return not s.loading end, 'cached lookup completes')
  equal(read('audio.log'), audio, 'cached lookup does not auto-pronounce')
  keys('p')
  await(function() return read('audio.log') ~= audio end, 'p manually pronounces cached result')

  draft('error')
  ui.submit()
  await(function() return not s.loading end, 'lookup errors complete')
  equal(s.message, 'expected lookup error', 'backend error shown')
  draft('exiterror')
  ui.submit()
  await(function() return not s.loading end, 'exit-1 lookup completes')
  equal(s.message, 'expected exit-1 detail', 'exit-1 preserves JSON error detail')
  draft('invalid')
  ui.submit()
  await(function() return not s.loading end, 'invalid response completes')
  equal(s.message, 'Backend returned invalid JSON.', 'malformed JSON handled')

  local lookup_count = #requests('lookup')
  draft('submit esc')
  keys('A!<Esc>')
  await(function() return #requests('lookup') > lookup_count end, 'Esc submits input')
  await(function() return not s.loading end, 'Esc query completes')
  draft('submit control')
  keys('A!<C-c>')
  await(function() return not s.loading and requests('lookup')[#requests('lookup')].text == 'submit control!' end, 'Ctrl+C submits input')

  -- Identical text in the other direction must not reuse the selected result.
  local direction_query = line()
  local count_before_direction = #requests('lookup')
  local audio_before_reverse = read('audio.log')
  keys('<Tab>')
  equal(s.direction, 'zh-en', 'switch direction before submitting same text')
  ui.submit()
  await(function() return not s.loading and #requests('lookup') > count_before_direction end, 'reverse-direction lookup completes')
  local reverse_request = requests('lookup')[#requests('lookup')]
  equal(reverse_request.text, direction_query, 'reverse lookup keeps original text')
  equal(reverse_request.direction, 'zh-en', 'lookup sends explicit reverse direction')
  equal(s.selected_id, 15, 'opposite direction gets a distinct result')
  check(result():find('[ZH→EN]', 1, true), 'reverse result labels its own direction')
  await(function() return read('audio.log') ~= audio_before_reverse end, 'new reverse result pronunciation completes')
  local audio_before_forward = read('audio.log')
  local reverse_count = #requests('lookup')
  ui.submit()
  equal(#requests('lookup'), reverse_count, 'same text and direction reuse selected result')
  keys('<Tab>')
  check(result():find('[ZH→EN]', 1, true), 'toggle leaves reverse result labeled while current direction changes')
  ui.submit()
  await(function() return not s.loading and #requests('lookup') > reverse_count end, 'forward direction cannot reuse reverse cache')
  equal(requests('lookup')[#requests('lookup')].direction, 'en-zh', 'lookup sends explicit forward direction')
  check(result():find('[EN→ZH]', 1, true), 'forward result labels its own direction')
  await(function() return read('audio.log') ~= audio_before_forward end, 'new forward result pronunciation completes')

  keys('<Tab>')
  draft('direction slow')
  ui.submit()
  check(s.loading, 'reverse slow query is asynchronous')
  local before_direction_response = { selected = s.selected_id, result = result(), audio = read('audio.log') }
  keys('<Tab>')
  equal(s.direction, 'en-zh', 'direction switches while lookup runs')
  await(function()
    for _, entry in ipairs(s.entries) do
      if entry.id == 16 then return true end
    end
    return false
  end, 'old-direction response eventually completes')
  equal(s.selected_id, before_direction_response.selected, 'stale opposite direction cannot select a result')
  equal(result(), before_direction_response.result, 'stale opposite direction cannot overwrite rendered result')
  equal(line(), 'direction slow', 'stale opposite direction preserves draft')
  equal(s.direction, 'en-zh', 'stale opposite direction cannot change current direction')
  equal(read('audio.log'), before_direction_response.audio, 'stale opposite direction never pronounces')
  for _, lookup in ipairs(requests('lookup')) do
    check(lookup.direction == 'en-zh' or lookup.direction == 'zh-en', 'every lookup declares its direction')
  end

  draft('hidden')
  ui.submit()
  draft('persist this draft')
  api.nvim_win_set_cursor(s.input_win, { 1, 4 })
  ui.scroll(1)
  local scroll = api.nvim_win_call(s.result_win, function() return vim.fn.winsaveview().topline end)
  local selected = s.selected_id
  write('fail-save', '1')
  equal(ui.before_hide(), 0, 'save failure prevents hide')
  check(s.visible, 'save failure preserves visible lifecycle')
  equal(s.message, 'state save refused', 'save failure detail displayed')
  equal(read('im-state'), '1', 'save failure does not restore IM prematurely')
  vim.fn.delete(temporary .. '/fail-save')
  equal(ui.before_hide(), 1, 'successful save permits hide')
  equal(read('im-state'), '2', 'hide restores previous global Chinese IM')
  local im_log = read('im.log')
  ui.before_hide()
  equal(read('im.log'), im_log, 'before_hide IM restore is idempotent')
  local saved = vim.json.decode(read('state.json'))
  equal(saved.draft, 'persist this draft', 'persist draft')
  equal(saved.cursor, 4, 'persist cursor byte column')
  equal(saved.selected_id, selected, 'persist selected id independently from draft')
  equal(saved.result_scroll, scroll, 'persist results scroll')
  equal(saved.direction, s.direction, 'persist current draft direction')
  audio = read('audio.log')
  vim.wait(450, function() return false end, 20)
  equal(read('audio.log'), audio, 'hidden pending query never pronounces')
  equal(s.selected_id, selected, 'hidden pending query never changes selection')

  -- Every new show captures the global state anew; closing an English session
  -- must restore English even when a previous show began in Chinese.
  write('im-state', '1')
  ui.on_show()
  ui.before_hide()
  equal(read('im-state'), '1', 'show recaptures English state')
  local no_im_log = read('im.log')
  s.config.input_method = false
  ui.on_show()
  keys('<Tab>i<Tab><C-\\><C-n>')
  ui.before_hide()
  equal(read('im.log'), no_im_log, 'input_method=false disables all show/Tab/Insert/hide IM calls')
  s.config.input_method = true
  ui.on_show()
  keys(':q<CR>')
  await(function() return read('launcher.log') == 'hide' end, ':q invokes hide')
  check(api.nvim_buf_is_valid(s.input_buf), ':q leaves Neovim alive')
  write('launcher.log', '')
  ui.on_show()
  keys(':q!<CR>')
  await(function() return read('launcher.log') == 'hide' end, ':q! invokes hide')

  -- Exercise :qa! in a child so this test can prove it really exits, bypassing
  -- hide interception. The parent and user's Neovim are never targeted.
  local child = vim.system({ vim.v.progpath, '--headless', '-u', root .. '/nvim/init.lua',
    '-c', 'lua vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(":qa!<CR>", true, false, true), "xt", false)' },
    { text = true }):wait(5000)
  equal(child.code, 0, ':qa! exits dedicated child normally')
  equal(read('launcher.log'), 'hide', ':qa! never invokes launcher hide')
end, debug.traceback)

-- All files removed here belong to this test's own verified temporary directory.
ui.before_hide()
api.nvim_clear_autocmds({ group = 'TranslatorUI', event = 'VimLeavePre' })
vim.fn.delete(temporary, 'rf')
if not ok then
  io.stderr:write(failure .. '\n')
  vim.cmd('cquit 1')
end
print('Neovim translator smoke: PASS')
vim.cmd('qa!')

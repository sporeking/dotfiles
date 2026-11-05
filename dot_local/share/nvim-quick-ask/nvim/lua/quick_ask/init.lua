local M = {}
local api = vim.api
local S = {
  entries = {}, config = {}, generation = 0, save_generation = 0,
  visible = false, loading = false, web_search = false, history_query = '',
}
M.state = S

local function valid_win(win) return win and api.nvim_win_is_valid(win) end
local function mode_label(web_search) return web_search and '联网' or '普通' end
local function lines(text) return vim.split(text or '', '\n', { plain = true }) end
local function draft() return table.concat(api.nvim_buf_get_lines(S.input_buf, 0, -1, false), '\n') end
local function status(text)
  S.message = text
  vim.cmd.redrawstatus()
end
local function backend_command()
  return { vim.env.QUICK_ASK_PYTHON or 'python3', '-m', 'quick_ask_backend' }
end
local function request(payload)
  local ok, result = pcall(function()
    return vim.system(backend_command(), {
      cwd = vim.env.QUICK_ASK_ROOT, stdin = vim.json.encode(payload) .. '\n', text = true,
    }):wait(5000)
  end)
  if not ok then return nil, '无法启动 Python 后端' end
  local decoded, response = pcall(vim.json.decode, result.stdout or '')
  if decoded and type(response) == 'table' and response.ok == false then
    return nil, tostring(response.error or '后端请求失败')
  end
  if result.code ~= 0 then return nil, '后端退出 (' .. tostring(result.code) .. ')' end
  if not decoded or type(response) ~= 'table' or response.ok ~= true then
    return nil, '后端返回无效 JSON'
  end
  return response
end
local function selected_entry()
  for _, entry in ipairs(S.entries) do
    if entry.id == S.selected_id then return entry end
  end
end
local function result_scroll()
  if not valid_win(S.result_win) then return 1 end
  return api.nvim_win_call(S.result_win, function() return vim.fn.winsaveview().topline end)
end
local function snapshot()
  return {
    selected_id = S.selected_id or vim.NIL, draft = draft(),
    cursor = api.nvim_win_get_cursor(S.input_win), result_scroll = result_scroll(),
    web_search = S.web_search, history_query = S.history_query,
  }
end
function M.save_state()
  if not S.initialized then return false end
  S.save_generation = S.save_generation + 1
  -- Saving while the selector is open must not persist its temporary scroll.
  local saved = S.search and vim.deepcopy(S.search.saved) or snapshot()
  saved.history_query = S.history_query
  local _, err = request({ op = 'save_state', state = saved })
  if err then status(err) end
  return not err
end
local function queue_save()
  if not S.initialized or S.changing then return end
  S.save_generation = S.save_generation + 1
  local generation = S.save_generation
  vim.defer_fn(function()
    if S.initialized and generation == S.save_generation then M.save_state() end
  end, 200)
end
local function set_input(text, cursor)
  S.changing = true
  api.nvim_buf_set_lines(S.input_buf, 0, -1, false, lines(text))
  local row = math.max(1, math.min(tonumber(cursor and cursor[1]) or 1, api.nvim_buf_line_count(S.input_buf)))
  local line = api.nvim_buf_get_lines(S.input_buf, row - 1, row, false)[1] or ''
  local col = math.max(0, math.min(tonumber(cursor and cursor[2]) or #line, #line))
  -- Clamp malformed persisted columns to the beginning of a UTF-8 character.
  while col > 0 and col < #line and line:byte(col + 1) >= 128 and line:byte(col + 1) < 192 do col = col - 1 end
  api.nvim_win_set_cursor(S.input_win, { row, col })
  vim.bo[S.input_buf].modified = false
  S.changing = false
end
local function set_scroll(topline)
  if not valid_win(S.result_win) then return end
  api.nvim_win_call(S.result_win, function()
    local row = math.max(1, math.min(tonumber(topline) or 1, api.nvim_buf_line_count(S.result_buf)))
    vim.fn.winrestview({ topline = row, lnum = row, col = 0, skipcol = 0 })
  end)
end
local function set_result(content, scroll)
  S.result_revision = (S.result_revision or 0) + 1
  vim.bo[S.result_buf].readonly = false
  vim.bo[S.result_buf].modifiable = true
  api.nvim_buf_set_lines(S.result_buf, 0, -1, false, content)
  vim.bo[S.result_buf].modified = false
  vim.bo[S.result_buf].modifiable = false
  vim.bo[S.result_buf].readonly = true
  if scroll then set_scroll(scroll) end
end
local function render(entry, scroll)
  S.display = entry and vim.deepcopy(entry) or nil
  if not entry then
    set_result({ '# Quick Ask', '', '输入问题后 Enter 提交；Ctrl+C 提交 / 取消生成。', '',
      'Tab：普通 / 联网    / 或 :History：搜索全部历史',
      '问题区支持多行编辑：o / O 或 Insert 中 Ctrl+J 换行。',
      'Esc：返回 Normal    Ctrl+D / Ctrl+U：滚动答案    :q：保存并隐藏' }, scroll or 1)
    return
  end
  local content = { '# 回答 [' .. mode_label(entry.web_search) .. ']', '' }
  vim.list_extend(content, lines(entry.answer))
  if #(entry.sources or {}) > 0 then
    vim.list_extend(content, { '', '## 来源', '' })
    for _, source in ipairs(entry.sources) do
      content[#content + 1] = '- [' .. (source.title or source.url or '') .. '](' .. (source.url or '') .. ')'
    end
  end
  set_result(content, scroll or 1)
end
local function remember(entry)
  for i, old in ipairs(S.entries) do
    if old.id == entry.id then table.remove(S.entries, i); break end
  end
  table.insert(S.entries, 1, entry)
end

-- Invalidate ownership BEFORE SIGTERM. Queued stdout, timer, and exit callbacks
-- can then do nothing even when a provider is slow to honor cancellation.
local function invalidate()
  S.generation = S.generation + 1
  local old = S.active
  S.active = nil
  S.loading = false
  if old and old.process then pcall(function() old.process:kill(15) end) end
end
local function invalidate_for_edit()
  local was_loading = S.loading
  invalidate()
  if was_loading then
    -- on_lines holds the text lock: update the Lua state now, redraw later.
    -- The scheduled redraw must not overwrite a newer request/error message.
    S.message = '已取消生成 · 编辑草稿'
    vim.schedule(function() if S.initialized then vim.cmd.redrawstatus() end end)
  end
end
function M.cancel()
  local was_loading = S.loading
  invalidate()
  if was_loading then status('已取消生成'); queue_save() end
end
local function current(stream)
  return S.active == stream and S.generation == stream.generation
    and api.nvim_buf_is_valid(S.input_buf)
    and api.nvim_buf_get_changedtick(S.input_buf) == stream.tick
end
local function stream_error(stream, message)
  if not current(stream) then return end
  stream.terminal = true
  S.loading = false
  S.active = nil
  if stream.process then pcall(function() stream.process:kill(15) end) end
  status(message)
end
local function flush(stream)
  if not current(stream) then return end
  render(stream.entry, stream.topline)
end
local function schedule_flush(stream)
  if stream.pending_render then return end
  stream.pending_render = true
  vim.defer_fn(function()
    stream.pending_render = false
    flush(stream)
  end, 40)
end
local function event(stream, raw)
  if not current(stream) or stream.terminal or raw:match('^%s*$') then return end
  local ok, value = pcall(vim.json.decode, raw)
  if not ok or type(value) ~= 'table' then stream_error(stream, '后端返回无效 NDJSON'); return end
  if value.event == 'delta' and type(value.text) == 'string' then
    stream.entry.answer = stream.entry.answer .. value.text
    schedule_flush(stream)
  elseif value.event == 'status' and type(value.text) == 'string' then
    status(value.text)
  elseif value.event == 'done' and type(value.entry) == 'table'
      and value.entry.id ~= nil and value.entry.id ~= vim.NIL
      and type(value.entry.question) == 'string' and type(value.entry.answer) == 'string'
      and type(value.entry.web_search) == 'boolean' then
    stream.terminal = true
    remember(value.entry)
    S.selected_id = value.entry.id
    render(value.entry)
    S.loading = false
    S.active = nil
    status('回答完成 [' .. mode_label(value.entry.web_search) .. ']')
    queue_save()
  elseif value.event == 'error' then
    stream_error(stream, tostring(value.error or '生成失败'))
  else
    stream_error(stream, '后端返回无效事件')
  end
end
local function consume(stream, chunk, eof)
  if not current(stream) then return end
  stream.raw = stream.raw .. (chunk or '')
  -- Keep arbitrary bytes (including split UTF-8 codepoints) until a whole JSON
  -- line arrives. text=false also prevents libuv from normalizing chunk tails.
  while true do
    local newline = stream.raw:find('\n', 1, true)
    if not newline then break end
    local raw = stream.raw:sub(1, newline - 1):gsub('\r$', '')
    stream.raw = stream.raw:sub(newline + 1)
    event(stream, raw)
    if not current(stream) then return end
  end
  if eof and stream.raw ~= '' then event(stream, stream.raw); stream.raw = '' end
end
function M.submit()
  if not S.initialized or S.search then return end
  vim.cmd.stopinsert()
  local question = draft()
  if question:match('^%s*$') then return end
  invalidate()
  local stream = {
    generation = S.generation, tick = api.nvim_buf_get_changedtick(S.input_buf), raw = '',
    entry = { question = question, answer = '', web_search = S.web_search, sources = {} }, topline = 1,
  }
  S.active = stream
  S.loading = true
  status('生成中 [' .. mode_label(S.web_search) .. '] · Ctrl+C 取消 / Enter 替换提交')
  queue_save()
  local ok, process = pcall(vim.system, backend_command(), {
    cwd = vim.env.QUICK_ASK_ROOT,
    stdin = vim.json.encode({ op = 'ask', question = question, web_search = S.web_search }) .. '\n',
    text = false,
    stdout = function(err, data)
      vim.schedule(function()
        if not current(stream) then return end
        if err then stream_error(stream, '读取生成结果失败: ' .. tostring(err)); return end
        consume(stream, data, data == nil)
      end)
    end,
  }, function(result)
    vim.schedule(function()
      if not current(stream) then return end
      consume(stream, nil, true)
      if not current(stream) then return end
      local detail = (result.stderr or ''):gsub('^%s+', ''):gsub('%s+$', ''):sub(1, 400)
      stream_error(stream, detail ~= '' and detail or ('后端未返回 done (' .. tostring(result.code) .. ')'))
    end)
  end)
  if ok then stream.process = process else stream_error(stream, '无法启动 Python 后端') end
end
function M.control_c()
  if S.search then M.cancel_history()
  elseif S.loading then M.cancel()
  else M.submit() end
end
function M.toggle_web()
  if not S.initialized then return end
  if S.search then M.cancel_history() end
  invalidate()
  S.web_search = not S.web_search
  status('下次提问 [' .. mode_label(S.web_search) .. '] · Tab 切换 · / 历史')
  queue_save()
  return S.web_search
end
function M.scroll(direction)
  if not valid_win(S.result_win) then return end
  api.nvim_win_call(S.result_win, function()
    local key = api.nvim_replace_termcodes(direction > 0 and '<C-d>' or '<C-u>', true, false, true)
    vim.cmd.normal({ args = { key }, bang = true })
  end)
  if S.active then S.active.topline = result_scroll() end
  queue_save()
end

local function im_command()
  if vim.fn.executable('fcitx5-remote') == 1 then return 'fcitx5-remote' end
  if vim.fn.executable('fcitx-remote') == 1 then return 'fcitx-remote' end
end
local function run_im(args)
  if S.config.input_method == false or not S.im_command then return end
  local command = { S.im_command }
  vim.list_extend(command, args or {})
  local ok, result = pcall(function() return vim.system(command, { text = true }):wait(1200) end)
  if ok and result.code == 0 then return result.stdout end
end
local function capture_im()
  if S.config.input_method == false then return end
  S.im_command = im_command()
  local value = tonumber(run_im({}) or '')
  S.previous_im = (value == 1 or value == 2) and value or nil
end
local function edit_im(editing)
  if S.visible then run_im({ editing and S.previous_im == 2 and '-o' or '-c' }) end
end

local function snippet(entry, query, snippets)
  local supplied = entry.search_snippet or (snippets and (snippets[tostring(entry.id)] or snippets[entry.id]))
  if type(supplied) == 'string' then return supplied:gsub('[\r\n]+', ' ') end
  local answer = entry.answer or ''
  -- Backends may additionally provide full Unicode-casefold match snippets.
  -- The fallback still uses literal matching, never a Vim or Lua pattern.
  local first = query ~= '' and vim.fn.tolower(answer):find(vim.fn.tolower(query), 1, true) or 1
  local start = first and math.max(0, vim.str_utfindex(answer, 'utf-8', first - 1, false) - 35) or 0
  local part = vim.fn.strcharpart(answer, start, 160):gsub('[\r\n]+', ' ')
  return (start > 0 and '…' or '') .. part .. (vim.fn.strchars(answer) > start + 160 and '…' or '')
end
local function render_history()
  local search = S.search
  if not search then return end
  local content = { '# 历史 / ' .. search.query, '', 'j / k 选择 · Enter 恢复 · Esc 返回草稿', '' }
  search.rows = {}
  for index, entry in ipairs(search.entries) do
    search.rows[index] = #content + 1
    content[#content + 1] = (index == search.index and '▶ ' or '  ') .. tostring(index) .. '. ['
      .. mode_label(entry.web_search) .. '] ' .. (entry.question or ''):gsub('[\r\n]+', ' ')
    content[#content + 1] = '  ' .. snippet(entry, search.query, search.snippets)
    content[#content + 1] = ''
  end
  if #search.entries == 0 then content[#content + 1] = '没有匹配的历史' end
  set_result(content)
  api.nvim_win_set_cursor(S.result_win, { search.rows[search.index] or 1, 0 })
end
function M.cancel_history()
  local search = S.search
  if not search then return end
  invalidate()
  S.search = nil
  S.prompting = false
  local saved = search.saved
  S.selected_id = saved.selected_id ~= vim.NIL and saved.selected_id or nil
  S.web_search = saved.web_search
  S.history_query = saved.history_query
  set_input(saved.draft, saved.cursor)
  S.display = search.display
  set_result(search.content, saved.result_scroll)
  if valid_win(search.win) then api.nvim_set_current_win(search.win) end
  edit_im(false)
  status(search.message or '已返回草稿')
  queue_save()
end
function M.history_move(delta)
  if not S.search or not S.search.entries or #S.search.entries == 0 then return end
  S.search.index = math.max(1, math.min(#S.search.entries, S.search.index + delta))
  render_history()
end
function M.select_history()
  if not S.search or not S.search.entries then return end
  local entry = S.search.entries[S.search.index]
  if not entry then return end
  invalidate()
  S.search = nil
  S.selected_id = entry.id
  S.web_search = entry.web_search == true
  -- Load's history is complete, but retain entries returned by newer searches too.
  local found = false
  for _, old in ipairs(S.entries) do if old.id == entry.id then found = true; break end end
  if not found then S.entries[#S.entries + 1] = entry end
  set_input(entry.question)
  render(entry)
  api.nvim_set_current_win(S.input_win)
  status('已恢复历史 [' .. mode_label(entry.web_search) .. '] · Enter 可重新提问')
  queue_save()
end
function M.open_history()
  if not S.initialized then return end
  if S.search then M.cancel_history() end
  local search = {
    saved = snapshot(), display = vim.deepcopy(S.display),
    content = api.nvim_buf_get_lines(S.result_buf, 0, -1, false),
    win = api.nvim_get_current_win(), message = S.message,
  }
  invalidate()
  search.generation = S.generation
  S.search = search
  S.prompting = true
  edit_im(true)
  vim.ui.input({ prompt = '历史 / ', default = S.history_query }, function(query)
    if S.search ~= search or search.generation ~= S.generation then return end
    S.prompting = false
    edit_im(false)
    if query == nil then M.cancel_history(); return end
    local response, err = request({ op = 'search', query = query })
    if not response then M.cancel_history(); status(err); return end
    S.history_query = query
    search.query, search.entries, search.snippets, search.index = query, response.entries or {}, response.snippets, 1
    render_history()
    api.nvim_set_current_win(S.result_win)
    status('历史 ' .. #search.entries .. ' 条 · j/k 选择 · Enter 恢复 · Esc 返回')
  end)
end

-- The question remains editable even while an asynchronous UI prompt or lower
-- selector is open. Such edits dismiss the selector without undoing the edit.
-- Defer buffer writes because on_lines runs under Neovim's text lock.
local function dismiss_history_on_edit()
  local search = S.search
  if not search then return end
  S.search, S.prompting = nil, false
  S.history_query, S.display = search.saved.history_query, search.display
  local revision = S.result_revision
  vim.schedule(function()
    -- More keystrokes can change generation before this scheduled restoration;
    -- only a newer rendered view should supersede it.
    if S.result_revision == revision and not S.search then
      set_result(search.content, search.saved.result_scroll)
    end
  end)
end

function M.on_show()
  if not S.initialized then return 0 end
  if not S.visible then capture_im() end
  S.visible = true
  vim.cmd.stopinsert()
  edit_im(false)
  if valid_win(S.input_win) then api.nvim_set_current_win(S.input_win) end
  status('Enter 提问 · Ctrl+C 提问/取消 · Tab 普通/联网 · / 历史 · :q 隐藏')
  return 1
end
function M.before_hide()
  if not S.initialized then return 0 end
  invalidate()
  if S.search then M.cancel_history() end
  if not M.save_state() then return 0 end
  if S.visible and S.previous_im then run_im({ S.previous_im == 2 and '-o' or '-c' }) end
  S.visible, S.previous_im = false, nil
  return 1
end
function M.hide()
  if M.before_hide() ~= 1 then return end
  local launcher = vim.env.QUICK_ASK_CTL
  if not launcher or launcher == '' then status('QUICK_ASK_CTL 未设置，无法隐藏窗口'); return end
  local ok = pcall(vim.system, { vim.env.QUICK_ASK_PYTHON or 'python3', launcher, 'hide' },
    { text = true }, function(result)
      if result.code ~= 0 then vim.schedule(function() status('隐藏失败；请检查 launcher / Hyprland') end) end
    end)
  if not ok then status('无法启动 launcher') end
end
function M.statusline()
  local mode = vim.fn.mode(1):sub(1, 1) == 'i' and 'INSERT' or 'NORMAL'
  local message = (S.message or 'Quick Ask'):gsub('%%', '%%%%'):gsub('[\r\n]', ' ')
  return ' ' .. mode .. ' [' .. mode_label(S.web_search) .. '] │ ' .. message
end
local function layout()
  vim.cmd('silent! only')
  S.input_buf = api.nvim_create_buf(false, true)
  api.nvim_set_current_buf(S.input_buf)
  S.input_win = api.nvim_get_current_win()
  vim.cmd('belowright new')
  S.result_win = api.nvim_get_current_win()
  S.result_buf = api.nvim_get_current_buf()
  api.nvim_set_current_win(S.input_win)
  api.nvim_win_set_height(S.input_win, 3)
  for _, buf in ipairs({ S.input_buf, S.result_buf }) do
    vim.bo[buf].buftype = 'nofile'
    vim.bo[buf].bufhidden = 'hide'
    vim.bo[buf].swapfile = false
    vim.bo[buf].undofile = false
  end
  for _, win in ipairs({ S.input_win, S.result_win }) do
    vim.wo[win].number = false
    vim.wo[win].relativenumber = false
    vim.wo[win].signcolumn = 'no'
    vim.wo[win].foldcolumn = '0'
    vim.wo[win].spell = false
    vim.wo[win].list = false
    vim.wo[win].wrap = true
    vim.wo[win].linebreak = true
  end
  vim.wo[S.input_win].winfixheight = true
  vim.wo[S.input_win].statusline = '%!v:lua.QuickAskStatusline()'
  vim.wo[S.result_win].scrolloff = 0
  vim.wo[S.result_win].statusline = ' Enter 提问   Ctrl+C 提问/取消   Tab 普通/联网   / 历史   Ctrl+D/U 滚动   :q 隐藏'
  vim.bo[S.result_buf].filetype = 'markdown'
  vim.bo[S.result_buf].syntax = 'markdown'
  vim.bo[S.result_buf].readonly = true
  vim.bo[S.result_buf].modifiable = false
end
function M.setup()
  if S.initialized then return M end
  _G.QuickAskStatusline = M.statusline
  vim.opt.title = true
  vim.opt.titlestring = 'Quick Ask'
  vim.opt.hidden = true
  vim.opt.laststatus = 2
  vim.opt.showmode = false
  vim.opt.showcmd = false
  vim.opt.cmdheight = 1
  vim.opt.shadafile = 'NONE'
  vim.opt.undofile = false
  vim.opt.backup = false
  vim.opt.writebackup = false
  vim.opt.winminheight = 0
  vim.opt.mouse = 'a'
  vim.cmd('filetype plugin on')
  vim.cmd('syntax enable')
  layout()
  local response, err = request({ op = 'load' })
  local saved = {}
  if response then
    S.entries, S.config, saved = response.entries or {}, response.config or {}, response.state or {}
  end
  S.selected_id = saved.selected_id ~= vim.NIL and saved.selected_id or nil
  S.web_search = saved.web_search == true
  S.history_query = type(saved.history_query) == 'string' and saved.history_query or ''
  set_input(type(saved.draft) == 'string' and saved.draft or '', saved.cursor or { 1, 0 })
  render(selected_entry(), saved.result_scroll)
  S.initialized = true
  status(err or 'Enter 提问 · Ctrl+C 提问/取消 · Tab 普通/联网 · / 历史')
  for _, buf in ipairs({ S.input_buf, S.result_buf }) do
    local function map(mode, key, action) vim.keymap.set(mode, key, action, { buffer = buf, silent = true }) end
    map('n', '/', M.open_history)
    map({ 'n', 'i' }, '<Tab>', M.toggle_web)
    map({ 'n', 'i' }, '<C-c>', M.control_c)
    map({ 'n', 'i' }, '<CR>', function() if S.search then M.select_history() else M.submit() end end)
    map('n', '<Esc>', function() if S.search then M.cancel_history() end end)
    map({ 'n', 'i' }, '<C-d>', function() M.scroll(1) end)
    map({ 'n', 'i' }, '<C-u>', function() M.scroll(-1) end)
  end
  -- Only the lower selector remaps j/k; the question retains native multiline motion.
  for _, motion in ipairs({ { 'j', 1 }, { 'k', -1 } }) do
    vim.keymap.set('n', motion[1], function()
      if S.search then M.history_move(motion[2])
      else vim.cmd.normal({ args = { motion[1] }, bang = true }) end
    end, { buffer = S.result_buf, silent = true })
  end
  api.nvim_create_user_command('History', M.open_history, {})
  vim.keymap.set('c', '<CR>', function()
    if vim.fn.getcmdtype() == ':' and vim.fn.getcmdline():match('^%s*q!?%s*$') then
      return '<C-u>lua require("quick_ask").hide()<CR>'
    end
    return '<CR>'
  end, { expr = true, replace_keycodes = true })
  local group = api.nvim_create_augroup('QuickAskUI', { clear = true })
  api.nvim_buf_attach(S.input_buf, false, { on_lines = function()
    if not S.changing then
      invalidate_for_edit()
      dismiss_history_on_edit()
      queue_save()
    end
  end })
  api.nvim_create_autocmd({ 'CursorMoved', 'CursorMovedI', 'InsertLeave' }, {
    group = group, buffer = S.input_buf, callback = queue_save,
  })
  api.nvim_create_autocmd('InsertEnter', { group = group, buffer = S.input_buf, callback = function()
    invalidate_for_edit()
    dismiss_history_on_edit()
    edit_im(true)
  end })
  api.nvim_create_autocmd('InsertLeave', { group = group, buffer = S.input_buf, callback = function() edit_im(false) end })
  api.nvim_create_autocmd('CmdlineEnter', { group = group, callback = function()
    if S.prompting then edit_im(true) end
  end })
  api.nvim_create_autocmd('CmdlineLeave', { group = group, callback = function()
    if S.prompting then edit_im(false) end
  end })
  api.nvim_create_autocmd('VimResized', { group = group, callback = function()
    if valid_win(S.input_win) then api.nvim_win_set_height(S.input_win, 3) end
  end })
  api.nvim_create_autocmd('VimLeavePre', { group = group, callback = M.before_hide })
  return M
end
return M

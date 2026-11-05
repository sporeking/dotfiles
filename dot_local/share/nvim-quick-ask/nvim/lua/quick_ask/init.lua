local M = {}
local api = vim.api
local S = {
  entries = {}, sessions = {}, messages = {}, config = {}, generation = 0, save_generation = 0,
  visible = false, loading = false, web_search = false, history_query = '',
  request_id = 0, queued = 0,
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
    selected_id = S.selected_id or vim.NIL, session_id = S.session_id or vim.NIL, draft = draft(),
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
    set_result({ '# Quick Agent · 多轮会话', '', 'Enter 提问；运行中 Enter 排队，Ctrl+C 取消任务和队列。', '',
      'Tab：web_search 开关（空闲时）    :NewChat：新会话    / 或 :History：历史',
      '问题区支持多行编辑：o / O 或 Insert 中 Ctrl+J 换行。',
      'Esc：返回 Normal    Ctrl+D / Ctrl+U：滚动    :q：保存并隐藏，任务继续' }, scroll or 1)
    return
  end
  local content = { '# 旧记录 · 单轮回答 [' .. mode_label(entry.web_search) .. ']',
    '', 'Enter 将在新会话中重新提问；原记录保留。', '' }
  vim.list_extend(content, lines(entry.answer))
  if #(entry.sources or {}) > 0 then
    vim.list_extend(content, { '', '## 来源', '' })
    for _, source in ipairs(entry.sources) do
      content[#content + 1] = '- [' .. (source.title or source.url or '') .. '](' .. (source.url or '') .. ')'
    end
  end
  set_result(content, scroll or 1)
end
-- Only tool previews are bounded; the native session retains complete output.
local function preview(text, max_lines, max_chars)
  text = tostring(text or ''):gsub('\r', '')
  local clipped = #text > max_chars
  if clipped then
    local boundary = max_chars
    while boundary > 0 and (text:byte(boundary + 1) or 0) >= 128
        and (text:byte(boundary + 1) or 0) < 192 do boundary = boundary - 1 end
    text = text:sub(1, boundary)
  end
  local out = lines(text)
  while #out > max_lines do table.remove(out); clipped = true end
  if clipped then out[#out + 1] = '…（完整输出保存在会话中）' end
  return out
end
local function render_messages(scroll)
  S.display = nil
  local content = { '# Quick Agent · ' .. ((S.session and S.session.title) or '多轮会话'), '' }
  if #S.messages == 0 then
    vim.list_extend(content, { 'Enter 提问；运行中 Enter 排队，Ctrl+C 取消任务和队列。', '',
      'Tab：切换 web_search（空闲时）    :NewChat：新会话    / 或 :History：历史',
      '问题区支持 o / O、Ctrl+J 和原生多行编辑。:q 隐藏，任务继续；:qa! 退出。', '' })
  end
  for _, message in ipairs(S.messages) do
    if message.role == 'tool' then
      local args = type(message.args) == 'table' and message.args or {}
      local detail = args.command or args.path or args.file_path or args.pattern or args.query or ''
      content[#content + 1] = '### 工具 · ' .. (message.name or 'tool')
        .. (message.is_error and ' · 失败' or (message.running and ' · 运行中' or ' · 完成'))
      vim.list_extend(content, preview(detail, 2, 240))
      vim.list_extend(content, preview(message.text, 12, 1600))
    else
      content[#content + 1] = message.role == 'user' and '## 你' or '## 助手'
      vim.list_extend(content, lines(message.text))
    end
    content[#content + 1] = ''
  end
  set_result(content, scroll or result_scroll())
end
local function current(server)
  -- Draft edits never invalidate work. Only replacement/shutdown of the server
  -- revokes callback ownership, before any signal is sent to the old process.
  return S.server == server and S.generation == server.generation
    and S.initialized and api.nvim_buf_is_valid(S.input_buf)
end
local function schedule_flush(server)
  if server.pending_render then return end
  server.pending_render = true
  vim.defer_fn(function()
    server.pending_render = false
    if current(server) and not S.search and S.session_id then render_messages() end
  end, 40)
end
local function restore_queue(texts)
  if type(texts) ~= 'table' or #texts == 0 then return end
  local existing, cursor = draft(), api.nvim_win_get_cursor(S.input_win)
  local restored = table.concat(texts, '\n\n')
  if existing ~= '' then set_input(existing .. '\n\n' .. restored, cursor)
  else set_input(restored) end
  queue_save()
end
local function fail_server(server, message)
  if not current(server) then return end
  S.generation = S.generation + 1
  S.server, S.active, S.loading, S.switching = nil, nil, false, false
  S.queued = 0
  if server.process then pcall(function() server.process:kill(15) end) end
  status(message)
end
local function tool_message(value)
  local message
  for _, item in ipairs(S.messages) do
    if item.role == 'tool' and item.tool_call_id == value.tool_call_id then message = item; break end
  end
  if not message then
    message = { role = 'tool', tool_call_id = value.tool_call_id, text = '' }
    S.messages[#S.messages + 1] = message
  end
  message.name = value.name or message.name
  message.args = value.args or message.args
  if type(value.text) == 'string' then message.text = value.text end -- cumulative, never append
  message.is_error = value.is_error == true
  message.running = value.event ~= 'tool_end'
end
local function event(server, raw)
  if not current(server) or raw:match('^%s*$') then return end
  local ok, value = pcall(vim.json.decode, raw)
  if not ok or type(value) ~= 'table' then fail_server(server, '后端返回无效 NDJSON'); return end
  local pending = value.id and server.pending[value.id]
  if value.event == 'snapshot' then
    S.messages = type(value.messages) == 'table' and value.messages or {}
    S.streaming = nil
    S.session = type(value.session) == 'table' and value.session or nil
    S.session_id = S.session and S.session.id or nil
    server.session_id = S.session_id
    S.selected_id = nil
    S.web_search = value.web_search == true
    server.busy = value.loading == true
    S.loading = server.busy
    for _, operation in pairs(server.pending) do
      if operation.question then S.loading = true; break end
    end
    if not S.loading then S.queued = 0 end
    S.switching = false
    if S.session then
      local found = false
      for i, session in ipairs(S.sessions) do
        if session.id == S.session_id then S.sessions[i] = S.session; found = true; break end
      end
      if not found then table.insert(S.sessions, 1, S.session) end
    end
    if not S.search then render_messages(server.restore_scroll); server.restore_scroll = nil end
    status(S.loading and '任务运行中 · Enter 排队 / Ctrl+C 取消' or '会话已就绪 · Enter 继续提问')
    if pending then
      server.pending[value.id] = nil
      if pending.after_snapshot then pending.after_snapshot() end
    end
    queue_save()
  elseif value.event == 'accepted' then
    if pending and pending.question then
      server.busy, S.loading = true, true
      if api.nvim_buf_get_changedtick(S.input_buf) == pending.tick then set_input('') end
      if value.disposition == 'queued' then S.queued = S.queued + 1 end
      server.pending[value.id] = nil
      status(value.disposition == 'queued' and ('已排队 ' .. S.queued .. ' 条 · Ctrl+C 取消任务和队列')
        or '任务运行中 · Enter 排队 / Ctrl+C 取消')
      queue_save()
    elseif value.id then
      server.pending[value.id] = nil
    end
  elseif value.event == 'message_start' then
    if value.role == 'assistant' then
      local message = { role = 'assistant', text = '' }
      S.messages[#S.messages + 1] = message
      S.streaming = message
    end
    schedule_flush(server)
  elseif value.event == 'delta' and type(value.text) == 'string' then
    if not S.streaming then
      S.streaming = { role = 'assistant', text = '' }
      S.messages[#S.messages + 1] = S.streaming
    end
    S.streaming.text = S.streaming.text .. value.text
    schedule_flush(server)
  elseif value.event == 'message_end' and type(value.message) == 'table' then
    local message = value.message
    if message.role == 'assistant' and S.streaming then
      for index, item in ipairs(S.messages) do
        if item == S.streaming then S.messages[index] = message; break end
      end
      S.streaming = nil
    elseif message.role == 'tool' then
      tool_message(vim.tbl_extend('force', message, { event = 'tool_end' }))
    else S.messages[#S.messages + 1] = message end
    schedule_flush(server)
  elseif value.event == 'tool_start' or value.event == 'tool_update' or value.event == 'tool_end' then
    tool_message(value)
    schedule_flush(server)
  elseif value.event == 'status' then
    status(tostring(value.text or ''))
  elseif value.event == 'settled' then
    -- The following snapshot is the completion barrier. A user may submit
    -- between callbacks; that older idle snapshot must not clear a new prompt.
    server.busy, S.queued = false, 0
    status(value.aborted and '已取消任务 · 可以继续提问' or '任务完成 · Enter 继续提问')
    schedule_flush(server)
    queue_save()
  elseif value.event == 'queue_cleared' then
    S.queued = 0
    restore_queue(value.messages)
  elseif value.event == 'error' then
    if pending then
      server.pending[value.id] = nil
      if pending.after_snapshot then S.switching = false end
      if pending.question then
        S.loading = server.busy == true
        for _, operation in pairs(server.pending) do
          if operation.question then S.loading = true; break end
        end
      end
    end
    status(tostring(value.error or '后端请求失败'))
  elseif value.event == 'closed' then
    server.closed = true
    S.loading, S.queued = false, 0
  else
    fail_server(server, '后端返回无效事件')
  end
end
local function consume(server, chunk, eof)
  if not current(server) then return end
  server.raw = server.raw .. (chunk or '')
  -- Buffer bytes until LF, including arbitrary splits inside UTF-8 codepoints.
  while true do
    local newline = server.raw:find('\n', 1, true)
    if not newline then break end
    local raw = server.raw:sub(1, newline - 1):gsub('\r$', '')
    server.raw = server.raw:sub(newline + 1)
    event(server, raw)
    if not current(server) then return end
  end
  if eof and server.raw ~= '' then event(server, server.raw); server.raw = '' end
end
local function start_server()
  if S.server then return S.server end
  S.generation = S.generation + 1
  local server = { generation = S.generation, raw = '', pending = {} }
  S.server, S.active = server, server
  local command = backend_command()
  command[#command + 1] = 'serve'
  local ok, process = pcall(vim.system, command, {
    cwd = vim.env.QUICK_ASK_ROOT, stdin = true, text = false,
    stdout = function(err, data)
      vim.schedule(function()
        if not current(server) then return end
        if err then fail_server(server, '读取后端结果失败'); return end
        consume(server, data, data == nil)
      end)
    end,
  }, function(result)
    vim.schedule(function()
      if not current(server) then return end
      consume(server, nil, true)
      if not current(server) then return end
      -- Provider stderr can include private diagnostics; never show it verbatim.
      fail_server(server, server.closed and '后端已关闭' or ('后端已退出 (' .. tostring(result.code) .. ')'))
    end)
  end)
  if not ok then fail_server(server, '无法启动 Python 后端'); return nil end
  server.process = process
  return server
end
local function send(payload, pending)
  local server = start_server()
  if not server then return end
  S.request_id = S.request_id + 1
  payload.id = S.request_id
  server.pending[payload.id] = pending or {}
  local ok = pcall(function() server.process:write(vim.json.encode(payload) .. '\n') end)
  if not ok then fail_server(server, '无法发送后端请求'); return end
  return payload.id
end
local function open_session(op, session_id, after_snapshot, scroll)
  S.switching = true
  local id = send({ op = op, session_id = session_id or vim.NIL, web_search = S.web_search }, {
    after_snapshot = after_snapshot or function() end,
  })
  if id and S.server then S.server.restore_scroll = scroll end
end
function M.submit()
  if not S.initialized or S.search then return end
  vim.cmd.stopinsert()
  local question = draft()
  if question:match('^%s*$') then return end
  if S.switching then status('正在切换会话，请稍候'); return end
  local pending = { question = question, tick = api.nvim_buf_get_changedtick(S.input_buf), was_busy = S.loading }
  local function prompt()
    if send({ op = 'prompt', question = question, web_search = S.web_search }, pending) then
      S.loading = true
      status(pending.was_busy and '正在排队后续问题' or '任务运行中 · Enter 排队 / Ctrl+C 取消')
      queue_save()
    end
  end
  -- A legacy answer is a read-only record, never context for an unrelated chat.
  -- Wait for a successful snapshot so a failed open cannot leak the question.
  if not S.session_id or not S.server or S.server.session_id ~= S.session_id then
    open_session(S.selected_id and 'new' or 'open', S.session_id, prompt)
  else prompt() end
end
function M.cancel()
  if not S.initialized or not S.server then return end
  send({ op = 'abort' })
  status('正在取消任务和队列')
end
function M.control_c()
  if S.search then M.cancel_history()
  elseif S.loading then M.cancel()
  else M.submit() end
end
function M.new_chat()
  if not S.initialized then return end
  if S.loading or S.switching then status('任务运行中，请等待完成或 Ctrl+C 取消后再新建会话'); return end
  if S.search then M.cancel_history() end
  open_session('new')
end
function M.toggle_web()
  if not S.initialized then return end
  if S.loading or S.switching then status('任务运行中，请等待完成后切换 web_search'); return end
  if S.search then M.cancel_history() end
  if S.session_id then
    local next_mode = not S.web_search
    local function change_mode()
      S.switching = true
      send({ op = 'mode', web_search = next_mode }, { after_snapshot = function() end })
    end
    if S.server and S.server.session_id == S.session_id then change_mode()
    else open_session('open', S.session_id, change_mode) end
  else
    S.web_search = not S.web_search
    status('web_search ' .. (S.web_search and '已启用' or '已关闭') .. ' · Tab 切换')
    queue_save()
  end
  return S.web_search
end
function M.shutdown()
  if S.shutting_down then return end
  S.shutting_down = true
  M.before_hide()
  local server = S.server
  if not server then return end
  -- Revoke ownership before waiting: queued stdout/exit/timer callbacks from
  -- this process can never mutate a later server or the draft during exit.
  S.generation = S.generation + 1
  S.server, S.active, S.loading = nil, nil, false
  pcall(function() server.process:write(vim.json.encode({ op = 'shutdown' }) .. '\n') end)
  pcall(function() server.process:write(nil) end)
  local ok, result = pcall(function() return server.process:wait(2500) end)
  if not ok or not result or result.code == 124 then
    pcall(function() server.process:kill(15) end)
    pcall(function() server.process:wait(500) end)
    pcall(function() server.process:kill(9) end)
  end
end
function M.scroll(direction)
  if not valid_win(S.result_win) then return end
  api.nvim_win_call(S.result_win, function()
    local key = api.nvim_replace_termcodes(direction > 0 and '<C-d>' or '<C-u>', true, false, true)
    vim.cmd.normal({ args = { key }, bang = true })
  end)
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
      .. (entry.kind == 'session' and '会话 · ' or '旧记录 · ') .. mode_label(entry.web_search) .. '] '
      .. (entry.title or entry.question or ''):gsub('[\r\n]+', ' ')
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
  if S.loading or S.switching then status('任务运行中，请等待完成后切换会话'); return end
  S.search = nil
  api.nvim_set_current_win(S.input_win)
  if entry.kind == 'session' then
    -- Opening history replaces only the transcript. Keep the unsent draft.
    open_session('open', entry.id)
  else
    S.selected_id, S.session_id, S.session = entry.id, nil, nil
    S.messages, S.streaming = {}, nil
    S.web_search = entry.web_search == true
    local found = false
    for _, old in ipairs(S.entries) do if old.id == entry.id then found = true; break end end
    if not found then S.entries[#S.entries + 1] = entry end
    set_input(entry.question)
    render(entry)
    status('已恢复旧记录 · Enter 在新会话中重新提问')
    queue_save()
  end
end
function M.open_history()
  if not S.initialized then return end
  if S.loading or S.switching then status('任务运行中，请等待完成后切换会话'); return end
  if S.search then M.cancel_history() end
  local search = {
    saved = snapshot(), display = vim.deepcopy(S.display),
    content = api.nvim_buf_get_lines(S.result_buf, 0, -1, false),
    win = api.nvim_get_current_win(), message = S.message,
  }
  S.search = search
  S.prompting = true
  edit_im(true)
  vim.ui.input({ prompt = '历史 / ', default = S.history_query }, function(query)
    if S.search ~= search then return end
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
    -- More keystrokes can arrive before this scheduled restoration; only a
    -- newer rendered view should supersede it.
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
  status(S.loading and '任务运行中 · Enter 排队 / Ctrl+C 取消' or 'Enter 提问 · Tab web_search · / 历史 · :q 隐藏')
  return 1
end
function M.before_hide()
  if not S.initialized then return 0 end
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
  local session = S.session or {}
  local activity = S.loading and ('运行中' .. (S.queued > 0 and ' / 排队 ' .. S.queued or '')) or '空闲'
  local context = (session.title or '新会话') .. ' · ' .. (session.cwd or S.config.workspace or '~/agent-workspace')
  local message = (context .. ' │ ' .. (S.message or 'Quick Agent')):gsub('%%', '%%%%'):gsub('[\r\n]', ' ')
  return ' ' .. mode .. ' [' .. mode_label(S.web_search) .. ' / ' .. activity .. '] │ ' .. message
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
  vim.wo[S.result_win].statusline = ' Enter 提问/排队   Ctrl+C 取消   Tab web_search   / 历史   :NewChat   Ctrl+D/U 滚动   :q 隐藏'
  vim.bo[S.result_buf].filetype = 'markdown'
  vim.bo[S.result_buf].syntax = 'markdown'
  vim.bo[S.result_buf].readonly = true
  vim.bo[S.result_buf].modifiable = false
end
function M.setup()
  if S.initialized then return M end
  _G.QuickAskStatusline = M.statusline
  vim.opt.title = true
  vim.opt.titlestring = 'Quick Agent'
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
    S.entries, S.sessions, S.config, saved = response.entries or {}, response.sessions or {}, response.config or {}, response.state or {}
  end
  S.selected_id = saved.selected_id ~= vim.NIL and saved.selected_id or nil
  S.session_id = saved.session_id ~= vim.NIL and saved.session_id or nil
  if S.session_id then
    local indexed = false
    for _, session in ipairs(S.sessions) do
      if session.id == S.session_id then indexed = true; break end
    end
    -- Pi allocates an id before its first persisted message. An empty chat
    -- isn't indexed yet; restarting it should keep the draft ready for a new
    -- chat rather than repeatedly attempting to resume an unknown id.
    if not indexed then S.session_id = nil end
  end
  S.web_search = saved.web_search == true
  S.history_query = type(saved.history_query) == 'string' and saved.history_query or ''
  set_input(type(saved.draft) == 'string' and saved.draft or '', saved.cursor or { 1, 0 })
  if S.selected_id then render(selected_entry(), saved.result_scroll) else render_messages(saved.result_scroll) end
  S.initialized = true
  status(err or 'Enter 提问 · Tab web_search · / 历史 · :NewChat')
  if S.session_id then open_session('open', S.session_id, nil, saved.result_scroll) end
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
  api.nvim_create_user_command('NewChat', M.new_chat, {})
  vim.keymap.set('c', '<CR>', function()
    if vim.fn.getcmdtype() == ':' and vim.fn.getcmdline():match('^%s*q!?%s*$') then
      return '<C-u>lua require("quick_ask").hide()<CR>'
    end
    return '<CR>'
  end, { expr = true, replace_keycodes = true })
  local group = api.nvim_create_augroup('QuickAskUI', { clear = true })
  api.nvim_buf_attach(S.input_buf, false, { on_lines = function()
    if not S.changing then
      dismiss_history_on_edit()
      queue_save()
    end
  end })
  api.nvim_create_autocmd({ 'CursorMoved', 'CursorMovedI', 'InsertLeave' }, {
    group = group, buffer = S.input_buf, callback = queue_save,
  })
  api.nvim_create_autocmd('InsertEnter', { group = group, buffer = S.input_buf, callback = function()
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
  api.nvim_create_autocmd('VimLeavePre', { group = group, callback = M.shutdown })
  return M
end
return M

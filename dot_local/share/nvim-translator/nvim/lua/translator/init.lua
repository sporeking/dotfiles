local M = {}
local api = vim.api
local S = {
  entries = {}, selected_id = nil, config = {}, generation = 0,
  visible = false, save_generation = 0, loading = false, direction = 'en-zh',
}
M.state = S

local function normalize(text)
  return (text:gsub('%s+', ' '):gsub('^ ', ''):gsub(' $', ''))
end

local function direction(value)
  return value == 'zh-en' and 'zh-en' or 'en-zh'
end

local function direction_label(value)
  return direction(value) == 'zh-en' and 'ZH→EN' or 'EN→ZH'
end

local function valid_win(win)
  return win and api.nvim_win_is_valid(win)
end

local function status(message)
  S.message = message
  if S.input_buf and api.nvim_buf_is_valid(S.input_buf) then
    vim.bo[S.input_buf].modified = false
  end
  vim.cmd.redrawstatus()
end

local function backend_command()
  return { vim.env.TRANSLATOR_PYTHON or 'python3', '-m', 'translator_backend' }
end

local function decode_response(result)
  local ok, response = pcall(vim.json.decode, result.stdout or '')
  -- Backend failures may deliberately use exit 1 with a human-readable JSON
  -- error. Decode that message before considering the exit status.
  if ok and type(response) == 'table' and response.ok ~= true then
    return nil, tostring(response.error or 'Backend request failed.')
  end
  if result.code ~= 0 then
    return nil, 'Backend exited (' .. tostring(result.code) .. '); check Python/configuration.'
  end
  if not ok or type(response) ~= 'table' then
    return nil, 'Backend returned invalid JSON.'
  end
  return response
end

-- Each invocation consumes one JSON request and exits. Only local operations wait;
-- lookups always use vim.system's asynchronous callback.
local function request(payload, callback)
  local options = {
    cwd = vim.env.TRANSLATOR_ROOT,
    stdin = vim.json.encode(payload) .. '\n', text = true,
  }
  if callback then
    local ok, process = pcall(vim.system, backend_command(), options, function(result)
      vim.schedule(function()
        local response, err = decode_response(result)
        callback(response, err)
      end)
    end)
    if not ok then
      vim.schedule(function() callback(nil, 'Cannot start Python backend.') end)
      return nil
    end
    return process
  end
  local ok, result = pcall(function()
    return vim.system(backend_command(), options):wait(5000)
  end)
  if not ok then return nil, 'Cannot start Python backend.' end
  return decode_response(result)
end

local function selected_index()
  for index, entry in ipairs(S.entries) do
    if entry.id == S.selected_id then return index end
  end
end

local function selected_entry()
  local index = selected_index()
  return index and S.entries[index] or nil
end

local function input_cursor()
  if not valid_win(S.input_win) then return 0 end
  return api.nvim_win_get_cursor(S.input_win)[2]
end

local function result_scroll()
  if not valid_win(S.result_win) then return 1 end
  return api.nvim_win_call(S.result_win, function() return vim.fn.winsaveview().topline end)
end

local function snapshot()
  return {
    selected_id = S.selected_id, direction = S.direction,
    draft = table.concat(api.nvim_buf_get_lines(S.input_buf, 0, -1, false), ' '),
    cursor = input_cursor(), result_scroll = result_scroll(),
  }
end

function M.save_state()
  if not S.initialized then return end
  S.save_generation = S.save_generation + 1
  local _, err = request({ op = 'save_state', state = snapshot() })
  if err then status(err) end
  return not err
end

local function queue_save()
  if not S.initialized or S.changing then return end
  S.save_generation = S.save_generation + 1
  local generation = S.save_generation
  vim.defer_fn(function()
    if generation == S.save_generation and S.initialized then M.save_state() end
  end, 200)
end

local function set_input(text, cursor)
  S.changing = true
  -- Draft whitespace belongs to the edit; normalize only the submitted query.
  api.nvim_buf_set_lines(S.input_buf, 0, -1, false, { ((text or ''):gsub('[\r\n]+', ' ')) })
  local line = api.nvim_buf_get_lines(S.input_buf, 0, 1, false)[1] or ''
  api.nvim_win_set_cursor(S.input_win, { 1, math.min(cursor or #line, #line) })
  vim.bo[S.input_buf].modified = false
  S.changing = false
end

-- Clipboard puts and RPC edits must obey the same one-line invariant as typing.
local function join_input_lines()
  if S.changing then return end
  local lines = api.nvim_buf_get_lines(S.input_buf, 0, -1, false)
  if #lines <= 1 then queue_save(); return end
  local cursor = api.nvim_win_get_cursor(S.input_win)
  local column = cursor[2]
  for i = 1, cursor[1] - 1 do column = column + #lines[i] + 1 end
  S.changing = true
  pcall(vim.cmd, 'undojoin')
  api.nvim_buf_set_lines(S.input_buf, 0, -1, false, { (table.concat(lines, ' '):gsub('[\r\n]', ' ')) })
  api.nvim_win_set_cursor(S.input_win, { 1, column })
  vim.bo[S.input_buf].modified = false
  S.changing = false
  queue_save()
end

local function result_lines(entry)
  if not entry then
    return { '输入单词、短语或句子，然后按 Esc / Ctrl+C 查询。', '',
      'w / b / ciw / u：原生 Vim 编辑', 'k：更早历史    j：更新历史',
      'Tab：切换 EN→ZH / ZH→EN',
      'Ctrl+D / Ctrl+U：滚动结果    p：发音    :q：隐藏' }
  end
  local result = entry.result or {}
  local lines = { (entry.text or '') .. '  [' .. direction_label(entry.direction) .. ']', '' }
  local phonetics = result.phonetics or {}
  for _, accent in ipairs({ 'us', 'uk' }) do
    if phonetics[accent] and phonetics[accent] ~= '' then
      lines[#lines + 1] = string.upper(accent) .. '  /' .. phonetics[accent] .. '/'
    end
  end
  if #lines > 2 then lines[#lines + 1] = '' end
  if result.translation and result.translation ~= '' then
    for line in (result.translation .. '\n'):gmatch('(.-)\n') do lines[#lines + 1] = line end
    lines[#lines + 1] = ''
  end
  for _, meaning in ipairs(result.meanings or {}) do
    lines[#lines + 1] = (meaning.pos or '') .. '  ' .. table.concat(meaning.definitions or {}, '；')
  end
  if #(result.meanings or {}) > 0 then lines[#lines + 1] = '' end
  if S.config.examples ~= false then
    for index, example in ipairs(result.examples or {}) do
      lines[#lines + 1] = tostring(index) .. '. ' .. (example.en or '')
      if example.zh and example.zh ~= '' then lines[#lines + 1] = '   ' .. example.zh end
      if example.source == 'generated' then lines[#lines + 1] = '   [生成例句]' end
      lines[#lines + 1] = ''
    end
  end
  lines[#lines + 1] = '来源：' .. tostring(result.source or 'unknown')
  return lines
end

local function set_scroll(topline)
  if not valid_win(S.result_win) then return end
  api.nvim_win_call(S.result_win, function()
    local line = math.max(1, math.min(tonumber(topline) or 1, api.nvim_buf_line_count(S.result_buf)))
    vim.fn.winrestview({ topline = line, lnum = line, col = 0, skipcol = 0 })
  end)
end

local function render(entry, scroll)
  local lines = result_lines(entry)
  vim.bo[S.result_buf].modifiable = true
  api.nvim_buf_set_lines(S.result_buf, 0, -1, false, lines)
  vim.bo[S.result_buf].modifiable = false
  vim.bo[S.result_buf].modified = false
  set_scroll(scroll or 1)
end

function M.scroll(direction)
  if not valid_win(S.result_win) then return end
  api.nvim_win_call(S.result_win, function()
    local key = direction > 0 and '<C-d>' or '<C-u>'
    vim.cmd.normal({ args = { api.nvim_replace_termcodes(key, true, false, true) }, bang = true })
  end)
  queue_save()
end

local function invalidate()
  S.generation = S.generation + 1
  S.loading = false
end

function M.history(delta)
  invalidate()
  local index = selected_index() or 0
  local target = index + delta
  if index == 0 then target = 1 end
  if target < 1 or target > #S.entries then
    status(delta > 0 and '已是最早历史' or '已是最新历史')
    return
  end
  local entry = S.entries[target]
  S.selected_id = entry.id
  S.direction = direction(entry.direction)
  set_input(entry.text)
  render(entry)
  status('历史 ' .. target .. '/' .. #S.entries)
  queue_save()
end

local function remember_entry(entry, cached)
  for index, old in ipairs(S.entries) do
    if old.id == entry.id then S.entries[index] = entry; return end
  end
  S.entries[#S.entries + 1] = entry
  -- Successful concurrent lookups can complete in a different order. Backend ids
  -- and creation dates define chronology; cached reads never move old entries.
  if not cached then
    table.sort(S.entries, function(a, b)
      if a.created_at ~= b.created_at and a.created_at and b.created_at then
        return a.created_at > b.created_at
      end
      return (tonumber(a.id) or 0) > (tonumber(b.id) or 0)
    end)
  end
end

function M.pronounce(automatic)
  local entry = selected_entry()
  if not entry then return end
  local audio = (entry.result or {}).audio or {}
  local accent = S.config.accent or 'us'
  local url = audio[accent] or audio.us or audio.uk
  if not url or url == '' then
    if not automatic then status('此结果没有发音音频') end
    return
  end
  if vim.fn.executable('mpv') ~= 1 then
    status('找不到 mpv，无法播放发音')
    return
  end
  if S.audio_process then pcall(function() S.audio_process:kill(15) end) end
  local ok, process = pcall(vim.system, { 'mpv', '--no-video', '--really-quiet', '--', url }, {}, function(result)
    if result.code ~= 0 and result.code ~= 143 then
      vim.schedule(function() status('发音播放失败') end)
    end
  end)
  if ok then S.audio_process = process else status('无法启动 mpv') end
end

function M.submit()
  if not S.initialized then return end
  vim.cmd.stopinsert()
  join_input_lines()
  local text = normalize(table.concat(api.nvim_buf_get_lines(S.input_buf, 0, -1, false), ' '))
  if text == '' then return end
  invalidate()
  local entry = selected_entry()
  if entry and normalize(entry.text or '') == text and direction(entry.direction) == S.direction then
    status('已保存的结果')
    queue_save()
    return
  end
  local generation = S.generation
  local submitted_tick = api.nvim_buf_get_changedtick(S.input_buf)
  S.loading = true
  status('查询中…')
  queue_save()
  request({ op = 'lookup', text = text, direction = S.direction, force = false }, function(response, err)
    if response and type(response.entry) == 'table' and response.entry.id then
      remember_entry(response.entry, response.cached)
    end
    if generation ~= S.generation then return end
    S.loading = false
    if submitted_tick ~= api.nvim_buf_get_changedtick(S.input_buf) then return end
    if err then status(err); return end
    if type(response.entry) ~= 'table' or not response.entry.id then
      status('Backend returned no entry.'); return
    end
    S.selected_id = response.entry.id
    -- Preserve the submitted draft and cursor rather than moving the user's cursor.
    render(response.entry)
    status(response.cached and '已缓存' or '查询完成')
    queue_save()
    if response.cached ~= true and S.config.auto_pronounce ~= false and S.visible then
      M.pronounce(true)
    end
  end)
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
  -- Query the global state even if Hyprland has already focused this Neovim.
  -- Focus-derived state would lose the IM state of the previously active app.
  local value = tonumber(run_im({}) or '')
  S.previous_im = (value == 1 or value == 2) and value or nil
end

local function set_edit_im(editing)
  run_im({ editing and S.direction == 'zh-en' and '-o' or '-c' })
end

function M.toggle_direction()
  if not S.initialized then return end
  invalidate()
  S.direction = S.direction == 'zh-en' and 'en-zh' or 'zh-en'
  -- A buffer-local mapping calls this in the existing mode. It never rewrites
  -- the draft or rendered result, so cursor, undo and result scroll stay intact.
  set_edit_im(vim.fn.mode(1):sub(1, 1) == 'i')
  status('Tab 切换方向 · Esc/Ctrl+C 查询 · :q 隐藏')
  queue_save()
  return S.direction
end

function M.on_show()
  if not S.initialized then return 0 end
  if not S.visible then capture_im() end
  S.visible = true
  vim.cmd.stopinsert()
  set_edit_im(false)
  if valid_win(S.input_win) then api.nvim_set_current_win(S.input_win) end
  status('Tab 方向 · k 更早 · j 更新 · Esc/Ctrl+C 查询 · :q 隐藏')
  return 1
end

-- Safe for repeated launcher RPC calls. Never invoke the launcher here: hide's
-- RPC callback must finish before the launcher can move the special workspace.
function M.before_hide()
  if not S.initialized then return 0 end
  invalidate()
  if not M.save_state() then return 0 end
  if S.visible and S.previous_im then
    run_im({ S.previous_im == 2 and '-o' or '-c' })
  end
  S.visible = false
  S.previous_im = nil
  return 1
end

function M.hide()
  if M.before_hide() ~= 1 then return end
  local launcher = vim.env.TRANSLATOR_CTL
  if not launcher or launcher == '' then
    status('TRANSLATOR_CTL 未设置，无法隐藏窗口')
    return
  end
  -- No wait: the launcher calls before_hide() over this process's RPC socket.
  local ok = pcall(vim.system, { vim.env.TRANSLATOR_PYTHON or 'python3', launcher, 'hide' },
    { text = true }, function(result)
      if result.code ~= 0 then
        vim.schedule(function() status('隐藏失败；请检查 launcher / Hyprland') end)
      end
    end)
  if not ok then status('无法启动 launcher') end
end

local function map(mode, lhs, rhs, options)
  options = vim.tbl_extend('force', { buffer = S.input_buf, silent = true }, options or {})
  vim.keymap.set(mode, lhs, rhs, options)
end

local function make_layout()
  vim.cmd('silent! only')
  S.input_buf = api.nvim_create_buf(false, true)
  api.nvim_set_current_buf(S.input_buf)
  S.input_win = api.nvim_get_current_win()
  vim.cmd('belowright new')
  S.result_win = api.nvim_get_current_win()
  S.result_buf = api.nvim_get_current_buf()
  api.nvim_set_current_win(S.input_win)
  api.nvim_win_set_height(S.input_win, 1)
  for _, buf in ipairs({ S.input_buf, S.result_buf }) do
    vim.bo[buf].buftype = 'nofile'
    vim.bo[buf].bufhidden = 'hide'
    vim.bo[buf].swapfile = false
    vim.bo[buf].filetype = 'translator'
  end
  for _, win in ipairs({ S.input_win, S.result_win }) do
    vim.wo[win].number = false
    vim.wo[win].relativenumber = false
    vim.wo[win].signcolumn = 'no'
    vim.wo[win].foldcolumn = '0'
    vim.wo[win].spell = false
    vim.wo[win].list = false
  end
  vim.wo[S.input_win].wrap = false
  vim.wo[S.input_win].winfixheight = true
  vim.wo[S.input_win].statusline = '%!v:lua.TranslatorStatusline()'
  vim.wo[S.result_win].wrap = true
  vim.wo[S.result_win].linebreak = true
  vim.wo[S.result_win].scrolloff = 0
  vim.wo[S.result_win].statusline = ' Tab 方向   Esc/Ctrl+C 查询   k/j 历史   Ctrl+D/U 滚动   p 发音   :q 隐藏'
  vim.bo[S.result_buf].modifiable = false
end

function M.statusline()
  local mode = vim.fn.mode(1):sub(1, 1) == 'i' and 'INSERT' or 'NORMAL'
  local position = tostring(selected_index() or 0) .. '/' .. tostring(#S.entries)
  local message = (S.message or 'Translator'):gsub('%%', '%%%%'):gsub('[\r\n]', ' ')
  return ' ' .. mode .. '  ' .. direction_label(S.direction) .. '  ' .. position .. ' │ ' .. message
end

function M.setup()
  if S.initialized then return M end
  _G.TranslatorStatusline = M.statusline
  vim.opt.title = true
  vim.opt.titlestring = 'Translator'
  vim.opt.hidden = true
  vim.opt.laststatus = 2
  vim.opt.showmode = false
  vim.opt.showcmd = false
  vim.opt.cmdheight = 1
  vim.opt.splitbelow = true
  vim.opt.shadafile = 'NONE'
  vim.opt.undofile = false
  vim.opt.backup = false
  vim.opt.writebackup = false
  vim.opt.winminheight = 0
  vim.opt.mouse = 'a'
  make_layout()
  local response, err = request({ op = 'load' })
  local saved = {}
  if response then
    S.entries = response.entries or {}
    S.config = response.config or {}
    saved = response.state or {}
  end
  -- The draft's direction is independent of the last rendered history entry.
  S.direction = direction(saved.direction)
  S.selected_id = saved.selected_id
  if not selected_entry() then S.selected_id = S.entries[1] and S.entries[1].id or nil end
  local entry = selected_entry()
  set_input(saved.draft ~= nil and saved.draft or (entry and entry.text or ''), saved.cursor or 0)
  render(entry, saved.result_scroll)
  S.initialized = true
  status(err or 'Tab 方向 · k 更早 · j 更新 · Esc/Ctrl+C 查询 · :q 隐藏')

  map('n', 'k', function() M.history(1) end)
  map('n', 'j', function() M.history(-1) end)
  map('n', 'p', function() M.pronounce(false) end)
  map({ 'n', 'i' }, '<Tab>', M.toggle_direction)
  map({ 'n', 'i' }, '<Esc>', M.submit)
  map({ 'n', 'i' }, '<C-c>', M.submit)
  map({ 'n', 'i' }, '<CR>', M.submit)
  map({ 'n', 'i' }, '<C-d>', function() M.scroll(1) end)
  map({ 'n', 'i' }, '<C-u>', function() M.scroll(-1) end)
  -- Exact :q / :q! only; :qa!, :quit, and other commands keep native meaning.
  vim.keymap.set('c', '<CR>', function()
    if vim.fn.getcmdtype() == ':' and vim.fn.getcmdline():match('^%s*q!?%s*$') then
      return '<C-u>lua require("translator").hide()<CR>'
    end
    return '<CR>'
  end, { expr = true, replace_keycodes = true })

  local group = api.nvim_create_augroup('TranslatorUI', { clear = true })
  api.nvim_create_autocmd({ 'TextChanged', 'TextChangedI', 'TextChangedP' }, {
    group = group, buffer = S.input_buf, callback = join_input_lines,
  })
  api.nvim_create_autocmd({ 'CursorMoved', 'CursorMovedI', 'InsertLeave' }, {
    group = group, buffer = S.input_buf, callback = queue_save,
  })
  api.nvim_create_autocmd('InsertEnter', { group = group, buffer = S.input_buf, callback = function()
    if not S.visible then capture_im(); S.visible = true end
    set_edit_im(true)
    -- Editing cancels UI ownership of an in-flight result, even before TextChanged.
    invalidate()
  end })
  api.nvim_create_autocmd('InsertLeave', { group = group, buffer = S.input_buf, callback = function()
    -- Navigation always uses English, even when the next query is ZH→EN.
    if S.visible then set_edit_im(false) end
  end })
  api.nvim_create_autocmd('WinEnter', { group = group, callback = function()
    if api.nvim_get_current_win() == S.result_win then
      vim.schedule(function()
        if valid_win(S.input_win) then api.nvim_set_current_win(S.input_win) end
      end)
    end
  end })
  api.nvim_create_autocmd('VimResized', { group = group, callback = function()
    if valid_win(S.input_win) then api.nvim_win_set_height(S.input_win, 1) end
  end })
  api.nvim_create_autocmd('VimLeavePre', { group = group, callback = M.before_hide })

  local original_paste = vim.paste
  vim.paste = function(lines, phase)
    if api.nvim_get_current_buf() == S.input_buf then
      local joined = table.concat(lines, ' '):gsub('%s+', ' ')
      return original_paste({ joined }, phase)
    end
    return original_paste(lines, phase)
  end
  return M
end

return M

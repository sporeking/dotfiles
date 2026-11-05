-- Kitty scrollback snapshot only: no editing, plugins, swap, or persistent history.
vim.opt.clipboard = "unnamedplus"
vim.opt.number = false
vim.opt.relativenumber = false
vim.opt.wrap = true
vim.opt.swapfile = false
vim.opt.laststatus = 2
vim.opt.statusline = " COPY  v/V/C-v select | y clipboard | / search | q return %=%l/%L "
vim.keymap.set("n", "q", "<Cmd>qa!<CR>", { silent = true })

vim.api.nvim_create_autocmd("StdinReadPost", {
  once = true,
  callback = function()
    local lines = vim.api.nvim_buf_get_lines(0, 0, -1, false)
    for i, line in ipairs(lines) do
      lines[i] = line
        :gsub("\27%][^\7\27]*\7", "") -- OSC terminated by BEL
        :gsub("\27%][^\27]*\27\\", "") -- OSC terminated by ST (including hyperlinks)
        :gsub("\27%[[0-?]*[ -/]*[@-~]", "") -- CSI (including colors)
        :gsub("\r", "")
    end
    vim.bo.modifiable = true
    vim.api.nvim_buf_set_lines(0, 0, -1, false, lines)
    vim.bo.buftype = "nofile"
    vim.bo.bufhidden = "wipe"
    vim.bo.modified = false
    vim.bo.modifiable = false
  end,
})

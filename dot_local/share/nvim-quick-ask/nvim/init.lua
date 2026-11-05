-- Dedicated config; never load the user's Neovim config or the translator app.
local source = debug.getinfo(1, 'S').source:sub(2)
local config_dir = vim.fs.dirname(vim.fn.fnamemodify(source, ':p'))
vim.opt.runtimepath:prepend(config_dir)
vim.env.QUICK_ASK_ROOT = vim.env.QUICK_ASK_ROOT or vim.fs.dirname(config_dir)
require('quick_ask').setup()

-- A dedicated init: the launcher owns NVIM_APPNAME and the listening socket.
-- Resolve Lua relative to this file, regardless of $PWD or XDG config paths.
local source = debug.getinfo(1, 'S').source:sub(2)
local config_dir = vim.fs.dirname(vim.fn.fnamemodify(source, ':p'))
vim.opt.runtimepath:prepend(config_dir)
vim.env.TRANSLATOR_ROOT = vim.env.TRANSLATOR_ROOT or vim.fs.dirname(config_dir)
require('translator').setup()

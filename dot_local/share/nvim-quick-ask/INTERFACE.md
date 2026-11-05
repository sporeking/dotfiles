# Native Pi floating-window control

The application runs native interactive Pi directly in a dedicated Kitty window. There is no custom agent RPC protocol, editor process, history index, or SQLite mutation. Pi owns the model, tools, extensions, queue, terminal rendering and JSONL session lifecycle.

## Launcher

`python3 bin/quick-ask {start,show,hide,toggle,status,stop}`

- `start`: create one hidden window, or reuse it.
- `show`: create/reuse, position on the actual monitor and focus.
- `hide`: hide only; preserve Pi and any active task.
- `toggle`: alternate show/hide.
- `status`: JSON `{running:boolean,visible:boolean,socket:string}`; socket is Kitty's dedicated Unix control socket, not an agent protocol endpoint.
- `stop`: request Pi's native SIGTERM shutdown through that socket, then close the dedicated window and clean its owned descendants within bounded waits.

The established class `nvim-quick-ask`, special workspace `quick-ask` and `Alt+A` binding remain stable for existing Hyprland integration. Kitty inherits normal font/color configuration; only this window's command/session and remote-control/close settings are overridden.

Launch argv: `pi --tui-mode fullscreen --session-dir <data>/sessions --continue --extension <package>/extensions/vim-navigation.ts`. Current Pi settings and installed extensions load normally. Models, thinking levels, system prompts and tool lists are not overridden by this wrapper. Workspace is a starting directory with ordinary user permissions, not a sandbox.

## Configuration and private data

- `QUICK_ASK_CONFIG`: TOML path, default `~/.config/nvim-quick-ask/config.toml`; only `[pi].command` and `[agent].workspace` are read.
- `QUICK_ASK_DB`: legacy DB path, default `~/.local/share/nvim-quick-ask/history.sqlite3`. Only its parent determines the native `sessions/` directory; the launcher never opens/writes SQLite.
- `QUICK_ASK_RUNTIME_DIR`: private Kitty socket, control lock and log directory. Default `$XDG_RUNTIME_DIR/nvim-quick-ask`.
- Pi authentication/settings are resolved by Pi as in a regular terminal invocation.

Native agent JSONL files remain usable through `--continue` and `/resume`; old single-turn SQLite data is retained as an archive. Hidden-window drafts remain in Pi memory. Persisted conversation recovery follows Pi's native rules.

## Navigation extension

The explicit extension subclasses Pi CustomEditor only. Insert delegates keys to Pi. First Escape enters Normal; j/k call native line scrolling, Ctrl+U/D half-page scrolling, gg/G top/bottom, and `/` native transcript search. i/a return to Insert at the transcript end, preserving editor text. A second Escape delegates native cancel/abort. Non-navigation control sequences continue through Pi's normal handlers. Selectors/overlays retain native input focus.

The extension does not render another chat view, alter tools/model settings, or store another history. It is loaded for this launcher only and does not modify global Pi keybindings or extension settings.

# Internal interface

Python backend runs from project root: `python3 -m translator_backend`.
One JSON request on stdin, one JSON response on stdout, then exit. Never log credentials.
Success: `{"ok":true,...}`. Failure: `{"ok":false,"error":"human-readable message"}`.

Requests:
- `{"op":"load"}` -> `{"ok":true,"entries":[ENTRY newest first],"state":STATE,"config":PUBLIC_CONFIG}`. All history must remain browseable.
- `{"op":"lookup","text":"...","force":false}` -> `{"ok":true,"entry":ENTRY,"cached":false}`. Normalize whitespace. Dictionary-first; sentence/unknown expression uses LLM. Save only successful results. Exact existing successful query returns cached record unless force; browsing must not alter chronology.
- `{"op":"save_state","state":STATE}` -> `{"ok":true}`. Replace UI state, never entries. SQLite busy timeout for concurrent lookups/state saves.
- `{"op":"config"}` -> `{"ok":true,"config":PUBLIC_CONFIG}` (no secrets).

ENTRY:
```
{"id":1,"text":"take for granted","created_at":"ISO timestamp",
 "result":{"kind":"dictionary|translation","source":"Youdao|protocol/model",
 "translation":"Chinese sentence or empty",
 "phonetics":{"us":"...","uk":"..."},
 "meanings":[{"pos":"v.","definitions":["义项一","义项二"]}],
 "examples":[{"en":"...","zh":"...","source":"dictionary|generated"}],
 "audio":{"us":"https://...","uk":"https://..."}}}
```
STATE: `{"selected_id":1,"draft":"...","cursor":0,"result_scroll":1}`. Cursor is zero-based UTF-8 byte column. Draft may differ from selected entry text (unsubmitted edit).
PUBLIC_CONFIG: `{"auto_pronounce":true,"accent":"us","examples":true,"input_method":true}`.

Config: `$TRANSLATOR_CONFIG`, default `$XDG_CONFIG_HOME/nvim-translator/config.toml`.
Database: `$TRANSLATOR_DB`, default `$XDG_DATA_HOME/nvim-translator/history.sqlite3`.
Standard XDG fallbacks are ~/.config and ~/.local/share.
TOML sections:
```
[llm]
protocol = "openai" # openai | openai-responses | anthropic | gemini
base_url = "https://api.openai.com/v1" # protocol API root, not endpoint
model = "gpt-4.1-mini"
api_key_env = "TRANSLATOR_API_KEY"
timeout = 45
[dictionary]
enabled = true
timeout = 8
[ui]
auto_pronounce = true
accent = "us"
examples = true
input_method = true
```
No LLM request until provider model AND credential are configured. No implicit paid fallback. Dictionary may work without LLM config. Prefer environment credentials; optional `api_key` in private local config.

Neovim dedicated init: `nvim/init.lua`; module `nvim/lua/translator/init.lua`.
Launcher sets TRANSLATOR_ROOT, NVIM_APPNAME=nvim-translator, PYTHONPATH includes root, TRANSLATOR_CTL as absolute launcher path, distinct --listen socket. Init must load local Lua without external plugins.
Launcher: `python3 /absolute/root/bin/translator {start|toggle|show|hide|status|stop|config}`. `hide` is idempotent (never toggles hidden workspace open); `start` launches silently on special:translator. `show` may notify Neovim via `--remote-expr` / RPC to call `require('translator').on_show()`; method restores input focus, Normal mode, captures previous IM state. `hide` request from UI persists state before invoking launcher, restores prior IM.
`:q` command-line Enter in dedicated UI is intercepted to hide, while `:qa!` truly exits. Never change ordinary Neovim configuration.

# Quick Ask interface

## Processes and isolation

- Launcher: `python3 bin/quick-ask {start,show,hide,toggle,status,stop,config}`.
- App-id / NVIM_APPNAME: `nvim-quick-ask`; workspace: `special:quick-ask`.
- Neovim module: `quick_ask`; root/launcher: `QUICK_ASK_ROOT`, `QUICK_ASK_CTL`.
- Socket: `$XDG_RUNTIME_DIR/nvim-quick-ask/nvim.sock`; override parent via `QUICK_ASK_RUNTIME_DIR`.
- Backend: `python3 -m quick_ask_backend`, one JSON request on stdin until EOF.
- Configuration: `QUICK_ASK_CONFIG` or `~/.config/nvim-quick-ask/config.toml`.
- Database: `QUICK_ASK_DB` or `~/.local/share/nvim-quick-ask/history.sqlite3`.

The launcher holds a control lock, uses a headless Neovim RPC client and targets only the dedicated app-id. `start` stays hidden. `show` prepares the editor, shows the special workspace, reads its actual monitor, resizes and centers in the rotated/scaled logical work area with reserved margins, then requests focus. `hide` first requires successful state save. `stop` waits for the dedicated window to exit.

## Single-response requests

```json
{"op":"load"}
{"op":"save_state","state":{"selected_id":null,"draft":"","cursor":[1,0],"result_scroll":1,"web_search":false,"history_query":""}}
{"op":"search","query":"keyword"}
```

`load` returns `{ok:true,entries:[...],state:{...},config:{input_method:true}}`; entries include the entire history, newest first. `save_state` returns `{ok:true}`. `search` returns `{ok:true,entries:[...]}`, applying Unicode casefold and literal substring matching to the full question and answer, and attaches `search_snippet` to each hit. Empty keyword returns every entry. Errors use `{ok:false,error:"message"}` and nonzero exit.

State cursor is `[one_based_row, zero_based_UTF8_byte_column]`. Entry IDs are UUID strings. The history picker is transient; restart restores the draft and selected answer rather than opening a picker.

## Streaming request

```json
{"op":"ask","question":"HTTP是什么？","web_search":false}
```

Stdout is UTF-8 NDJSON with LF-terminated records. Events:

```json
{"event":"status","text":"正在回答…"}
{"event":"delta","text":"HTTP 是"}
{"event":"done","entry":{"id":"uuid","question":"HTTP是什么？","answer":"HTTP 是……","web_search":false,"sources":[],"created_at":"ISO-8601"}}
```

Failure terminal: `{event:"error",error:"message"}`. A completed ask has one terminal event. Process cancellation can interrupt the stream. Only a successful `done` is saved to history. Optional entry fields `provider` and `model` describe the actual Pi response. Source objects have `title` and `url`, extracted from successful search tool output, not from invented answer citations. Web mode requires at least one valid HTTP(S) source.

Pi owns service credentials. The wrapper suppresses raw provider diagnostics and reasoning events. A zero process exit alone is insufficient: the final assistant must have `stopReason:stop`, nonempty text, no pending tool call, and Pi must settle without abort. Repeating a question performs a fresh request. SIGINT/SIGTERM, timeout and errors terminate the owned Pi process group and leave no partial history entry.

The UI buffers stdout bytes until complete JSON lines, throttles text rendering and tracks request generation plus input changedtick. Edits, mode changes, history, cancel and hide invalidate old callbacks before sending SIGTERM. An old response cannot overwrite a newer draft or chosen historical answer.

## Editor lifecycle and keys

`require('quick_ask').on_show()` and `.before_hide()` return `1` on success, `0` if initialization/save fails. The editor preserves multiline draft, byte cursor, selected answer, answer viewport, mode and history keyword. Normal `/` and `:History` both search all history; Enter in the picker restores a record without querying Pi. Tab changes the next request mode. Enter submits, Ctrl+C submits/cancels, Esc leaves Insert or exits a history picker. Exact `:q` / `:q!` save/hide; `:qa!` exits.

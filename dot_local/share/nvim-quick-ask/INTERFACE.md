# Quick Ask agent interface

## Runtime

The floating Vim app keeps the existing app-id, launcher and socket. One `python3 -m quick_ask_backend serve` subprocess stays attached to the editor; its stdin/stdout are LF-delimited UTF-8 JSON. It owns one native persistent `pi --mode rpc` runtime for the active conversation. Pi performs the agent loop, tools, retries and compaction, and owns native JSONL session persistence. Hiding the window and editing the next draft do not cancel the agent. Quitting the editor shuts the runtime down.

Configuration adds `[agent] workspace = "~/agent-workspace"`. It is the cwd for new sessions, not a sandbox. Native `read,bash,edit,write,grep,find,ls` run as the normal user. Existing optional web search remains available through the thin extension. `web_search` means this tool is enabled, not network isolation or a mandatory search. Tool selection can change only while idle, by restarting/resuming the same native session. No browser/GUI control is added.

Session files live privately under `db_path().parent / "sessions"`; absolute paths returned by Pi are indexed in SQLite. Old one-shot history is retained. UI state adds nullable `session_id` while retaining the old `selected_id`, draft, UTF-8 byte cursor, result scroll, web_search and history_query.

## Existing single-response API

`python3 -m quick_ask_backend` still accepts one JSON stdin object. Preserve `load`, `save_state`, `search`, and legacy `ask` compatibility.

- `load`: `{ok:true,entries:[legacy entries],sessions:[session metadata],state:{...},config:{input_method,workspace}}`.
- `save_state`: `{op:"save_state",state:{...}}` -> `{ok:true}`.
- `search`: `{op:"search",query:"literal keyword"}` -> `{ok:true,entries:[session or legacy hits]}`; Unicode casefold literal matching over full user/assistant history, including precompaction entries. Empty keyword lists all. Session results are `{kind:"session",id,title,question:title,cwd,path,web_search,updated_at,search_snippet}`. Legacy hits add `kind:"legacy"` to their existing shape.
- Session metadata: `{id,path,cwd,title,web_search,updated_at}`; id is native Pi sessionId. Cwd is restored from the native session header, not changed by Vim `:cd`.

## Persistent serve requests

Each object may include a client `id`; responses echo it. All protocol output is NDJSON and may be split at arbitrary byte boundaries.

```json
{"id":1,"op":"open","session_id":null,"web_search":false}
{"id":2,"op":"prompt","question":"Read the file and report its lines","web_search":false}
{"id":3,"op":"prompt","question":"Now append one line","web_search":false}
{"id":4,"op":"abort"}
{"id":5,"op":"new","web_search":false}
{"id":6,"op":"open","session_id":"native-uuid","web_search":false}
{"id":7,"op":"mode","web_search":true}
{"id":8,"op":"shutdown"}
```

`open` with null creates a session. `new` always creates a fresh session in the configured workspace. `open` by id resumes the indexed absolute native file. Neither new/open/mode may interrupt an executing task: reject with a friendly error while busy. `prompt` continues the current session (create one if necessary); if busy it uses native follow-up queuing. `abort` clears the native pending queue before aborting, returns cleared texts, and keeps the runtime/conversation available. `shutdown` / stdin EOF gracefully stop owned work, with bounded process-group cleanup. Mode switches preserve native context; prompt must not implicitly change tools while busy.

## Server events

- `{event:"snapshot",id?,session:{metadata},messages:[public message],loading:boolean,web_search:boolean,model?:string,provider?:string,thinking?:string}`: authoritative current conversation after open/new/mode and settlement. Use it to replace transcript, never input draft. Native message history may compact; search indexes full JSONL user/assistant text.
- `{event:"accepted",id,disposition:"started"|"queued"|"handled"}`: prompt accepted. Clear the submitted draft only if it has not changed since submission. This is not completion.
- `{event:"message_start",role:"assistant"}`: new streaming assistant message.
- `{event:"delta",text:"..."}`: append assistant text, never thinking.
- `{event:"message_end",message:public message}`: authoritative user/assistant message. User messages append once; assistant replaces its streaming placeholder. ToolResult message_end need not be forwarded, since correlated tool events already render it.
- `{event:"tool_start"|"tool_update"|"tool_end",tool_call_id,name,args?:object,text?:string,is_error?:boolean}`: correlate by id. Tool updates are cumulative snapshots and REPLACE previous output, not append. Render brief command/path, progress and a bounded output preview; retain complete native logs.
- `{event:"status",text:"..."}`: compact/retry/progress.
- `{event:"settled",aborted:boolean}`: native `agent_settled` boundary, not `agent_end`. An authoritative snapshot follows. Keep conversation and failed/aborted tool history.
- `{event:"queue_cleared",messages:["pending prompt",...]}`: restore cleared pending text to the draft without discarding an already edited draft.
- `{event:"error",id?,error:"friendly message"}`: operation/provider failure; do not expose raw provider diagnostics. Recoverable errors leave the server alive.
- `{event:"closed"}` on orderly shutdown.

Public messages: `{role:"user"|"assistant"|"tool",text:string,tool_call_id?:string,name?:string,args?:object,is_error?:boolean}`. Normalize native content to text and correlated tool calls/results; omit thought blocks and raw provider diagnostics. Snapshots may omit empty assistant text associated only with tool calls, and show those calls through tool rows instead.

Unexpected `extension_ui_request` dialogs must receive a cancelled response so the runtime cannot hang. This release adds no confirmation extension or extra per-command approval flow. Pi's `--no-approve` is project-resource trust, not a filesystem sandbox or a per-tool permission switch.

## Vim interaction

- Enter submits to this conversation; while busy queues a follow-up. Ctrl+C cancels task/queue; idle Ctrl+C submits.
- Editing preserves active work and streaming. Accepted prompt clears only its own unchanged draft.
- Tab toggles dedicated search availability while idle; busy toggle reports that it must wait, without stopping work. Preserve n/i mode and byte cursor.
- `:NewChat` creates a clean native conversation; `:History` / Normal `/` searches saved sessions plus old single-turn records. j/k/Enter chooses; Esc returns without losing draft. Switching sessions requires idle.
- Old record selection displays its old answer and restores its question; Enter starts a NEW agent conversation to re-ask, retaining old historical data. It must not silently send it into an unrelated active conversation.
- `:q/:q!` saves/hides and keeps tasks running. `:qa!` saves, stops owned work and exits. Keep existing input-method lifecycle and native multiline editing. Expose current title/cwd/task state in compact UI status, and a chronological user/assistant/tool transcript below.

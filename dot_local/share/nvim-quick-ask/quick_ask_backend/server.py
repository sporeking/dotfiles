"""Persistent UI NDJSON server; serialize operations, never block the RPC reader."""

import json
import os
from pathlib import Path
import queue
import signal
import sys
import threading

from .agent import Runtime
from .messages import PREVIEW_LIMIT, public_messages, text_content
from .pi import PiError


class Server:
    def __init__(self, config, store, emit):
        self.config, self.store, self.emit = config, store, emit
        self.inbox = queue.Queue()
        self.stopping = threading.Event()
        self.runtime = None
        self.metadata = None
        self.web_search = False
        self.failed = False

    def reply(self, event, request=None, **values):
        value = {"event": event, **values}
        if request is not None and "id" in request:
            value["id"] = request["id"]
        self.emit(value)

    def _event(self, token, record):
        self.inbox.put(("native", (token, record)))

    def snapshot(self, request=None):
        state = self.runtime.request("get_state")
        messages = self.runtime.request("get_messages").get("messages", [])
        path, session_id = state.get("sessionFile"), state.get("sessionId")
        if not isinstance(path, str) or not Path(path).is_absolute() or not isinstance(session_id, str):
            raise PiError("Pi 未提供可恢复的会话信息")
        metadata = self.store.index_session(path, self.web_search, session_id,
                                            self.metadata["cwd"] if self.metadata else str(Path(self.config.workspace).expanduser().resolve()))
        if metadata is None:
            raise PiError("Pi 会话信息不完整")
        self.metadata = metadata
        loading = bool(state.get("isStreaming") or state.get("isCompacting") or state.get("pendingMessageCount"))
        values = {"session": metadata, "messages": public_messages(messages),
                  "loading": loading, "web_search": self.web_search}
        model = state.get("model")
        if isinstance(model, dict):
            for source, target in (("id", "model"), ("provider", "provider")):
                if isinstance(model.get(source), str):
                    values[target] = model[source]
        if isinstance(state.get("thinkingLevel"), str):
            values["thinking"] = state["thinkingLevel"]
        self.reply("snapshot", request, **values)

    def idle(self):
        if self.runtime is not None and self.runtime.busy:
            raise PiError("任务正在执行；请等待完成或先取消")

    def open(self, session_id, web_search, request):
        self.idle()
        metadata = self.store.session(session_id) if session_id else None
        if metadata and not Path(metadata["path"]).is_file():
            raise PiError("会话文件不可用，请新建会话")
        cwd = Path(metadata["cwd"] if metadata else self.config.workspace).expanduser().resolve()
        if metadata is None:
            cwd.mkdir(parents=True, exist_ok=True)
        # Validate resources before disposing the current runtime.
        from .agent import agent_command
        agent_command(self.config, web_search, self.store.session_dir, metadata["path"] if metadata else None)
        self.close_runtime()
        self.metadata, self.web_search, self.failed = metadata, web_search, False
        self.runtime = Runtime(self.config, cwd, self.store.session_dir, web_search, self._event,
                               metadata["path"] if metadata else None, self.stopping)
        self.snapshot(request)

    def close_runtime(self):
        if self.runtime is not None:
            self.runtime.close()
            self.runtime = None
            if self.metadata:
                self.store.index_session(self.metadata["path"], self.web_search,
                                         self.metadata["id"], self.metadata["cwd"])

    def handle(self, request):
        if not isinstance(request, dict):
            raise ValueError("请求必须是 JSON 对象")
        op = request.get("op", request.get("action"))
        web_search = request.get("web_search", self.web_search)
        if not isinstance(web_search, bool):
            raise ValueError("web_search 必须是布尔值")
        if op in ("open", "new"):
            session_id = request.get("session_id") if op == "open" else None
            if session_id is not None and not isinstance(session_id, str):
                raise ValueError("session_id 必须是字符串或 null")
            self.open(session_id, web_search, request)
        elif op == "mode":
            self.idle()
            if self.runtime is not None and web_search == self.web_search:
                self.snapshot(request)
            else:
                session_id = self.metadata["id"] if self.metadata and Path(self.metadata["path"]).is_file() else None
                self.open(session_id, web_search, request)
        elif op == "prompt":
            question = request.get("question")
            if not isinstance(question, str) or not question.strip():
                raise ValueError("问题不能为空")
            if self.runtime is None:
                self.open(None, web_search, None)
            elif web_search != self.web_search:
                # Tools are explicit; a submit must never implicitly restart active work.
                raise PiError("工具模式已改变，请在空闲时先切换模式")
            was_busy = self.runtime.busy
            self.runtime.busy = True  # Acceptance may precede native agent_start.
            try:
                result = self.runtime.request("prompt", message=question, streamingBehavior="followUp")
            except PiError:
                try:
                    self.runtime.request("get_state")
                except PiError:
                    # Keep the reader's latest busy state. A lost acceptance
                    # response must not let open/mode kill potentially live work.
                    pass
                raise
            disposition = result.get("disposition")
            if disposition not in ("started", "queued", "handled"):
                raise PiError("Pi 返回了无效的提交状态")
            if disposition == "handled":
                self.runtime.request("get_state")
            self.reply("accepted", request, disposition=disposition)
            if disposition == "handled" and not was_busy:
                self.snapshot()
        elif op == "abort":
            if self.runtime:
                cleared = self.runtime.request("clear_queue")
                messages = [text for key in ("steering", "followUp") for text in cleared.get(key, []) if isinstance(text, str)]
                self.reply("queue_cleared", request, messages=messages)
                self.runtime.request("abort")
            else:
                self.reply("queue_cleared", request, messages=[])
        elif op == "shutdown":
            return False
        elif op == "load":
            self.emit({"ok": True, **({"id": request["id"]} if "id" in request else {}),
                       "entries": self.store.entries(), "sessions": self.store.sessions(),
                       "state": self.store.load_state(), "config": {
                           "input_method": self.config.input_method,
                           "workspace": str(Path(self.config.workspace).expanduser().resolve())}})
        elif op in ("search", "save_state"):
            value = {"ok": True, **({"id": request["id"]} if "id" in request else {})}
            if op == "search":
                value["entries"] = self.store.search(request.get("query", ""))
            else:
                self.store.save_state(request.get("state"))
            self.emit(value)
        else:
            raise ValueError("未知请求")
        return True

    def native(self, token, record):
        if self.runtime is None or token != self.runtime.token:
            return  # A previous runtime's queued events cannot modify the new session.
        kind = record.get("type")
        if kind == "runtime_exit":
            self.reply("error", error=record["error"])
            self.close_runtime()
        elif kind == "message_start" and record.get("message", {}).get("role") == "assistant":
            self.reply("message_start", role="assistant")
        elif kind == "message_update":
            update = record.get("assistantMessageEvent", {})
            if update.get("type") == "text_delta" and isinstance(update.get("delta"), str):
                self.reply("delta", text=update["delta"])
        elif kind == "message_end":
            message = record.get("message", {})
            if message.get("role") in ("user", "assistant"):
                normalized = public_messages([message])
                public = next((row for row in normalized if row["role"] == message["role"]),
                              {"role": message["role"], "text": ""})
                self.reply("message_end", message=public)
                if message["role"] == "assistant":
                    self.failed = message.get("stopReason") == "error"
        elif kind in ("tool_execution_start", "tool_execution_update", "tool_execution_end"):
            values = {"tool_call_id": str(record.get("toolCallId", "")),
                      "name": str(record.get("toolName", "tool"))}
            if isinstance(record.get("args"), dict):
                values["args"] = record["args"]
            if kind != "tool_execution_start":
                result = record.get("partialResult" if kind == "tool_execution_update" else "result", {})
                values["text"] = text_content(result.get("content") if isinstance(result, dict) else None)[:PREVIEW_LIMIT]
            if kind == "tool_execution_end":
                values["is_error"] = bool(record.get("isError"))
            self.reply({"tool_execution_start": "tool_start", "tool_execution_update": "tool_update",
                        "tool_execution_end": "tool_end"}[kind], **values)
        elif kind == "agent_settled":
            if self.failed and not record.get("aborted"):
                self.reply("error", error="Pi 未成功完成任务，请检查配置或稍后重试")
            self.reply("settled", aborted=bool(record.get("aborted")))
            self.snapshot()
        elif kind in ("auto_retry_start", "summarization_retry_scheduled", "summarization_retry_attempt_start"):
            self.reply("status", text="Pi 正在重试…")
        elif kind in ("compaction_start", "auto_compaction_start"):
            self.reply("status", text="Pi 正在整理上下文…")
        elif kind in ("compaction_end", "auto_retry_end", "summarization_retry_finished"):
            self.reply("status", text="Pi 正在继续任务…")
        elif kind == "extension_error":
            self.reply("error", error="Pi 扩展处理失败")

    def run(self, stream):
        def read_requests():
            # Raw fd reads avoid a daemon holding BufferedReader's lock during
            # Python finalization when an explicit shutdown leaves stdin open.
            pending = b""
            try:
                while True:
                    chunk = os.read(stream.fileno(), 65536)
                    if not chunk:
                        break
                    pending += chunk
                    while b"\n" in pending:
                        line, pending = pending.split(b"\n", 1)
                        try:
                            request = json.loads(line)
                        except (ValueError, UnicodeError):
                            request = {"op": "invalid"}
                        if isinstance(request, dict) and request.get("op", request.get("action")) == "shutdown":
                            self.stopping.set()
                        self.inbox.put(("request", request))
                if pending.strip():
                    self.inbox.put(("request", {"op": "invalid"}))
            finally:
                self.stopping.set()
                self.inbox.put(("request", {"op": "shutdown"}))

        threading.Thread(target=read_requests, daemon=True).start()
        previous = {}
        def stop_signal(*_):
            self.stopping.set()
            self.inbox.put(("request", {"op": "shutdown"}))
        for signum in (signal.SIGINT, signal.SIGTERM):
            previous[signum] = signal.signal(signum, stop_signal)
        shutdown_request = None
        try:
            while True:
                kind, value = self.inbox.get()
                try:
                    if kind == "request":
                        if not self.handle(value):
                            shutdown_request = value
                            break
                    else:
                        self.native(*value)
                except (ValueError, OSError, PiError) as error:
                    # OS errors can contain paths, but never pass unrecognized diagnostic text.
                    text = str(error) if isinstance(error, (ValueError, PiError)) else "无法访问工作目录或会话文件"
                    self.reply("error", value if kind == "request" and isinstance(value, dict) else None, error=text)
                except Exception:
                    self.reply("error", value if kind == "request" and isinstance(value, dict) else None, error="后端处理失败")
        finally:
            self.close_runtime()
            for signum, handler in previous.items():
                signal.signal(signum, handler)
        self.reply("closed", shutdown_request)
        return 0


def serve(config, store, emit):
    return Server(config, store, emit).run(sys.stdin.buffer)

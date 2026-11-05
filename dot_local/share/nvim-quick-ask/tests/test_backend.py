"""Isolated Pi protocol tests. Never load user credentials or call a model."""

import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import tempfile
import time
import unittest

from quick_ask_backend.config import Config, load_config
from quick_ask_backend.pi import Events, command_args, PiError
from quick_ask_backend.store import Store, DEFAULT_STATE


ROOT = Path(__file__).resolve().parents[1]
FAKE_PI = r'''#!/usr/bin/env python3
import json, os, pathlib, subprocess, sys, time
scenario = json.loads(pathlib.Path(os.environ["FAKE_SCENARIO"]).read_text())
question = sys.stdin.read()
observed = {"argv": sys.argv[1:], "cwd": os.getcwd(), "files": os.listdir('.'), "stdin": question}
if scenario.get("child"):
    child = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(90)"])
    observed["child"] = child.pid
pathlib.Path(os.environ["FAKE_OBSERVED"]).write_text(json.dumps(observed))
if scenario.get("stderr"):
    sys.stderr.write("private-diagnostic" * 10000)
    sys.stderr.flush()
for event in scenario.get("events", []):
    data = (json.dumps(event, ensure_ascii=False) + "\n").encode()
    # Even multi-byte Chinese characters may cross reads.
    for offset in range(0, len(data), 7):
        os.write(sys.stdout.fileno(), data[offset:offset+7])
if scenario.get("raw"):
    os.write(sys.stdout.fileno(), scenario["raw"].encode())
if scenario.get("hang"):
    time.sleep(90)
sys.exit(scenario.get("exit", 0))
'''


def final(text="权威最终答案", reason="stop", **extra):
    return {"type": "message_end", "message": {
        "role": "assistant", "content": [{"type": "text", "text": text}],
        "stopReason": reason, "provider": "mock", "model": "mock-model", **extra}}


def delta(text="流式片段"):
    return {"type": "message_update", "assistantMessageEvent": {"type": "text_delta", "delta": text}}


def settled(aborted=False):
    return {"type": "agent_settled", "aborted": aborted}


def is_running(pid):
    try:
        stat = Path(f"/proc/{pid}/stat").read_text()
    except FileNotFoundError:
        return False
    return stat.split(") ", 1)[1][0] != "Z"


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="quick-ask-test-")
        self.directory = Path(self.temp.name)
        self.command = self.directory / "fake-pi"
        self.command.write_text(FAKE_PI)
        self.command.chmod(0o700)
        self.config = self.directory / "config.toml"
        self.scenario = self.directory / "scenario.json"
        self.observed = self.directory / "observed.json"
        self.db = self.directory / "history.sqlite3"
        self.environment = {**os.environ, "QUICK_ASK_CONFIG": str(self.config), "QUICK_ASK_DB": str(self.db),
                            "FAKE_SCENARIO": str(self.scenario), "FAKE_OBSERVED": str(self.observed),
                            "PYTHONPATH": str(ROOT)}
        self.write_config()
        self.set_scenario([delta(), final(), settled()])

    def tearDown(self):
        self.temp.cleanup()

    def write_config(self, timeout=5, extra="", ui=""):
        self.config.write_text(f'[pi]\ncommand={json.dumps(str(self.command))}\ntimeout={timeout}\n' + extra + '\n[ui]\n' + ui)

    def set_scenario(self, events, **extra):
        self.scenario.write_text(json.dumps({"events": events, **extra}, ensure_ascii=False))

    def request(self, request):
        process = subprocess.run([sys.executable, "-m", "quick_ask_backend"], cwd=ROOT, env=self.environment,
                                 input=json.dumps(request, ensure_ascii=False), text=True, capture_output=True, timeout=10)
        output = [json.loads(line) for line in process.stdout.split("\n") if line.strip()]
        self.assertEqual(process.stderr, "", process.stderr)
        return process, output

    def ask(self, **extra):
        return self.request({"op": "ask", "question": "问题", **extra})

    def load(self):
        process, output = self.request({"op": "load"})
        self.assertEqual(process.returncode, 0, output)
        return output[0]

    def assert_no_history(self):
        self.assertEqual(self.load()["entries"], [])

    def test_load_default_state_and_ui_config(self):
        loaded = self.load()
        self.assertEqual(loaded["state"], DEFAULT_STATE)
        workspace = str(Path("~/agent-workspace").expanduser().resolve())
        self.assertEqual(loaded["config"], {"input_method": True, "workspace": workspace})
        self.assertEqual(loaded["sessions"], [])
        self.write_config(ui="input_method=false\n")
        self.assertEqual(self.load()["config"], {"input_method": False, "workspace": workspace})

    def test_state_round_trip_preserves_byte_column(self):
        state = {"selected_id": "previous", "session_id": None, "draft": "中文\n草稿", "cursor": [2, 6], "result_scroll": 7,
                 "web_search": True, "history_query": "关键词"}
        process, result = self.request({"op": "save_state", "state": state})
        self.assertEqual(process.returncode, 0, result)
        self.assertEqual(self.load()["state"], state)
        process, result = self.request({"op": "save_state", "state": {"cursor": [0, 4]}})
        self.assertEqual(process.returncode, 1)
        self.assertFalse(result[0]["ok"])
        self.assertEqual(self.load()["state"], state)

    def test_success_uses_authoritative_answer_ignores_thinking_and_never_caches(self):
        self.set_scenario([delta("草稿"), {"type": "message_update", "assistantMessageEvent": {
            "type": "thinking_delta", "delta": "秘密思考"}}, final("答复\u2028含分隔符\n第二行"), settled()], stderr=True)
        for _ in range(2):
            process, events = self.ask(question="  @/etc/passwd\n--model bad  ")
            self.assertEqual(process.returncode, 0, events)
            self.assertEqual(events[-1]["event"], "done")
            self.assertEqual(events[-1]["entry"]["answer"], "答复\u2028含分隔符\n第二行")
            self.assertEqual([e["text"] for e in events if e["event"] == "delta"], ["草稿"])
            self.assertNotIn("秘密思考", json.dumps(events, ensure_ascii=False))
            self.assertEqual(sum(e["event"] in ("done", "error") for e in events), 1)
        entries = self.load()["entries"]
        self.assertEqual(len(entries), 2)
        self.assertNotEqual(entries[0]["id"], entries[1]["id"])
        self.assertEqual(entries[0]["question"], "  @/etc/passwd\n--model bad  ")
        observed = json.loads(self.observed.read_text())
        args = observed["argv"]
        for flag in ("--no-tools", "--no-builtin-tools", "--no-mcp", "--no-context-files", "--no-skills",
                     "--no-extensions", "--no-session", "--no-approve", "--no-prompt-templates", "--no-themes"):
            self.assertIn(flag, args)
        self.assertNotIn("--provider", args)
        self.assertNotIn("--model", args)
        self.assertEqual(observed["files"], [])
        self.assertNotEqual(observed["cwd"], str(ROOT))
        self.assertEqual(observed["stdin"], "  @/etc/passwd\n--model bad  \n")
        self.assertNotIn("@/etc/passwd", args)

    def test_all_failed_final_states_reject_even_exit_zero(self):
        cases = [
            [final(reason="error", errorMessage="401 api_key_expired DO_NOT_ECHO"), settled()],
            [final(reason="aborted"), settled()], [final(reason="length"), settled()],
            [final(reason="toolUse"), settled()], [final("   "), settled()],
            [delta(), settled()], [final()], [final(), settled(True)],
            [final(content=[{"type": "text", "text": "not-final"}, {"type": "toolCall", "name": "web_search"}]), settled()],
        ]
        for events in cases:
            with self.subTest(events=events):
                self.set_scenario(events)
                process, output = self.ask()
                self.assertEqual(process.returncode, 1, output)
                self.assertEqual(output[-1]["event"], "error")
                self.assertNotIn("done", [e["event"] for e in output])
                self.assertNotIn("DO_NOT_ECHO", json.dumps(output))
                self.assert_no_history()

    def test_nonzero_process_rejects_success_looking_events(self):
        self.set_scenario([delta(), final(), settled()], exit=4)
        process, output = self.ask()
        self.assertEqual(process.returncode, 1)
        self.assertEqual(output[-1]["event"], "error")
        self.assert_no_history()

    def test_incomplete_or_malformed_jsonl_is_error(self):
        for raw in ('{"type":"message_end"}', 'not json\n'):
            self.set_scenario([delta()], raw=raw)
            process, output = self.ask()
            self.assertEqual(process.returncode, 1)
            self.assertEqual(output[-1]["event"], "error")
            self.assert_no_history()

    def test_automatic_retry_final_success_and_tool_turn(self):
        self.set_scenario([
            final(reason="error"), {"type": "agent_end", "willRetry": True},
            {"type": "auto_retry_start", "attempt": 1}, {"type": "agent_start"},
            final("Searching", reason="toolUse"), {"type": "agent_end"},
            {"type": "message_start", "message": {"role": "assistant"}}, delta("真实回答"),
            final("真实回答"), settled(),
        ])
        process, events = self.ask()
        self.assertEqual(process.returncode, 0, events)
        self.assertEqual(events[-1]["entry"]["answer"], "真实回答")
        self.assertEqual(len(self.load()["entries"]), 1)

    def test_source_extraction_uses_only_successful_search_results(self):
        core = self.directory / "agent/npm/node_modules/pi-web-access/web-tool-core.ts"
        core.parent.mkdir(parents=True)
        core.write_text("// mock never loaded")
        self.environment["PI_CODING_AGENT_DIR"] = str(self.directory / "agent")
        self.set_scenario([
            {"type": "tool_execution_start", "toolName": "web_search"},
            {"type": "tool_execution_end", "toolName": "web_search", "isError": False, "result": {
                "details": {"sources": [{"title": "真实来源", "url": "https://example.org/a"},
                                          {"title": "拒绝", "url": "file:///tmp/private"}]},
                "structuredContent": {"queries": [{"results": [
                    {"title": "duplicate", "url": "https://example.org/a", "snippet": "摘要"},
                    {"title": "来源二", "url": "https://example.org/b"}]}]}}},
            {"type": "tool_execution_end", "toolName": "other", "result": {"details": {
                "sources": [{"url": "https://invented.invalid"}]}}},
            {"type": "tool_execution_end", "toolName": "web_search", "isError": True, "result": {
                "details": {"sources": [{"url": "https://failed.invalid"}]}}},
            final("依据来源回答 https://not-a-tool-result.invalid"), settled(),
        ])
        process, events = self.ask(web_search=True)
        self.assertEqual(process.returncode, 0, events)
        self.assertEqual(events[-1]["entry"]["sources"], [
            {"title": "真实来源", "url": "https://example.org/a"}, {"title": "来源二", "url": "https://example.org/b"}])
        saved = self.load()["entries"]
        self.assertEqual(len(saved), 1)
        self.assertTrue(saved[0]["web_search"])
        self.assertEqual(saved[0]["sources"], events[-1]["entry"]["sources"])
        args = json.loads(self.observed.read_text())["argv"]
        self.assertEqual(args[args.index("--tools") + 1], "web_search")
        self.assertNotIn("--no-tools", args)
        self.assertTrue(args[args.index("--extension") + 1].endswith("extensions/web-search.ts"))

    def test_web_mode_requires_actual_usable_search_sources(self):
        extension = self.directory / "custom.ts"
        extension.write_text("// mock never loaded")
        self.write_config(extra=f'web_extension={json.dumps(str(extension))}\n')
        cases = {
            "never_called": [],
            "failed": [{"type": "tool_execution_end", "toolName": "web_search", "isError": True,
                        "result": {"details": {"sources": [{"url": "https://failed.invalid"}]}}}],
            "zero_results": [{"type": "tool_execution_end", "toolName": "web_search", "isError": False,
                              "result": {"structuredContent": {"queries": [{"results": []}]}}}],
            "invalid_urls": [{"type": "tool_execution_end", "toolName": "web_search", "isError": False,
                              "result": {"details": {"sources": [{"url": "file:///private"}, {"url": "invalid"}]}}}],
        }
        for name, tool_events in cases.items():
            with self.subTest(name=name):
                self.set_scenario([*tool_events, delta("联网不可用的解释"), final("联网不可用的解释"), settled()])
                process, events = self.ask(web_search=True)
                self.assertEqual(process.returncode, 1, events)
                self.assertEqual(events[-1], {"event": "error", "error": "联网搜索未取得可用来源，请重试或改用普通问答"})
                self.assertEqual([event["text"] for event in events if event["event"] == "delta"], ["联网不可用的解释"])
                self.assertNotIn("done", [event["event"] for event in events])
                self.assert_no_history()

    def test_plain_mode_discards_any_tool_sources(self):
        self.set_scenario([{"type": "tool_execution_end", "toolName": "web_search", "result": {
            "details": {"sources": [{"url": "https://example.org"}]}}}, final(), settled()])
        process, output = self.ask()
        self.assertEqual(process.returncode, 0, output)
        self.assertEqual(output[-1]["entry"]["sources"], [])

    def test_full_history_literal_unicode_search_and_snippets(self):
        store = Store(self.db)
        for index in range(120):
            store.add({"id": str(index), "question": f"Question {index}", "answer": "中文答案 Straße literal_% 和两词甲乙",
                       "web_search": False, "sources": [], "created_at": "same-time"})
        self.assertEqual(len(self.load()["entries"]), 120)
        self.assertEqual(self.load()["entries"][0]["id"], "119")
        for query, count in (("STRASSE", 120), ("中文答案", 120), ("_%", 120), ("甲 乙", 0), ("甲乙", 120), ("Question 119", 1)):
            process, output = self.request({"op": "search", "query": query})
            self.assertEqual(process.returncode, 0)
            self.assertEqual(len(output[0]["entries"]), count, query)
            for entry in output[0]["entries"]:
                self.assertIn("search_snippet", entry)

    def test_timeout_kills_child_group_and_keeps_partial_out_of_history(self):
        self.write_config(timeout=0.5)
        self.set_scenario([delta("未完成")], hang=True, child=True)
        process, events = self.ask()
        self.assertEqual(process.returncode, 1, events)
        self.assertIn("超时", events[-1]["error"])
        self.assertFalse(is_running(json.loads(self.observed.read_text())["child"]))
        self.assert_no_history()

    def test_sigterm_kills_child_group_and_does_not_save_partial(self):
        self.set_scenario([delta("未完成")], hang=True, child=True)
        process = subprocess.Popen([sys.executable, "-m", "quick_ask_backend"], cwd=ROOT,
                                   env=self.environment, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, text=True)
        try:
            process.stdin.write(json.dumps({"op": "ask", "question": "问题"}))
            process.stdin.close()
            process.stdin = None
            self.assertEqual(json.loads(process.stdout.readline())["event"], "status")
            self.assertEqual(json.loads(process.stdout.readline())["event"], "delta")
            process.send_signal(signal.SIGTERM)
            stdout, stderr = process.communicate(timeout=5)
            self.assertEqual(stderr, "")
            events = [json.loads(line) for line in stdout.split("\n") if line]
            self.assertEqual(events[-1]["event"], "error")
            self.assertFalse(is_running(json.loads(self.observed.read_text())["child"]))
            self.assert_no_history()
        finally:
            if process.poll() is None:
                process.kill()
                process.communicate()

    def test_validation_and_missing_command(self):
        for request in ({"op": "ask", "question": "  "}, {"op": "ask", "question": "x", "web_search": "yes"}):
            process, output = self.request(request)
            self.assertEqual(process.returncode, 1)
            self.assertEqual(output[-1]["event"], "error")
        self.command.unlink()
        process, output = self.ask()
        self.assertEqual(process.returncode, 1)
        self.assertIn("找不到 Pi", output[-1]["error"])
        self.assert_no_history()

    def test_config_overrides_and_extension_override(self):
        extension = self.directory / "custom.ts"
        extension.write_text("// custom")
        self.write_config(extra=f'provider="mock"\nmodel="test-model"\nthinking="minimal"\nweb_extension={json.dumps(str(extension))}\n')
        self.set_scenario([{"type": "tool_execution_end", "toolName": "web_search", "isError": False,
                            "result": {"details": {"sources": [{"url": "https://example.org", "title": "实际搜索来源"}]}}},
                           final(), settled()])
        process, output = self.ask(web_search=True)
        self.assertEqual(process.returncode, 0, output)
        args = json.loads(self.observed.read_text())["argv"]
        for flag, value in (("--provider", "mock"), ("--model", "test-model"), ("--thinking", "minimal"), ("--extension", str(extension))):
            self.assertEqual(args[args.index(flag) + 1], value)


if __name__ == "__main__":
    unittest.main()

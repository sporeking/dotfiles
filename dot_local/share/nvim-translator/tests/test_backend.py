"""Offline integration tests. No user credentials or paid/external HTTP requests.

Run from project root: python3 -m unittest discover -s tests -p test_backend.py -v
"""

from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit

from translator_backend.app import handle_request
from translator_backend.config import Config, ROOTS, database_path, load_config
from translator_backend.dictionary import clearly_sentence, lookup_dictionary, parse_dictionary
from translator_backend.errors import BackendError
from translator_backend.llm import translate
from translator_backend.storage import DEFAULT_STATE, Storage

ROOT = Path(__file__).resolve().parents[1]
FAKE_KEY = "test-only-fake-credential-should-not-be-logged"
LONG_MEANING = "喂，你好（用于问候或打招呼）；喂，你好（打电话时的招呼语）；<非正式>喂，嘿；<英，旧>嘿（表示惊讶）"
TRANSLATION = json.dumps({"translation": "这只猫正坐在垫子上。", "examples": [
    {"en": "The cat sleeps.", "zh": "猫睡觉。"},
]}, ensure_ascii=False)


def lexical(query, *, headword=None):
    return {
        "input": query, "lang": "eng",
        "ec": {"word": [{
            "return-phrase": {"l": {"i": headword or query}},
            "usphone": "həˈloʊ", "ukphone": "həˈləʊ",
            "trs": [
                {"tr": [{"l": {"i": ["int. " + LONG_MEANING, "int. 第二条完整义项"],
                    "sentence": [{"en": "<b>Hello</b>, world.", "zh": "你好，世界。"}]}}]},
                {"tr": [{"l": {"i": ["n. 招呼，问候；人名"]}}]},
            ],
        }]},
        "blng_sents_part": {"sentence-pair": [
            {"sentence": "Say hello.", "sentence-translation": "打个招呼。"},
        ]},
    }


def provider_response(path, content=TRANSLATION):
    if path == "/api/chat/completions":
        return {"choices": [{"finish_reason": "stop", "message": {"content": content}}]}
    if path == "/api/responses":
        return {"status": "completed", "output": [
            {"type": "reasoning", "summary": []},
            {"type": "message", "content": [{"type": "output_text", "text": content}]},
        ]}
    if path == "/api/messages":
        return {"stop_reason": "end_turn", "content": [
            {"type": "thinking", "thinking": "not translation"},
            {"type": "text", "text": content},
        ]}
    if path == "/api/models/test-model:generateContent":
        return {"candidates": [{"finishReason": "STOP", "content": {"parts": [{"text": content}]}}]}
    return {"error": {"message": "unexpected endpoint"}}


class MockHandler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        self.dispatch()

    def do_POST(self):
        self.dispatch()

    def dispatch(self):
        raw = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        body = json.loads(raw) if raw else None
        request = {"method": self.command, "path": self.path,
                   "headers": dict(self.headers), "body": body}
        self.server.requests.append(request)
        status, payload, headers = self.server.responder(request)
        encoded = payload.encode() if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False).encode()
        try:
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            for key, value in headers.items():
                self.send_header(key, value)
            self.send_header("Content-Length", str(len(encoded)))
            self.end_headers()
            self.wfile.write(encoded)
        except (BrokenPipeError, ConnectionResetError):
            pass


def default_responder(request):
    path = urlsplit(request["path"])
    if path.path == "/dictionary":
        query = parse_qs(path.query)["q"][0]
        if query == "unknown expression":
            return 200, {"input": query, "lang": "eng"}, {}
        if query == "misspelled phrase":
            return 200, lexical(query, headword="different phrase"), {}
        return 200, lexical(query), {}
    return 200, provider_response(path.path), {}


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.store = Storage(self.root / "history.sqlite3")
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), MockHandler)
        self.server.daemon_threads = True
        self.server.requests = []
        self.server.responder = default_responder
        self.worker = threading.Thread(target=self.server.serve_forever, kwargs={"poll_interval": 0.01}, daemon=True)
        self.worker.start()
        self.base = f"http://127.0.0.1:{self.server.server_port}"
        self.dictionary_patch = patch("translator_backend.dictionary.DICTIONARY_URL", self.base + "/dictionary")
        self.dictionary_patch.start()
        self.config = Config(base_url=self.base + "/api", model="test-model", api_key=FAKE_KEY,
                             llm_timeout=1, dictionary_timeout=1)

    def tearDown(self):
        self.dictionary_patch.stop()
        self.server.shutdown()
        self.server.server_close()
        self.worker.join(timeout=1)
        self.temp.cleanup()

    def call(self, request, config=None):
        return handle_request(request, config=config or self.config, storage=self.store)

    def cli(self, request, config_text="", *, raw=False):
        path = self.root / "config.toml"
        path.write_text(config_text)
        environment = dict(os.environ, TRANSLATOR_CONFIG=str(path), TRANSLATOR_DB=str(self.root / "cli.sqlite3"),
                           TRANSLATOR_API_KEY=FAKE_KEY)
        data = request if raw else json.dumps(request, ensure_ascii=False) + "\n"
        process = subprocess.run([sys.executable, "-m", "translator_backend"], input=data,
                                 capture_output=True, text=True, cwd=ROOT, env=environment, timeout=5)
        self.assertEqual(process.returncode, 0, process.stderr)
        self.assertEqual(process.stderr, "")
        self.assertEqual(len(process.stdout.splitlines()), 1)
        return json.loads(process.stdout), process.stdout

    def test_real_http_dictionary_preserves_all_senses_and_examples(self):
        response = self.call({"op": "lookup", "text": " \t hello\n "})
        entry = response["entry"]
        self.assertEqual(entry["text"], "hello")
        self.assertEqual(entry["direction"], "en-zh")
        result = entry["result"]
        self.assertEqual(result["kind"], "dictionary")
        self.assertEqual(result["meanings"], [
            {"pos": "int.", "definitions": [LONG_MEANING, "第二条完整义项"]},
            {"pos": "n.", "definitions": ["招呼，问候；人名"]},
        ])
        self.assertEqual(result["examples"], [
            {"en": "Hello, world.", "zh": "你好，世界。", "source": "dictionary"},
            {"en": "Say hello.", "zh": "打个招呼。", "source": "dictionary"},
        ])
        self.assertEqual(result["phonetics"], {"us": "həˈloʊ", "uk": "həˈləʊ"})
        self.assertEqual(parse_qs(urlsplit(result["audio"]["us"]).query), {"audio": ["hello"], "type": ["2"]})
        request = self.server.requests[0]
        dictionaries = json.loads(parse_qs(urlsplit(request["path"]).query)["dicts"][0])
        self.assertIn(["blng_sents_part"], dictionaries["dicts"])
        self.assertNotIn("Authorization", request["headers"])
        self.assertEqual(len(self.server.requests), 1)

    def test_long_phrase_stays_dictionary_and_has_encoded_audio(self):
        text = "a bird in the hand is worth two in the bush"
        result = self.call({"op": "lookup", "text": text})["entry"]["result"]
        self.assertEqual(result["kind"], "dictionary")
        self.assertEqual(parse_qs(urlsplit(result["audio"]["uk"]).query), {"audio": [text], "type": ["1"]})
        self.assertFalse(clearly_sentence(text))
        self.assertEqual(len(self.server.requests), 1)

    def test_headword_mismatch_is_not_accepted_as_dictionary_hit(self):
        result = self.call({"op": "lookup", "text": "misspelled phrase"})["entry"]["result"]
        self.assertEqual(result["kind"], "translation")
        self.assertEqual(len(self.server.requests), 2)
        self.assertIsNone(parse_dictionary(lexical("sentence", headword="sent"), "sentence"))
        self.assertIsNotNone(parse_dictionary(lexical("Hello", headword="hello"), "Hello"))

    def test_punctuation_and_typographic_apostrophe_are_tolerated(self):
        self.assertIsNotNone(parse_dictionary(lexical("don't", headword="Don’t"), "don't!"))
        self.assertIsNotNone(parse_dictionary(lexical("hello", headword="hello"), "hello."))

    def test_examples_option_disables_request_and_output(self):
        config = replace(self.config, ui={**self.config.ui, "examples": False})
        result = self.call({"op": "lookup", "text": "hello"}, config)["entry"]["result"]
        self.assertEqual(result["examples"], [])
        dictionaries = json.loads(parse_qs(urlsplit(self.server.requests[0]["path"]).query)["dicts"][0])
        self.assertEqual(dictionaries["dicts"], [["ec"]])
        result = self.call({"op": "lookup", "text": "A complete sentence."}, config)["entry"]["result"]
        self.assertEqual(result["examples"], [])
        self.assertIn('"examples" array must be empty', self.server.requests[-1]["body"]["messages"][0]["content"])

    def test_all_four_native_protocols_send_correct_requests_and_parse(self):
        for protocol in ROOTS:
            with self.subTest(protocol=protocol):
                config = replace(self.config, protocol=protocol)
                result = self.call({"op": "lookup", "text": "The cat sits.", "force": True}, config)["entry"]["result"]
                self.assertEqual(result["translation"], "这只猫正坐在垫子上。")
                self.assertEqual(result["source"], protocol + "/test-model")
                self.assertEqual(result["kind"], "translation")
                self.assertEqual(result["meanings"], [])
                self.assertEqual(result["audio"], {})
                self.assertEqual(result["examples"][0]["source"], "generated")
                request = self.server.requests[-1]
                self.assertEqual(request["method"], "POST")
                self.assertNotIn(FAKE_KEY, request["path"])
                body = request["body"]
                headers = {key.lower(): value for key, value in request["headers"].items()}
                if protocol.startswith("openai"):
                    self.assertEqual(headers["authorization"], "Bearer " + FAKE_KEY)
                    self.assertEqual(body["model"], "test-model")
                    if protocol == "openai":
                        self.assertEqual(request["path"], "/api/chat/completions")
                        self.assertEqual(body["messages"][1], {"role": "user", "content": "The cat sits."})
                    else:
                        self.assertEqual(request["path"], "/api/responses")
                        self.assertEqual(body["input"], "The cat sits.")
                        self.assertIn("instructions", body)
                elif protocol == "anthropic":
                    self.assertEqual(request["path"], "/api/messages")
                    self.assertEqual(headers["x-api-key"], FAKE_KEY)
                    self.assertEqual(headers["anthropic-version"], "2023-06-01")
                    self.assertGreater(body["max_tokens"], 0)
                    self.assertEqual(body["messages"][0]["content"], "The cat sits.")
                else:
                    self.assertEqual(request["path"], "/api/models/test-model:generateContent")
                    self.assertEqual(headers["x-goog-api-key"], FAKE_KEY)
                    self.assertEqual(body["contents"][0]["parts"][0]["text"], "The cat sits.")
                    self.assertEqual(body["generationConfig"]["responseMimeType"], "application/json")
        self.assertEqual(len(self.server.requests), 4)  # Clear sentences bypass dictionary.

    def test_gemini_models_prefix_and_provider_specific_defaults(self):
        config = replace(self.config, protocol="gemini", model="models/test-model")
        self.call({"op": "lookup", "text": "This is a sentence."}, config)
        self.assertEqual(self.server.requests[0]["path"], "/api/models/test-model:generateContent")
        path = self.root / "config.toml"
        path.write_text('[llm]\nprotocol="anthropic"\n')
        parsed = load_config(path)
        self.assertEqual(parsed.base_url, ROOTS["anthropic"])
        self.assertEqual(parsed.model, "")

    def test_lexical_miss_uses_llm_not_dictionary_examples(self):
        response = self.call({"op": "lookup", "text": "unknown expression"})
        self.assertEqual(response["entry"]["result"]["kind"], "translation")
        self.assertEqual(len(self.server.requests), 2)

    def test_unconfigured_llm_never_sends_provider_request(self):
        for config in (replace(self.config, model=""), replace(self.config, api_key="")):
            with self.assertRaisesRegex(BackendError, "尚未发送 LLM 请求"):
                self.call({"op": "lookup", "text": "unknown expression"}, config)
        self.assertEqual(len(self.server.requests), 2)  # Dictionary only.
        self.assertTrue(all(urlsplit(req["path"]).path == "/dictionary" for req in self.server.requests))
        self.assertEqual(self.store.load()[0], [])
        self.assertTrue(self.call({"op": "lookup", "text": "hello"}, replace(self.config, model="", api_key=""))["ok"])

    def test_dictionary_http_failure_is_not_a_miss_or_paid_fallback(self):
        successful = self.call({"op": "lookup", "text": "hello"})["entry"]
        state = {"selected_id": successful["id"], "draft": "unfinished edit", "cursor": 3, "result_scroll": 2}
        self.call({"op": "save_state", "state": state})
        self.server.responder = lambda req: (503, {"error": FAKE_KEY}, {})
        with self.assertRaisesRegex(BackendError, "有道词典 HTTP 503") as error:
            self.call({"op": "lookup", "text": "hello", "force": True})
        self.assertNotIn(FAKE_KEY, str(error.exception))
        entries, restored = self.store.load()
        self.assertEqual(entries, [successful])
        self.assertEqual(restored, {**state, "direction": "en-zh"})
        self.assertEqual(len(self.server.requests), 2)

    def test_malformed_dictionary_response_is_failure_not_lexical_miss(self):
        for payload in ("<html>blocked</html>", {}, {"ec": {"word": "broken"}}):
            self.server.responder = lambda req, value=payload: (200, value, {})
            with self.assertRaisesRegex(BackendError, "有道词典"):
                self.call({"op": "lookup", "text": "hello"})
        self.assertEqual(len(self.server.requests), 3)
        self.assertEqual(self.store.load()[0], [])

    def test_timeout_is_explicit_and_not_saved(self):
        def delayed(request):
            time.sleep(0.05)
            return 200, lexical("hello"), {}
        self.server.responder = delayed
        with self.assertRaisesRegex(BackendError, "有道词典网络超时"):
            self.call({"op": "lookup", "text": "hello"}, replace(self.config, dictionary_timeout=0.01))
        self.assertEqual(self.store.load()[0], [])

    def test_redirect_is_not_followed_with_credentials(self):
        self.server.responder = lambda req: (307, {}, {"Location": self.base + "/leaked"})
        with self.assertRaisesRegex(BackendError, "重定向"):
            self.call({"op": "lookup", "text": "A full sentence."})
        self.assertEqual(len(self.server.requests), 1)

    def test_llm_errors_and_invalid_outputs_never_save_history(self):
        payloads = [
            {"error": {"message": FAKE_KEY}},
            {"choices": []},
            {"choices": [{"message": {"content": ""}}]},
            {"choices": [{"message": {"content": '{"translation": ""}'}}]},
            {"choices": [{"message": {"content": '{"translation": "truncated'}}]},
            {"choices": [{"message": {"content": 'not a translation'}}]},
            {"choices": [{"finish_reason": "length", "message": {"content": TRANSLATION}}]},
            {"choices": [{"finish_reason": "content_filter", "message": {"content": TRANSLATION}}]},
            {"choices": [{"message": {"refusal": "refused", "content": TRANSLATION}}]},
        ]
        for payload in payloads:
            self.server.responder = lambda req, value=payload: (200, value, {})
            with self.assertRaises(BackendError) as error:
                self.call({"op": "lookup", "text": "The cat sits."})
            self.assertNotIn(FAKE_KEY, str(error.exception))
        self.assertEqual(self.store.load()[0], [])

    def test_other_protocols_reject_incomplete_or_safety_results(self):
        cases = [
            ("openai-responses", {"status": "incomplete", "output_text": TRANSLATION}),
            ("anthropic", {"stop_reason": "max_tokens", "content": [{"type": "text", "text": TRANSLATION}]}),
            ("gemini", {"candidates": [{"finishReason": "SAFETY", "content": {"parts": [{"text": TRANSLATION}]}}]}),
        ]
        for protocol, payload in cases:
            self.server.responder = lambda req, value=payload: (200, value, {})
            with self.assertRaises(BackendError):
                self.call({"op": "lookup", "text": "The cat sits."}, replace(self.config, protocol=protocol))
        self.assertEqual(self.store.load()[0], [])

    def test_plain_text_and_fenced_json_compatible_outputs(self):
        for content in ("这只猫正坐在垫子上。", "```json\n" + TRANSLATION + "\n```"):
            self.server.responder = lambda req, value=content: (200, {"choices": [{"message": {"content": value}}]}, {})
            result = self.call({"op": "lookup", "text": "A complete sentence.", "force": True})["entry"]["result"]
            self.assertEqual(result["translation"], "这只猫正坐在垫子上。")

    def test_cache_and_forced_refresh_preserve_chronology(self):
        first = self.call({"op": "lookup", "text": "hello"})["entry"]
        second = self.call({"op": "lookup", "text": "world"})["entry"]
        cached = self.call({"op": "lookup", "text": " \t hello  "})
        self.assertTrue(cached["cached"])
        self.assertEqual(cached["entry"], first)
        self.assertEqual(self.call({"op": "load"})["entries"], [second, first])
        self.assertEqual(len(self.server.requests), 2)
        refreshed = self.call({"op": "lookup", "text": "hello", "force": True})
        self.assertFalse(refreshed["cached"])
        self.assertGreater(refreshed["entry"]["id"], second["id"])
        self.assertEqual(self.call({"op": "load"})["entries"], [refreshed["entry"], second, first])
        self.assertEqual(len(self.server.requests), 3)

    def test_full_history_and_unsubmitted_multibyte_draft_survive_reopen(self):
        result = parse_dictionary(lexical("hello"), "hello")
        for index in range(130):
            self.store.save_success(f"query-{index}", result)
        state = {"selected_id": 4, "draft": "草稿 edited but not submitted\nnext", "cursor": 6, "result_scroll": 9}
        self.call({"op": "save_state", "state": state})
        reopened = Storage(self.store.path)
        entries, restored = reopened.load()
        self.assertEqual(len(entries), 130)
        self.assertEqual(entries[0]["id"], 130)
        self.assertEqual(entries[-1]["text"], "query-0")
        self.assertEqual(restored, {**state, "direction": "en-zh"})
        self.assertNotEqual(entries[-4]["text"], restored["draft"])
        self.assertEqual(self.store.path.stat().st_mode & 0o777, 0o600)

    def test_concurrent_state_and_success_writes_do_not_lose_history(self):
        self.store.load()
        result = parse_dictionary(lexical("hello"), "hello")
        def action(index):
            store = Storage(self.store.path)
            if index % 2:
                store.save_state({**DEFAULT_STATE, "draft": f"draft-{index}", "cursor": index})
            else:
                store.save_success(f"query-{index}", result)
        with ThreadPoolExecutor(max_workers=8) as pool:
            list(pool.map(action, range(40)))
        entries, state = self.store.load()
        self.assertEqual(len(entries), 20)
        self.assertEqual({entry["text"] for entry in entries}, {f"query-{i}" for i in range(0, 40, 2)})
        self.assertTrue(state["draft"].startswith("draft-"))
        self.assertEqual(state["cursor"], int(state["draft"].split("-")[1]))

    def test_concurrent_identical_success_only_inserts_once(self):
        self.store.load()
        result = parse_dictionary(lexical("hello"), "hello")
        with ThreadPoolExecutor(max_workers=8) as pool:
            responses = list(pool.map(lambda _: Storage(self.store.path).save_success("hello", result), range(12)))
        self.assertEqual(len(self.store.load()[0]), 1)
        self.assertEqual(sum(not cached for entry, cached in responses), 1)

    def test_invalid_requests_and_state_never_change_history(self):
        requests = [None, [], {}, {"op": "bad"}, {"op": "lookup", "text": 7},
                    {"op": "lookup", "text": " \n "}, {"op": "lookup", "text": "hello", "force": "true"},
                    {"op": "save_state", "state": {"cursor": -1}},
                    {"op": "save_state", "state": {"draft": 1}},
                    {"op": "save_state", "state": {"selected_id": True}}]
        for request in requests:
            with self.subTest(request=request), self.assertRaises(BackendError):
                self.call(request)
        self.assertEqual(self.store.load(), ([], DEFAULT_STATE))
        self.assertEqual(self.server.requests, [])

    def test_zh_en_four_protocols_translate_chinese_and_keep_proper_names(self):
        text = "明天在星星咖啡馆和王小明见面。"
        english = "Let's meet 王小明 at Café Étoile tomorrow."
        content = json.dumps({"translation": english, "examples": [
            {"en": "See you tomorrow.", "zh": "明天见。"},
        ]}, ensure_ascii=False)
        self.server.responder = lambda req: (200, provider_response(urlsplit(req["path"]).path, content), {})
        for protocol in ROOTS:
            with self.subTest(protocol=protocol):
                response = self.call({"op": "lookup", "text": text, "direction": "zh-en", "force": True},
                                     replace(self.config, protocol=protocol))
                self.assertEqual(response["entry"]["direction"], "zh-en")
                result = response["entry"]["result"]
                self.assertEqual(result["translation"], english)
                self.assertEqual(result["kind"], "translation")
                self.assertEqual(result["audio"], {})
                self.assertEqual(result["examples"], [{"en": "See you tomorrow.", "zh": "明天见。", "source": "generated"}])
                request = self.server.requests[-1]
                self.assertEqual(request["method"], "POST")
                body = request["body"]
                if protocol == "openai":
                    prompt = body["messages"][0]["content"]
                    supplied_text = body["messages"][1]["content"]
                elif protocol == "openai-responses":
                    prompt, supplied_text = body["instructions"], body["input"]
                elif protocol == "anthropic":
                    prompt, supplied_text = body["system"], body["messages"][0]["content"]
                else:
                    prompt = body["systemInstruction"]["parts"][0]["text"]
                    supplied_text = body["contents"][0]["parts"][0]["text"]
                self.assertIn("Chinese-to-English", prompt)
                self.assertIn("into English", prompt)
                self.assertEqual(supplied_text, text)
        self.assertEqual(len(self.server.requests), 4)  # Never consult Youdao for zh-en.

    def test_same_text_has_independent_direction_cache_and_refresh(self):
        first = self.call({"op": "lookup", "text": "hello"})["entry"]
        self.assertEqual(first["direction"], "en-zh")
        self.server.responder = lambda req: (200, provider_response(urlsplit(req["path"]).path, "Hello."), {})
        second = self.call({"op": "lookup", "text": "hello", "direction": "zh-en"})["entry"]
        self.assertNotEqual(second["id"], first["id"])
        self.assertEqual(second["direction"], "zh-en")
        self.assertEqual(second["result"]["translation"], "Hello.")
        for direction, expected in (("en-zh", first), ("zh-en", second)):
            cached = self.call({"op": "lookup", "text": " hello ", "direction": direction},
                               replace(self.config, api_key="", model=""))
            self.assertTrue(cached["cached"])
            self.assertEqual(cached["entry"], expected)
        self.assertEqual(len(self.server.requests), 2)
        refreshed = self.call({"op": "lookup", "text": "hello", "direction": "zh-en", "force": True})["entry"]
        self.assertGreater(refreshed["id"], second["id"])
        self.assertEqual(self.store.cached("hello"), first)  # Old internal default remains en-zh.
        self.assertEqual(self.store.cached("hello", "zh-en"), refreshed)
        self.assertEqual(self.store.load()[0], [refreshed, second, first])
        self.assertEqual(len(self.server.requests), 3)

    def test_zh_en_unconfigured_provider_makes_no_network_requests(self):
        for config in (replace(self.config, model=""), replace(self.config, api_key="")):
            with self.assertRaisesRegex(BackendError, "尚未发送 LLM 请求"):
                self.call({"op": "lookup", "text": "你好", "direction": "zh-en"}, config)
        self.assertEqual(self.server.requests, [])
        self.assertEqual(self.store.load()[0], [])

    def test_zh_en_plain_and_json_outputs_require_latin_but_allow_chinese_names(self):
        config = replace(self.config, ui={**self.config.ui, "examples": False})
        for english in ("Good morning.", "Meet 王小明 at Café Étoile."):
            for content in (english, "```json\n" + json.dumps({"translation": english, "examples": [
                {"en": "Good morning.", "zh": "早上好。"},
            ]}, ensure_ascii=False) + "\n```"):
                self.server.responder = lambda req, value=content: (200, provider_response(urlsplit(req["path"]).path, value), {})
                entry = self.call({"op": "lookup", "text": "早上好", "direction": "zh-en", "force": True}, config)["entry"]
                self.assertEqual(entry["result"]["translation"], english)
                self.assertEqual(entry["result"]["examples"], [])
        before = self.store.load()[0]
        for content in ("只有中文，没有英文。", '{"translation":"只有中文"}', "12345", '{"translation":"unfinished'):
            self.server.responder = lambda req, value=content: (200, provider_response(urlsplit(req["path"]).path, value), {})
            with self.assertRaises(BackendError):
                self.call({"op": "lookup", "text": "早上好", "direction": "zh-en", "force": True})
        self.assertEqual(self.store.load()[0], before)

    def test_invalid_directions_rejected_before_network_or_database_access(self):
        for direction in (None, False, 1, [], {}, "auto", FAKE_KEY):
            with self.subTest(direction=direction):
                with self.assertRaisesRegex(BackendError, "direction") as error:
                    self.call({"op": "lookup", "text": "hello", "direction": direction})
                self.assertNotIn(FAKE_KEY, str(error.exception))
                with self.assertRaisesRegex(BackendError, "direction"):
                    self.call({"op": "save_state", "state": {**DEFAULT_STATE, "direction": direction}})
        self.assertFalse(self.store.path.exists())
        self.assertEqual(self.server.requests, [])
        with self.assertRaisesRegex(BackendError, "direction"):
            self.store.cached("hello", direction="auto")
        with self.assertRaisesRegex(BackendError, "direction"):
            self.store.save_success("hello", {}, direction="auto")
        with self.assertRaisesRegex(BackendError, "direction"):
            translate("hello", self.config, direction="auto")
        self.assertFalse(self.store.path.exists())
        self.assertEqual(self.server.requests, [])

    def _make_legacy_database(self):
        entry = {"id": 7, "text": "hello", "created_at": "2024-01-02T03:04:05+00:00",
                 "result": parse_dictionary(lexical("hello"), "hello")}
        state = {"selected_id": 7, "draft": "未提交修改 edited draft", "cursor": 6, "result_scroll": 5}
        connection = sqlite3.connect(self.store.path)
        try:
            connection.execute("CREATE TABLE entries (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, created_at TEXT NOT NULL, result_json TEXT NOT NULL)")
            connection.execute("CREATE INDEX entries_text ON entries(text, id DESC)")
            connection.execute("CREATE TABLE app_state (singleton INTEGER PRIMARY KEY CHECK(singleton=1), state_json TEXT NOT NULL)")
            connection.execute("INSERT INTO entries VALUES(?,?,?,?)", (entry["id"], entry["text"], entry["created_at"], json.dumps(entry["result"], ensure_ascii=False)))
            connection.execute("INSERT INTO app_state VALUES(1,?)", (json.dumps(state, ensure_ascii=False),))
            connection.commit()
        finally:
            connection.close()
        return entry, state

    def test_legacy_database_preserves_ids_timestamps_results_and_drafts(self):
        legacy, old_state = self._make_legacy_database()
        expected = {**legacy, "direction": "en-zh"}
        entries, state = self.store.load()
        self.assertEqual(entries, [expected])
        self.assertEqual(state, {**old_state, "direction": "en-zh"})
        self.assertEqual(self.store.cached("hello"), expected)
        self.assertIsNone(self.store.cached("hello", "zh-en"))
        newer, cached = self.store.save_success("hello", {"kind": "translation", "translation": "Hello."}, direction="zh-en")
        self.assertFalse(cached)
        self.assertEqual(newer["id"], 8)
        self.assertEqual(self.store.cached("hello"), expected)
        self.assertEqual(self.store.cached("hello", "zh-en"), newer)
        self.assertEqual(self.store.load()[1], {**old_state, "direction": "en-zh"})

    def _trace_sqlite_errors(self, errors, wal_blocked=None):
        real_connect = sqlite3.connect
        class TracedConnection(sqlite3.Connection):
            def execute(connection, sql, *args, **kwargs):
                try:
                    return super().execute(sql, *args, **kwargs)
                except sqlite3.Error as exc:
                    errors.append((sql, exc.sqlite_errorcode))
                    if wal_blocked is not None and sql == "PRAGMA journal_mode=WAL":
                        wal_blocked.set()
                    raise
        return patch("translator_backend.storage.sqlite3.connect",
                     lambda *args, **kwargs: real_connect(*args, **kwargs, factory=TracedConnection))

    def test_legacy_wal_transition_recovers_after_real_reader_releases_lock(self):
        legacy, old_state = self._make_legacy_database()
        reader = sqlite3.connect(self.store.path)
        reader.execute("BEGIN")
        reader.execute("SELECT * FROM entries").fetchall()  # Hold a real DELETE-mode shared lock.
        errors = []
        blocked = threading.Event()
        with self._trace_sqlite_errors(errors, blocked), ThreadPoolExecutor(max_workers=1) as pool:
            loading = pool.submit(self.store.load)
            try:
                self.assertTrue(blocked.wait(timeout=2), "WAL transition should encounter the held reader lock")
            finally:
                reader.rollback()
                reader.close()
            entries, state = loading.result(timeout=3)
        self.assertTrue(errors)
        self.assertTrue(all(item == ("PRAGMA journal_mode=WAL", sqlite3.SQLITE_BUSY) for item in errors))
        self.assertEqual(entries, [{**legacy, "direction": "en-zh"}])
        self.assertEqual(state, {**old_state, "direction": "en-zh"})
        with self.store.connection() as connection:
            self.assertEqual(connection.execute("PRAGMA journal_mode").fetchone()[0], "wal")
            self.assertEqual(connection.execute("PRAGMA busy_timeout").fetchone()[0], 15000)

    def test_wal_busy_timeout_is_bounded_and_preserves_legacy_data(self):
        legacy, old_state = self._make_legacy_database()
        reader = sqlite3.connect(self.store.path)
        reader.execute("BEGIN")
        reader.execute("SELECT * FROM entries").fetchall()
        errors = []
        started = time.monotonic()
        try:
            with self._trace_sqlite_errors(errors), patch("translator_backend.storage.BUSY_TIMEOUT_MS", 50):
                with self.assertRaises(BackendError):
                    self.store.load()
            self.assertLess(time.monotonic() - started, 2)
            self.assertGreaterEqual(len(errors), 2)
            self.assertTrue(all(item == ("PRAGMA journal_mode=WAL", sqlite3.SQLITE_BUSY) for item in errors))
            self.assertNotIn("direction", {row[1] for row in reader.execute("PRAGMA table_info(entries)")})
        finally:
            reader.rollback()
            reader.close()
        self.assertEqual(self.store.load(), ([{**legacy, "direction": "en-zh"}], {**old_state, "direction": "en-zh"}))

    def test_non_busy_database_errors_are_not_retried_or_overwritten(self):
        contents = b"This is not a SQLite database. Preserve it for diagnosis."
        self.store.path.write_bytes(contents)
        errors = []
        with self._trace_sqlite_errors(errors), patch("translator_backend.storage.time.sleep") as delay:
            with self.assertRaises(BackendError):
                self.store.load()
        self.assertEqual(errors, [("PRAGMA journal_mode=WAL", sqlite3.SQLITE_NOTADB)])
        delay.assert_not_called()
        self.assertEqual(self.store.path.read_bytes(), contents)

    def test_wal_busy_recovery_retries_but_locked_does_not(self):
        real_connect = sqlite3.connect
        for code in (sqlite3.SQLITE_BUSY_RECOVERY, sqlite3.SQLITE_LOCKED):
            with self.subTest(code=code):
                self.store = Storage(self.root / f"legacy-{code}.sqlite3")
                legacy, state = self._make_legacy_database()
                attempts = []
                class FirstAttemptError(sqlite3.Connection):
                    def execute(connection, sql, *args, **kwargs):
                        if sql == "PRAGMA journal_mode=WAL":
                            attempts.append(sql)
                            if len(attempts) == 1:
                                # Deterministically exercise the extended code
                                # also observed from real synchronized opens.
                                error = sqlite3.OperationalError("database is locked")
                                error.sqlite_errorcode = code
                                raise error
                        return super().execute(sql, *args, **kwargs)
                with patch("translator_backend.storage.sqlite3.connect",
                           lambda *args, **kwargs: real_connect(*args, **kwargs, factory=FirstAttemptError)):
                    if code == sqlite3.SQLITE_BUSY_RECOVERY:
                        self.assertEqual(self.store.load()[0], [{**legacy, "direction": "en-zh"}])
                        self.assertEqual(len(attempts), 2)
                    else:
                        with self.assertRaises(BackendError):
                            self.store.load()
                        self.assertEqual(len(attempts), 1)
                self.assertEqual(self.store.load()[1], {**state, "direction": "en-zh"})

    def test_schema_busy_uses_normal_timeout_without_wal_retry(self):
        self.store.save_state({**DEFAULT_STATE, "draft": "keep this draft"})
        writer = sqlite3.connect(self.store.path)
        writer.execute("BEGIN IMMEDIATE")
        errors = []
        try:
            with self._trace_sqlite_errors(errors), patch("translator_backend.storage.BUSY_TIMEOUT_MS", 50), \
                    patch("translator_backend.storage.time.sleep") as delay:
                with self.assertRaises(BackendError):
                    self.store.save_state({**DEFAULT_STATE, "draft": "must not replace it"})
            self.assertEqual(errors, [("BEGIN IMMEDIATE", sqlite3.SQLITE_BUSY)])
            delay.assert_not_called()
        finally:
            writer.rollback()
            writer.close()
        self.assertEqual(self.store.load()[1]["draft"], "keep this draft")

    def test_multiple_backend_processes_can_migrate_same_legacy_database(self):
        legacy, old_state = self._make_legacy_database()
        path = self.root / "migration.toml"
        path.write_text("")
        environment = dict(os.environ, TRANSLATOR_CONFIG=str(path), TRANSLATOR_DB=str(self.store.path), TRANSLATOR_API_KEY="")
        barrier = threading.Barrier(8)
        def load_in_process(index):
            barrier.wait(timeout=5)
            process = subprocess.run([sys.executable, "-m", "translator_backend"], input='{"op":"load"}\n',
                                     text=True, capture_output=True, env=environment, cwd=ROOT, timeout=20)
            self.assertEqual(process.returncode, 0, process.stderr)
            self.assertEqual(process.stderr, "")
            response = json.loads(process.stdout)
            self.assertTrue(response["ok"], response)
            return response
        with ThreadPoolExecutor(max_workers=8) as pool:
            responses = list(pool.map(load_in_process, range(8)))
        for response in responses:
            self.assertEqual(response["entries"], [{**legacy, "direction": "en-zh"}])
            self.assertEqual(response["state"], {**old_state, "direction": "en-zh"})
        self.assertEqual(self.server.requests, [])

    def test_zh_en_direction_and_unsubmitted_draft_survive_separate_cli_processes(self):
        content = json.dumps({"translation": "Good morning.", "examples": []})
        self.server.responder = lambda req: (200, provider_response(urlsplit(req["path"]).path, content), {})
        config = '[llm]\nmodel="test-model"\nbase_url="' + self.base + '/api"\n'
        response, output = self.cli({"op": "lookup", "text": "早上好", "direction": "zh-en"}, config)
        self.assertTrue(response["ok"])
        entry = response["entry"]
        self.assertEqual(entry["direction"], "zh-en")
        state = {"selected_id": entry["id"], "draft": "尚未提交的新草稿", "cursor": 9, "result_scroll": 2, "direction": "zh-en"}
        self.assertTrue(self.cli({"op": "save_state", "state": state}, config)[0]["ok"])
        loaded, output = self.cli({"op": "load"})
        self.assertEqual(loaded["state"], state)
        self.assertEqual(loaded["entries"], [entry])
        self.assertNotIn(FAKE_KEY, output)
        self.assertEqual(len(self.server.requests), 1)

    def test_config_environment_precedence_and_private_public_separation(self):
        path = self.root / "config.toml"
        path.write_text('[llm]\nprotocol="gemini"\nmodel="test-model"\napi_key="local-fake"\napi_key_env="TEST_TRANSLATOR_KEY"\n'
                        '[ui]\nexamples=false\naccent="uk"\nauto_pronounce=false\ninput_method=false\n')
        with patch.dict(os.environ, {"TEST_TRANSLATOR_KEY": FAKE_KEY}):
            config = load_config(path)
        self.assertEqual(config.api_key, FAKE_KEY)
        self.assertNotIn(FAKE_KEY, repr(config))
        public = self.call({"op": "config"}, config)
        self.assertEqual(public, {"ok": True, "config": {
            "auto_pronounce": False, "accent": "uk", "examples": False, "input_method": False}})
        self.assertNotIn("api_key", json.dumps(public))
        with patch.dict(os.environ, {"TEST_TRANSLATOR_KEY": ""}):
            self.assertEqual(load_config(path).api_key, "local-fake")

    def test_local_config_merges_fields_and_keeps_environment_credentials_first(self):
        path = self.root / "config.toml"
        path.write_text('[llm]\nprotocol="gemini"\nmodel="public-model"\napi_key="public-fake"\n'
                        'api_key_env="TEST_TRANSLATOR_KEY"\ntimeout=30\n'
                        '[dictionary]\nenabled=true\ntimeout=4\n[ui]\nexamples=false\naccent="us"\n')
        (self.root / "config.local.toml").write_text(
            '[llm]\napi_key="' + FAKE_KEY + '"\nmodel="private-model"\n'
            '[dictionary]\nenabled=false\n[ui]\naccent="uk"\n')
        with patch.dict(os.environ, {"TEST_TRANSLATOR_KEY": ""}):
            config = load_config(path)
        self.assertEqual(config.api_key, FAKE_KEY)
        self.assertEqual(config.model, "private-model")
        self.assertEqual(config.protocol, "gemini")
        self.assertEqual(config.base_url, ROOTS["gemini"])
        self.assertEqual(config.llm_timeout, 30)
        self.assertEqual(config.dictionary_timeout, 4)
        self.assertFalse(config.dictionary_enabled)
        self.assertEqual(config.public(), {"examples": False, "accent": "uk", "auto_pronounce": True, "input_method": True})
        self.assertNotIn(FAKE_KEY, repr(config))
        self.assertNotIn(FAKE_KEY, json.dumps(self.call({"op": "config"}, config)))
        with patch.dict(os.environ, {"TEST_TRANSLATOR_KEY": "environment-fake"}):
            self.assertEqual(load_config(path).api_key, "environment-fake")

    def test_custom_config_uses_only_matching_local_path_and_allows_missing_files(self):
        path = self.root / "foo.toml"
        path.write_text('[llm]\nmodel="public-model"\n')
        (self.root / "config.local.toml").write_text('[llm]\nmodel="wrong-local-model"\n')
        with patch.dict(os.environ, {"TRANSLATOR_CONFIG": str(path), "TRANSLATOR_API_KEY": ""}):
            self.assertEqual(load_config().model, "public-model")  # Missing foo.local.toml changes nothing.
            (self.root / "foo.local.toml").write_text('[llm]\napi_key="' + FAKE_KEY + '"\n')
            config = load_config()
        self.assertEqual(config.model, "public-model")
        self.assertEqual(config.api_key, FAKE_KEY)
        # A private file may also supply settings when the public file is absent.
        (self.root / "missing.local.toml").write_text('[ui]\naccent="uk"\n')
        self.assertEqual(load_config(self.root / "missing.toml").public()["accent"], "uk")

    def test_local_config_format_and_validation_errors_never_echo_private_values(self):
        private = self.root / "config.local.toml"
        invalid_values = [
            '[llm]\napi_key="' + FAKE_KEY + '" broken',
            'llm="' + FAKE_KEY + '"',
            '[ui]\nexamples="' + FAKE_KEY + '"',
            '[llm]\ntimeout="' + FAKE_KEY + '"',
            '[llm]\nbase_url="https://user:' + FAKE_KEY + '@example.invalid/v1"',
        ]
        for value in invalid_values:
            private.write_text(value)
            failed, output = self.cli({"op": "config"}, '[llm]\nmodel="public-model"\n')
            self.assertFalse(failed["ok"])
            self.assertNotIn(FAKE_KEY, output)
            self.assertEqual(self.server.requests, [])

    def test_local_config_read_failure_is_not_silently_ignored(self):
        path = self.root / "config.toml"
        path.write_text('[llm]\nmodel="public-model"\n')
        (self.root / "config.local.toml").mkdir()  # Portable read error, even as root.
        with self.assertRaisesRegex(BackendError, "无法读取配置"):
            load_config(path)
        failed, output = self.cli({"op": "config"})
        self.assertFalse(failed["ok"])
        self.assertIn("无法读取配置", failed["error"])
        self.assertNotIn(str(self.root), output)

    def test_xdg_paths_and_missing_config_do_not_create_implicit_model(self):
        with patch.dict(os.environ, {"XDG_CONFIG_HOME": str(self.root / "cfg"), "XDG_DATA_HOME": str(self.root / "data"),
                                    "TRANSLATOR_CONFIG": "", "TRANSLATOR_DB": "", "TRANSLATOR_API_KEY": ""}):
            config = load_config()
            self.assertEqual(config.model, "")
            self.assertEqual(config.api_key, "")
            self.assertEqual(database_path(), self.root / "data/nvim-translator/history.sqlite3")
            self.assertTrue(config.dictionary_enabled)

    def test_cli_json_and_errors_do_not_log_secrets(self):
        config = '[llm]\nmodel="test-model"\nbase_url="' + self.base + '/api"\n[dictionary]\nenabled=false\n'
        self.server.responder = lambda req: (401, {"error": {"message": FAKE_KEY}}, {})
        failed, output = self.cli({"op": "lookup", "text": "A complete sentence."}, config)
        self.assertFalse(failed["ok"])
        self.assertIn("401", failed["error"])
        self.assertNotIn(FAKE_KEY, output)
        invalid, output = self.cli("not-json " + FAKE_KEY + "\n", raw=True)
        self.assertFalse(invalid["ok"])
        self.assertNotIn(FAKE_KEY, output)
        malformed, output = self.cli({"op": "config"}, '[llm]\napi_key="' + FAKE_KEY + '" broken')
        self.assertFalse(malformed["ok"])
        self.assertNotIn(FAKE_KEY, output)
        invalid_url, output = self.cli({"op": "config"}, '[llm]\nbase_url="https://user:' + FAKE_KEY + '@example.invalid/v1"')
        self.assertFalse(invalid_url["ok"])
        self.assertNotIn(FAKE_KEY, output)

    def test_cli_separate_process_draft_restore_and_successful_lookup(self):
        state = {"selected_id": None, "draft": "未提交 draft", "cursor": 9, "result_scroll": 3}
        self.assertTrue(self.cli({"op": "save_state", "state": state})[0]["ok"])
        self.assertEqual(self.cli({"op": "load"})[0]["state"], {**state, "direction": "en-zh"})
        config = '[llm]\nmodel="test-model"\nbase_url="' + self.base + '/api"\n[dictionary]\nenabled=false\n'
        response, output = self.cli({"op": "lookup", "text": "The cat sits."}, config)
        self.assertTrue(response["ok"])
        self.assertNotIn(FAKE_KEY, output)
        loaded, output = self.cli({"op": "load"}, config)
        self.assertEqual(loaded["entries"], [response["entry"]])
        self.assertEqual(loaded["state"], {**state, "direction": "en-zh"})
        self.assertNotIn(FAKE_KEY, output)


if __name__ == "__main__":
    unittest.main()

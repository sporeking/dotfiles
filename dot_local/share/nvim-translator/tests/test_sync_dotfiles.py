"""Public configuration export must never carry local credentials."""
import importlib.util
from pathlib import Path
import tempfile
import tomllib
import unittest

spec = importlib.util.spec_from_file_location("sync_dotfiles", Path(__file__).resolve().parents[1] / "scripts/sync-dotfiles.py")
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class PublicConfigTests(unittest.TestCase):
    def test_only_public_settings_are_exported(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "config.toml"
            path.write_text('[llm]\nmodel="chosen-model"\napi_key="must-stay-private"\napi_key_env="MY_TRANSLATOR_KEY"\n[ui]\nexamples=false\n[unrelated]\npassword="also-private"\n')
            exported = sync.public_config(path)
            parsed = tomllib.loads(exported.decode())
            self.assertEqual(parsed["llm"]["model"], "chosen-model")
            self.assertFalse(parsed["ui"]["examples"])
            self.assertNotIn(b"must-stay-private", exported)
            self.assertNotIn(b"also-private", exported)
            self.assertNotIn("api_key", parsed["llm"])
            self.assertNotIn("unrelated", parsed)

    def test_local_override_is_not_exported(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "config.toml"
            path.write_text('[llm]\nmodel="public-model"\n')
            path.with_name("config.local.toml").write_text('[llm]\napi_key="local-secret"\nmodel="local-model"\n')
            exported = sync.public_config(path)
            self.assertIn(b"public-model", exported)
            self.assertNotIn(b"local-secret", exported)
            self.assertNotIn(b"local-model", exported)

    def test_url_credentials_cannot_be_exported(self):
        for url in ("https://name:password@api.example/v1", "https://api.example/v1?key=private"):
            with self.subTest(url_type="credential-bearing"), tempfile.TemporaryDirectory() as directory:
                path = Path(directory) / "config.toml"
                path.write_text('[llm]\nbase_url="' + url + '"\n')
                with self.assertRaisesRegex(ValueError, "credential-bearing"):
                    sync.public_config(path)


if __name__ == "__main__":
    unittest.main()

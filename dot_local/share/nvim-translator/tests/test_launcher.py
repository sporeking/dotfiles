"""Behavioral checks for window control; no real desktop mutations."""
import importlib.machinery
import importlib.util
import os
from pathlib import Path
import unittest
from unittest.mock import patch

loader = importlib.machinery.SourceFileLoader("translator_launcher", str(Path(__file__).resolve().parents[1] / "bin" / "translator"))
spec = importlib.util.spec_from_loader(loader.name, loader)
launcher = importlib.util.module_from_spec(spec)
loader.exec_module(launcher)


class LauncherTests(unittest.TestCase):
    def test_hiding_hidden_window_never_reopens_it(self):
        with patch.object(launcher, "clients", return_value=[{"class": launcher.APP_ID}]), \
             patch.object(launcher, "visible", return_value=False), \
             patch.object(launcher, "notify_nvim", return_value=True) as notify, \
             patch.object(launcher, "lua") as dispatch:
            launcher.hide()
            notify.assert_called_once_with("before_hide")
            dispatch.assert_not_called()

    def test_failed_state_save_keeps_visible_window(self):
        with patch.object(launcher, "clients", return_value=[{"class": launcher.APP_ID}]), \
             patch.object(launcher, "notify_nvim", return_value=False), \
             patch.object(launcher, "lua") as dispatch:
            with self.assertRaisesRegex(RuntimeError, "state save"):
                launcher.hide()
            dispatch.assert_not_called()

    def test_hidden_show_prepares_editor_before_display(self):
        events = []
        with patch.object(launcher, "ensure_started"), \
             patch.object(launcher, "visible", return_value=False), \
             patch.object(launcher, "notify_nvim", side_effect=lambda method: events.append(method) or True), \
             patch.object(launcher, "lua", side_effect=lambda code: events.append(code)):
            launcher.show()
        self.assertEqual(events[0], "on_show")
        self.assertIn("toggle_special", events[1])
        self.assertIn("nvim-translator", events[2])

    def test_stop_waits_for_window_exit_before_allowing_restart(self):
        with patch.object(launcher, "clients", side_effect=[[{"class": launcher.APP_ID}], [{"class": launcher.APP_ID}], []]) as clients, \
             patch.object(launcher, "hide"), \
             patch.object(launcher, "runtime_dir", return_value=Path("/tmp/translator-test")), \
             patch.object(launcher, "run"), \
             patch.object(launcher.time, "sleep") as pause:
            launcher.stop()
            self.assertEqual(clients.call_count, 3)
            pause.assert_called_once()

    def test_ordinary_kitty_windows_are_ignored(self):
        with patch.object(launcher, "hypr_json", return_value=[{"class": "kitty"}, {"class": "Alacritty"}, {"class": launcher.APP_ID}]):
            self.assertEqual(launcher.clients(), [{"class": launcher.APP_ID}])

    def test_launch_environment_does_not_reuse_another_neovim(self):
        original = {"NVIM": "/tmp/editor.sock", "NVIM_LISTEN_ADDRESS": "/tmp/editor-old.sock", "VIMINIT": "source personal.vim", "NVIM_APPNAME": "personal"}
        with patch.dict(os.environ, original):
            env = launcher.isolated_env()
            self.assertEqual(os.environ["NVIM_APPNAME"], "personal")
        self.assertEqual(env["NVIM_APPNAME"], "nvim-translator")
        for name in ("NVIM", "NVIM_LISTEN_ADDRESS", "VIMINIT"):
            self.assertNotIn(name, env)


if __name__ == "__main__":
    unittest.main()

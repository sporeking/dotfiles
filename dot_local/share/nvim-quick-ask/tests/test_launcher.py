"""Behavioral checks for window control; no real desktop mutations."""
import importlib.machinery
import importlib.util
import os
from pathlib import Path
import unittest
from unittest.mock import patch

loader = importlib.machinery.SourceFileLoader("quick_ask_launcher", str(Path(__file__).resolve().parents[1] / "bin" / "quick-ask"))
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
             patch.object(launcher, "place_window", side_effect=lambda: events.append("place")), \
             patch.object(launcher, "lua", side_effect=lambda code: events.append(code)):
            launcher.show()
        self.assertEqual(events[0], "on_show")
        self.assertIn("toggle_special", events[1])
        self.assertEqual(events[2], "place")
        self.assertIn("nvim-quick-ask", events[3])

    def test_scaled_main_monitor_uses_logical_work_area(self):
        monitor = {"width": 3840, "height": 2160, "scale": 1.6,
                   "transform": 0, "x": 0, "y": 0, "reserved": [0, 35, 0, 0]}
        self.assertEqual(launcher.window_geometry(monitor), (750, 392, 900, 600))

    def test_rotated_secondary_fits_portrait_width_and_global_origin(self):
        for transform in (1, 3, 5, 7):
            with self.subTest(transform=transform):
                monitor = {"width": 1920, "height": 1080, "scale": 1,
                           "transform": transform, "x": 2400, "y": 0, "reserved": [0, 35, 0, 0]}
                self.assertEqual(launcher.window_geometry(monitor), (2490, 678, 900, 600))

    def test_small_scaled_display_shrinks_inside_reserved_area(self):
        monitor = {"width": 1280, "height": 720, "scale": 2,
                   "transform": 0, "x": -640, "y": -400, "reserved": [10, 30, 20, 10]}
        self.assertEqual(launcher.window_geometry(monitor), (-606, -346, 562, 272))

    def test_placement_targets_window_address_and_its_actual_monitor(self):
        primary = {"id": 1, "focused": True, "width": 3840, "height": 2160,
                   "scale": 1.6, "transform": 0, "x": 0, "y": 0, "reserved": [0, 35, 0, 0]}
        secondary = {"id": 0, "focused": False, "width": 1920, "height": 1080,
                     "scale": 1, "transform": 3, "x": 2400, "y": 0, "reserved": [0, 35, 0, 0]}
        client = {"address": "0x1234", "monitor": 0, "at": [3150, 393], "size": [900, 600]}
        with patch.object(launcher, "clients", return_value=[client]), \
             patch.object(launcher, "hypr_json", return_value=[primary, secondary]), \
             patch.object(launcher, "lua") as dispatch:
            launcher.place_window()
        code = dispatch.call_args.args[0]
        self.assertEqual(code.count('window="address:0x1234"'), 2)
        self.assertIn('resize({window="address:0x1234",x=900,y=600,relative=false})', code)
        self.assertIn('move({window="address:0x1234",x=2490,y=678,relative=false})', code)

    def test_show_refits_existing_visible_window(self):
        with patch.object(launcher, "ensure_started"), \
             patch.object(launcher, "visible", return_value=True), \
             patch.object(launcher, "notify_nvim") as notify, \
             patch.object(launcher, "place_window") as place, \
             patch.object(launcher, "lua") as dispatch:
            launcher.show()
        notify.assert_not_called()
        place.assert_called_once_with()
        self.assertIn('focus', dispatch.call_args.args[0])

    def test_stop_waits_for_window_exit_before_allowing_restart(self):
        with patch.object(launcher, "clients", side_effect=[[{"class": launcher.APP_ID}], [{"class": launcher.APP_ID}], []]) as clients, \
             patch.object(launcher, "hide"), \
             patch.object(launcher, "runtime_dir", return_value=Path("/tmp/quick-ask-test")), \
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
        self.assertEqual(env["NVIM_APPNAME"], "nvim-quick-ask")
        for name in ("NVIM", "NVIM_LISTEN_ADDRESS", "VIMINIT"):
            self.assertNotIn(name, env)


if __name__ == "__main__":
    unittest.main()

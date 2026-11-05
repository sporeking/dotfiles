"""Native Pi launcher checks; no real desktop, Pi, auth or user config mutations."""
import importlib.machinery
import importlib.util
import os
from pathlib import Path
import select
import signal
import socket
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

loader = importlib.machinery.SourceFileLoader("quick_ask_launcher", str(Path(__file__).resolve().parents[1] / "bin" / "quick-ask"))
spec = importlib.util.spec_from_loader(loader.name, loader)
launcher = importlib.util.module_from_spec(spec)
loader.exec_module(launcher)


class LauncherTests(unittest.TestCase):
    def test_hiding_hidden_window_does_not_reopen_or_interrupt_pi(self):
        with patch.object(launcher, "clients", return_value=[{"class": launcher.APP_ID}]), \
             patch.object(launcher, "visible", return_value=False), \
             patch.object(launcher, "remote") as remote, patch.object(launcher, "lua") as dispatch:
            launcher.hide()
        dispatch.assert_not_called()
        remote.assert_not_called()

    def test_hiding_visible_window_only_changes_workspace_visibility(self):
        with patch.object(launcher, "clients", return_value=[{"class": launcher.APP_ID}]), \
             patch.object(launcher, "visible", return_value=True), \
             patch.object(launcher, "remote") as remote, patch.object(launcher, "lua") as dispatch:
            launcher.hide()
        self.assertIn("toggle_special", dispatch.call_args.args[0])
        remote.assert_not_called()

    def test_show_places_and_focuses_window_after_workspace_moves(self):
        events = []
        with patch.object(launcher, "ensure_started", side_effect=lambda: events.append("start")), \
             patch.object(launcher, "visible", return_value=False), \
             patch.object(launcher, "place_window", side_effect=lambda: events.append("place")), \
             patch.object(launcher, "lua", side_effect=events.append):
            launcher.show()
        self.assertEqual(events[0], "start")
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
        with patch.object(launcher, "ensure_started"), patch.object(launcher, "visible", return_value=True), \
             patch.object(launcher, "place_window") as place, patch.object(launcher, "lua") as dispatch:
            launcher.show()
        place.assert_called_once_with()
        self.assertIn('focus', dispatch.call_args.args[0])

    def test_ordinary_kitty_windows_are_ignored(self):
        with patch.object(launcher, "hypr_json", return_value=[{"class": "kitty"}, {"class": "Alacritty"}, {"class": launcher.APP_ID}]):
            self.assertEqual(launcher.clients(), [{"class": launcher.APP_ID}])

    def test_config_defaults_do_not_read_or_create_legacy_database(self):
        with tempfile.TemporaryDirectory() as directory:
            data = Path(directory)
            with patch.dict(os.environ, {"HOME": directory, "QUICK_ASK_CONFIG": str(data / "absent.toml"), "QUICK_ASK_DB": str(data / "db/history.sqlite3")}):
                command, workspace, sessions = launcher.launch_settings()
            self.assertEqual(command, "pi")
            self.assertEqual(workspace, data / "agent-workspace")
            self.assertEqual(sessions, data / "db/sessions")
            self.assertFalse((data / "db").exists())

    def test_config_uses_only_workspace_and_executable_ignoring_old_options(self):
        with tempfile.TemporaryDirectory() as directory:
            data = Path(directory)
            config = data / "config.toml"
            config.write_text('[agent]\nworkspace = "~/outside folder"\n[pi]\ncommand = "/custom/pi"\nthinking = 123\nmodel = false\n[ui]\ninput_method = "obsolete"\n')
            db = data / "history.sqlite3"
            db.write_bytes(b'legacy records stay byte-identical')
            with patch.dict(os.environ, {"HOME": directory, "QUICK_ASK_CONFIG": str(config), "QUICK_ASK_DB": str(db)}):
                command, workspace, sessions = launcher.launch_settings()
            self.assertEqual((command, workspace, sessions), ("/custom/pi", data / "outside folder", data / "sessions"))
            self.assertEqual(db.read_bytes(), b'legacy records stay byte-identical')

    def test_bad_launcher_config_is_rejected(self):
        for text in ('[agent]\nworkspace = false', '[pi]\ncommand = ""', 'pi = false'):
            with self.subTest(text=text), tempfile.TemporaryDirectory() as directory:
                path = Path(directory) / 'config.toml'; path.write_text(text)
                with patch.dict(os.environ, {"QUICK_ASK_CONFIG": str(path)}):
                    with self.assertRaises(ValueError): launcher.launch_settings()

    def test_native_pi_command_inherits_models_extensions_and_user_kitty_styling(self):
        with patch.object(launcher, "control_socket", return_value=Path('/private/run/kitty.sock')):
            command = launcher.kitty_command('/custom/pi', Path('/private/data/sessions'))
        self.assertEqual(command[:7], ['kitty', '--class', 'nvim-quick-ask', '--title', 'Pi', '--session', 'none'])
        self.assertEqual(command[command.index('/custom/pi'):], ['/custom/pi', '--tui-mode', 'fullscreen', '--session-dir', '/private/data/sessions', '--continue', '--extension', str(launcher.ROOT / 'extensions/vim-navigation.ts')])
        for flag in ('--config', '--model', '--provider', '--thinking', '--mode', '--no-extensions', '--no-mcp', '--system-prompt'):
            self.assertNotIn(flag, command)
        self.assertIn('allow_remote_control=socket-only', command)
        self.assertFalse(any('background=' in value or 'foreground=' in value for value in command))

    def test_remote_control_uses_only_private_socket_without_password_prompts(self):
        with patch.object(launcher, "control_socket", return_value=Path('/private/kitty.sock')), patch.object(launcher, 'run', return_value='screen') as run:
            self.assertEqual(launcher.remote('get-text'), 'screen')
        self.assertEqual(run.call_args.args[0], ['kitty', '@', '--to', 'unix:/private/kitty.sock', '--use-password', 'never', 'get-text'])

    def test_started_window_needs_no_neovim_or_backend(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); (root / 'extensions').mkdir(); (root / 'extensions/vim-navigation.ts').touch()
            workspace, sessions = root / 'workspace', root / 'data/sessions'
            runtime = root / 'run'; runtime.mkdir(); (runtime / 'kitty.sock').touch()
            process = Mock(pid=1234); process.poll.return_value = None
            with patch.object(launcher, 'ROOT', root), patch.object(launcher, 'launch_settings', return_value=('pi', workspace, sessions)), \
                 patch.object(launcher, 'runtime_dir', return_value=runtime), patch.object(launcher, 'clients', side_effect=[[], [{'pid': 1234}]]), \
                 patch.object(launcher.shutil, 'which', side_effect=lambda name: '/bin/' + name) as which, \
                 patch.object(launcher, 'configure_rule'), patch.object(launcher, 'clear_stale_socket'), patch.object(launcher, 'remember_children'), \
                 patch.object(launcher.subprocess, 'Popen', return_value=process) as popen, patch.object(launcher, 'remote', return_value='[{"id":1}]'):
                launcher.ensure_started()
            self.assertTrue(workspace.is_dir()); self.assertTrue(sessions.is_dir())
            self.assertEqual([call.args[0] for call in which.call_args_list], ['pi', 'kitty', 'hyprctl'])
            args = popen.call_args
            self.assertEqual(args.kwargs['cwd'], workspace)
            self.assertTrue(args.kwargs['start_new_session'])
            self.assertEqual(args.kwargs['umask'], 0o077)
            self.assertEqual(args.kwargs['env'], dict(os.environ))
            self.assertIn('--continue', args.args[0])

    def test_stop_requests_native_shutdown_then_waits_and_cleans_only_owned_tree(self):
        own = {100: 'born'}
        def remember(owned, root_pid=None): owned.update(own)
        with patch.object(launcher, 'clients', side_effect=[[{'pid': 100}], [{'pid': 100}], [], [], []]), \
             patch.object(launcher, 'remember_children', side_effect=remember), patch.object(launcher, 'remote') as remote, \
             patch.object(launcher, 'clean_children') as cleanup, patch.object(launcher.time, 'sleep') as pause:
            launcher.stop()
        remote.assert_called_once_with('signal-child', '--match', 'all', 'SIGTERM')
        cleanup.assert_called_once_with(own)
        pause.assert_called_once()

    def test_recycled_pid_is_never_signaled(self):
        with patch.object(launcher, 'process_identity', side_effect=lambda pid: (1, 'new-birth') if pid == 123 else (1, 'original')), \
             patch.object(launcher.os, 'kill') as kill:
            launcher.signal_owned({123: 'old-birth', 456: 'original'}, signal.SIGTERM)
        kill.assert_called_once_with(456, signal.SIGTERM)

    def test_cleanup_reaps_owned_parent_and_detached_command_child(self):
        # A tiny ordinary Python process tree, not Pi/Kitty. Ignoring SIGTERM
        # forces the same fallback needed when a tool or terminal is stuck.
        script = ('import subprocess,sys,signal,time; '
                  'signal.signal(signal.SIGTERM,signal.SIG_IGN); '
                  'child=subprocess.Popen([sys.executable,"-c","import time;time.sleep(30)"],start_new_session=True); '
                  'print(child.pid,flush=True);time.sleep(30)')
        process = subprocess.Popen([sys.executable, '-c', script], stdout=subprocess.PIPE,
                                   stderr=subprocess.DEVNULL, start_new_session=True)
        owned = {}
        try:
            self.assertTrue(select.select([process.stdout], [], [], 3)[0], 'fixture startup timed out')
            child = int(process.stdout.readline())
            launcher.remember_children(owned, process.pid)
            self.assertIn(child, owned)
            launcher.clean_children(owned)
            process.wait(timeout=2)
            self.assertFalse(launcher.alive(owned))
        finally:
            launcher.remember_children(owned, process.pid)
            launcher.signal_owned(owned, signal.SIGKILL)
            if process.poll() is None: process.wait(timeout=2)
            process.stdout.close()

    def test_stop_falls_back_to_close_then_owned_cleanup_when_ui_unresponsive(self):
        with patch.object(launcher, 'clients', side_effect=[[{'pid': 100}], [{'pid': 100}], [{'pid': 100}], []]), \
             patch.object(launcher, 'remember_children'), patch.object(launcher, 'remote', side_effect=[RuntimeError('unresponsive'), '']) as remote, \
             patch.object(launcher, 'clean_children') as cleanup, patch.object(launcher.time, 'monotonic', side_effect=[0, 5, 5]):
            launcher.stop()
        self.assertEqual(remote.call_args_list[1].args, ('close-window', '--match', 'all'))
        cleanup.assert_called_once_with({})

    def test_duplicate_windows_are_not_stopped_together(self):
        with patch.object(launcher, 'clients', return_value=[{'pid': 100}, {'pid': 200}]), patch.object(launcher, 'remote') as remote:
            with self.assertRaisesRegex(RuntimeError, 'Multiple'): launcher.stop()
        remote.assert_not_called()

    def test_live_socket_with_missing_window_is_not_unlinked(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'kitty.sock'
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as server:
                server.bind(str(path)); server.listen()
                with patch.object(launcher, 'control_socket', return_value=path):
                    with self.assertRaisesRegex(RuntimeError, 'live'): launcher.clear_stale_socket()
                self.assertTrue(path.exists())

    def test_dead_socket_can_be_recreated_without_touching_other_runtime_data(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'kitty.sock'
            with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as server: server.bind(str(path))
            history = Path(directory) / 'history.sqlite3'; history.write_bytes(b'keep')
            with patch.object(launcher, 'control_socket', return_value=path): launcher.clear_stale_socket()
            self.assertFalse(path.exists()); self.assertEqual(history.read_bytes(), b'keep')


if __name__ == "__main__":
    unittest.main()

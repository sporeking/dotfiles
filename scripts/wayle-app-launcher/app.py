#!/usr/bin/python3

from __future__ import annotations

import sys
from pathlib import Path
from typing import Callable, Sequence

import gi

gi.require_version("Gdk", "4.0")
gi.require_version("Gio", "2.0")
gi.require_version("Gtk", "4.0")
gi.require_version("Gtk4LayerShell", "1.0")

from gi.repository import Gdk, Gio, GLib, Gtk, Gtk4LayerShell, Pango

from launcher_core import (
    AppRecord,
    LauncherStateError,
    favorite_records,
    load_favorites,
    save_favorites,
    search_records,
)


APPLICATION_ID = "com.sporeking.WayleAppLauncher"
STATE_PATH = Path(GLib.get_user_state_dir()) / "wayle-app-launcher" / "favorites.json"


class ApplicationDiscoveryError(RuntimeError):
    """Raised when the desktop-entry registry cannot be represented safely."""


def discover_apps(
    provider: Callable[[], Sequence[object]] | None = None,
) -> list[AppRecord]:
    source = provider or Gio.AppInfo.get_all
    try:
        app_infos = source()
    except GLib.Error as exc:
        raise ApplicationDiscoveryError(
            f"cannot enumerate desktop applications: {exc}"
        ) from exc
    except Exception as exc:
        raise ApplicationDiscoveryError(
            f"cannot enumerate desktop applications: {exc}"
        ) from exc

    records: list[AppRecord] = []
    seen_ids: set[str] = set()
    for app_info in app_infos:
        try:
            if not app_info.should_show():
                continue
            desktop_id = app_info.get_id()
            name = app_info.get_display_name()
            generic_name = app_info.get_generic_name() or ""
        except Exception as exc:
            raise ApplicationDiscoveryError(
                f"invalid desktop-entry metadata: {exc}"
            ) from exc

        if not desktop_id:
            raise ApplicationDiscoveryError(
                f"visible application {name!r} has no desktop-entry ID"
            )
        if desktop_id in seen_ids:
            raise ApplicationDiscoveryError(
                f"desktop-entry registry contains duplicate ID {desktop_id!r}"
            )
        if not name or not name.strip():
            raise ApplicationDiscoveryError(
                f"desktop-entry {desktop_id!r} has no display name"
            )

        seen_ids.add(desktop_id)
        records.append(AppRecord(desktop_id, name, generic_name, app_info))

    return sorted(
        records,
        key=lambda record: (record.name.casefold(), record.desktop_id.casefold()),
    )


class LauncherWindow(Gtk.ApplicationWindow):
    WIDTH = 720
    HEIGHT = 650

    def __init__(self, application: Gtk.Application):
        super().__init__(application=application)
        self.set_name("launcher-window")
        self.set_title("应用程序")
        self.set_default_size(self.WIDTH, self.HEIGHT)
        self.set_resizable(False)
        self.set_hide_on_close(True)

        if not Gtk4LayerShell.is_supported():
            raise RuntimeError("gtk4-layer-shell is not supported by this Wayland session")
        Gtk4LayerShell.init_for_window(self)
        Gtk4LayerShell.set_namespace(self, "wayle-app-launcher")
        Gtk4LayerShell.set_layer(self, Gtk4LayerShell.Layer.OVERLAY)
        Gtk4LayerShell.set_anchor(self, Gtk4LayerShell.Edge.TOP, True)
        Gtk4LayerShell.set_anchor(self, Gtk4LayerShell.Edge.RIGHT, True)
        Gtk4LayerShell.set_margin(self, Gtk4LayerShell.Edge.TOP, 52)
        Gtk4LayerShell.set_margin(self, Gtk4LayerShell.Edge.RIGHT, 18)
        Gtk4LayerShell.set_exclusive_zone(self, 0)
        Gtk4LayerShell.set_keyboard_mode(
            self,
            Gtk4LayerShell.KeyboardMode.EXCLUSIVE,
        )
        Gtk4LayerShell.set_respect_close(self, True)

        self.mode = "favorites"
        self.favorite_ids: list[str] = []
        self.records: list[AppRecord] = []
        self._fatal_error: str | None = None
        self._runtime_error: str | None = None
        self._css_error: str | None = None
        self._icon_errors: list[str] = []
        self._active_popover: Gtk.Popover | None = None

        try:
            self.records = discover_apps()
            available_ids = {record.desktop_id for record in self.records}
            self.favorite_ids = load_favorites(STATE_PATH, available_ids)
        except (ApplicationDiscoveryError, LauncherStateError) as exc:
            self._fatal_error = str(exc)

        self._build_ui()
        self._install_css()
        self._render()
        self.connect("notify::is-active", self._on_active_changed)

    def _build_ui(self) -> None:
        panel = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=0)
        panel.add_css_class("launcher-panel")
        self.set_child(panel)

        header = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=12)
        header.add_css_class("launcher-header")
        panel.append(header)

        title_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=2)
        title_box.set_hexpand(True)
        header.append(title_box)

        self.title_label = Gtk.Label(xalign=0)
        self.title_label.add_css_class("launcher-title")
        title_box.append(self.title_label)

        self.result_label = Gtk.Label(xalign=0)
        self.result_label.add_css_class("launcher-result-count")
        title_box.append(self.result_label)

        self.toggle_button = Gtk.Button()
        self.toggle_button.add_css_class("view-toggle")
        self.toggle_button.connect("clicked", self._toggle_view)
        toggle_content = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=7)
        self.toggle_icon = Gtk.Image()
        self.toggle_icon.set_pixel_size(16)
        toggle_content.append(self.toggle_icon)
        self.toggle_label = Gtk.Label()
        toggle_content.append(self.toggle_label)
        self.toggle_button.set_child(toggle_content)
        header.append(self.toggle_button)

        self.search_entry = Gtk.SearchEntry()
        self.search_entry.set_focusable(True)
        self.search_entry.set_placeholder_text("搜索应用...")
        self.search_entry.set_hexpand(True)
        self.search_entry.add_css_class("launcher-search")
        self.search_entry.connect("search-changed", self._search_changed)
        self.search_entry.connect("activate", self._search_activated)
        panel.append(self.search_entry)

        self.status_label = Gtk.Label()
        self.status_label.set_wrap(True)
        self.status_label.set_xalign(0)
        self.status_label.add_css_class("launcher-status")
        self.status_label.set_visible(False)
        panel.append(self.status_label)

        scrolled = Gtk.ScrolledWindow()
        scrolled.set_vexpand(True)
        scrolled.set_hexpand(True)
        scrolled.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
        scrolled.add_css_class("launcher-scrolled")
        panel.append(scrolled)

        self.flow = Gtk.FlowBox()
        self.flow.set_selection_mode(Gtk.SelectionMode.NONE)
        self.flow.set_homogeneous(True)
        self.flow.set_min_children_per_line(4)
        self.flow.set_max_children_per_line(4)
        self.flow.set_row_spacing(10)
        self.flow.set_column_spacing(10)
        self.flow.set_valign(Gtk.Align.START)
        self.flow.set_hexpand(True)
        self.flow.set_vexpand(True)
        scrolled.set_child(self.flow)

        key_controller = Gtk.EventControllerKey()
        key_controller.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)
        key_controller.connect("key-pressed", self._key_pressed)
        self.add_controller(key_controller)

    def _install_css(self) -> None:
        display = Gdk.Display.get_default()
        if display is None:
            self._css_error = "无法获取 GTK 显示对象"
            return

        provider = Gtk.CssProvider()
        css_path = Path(__file__).with_name("style.css")
        try:
            provider.load_from_path(str(css_path))
            Gtk.StyleContext.add_provider_for_display(
                display,
                provider,
                Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
            )
        except (GLib.Error, OSError) as exc:
            self._css_error = f"无法加载 launcher 样式 {css_path}: {exc}"

    def _toggle_view(self, _button: Gtk.Button) -> None:
        self._set_mode("all" if self.mode == "favorites" else "favorites")

    def _set_mode(self, mode: str) -> None:
        if mode not in {"favorites", "all"}:
            raise ValueError(f"unknown launcher view: {mode}")
        self.mode = mode
        self._runtime_error = None
        self.search_entry.set_text("")
        self._render()
        self.focus_search()

    def focus_search(self) -> bool:
        self.set_focus(self.search_entry)
        self.search_entry.grab_focus()
        return GLib.SOURCE_REMOVE

    def _search_changed(self, _entry: Gtk.SearchEntry) -> None:
        self._runtime_error = None
        self._render()

    def _search_activated(self, _entry: Gtk.SearchEntry) -> None:
        visible = self._visible_records()
        if len(visible) == 1:
            self._launch(visible[0])

    def _visible_records(self) -> list[AppRecord]:
        query = self.search_entry.get_text()
        if self.mode == "favorites":
            records = favorite_records(self.records, self.favorite_ids)
        else:
            records = self.records
        return search_records(records, query)

    def _render(self) -> None:
        self._clear_grid()
        self._icon_errors = []

        if self.mode == "favorites":
            self.title_label.set_text("固定收藏")
            self.toggle_label.set_text("全部应用")
            self.toggle_icon.set_from_icon_name("view-grid-symbolic")
        else:
            self.title_label.set_text("全部应用")
            self.toggle_label.set_text("固定收藏")
            self.toggle_icon.set_from_icon_name("starred-symbolic")

        try:
            visible = self._visible_records() if not self._fatal_error else []
        except LauncherStateError as exc:
            self._fatal_error = str(exc)
            visible = []

        self.result_label.set_text(f"{len(visible)} 个应用")
        if self._fatal_error:
            self.toggle_button.set_sensitive(False)
            self.search_entry.set_sensitive(False)
            self._refresh_status()
            return

        self.toggle_button.set_sensitive(True)
        self.search_entry.set_sensitive(True)
        query = self.search_entry.get_text().strip()
        if self.mode == "favorites" and not query:
            self.flow.append(self._make_all_apps_tile())
        for record in visible:
            self.flow.append(self._make_app_tile(record))
        self._refresh_status(visible_count=len(visible), has_all_apps_tile=not query)

    def _clear_grid(self) -> None:
        child = self.flow.get_first_child()
        while child is not None:
            next_child = child.get_next_sibling()
            self.flow.remove(child)
            child = next_child

    def _make_all_apps_tile(self) -> Gtk.Button:
        button = Gtk.Button()
        button.set_size_request(148, 116)
        button.add_css_class("app-tile")
        button.add_css_class("all-apps-tile")
        button.set_tooltip_text("查看全部应用")
        button.connect("clicked", lambda _button: self._set_mode("all"))

        content = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=8)
        content.set_halign(Gtk.Align.CENTER)
        content.set_valign(Gtk.Align.CENTER)
        icon = Gtk.Image.new_from_icon_name("view-grid-symbolic")
        icon.set_pixel_size(48)
        content.append(icon)
        label = Gtk.Label(label="全部应用")
        label.add_css_class("app-name")
        content.append(label)
        button.set_child(content)
        return button

    def _make_app_tile(self, record: AppRecord) -> Gtk.Button:
        button = Gtk.Button()
        button.set_size_request(148, 116)
        button.add_css_class("app-tile")
        button.set_tooltip_text(record.name)
        button.connect("clicked", lambda _button, app=record: self._launch(app))

        content = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=8)
        content.set_halign(Gtk.Align.CENTER)
        content.set_valign(Gtk.Align.CENTER)
        image = self._make_app_icon(record)
        content.append(image)

        label = Gtk.Label(label=record.name)
        label.add_css_class("app-name")
        label.set_max_width_chars(17)
        label.set_wrap(True)
        label.set_wrap_mode(Pango.WrapMode.WORD_CHAR)
        label.set_lines(2)
        label.set_ellipsize(Pango.EllipsizeMode.END)
        label.set_justify(Gtk.Justification.CENTER)
        label.set_xalign(0.5)
        content.append(label)
        button.set_child(content)

        gesture = Gtk.GestureClick()
        gesture.set_button(3)
        gesture.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)
        gesture.connect("pressed", self._show_context_menu, button, record)
        button.add_controller(gesture)
        return button

    def _make_app_icon(self, record: AppRecord) -> Gtk.Image:
        try:
            icon = record.app_info.get_icon() if record.app_info is not None else None
        except Exception as exc:
            self._icon_errors.append(f"{record.desktop_id}: {exc}")
            icon = None

        if icon is None:
            self._icon_errors.append(f"{record.desktop_id}: no icon")
            image = Gtk.Image.new_from_icon_name("image-missing")
        else:
            image = Gtk.Image.new_from_gicon(icon)
        image.set_pixel_size(48)
        image.add_css_class("app-icon")
        return image

    def _show_context_menu(
        self,
        gesture: Gtk.GestureClick,
        _n_press: int,
        x: float,
        y: float,
        button: Gtk.Button,
        record: AppRecord,
    ) -> None:
        gesture.set_state(Gtk.EventSequenceState.CLAIMED)
        if self._active_popover is not None:
            self._active_popover.popdown()

        popover = Gtk.Popover()
        popover.set_parent(button)
        popover.set_has_arrow(True)
        popover.set_autohide(True)
        popover.set_position(Gtk.PositionType.BOTTOM)
        popover.set_pointing_to(Gdk.Rectangle(int(x), int(y), 1, 1))
        popover.connect("closed", self._popover_closed)

        menu = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=3)
        menu.add_css_class("context-menu")
        open_button = self._make_menu_button("打开")
        open_button.connect("clicked", lambda _button: self._popover_launch(popover, record))
        menu.append(open_button)

        is_favorite = record.desktop_id in self.favorite_ids
        favorite_button = self._make_menu_button(
            "移除固定收藏" if is_favorite else "加入固定收藏"
        )
        favorite_button.connect(
            "clicked",
            lambda _button: self._popover_change_favorite(
                popover,
                record,
                add=not is_favorite,
            ),
        )
        menu.append(favorite_button)
        popover.set_child(menu)
        self._active_popover = popover
        popover.popup()

    @staticmethod
    def _make_menu_button(label: str) -> Gtk.Button:
        button = Gtk.Button(label=label)
        button.set_has_frame(False)
        button.add_css_class("context-menu-button")
        return button

    def _popover_launch(self, popover: Gtk.Popover, record: AppRecord) -> None:
        popover.popdown()
        self._launch(record)

    def _popover_change_favorite(
        self,
        popover: Gtk.Popover,
        record: AppRecord,
        add: bool,
    ) -> None:
        popover.popdown()
        candidate = list(self.favorite_ids)
        if add:
            if record.desktop_id in candidate:
                self._runtime_error = (
                    f"应用 {record.desktop_id} 已经在固定收藏中"
                )
                self._refresh_status()
                return
            candidate.append(record.desktop_id)
        else:
            if record.desktop_id not in candidate:
                self._runtime_error = (
                    f"应用 {record.desktop_id} 不在固定收藏中"
                )
                self._refresh_status()
                return
            candidate.remove(record.desktop_id)

        available_ids = {item.desktop_id for item in self.records}
        try:
            save_favorites(STATE_PATH, candidate, available_ids)
        except LauncherStateError as exc:
            self._runtime_error = str(exc)
            self._refresh_status()
            return

        self.favorite_ids = candidate
        self._runtime_error = None
        self._render()

    def _popover_closed(self, popover: Gtk.Popover) -> None:
        if self._active_popover is popover:
            self._active_popover = None
        if popover.get_parent() is not None:
            popover.unparent()

    def _launch(self, record: AppRecord) -> None:
        if record.app_info is None:
            self._runtime_error = f"应用 {record.desktop_id} 没有关联的 desktop-entry"
            self._refresh_status()
            return
        try:
            launched = record.app_info.launch([], None)
        except GLib.Error as exc:
            self._runtime_error = f"无法打开 {record.desktop_id}: {exc}"
            self._refresh_status()
            return
        except Exception as exc:
            self._runtime_error = f"无法打开 {record.desktop_id}: {exc}"
            self._refresh_status()
            return
        if not launched:
            self._runtime_error = f"无法打开 {record.desktop_id}: desktop-entry launch returned false"
            self._refresh_status()
            return
        self.close()

    def _refresh_status(
        self,
        visible_count: int | None = None,
        has_all_apps_tile: bool = False,
    ) -> None:
        message: str | None = None
        error = False
        if self._fatal_error:
            message = self._fatal_error
            error = True
        elif self._runtime_error:
            message = self._runtime_error
            error = True
        elif self._css_error:
            message = self._css_error
            error = True
        elif self._icon_errors:
            examples = ", ".join(self._icon_errors[:3])
            extra = "" if len(self._icon_errors) <= 3 else " ..."
            message = f"{len(self._icon_errors)} 个应用图标加载失败: {examples}{extra}"
            error = True
        elif visible_count == 0 and self.mode == "favorites" and has_all_apps_tile:
            message = "还没有固定收藏。切换到全部应用后，右键应用即可加入。"
        elif visible_count == 0:
            message = "没有匹配的应用"

        if message is None:
            self.status_label.set_visible(False)
            return
        self.status_label.set_text(message)
        self.status_label.remove_css_class("launcher-status-error")
        if error:
            self.status_label.add_css_class("launcher-status-error")
        self.status_label.set_visible(True)

    def _key_pressed(
        self,
        _controller: Gtk.EventControllerKey,
        keyval: int,
        _keycode: int,
        _state: Gdk.ModifierType,
    ) -> bool:
        if keyval == Gdk.KEY_Escape:
            self.close()
            return True
        return False

    def _on_active_changed(self, _window: Gtk.Window, _param: object) -> None:
        if self.get_visible() and not self.is_active() and self._active_popover is None:
            GLib.idle_add(self.close)


class LauncherApplication(Gtk.Application):
    def __init__(self):
        super().__init__(application_id=APPLICATION_ID)
        self.window: LauncherWindow | None = None

    def do_activate(self) -> None:
        if self.window is None:
            self.window = LauncherWindow(self)
        self.window.present()
        GLib.idle_add(self.window.focus_search)


def run_check() -> int:
    try:
        records = discover_apps()
        available_ids = {record.desktop_id for record in records}
        favorites = load_favorites(STATE_PATH, available_ids)
    except (ApplicationDiscoveryError, LauncherStateError) as exc:
        print(f"wayle-app-launcher check failed: {exc}", file=sys.stderr)
        return 1
    print(f"applications={len(records)} favorites={len(favorites)} state={STATE_PATH}")
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    args = list(argv or sys.argv)
    if len(args) == 2 and args[1] == "--check":
        return run_check()
    if len(args) != 1:
        print(f"usage: {args[0]} [--check]", file=sys.stderr)
        return 2
    application = LauncherApplication()
    return application.run([args[0]])


if __name__ == "__main__":
    raise SystemExit(main())

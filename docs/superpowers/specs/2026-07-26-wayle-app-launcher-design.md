# Wayle Application Launcher Design

Date: 2026-07-26

Status: Proposed

## Context

Wayle's dashboard already exposes a right-click action. The launcher should be
opened from that action without modifying Wayle's upstream source, because a
local source fork would create unnecessary merge conflicts. The launcher must
behave like a compact application menu rather than replace the existing Rofi
window/run shortcut.

Rofi 2.0 can enumerate applications, but its installed mouse bindings do not
provide a right-click action that script mode can consume. Using it would make
the requested add/remove-favorite interaction impossible to implement
precisely. The launcher will therefore be a small standalone GTK4 application
using `gtk4-layer-shell`.

## Goals

- Open from the dashboard button's right-click action.
- Show one compact panel with no left navigation sidebar.
- Start in the fixed-favorites view.
- Use one top-right toggle to switch between fixed favorites and all apps.
- Search applications in either view.
- Launch an application with a primary click.
- Add an application to favorites with its secondary-click context menu.
- Remove a favorite with the same secondary-click interaction.
- Persist favorites using desktop-entry IDs, not display names or commands.
- Keep all launcher code and styling outside Wayle's source tree.
- Fail visibly when application metadata or state cannot be read or written;
  do not silently omit entries or overwrite a corrupt state file.

## Non-goals

- Replacing the existing `Super+R` Rofi shortcut.
- Editing or vendoring Wayle source code.
- Implementing an application installer, desktop-entry editor, or settings
  manager.
- Guessing executable commands when a desktop entry cannot be launched.

## User experience

### Favorites view

The panel opens with a search field below the header and a responsive grid of
favorite applications. The top-right button is labeled `全部应用` and switches
to the complete application list. The favorite grid also contains an
`全部应用` entry so the same transition is discoverable without a sidebar.

When no favorites have been configured, the grid shows the all-applications
entry and an explicit empty-state message. The launcher does not invent a
favorite list from installation order.

### All applications view

The top-right button changes to `固定收藏` and returns to the favorites view.
The grid contains every launchable desktop application visible to the current
user, sorted by localized display name and then desktop-entry ID. The search
field filters the list by localized name, generic name, and desktop-entry ID.

### Application actions

- Primary click: launch through the desktop-entry API and close the launcher.
- Secondary click on an unfavorited app: show a context menu with `加入固定收藏`.
- Secondary click on a favorite: show a context menu with `移除固定收藏`.
- The context menu also offers `打开` so the action is explicit and keyboard
  accessible.
- After a favorite mutation, the file is written atomically and the visible
  grid is rebuilt from the new state.

Escape closes the panel. Losing focus closes it after GTK has delivered the
focus transition, except while a launcher context menu is open. A second
invocation focuses the existing window instead of opening a duplicate.

## Layout and visual treatment

The launcher is a single rounded layer-shell panel anchored to the top-right
of the output. It has a stable width and a height constrained to the available
work area, with scrolling for long application lists. The header contains the
title, result count, and one icon-plus-text view toggle. The search entry uses
the existing Wayle font variables where possible, with the application name
font falling back to the system UI font only when the requested font cannot be
loaded.

Application tiles use the desktop-entry icon and localized name. The tile size
is fixed so loading an icon or changing the result count cannot shift the grid.
The implementation uses GTK widgets and CSS rather than embedding a browser or
copying Wayle's internal styles.

## Technical design

### Entry point and integration

The chezmoi source will contain:

- `scripts/wayle-app-launcher/launcher`: executable entry-point wrapper.
- `scripts/wayle-app-launcher/app.py`: GTK4 application and UI.
- `scripts/wayle-app-launcher/launcher_core.py`: testable search and state logic.
- `scripts/wayle-app-launcher/style.css`: launcher-only GTK CSS.

The wrapper executes the application with the system Python interpreter and
uses an absolute path derived from the wrapper location, so it does not depend
on the caller's working directory or `PATH` beyond Python itself. It
preloads `/usr/lib/libgtk4-layer-shell.so`, which is required by the installed
GI binding because the layer-shell library interposes Wayland client symbols.
If that required library is absent, the wrapper exits with an explicit error.

Wayle will receive only this configuration addition:

```toml
[modules.dashboard]
border-show = true
right-click = "/home/sporeking/scripts/wayle-app-launcher/launcher"
```

The existing dashboard left-click action and existing Rofi key binding remain
unchanged.

The launcher window uses layer `overlay`, top/right anchors, and
`KeyboardMode.EXCLUSIVE`. The search entry is explicitly focusable and is
focused from an idle callback after the layer surface is mapped, so the first
invocation is ready for typing.

### Application discovery and launching

The app uses `Gio.AppInfo.get_all()` and filters to applications that are
visible and launchable for the current desktop session. It retains each
application's desktop-entry ID as its identity and uses `Gio.AppInfo.launch()`
to start it. No shell command is assembled from desktop-entry fields.

The displayed name and icon come from `Gio.AppInfo`; sorting uses the
localized display name with the ID as a deterministic tie-breaker. The same
discovery result feeds both the favorites and all-applications views so the
two views cannot disagree about launchability.

### Persistent favorites

Favorites are stored outside the chezmoi source at:

`~/.local/state/wayle-app-launcher/favorites.json`

The file contains a JSON object with a version and an ordered array of desktop
entry IDs:

```json
{
  "version": 1,
  "favorites": ["firefox.desktop", "code.desktop"]
}
```

At startup, the file must be valid JSON, have the expected version, and contain
unique string IDs. Each ID must resolve to a currently visible launchable
desktop entry before it can be rendered as a favorite. A missing entry is a
state error, not an instruction to silently rewrite the user's file.

Writes use a temporary file in the same directory, flush and close it, then
replace the destination with `os.replace()`. The parent directory is created
only when the state file is first needed. A failed write leaves the previous
state untouched and presents an error in the launcher.

## Error behavior

- Discovery failure: show a visible error panel with the underlying exception
  text and disable launching; do not show an empty list as if discovery
  succeeded.
- Invalid favorites file: show the file path and validation error; do not
  truncate, repair, or silently reset it.
- Favorite ID no longer available: show that ID in the error panel and require
  the user to remove or correct the state file; do not silently drop it.
- Launch failure: keep the launcher open and show the application ID plus the
  launch error.
- CSS or icon-load failure: keep the structural UI available and report the
  failed resource in the visible error area. Missing icons use GTK's standard
  missing-image representation rather than a hand-picked substitute.

## Verification

The implementation will be verified with focused tests for desktop-entry
identity, search matching, favorite validation, atomic persistence, and
duplicate favorite rejection. A GTK smoke test will launch the app on the
current Wayland session and verify the favorites/all-apps toggle, search,
secondary-click menu, add/remove persistence, Escape close, and second-launch
single-instance behavior. The deployed Wayle configuration will be checked
with `wayle check` or the available Wayle validation command, then reloaded.

# Wayle Application Launcher Design

Date: 2026-07-26

Status: Implemented

## Context

Wayle's dashboard already exposes a right-click action. The launcher is opened
from that action without modifying Wayle's upstream source, because a local
source fork would create unnecessary merge conflicts. The launcher is a
standalone GTK4 application built with AGS and Astal Apps.

The UI is intentionally compact and aligned with the existing Wayle dashboard:
it opens below the bar at the top-left, has no sidebar, starts in the fixed
favorites view, and uses one icon button to switch between favorites and all
applications.

## Goals

- Open from the dashboard button's right-click action.
- Keep all launcher code and styling outside Wayle's source tree.
- Show a compact top-left panel with no navigation sidebar.
- Start in the fixed-favorites view.
- Switch between fixed favorites and all applications with one top-right button.
- Search applications by name, desktop-entry ID, description, and keywords.
- Launch an application with a primary click.
- Add an application to favorites with its secondary-click context menu.
- Remove a favorite with the same secondary-click interaction.
- Persist favorites using desktop-entry IDs, not display names or commands.
- Close on Escape or a click outside the panel.
- Fail visibly when application metadata or favorite state cannot be read or
  written; do not silently repair invalid state.

## Non-goals

- Replacing the existing `Super+R` Rofi shortcut.
- Editing or vendoring Wayle source code.
- Registering a new Wayle module or dashboard dropdown.
- Implementing an application installer, desktop-entry editor, or settings
  manager.
- Guessing executable commands when a desktop entry cannot be launched.

## User experience

### Favorites view

The panel opens with a search field below the header and a fixed three-column
grid of favorite applications. The header contains the title, result count, and
one icon button that switches to all applications.

On first use, the state file does not exist. The launcher seeds favorites from
an explicit list of common desktop-entry IDs and keeps only entries that are
actually present in the current application catalog. This first-run behavior
is deterministic; once a state file exists, every ID is validated strictly.

### All applications view

The top-right button changes to the favorites icon and returns to the fixed
favorites view. The all-applications grid is populated from Astal Apps and is
sorted by localized display name, with the desktop-entry ID as a deterministic
tie-breaker. Typing in the search field uses Astal Apps fuzzy matching.

### Application actions

- Primary click: launch through the desktop-entry API and close the launcher.
- Secondary click on an unfavorited app: show `加入固定收藏`.
- Secondary click on a favorite: show `移除固定收藏`.
- Both context menus also offer `打开`.
- After a favorite mutation, the state file is replaced and the visible grid is
  rebuilt from the new state.

The Escape key hides the panel. A single full-output layer-shell surface holds
both the dimmed dismiss area and the panel overlay. A capture-phase pointer
gesture computes the panel's exact bounds and hides the surface only when the
press is outside those bounds. A second invocation toggles the existing AGS
instance instead of creating a duplicate.

## Layout and visual treatment

The launcher is a rounded layer-shell panel anchored to the top-left of the
output, below the 35px Wayle bar. It has stable dimensions of 380x420 logical
pixels and a scrollable content area for longer application lists. The header,
search field, quick-action tiles, colors, spacing, and typography are defined
in launcher-local CSS modeled on the current Wayle dashboard palette.

Application tiles use the desktop-entry icon and localized name. Tile sizes are
fixed so loading an icon or changing the result count does not shift the grid.

## Technical design

### Entry point and integration

The chezmoi source contains:

- `dot_config/ags/wayle-launcher/app.tsx`: AGS GTK4 application and UI.
- `dot_config/ags/wayle-launcher/style.css`: launcher-local GTK CSS.
- `scripts/wayle-app-launcher/launcher`: executable toggle/start wrapper.

The wrapper checks that the deployed AGS entry point exists, toggles the named
`wayle-app-launcher` instance when it is already running, and otherwise starts
it with GTK4. AGS and Astal provide the GTK4 and layer-shell integration; the
launcher does not preload `libgtk4-layer-shell.so` or interpose Wayland client
symbols.

Wayle receives only this existing dashboard configuration:

```toml
[modules.dashboard]
border-show = true
right-click = "/home/sporeking/scripts/wayle-app-launcher/launcher"
```

The dashboard left-click action and existing Rofi key binding remain unchanged.
No Wayle source file, module registration, or dropdown implementation is
modified.

The launcher uses one `overlay` layer with exclusive keyboard input and anchors
it to all four output edges. When the surface maps, the launcher resolves its
GDK monitor, validates the monitor geometry, and sizes the input surface to the
full logical output. The panel is a measured `Gtk.Overlay` child aligned to the
top-left; a root capture gesture compares every pointer press against its
computed Graphene bounds. This makes outside-click dismissal independent of
focus changes or idle-cycle timing. Context-menu popovers are owned by the
application tile and remain interactive.

### Application discovery and launching

Astal Apps enumerates visible desktop applications and provides the desktop
entry ID, localized name, icon, metadata, fuzzy search, and launch operation.
The launcher keeps the desktop-entry ID as the application identity and calls
the Astal Apps launch API. No shell command is assembled from desktop-entry
fields.

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

At startup, an existing file must be valid JSON, have the expected version,
contain only the known fields, and contain unique IDs that resolve to visible,
launchable desktop entries. An invalid file or unavailable ID is displayed as
an explicit state error; it is not truncated, repaired, or silently rewritten.

Writes validate the complete next state, create the parent directory when
needed, and replace the destination using Gio's replacement API. A failed
write leaves the previous state untouched and displays the write error.

## Error behavior

- Discovery failure: show a visible error message and do not present a false
  empty result.
- Invalid favorites file: show the path-derived state error and do not reset it.
- Unavailable favorite ID: show the exact desktop-entry ID in the error.
- Launch failure: keep the launcher open and show the entry ID plus the error.
- Favorite write failure: keep the prior in-memory state and show the error.

## Verification

- AGS GTK4 runtime compilation and startup completed on the current Wayland
  session without launcher errors.
- The rendered panel was inspected with a screenshot: it is nonblank, uses the
  Wayle-aligned palette, and is positioned at the top-left below the bar.
- `hyprctl layers -j` showed one `wayle-app-launcher` surface covering the full
  `1920x1200` logical output.
- An injected primary click inside the panel kept the launcher visible; a click
  at `1000,900` outside the panel removed the launcher layer immediately while
  the named AGS instance remained running.
- Calling the configured wrapper after dismissal reopened the same instance at
  the full output size and did not create a duplicate launcher layer.
- The old Python launcher process was stopped before the single-instance test.
- The dashboard configuration still points to the same wrapper and no Wayle
  source file is part of this implementation.

The context-menu add/remove flow remains implemented by GTK gesture/popover
handlers and needs a final manual right-click check in the running desktop.

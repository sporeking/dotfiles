import app from "ags/gtk4/app"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import Apps from "gi://AstalApps?version=0.1"
import Gio from "gi://Gio?version=2.0"
import GLib from "gi://GLib?version=2.0"
import Pango from "gi://Pango?version=1.0"

const INSTANCE_NAME = "wayle-app-launcher"
const LAUNCHER_WINDOW_NAME = "launcher"
const STATE_VERSION = 1
const WIDTH = 380
const HEIGHT = 420
const STATE_PATH = GLib.build_filenamev([
    GLib.get_user_state_dir(),
    "wayle-app-launcher",
    "favorites.json",
])
const CSS_PATH = GLib.build_filenamev([
    GLib.get_user_config_dir(),
    "ags",
    "wayle-launcher",
    "style.css",
])

const DEFAULT_FAVORITES = [
    "kitty.desktop",
    "org.gnome.Nautilus.desktop",
    "microsoft-edge.desktop",
    "firefox.desktop",
    "code.desktop",
    "obsidian.desktop",
]

type DesktopApplication = Apps.Application
type ViewMode = "favorites" | "all"

type FavoriteState = {
    version: number
    favorites: string[]
}

function errorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    if (typeof error === "object" && error !== null && "message" in error) {
        return String(error.message)
    }
    return String(error)
}

function decodeContents(contents: Uint8Array): string {
    return new TextDecoder("utf-8", { fatal: true }).decode(contents)
}

function catalogByEntry(apps: Apps.Apps): Map<string, DesktopApplication> {
    const catalog = new Map<string, DesktopApplication>()
    for (const application of apps.list) {
        if (!application.entry || !application.name.trim()) {
            throw new Error("AstalApps returned an application without an entry or name")
        }
        if (catalog.has(application.entry)) {
            throw new Error(`AstalApps returned duplicate desktop entry ${application.entry}`)
        }
        catalog.set(application.entry, application)
    }
    return catalog
}

function validateFavoriteIds(
    favorites: unknown,
    catalog: Map<string, DesktopApplication>,
): string[] {
    if (!Array.isArray(favorites)) {
        throw new Error("favorites must be an array")
    }

    const result: string[] = []
    const seen = new Set<string>()
    favorites.forEach((value, index) => {
        if (typeof value !== "string" || !value.trim()) {
            throw new Error(`favorites[${index}] must be a non-empty desktop-entry ID`)
        }
        if (!catalog.has(value)) {
            throw new Error(`favorites[${index}] references unavailable desktop entry ${value}`)
        }
        if (seen.has(value)) {
            throw new Error(`favorites[${index}] duplicates desktop entry ${value}`)
        }
        seen.add(value)
        result.push(value)
    })
    return result
}

function loadFavorites(catalog: Map<string, DesktopApplication>): string[] {
    const file = Gio.File.new_for_path(STATE_PATH)
    if (!file.query_exists(null)) {
        return DEFAULT_FAVORITES.filter((entry) => catalog.has(entry))
    }

    const [, contents] = file.load_contents(null)
    const state = JSON.parse(decodeContents(contents)) as Partial<FavoriteState>
    if (state.version !== STATE_VERSION) {
        throw new Error(`unsupported favorites state version: ${String(state.version)}`)
    }
    if (Object.keys(state).some((key) => key !== "version" && key !== "favorites")) {
        throw new Error("favorites state contains unknown fields")
    }
    return validateFavoriteIds(state.favorites, catalog)
}

function saveFavorites(
    favorites: string[],
    catalog: Map<string, DesktopApplication>,
): void {
    const validated = validateFavoriteIds(favorites, catalog)
    const parent = Gio.File.new_for_path(GLib.path_get_dirname(STATE_PATH))
    if (!parent.query_exists(null)) {
        parent.make_directory_with_parents(null)
    }

    const payload = `${JSON.stringify({
        version: STATE_VERSION,
        favorites: validated,
    }, null, 2)}\n`
    const file = Gio.File.new_for_path(STATE_PATH)
    const [success] = file.replace_contents(
        payload,
        null,
        false,
        Gio.FileCreateFlags.REPLACE_DESTINATION,
        null,
    )
    if (!success) {
        throw new Error(`cannot replace favorites file ${STATE_PATH}`)
    }
}

function normalized(value: string): string {
    return value.trim().toLocaleLowerCase()
}

function matches(application: DesktopApplication, query: string): boolean {
    const needle = normalized(query)
    if (!needle) {
        return true
    }
    return [
        application.name,
        application.entry,
        application.description,
        ...application.keywords,
    ].some((value) => typeof value === "string" && normalized(value).includes(needle))
}

function sortedApplications(applications: DesktopApplication[]): DesktopApplication[] {
    return [...applications].sort((left, right) =>
        normalized(left.name).localeCompare(normalized(right.name))
        || left.entry.localeCompare(right.entry))
}

function makeMenuButton(iconName: string, label: string): Gtk.Button {
    const button = Gtk.Button.new()
    button.add_css_class("launcher-menu-item")
    button.set_has_frame(false)

    const content = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    })
    const icon = Gtk.Image.new_from_icon_name(iconName)
    icon.set_pixel_size(16)
    content.append(icon)
    content.append(Gtk.Label.new(label))
    button.set_child(content)
    return button
}

class LauncherController {
    readonly window: Astal.Window
    readonly dismissWindow: Astal.Window

    private readonly apps: Apps.Apps
    private readonly catalog: Map<string, DesktopApplication>
    private readonly title: Gtk.Label
    private readonly resultCount: Gtk.Label
    private readonly toggleButton: Gtk.Button
    private readonly toggleIcon: Gtk.Image
    private readonly search: Gtk.SearchEntry
    private readonly status: Gtk.Label
    private readonly grid: Gtk.FlowBox
    private favoriteIds: string[] = []
    private mode: ViewMode = "favorites"
    private contextMenu: Gtk.Popover | null = null
    private stateError: string | null = null

    constructor() {
        this.apps = new Apps.Apps()
        this.apps.show_hidden = false
        this.catalog = catalogByEntry(this.apps)

        try {
            this.favoriteIds = loadFavorites(this.catalog)
        } catch (error) {
            this.stateError = errorMessage(error)
        }

        this.dismissWindow = new Astal.Window()
        this.dismissWindow.name = "wayle-launcher-dismiss"
        this.dismissWindow.namespace = "wayle-app-launcher-dismiss"
        this.dismissWindow.layer = Astal.Layer.TOP
        this.dismissWindow.exclusivity = Astal.Exclusivity.IGNORE
        this.dismissWindow.keymode = Astal.Keymode.NONE
        this.dismissWindow.anchor = Astal.WindowAnchor.TOP
            | Astal.WindowAnchor.RIGHT
            | Astal.WindowAnchor.BOTTOM
            | Astal.WindowAnchor.LEFT

        const dismissSurface = Gtk.Button.new()
        dismissSurface.set_has_frame(false)
        dismissSurface.add_css_class("launcher-dismiss-surface")
        dismissSurface.hexpand = true
        dismissSurface.vexpand = true
        this.dismissWindow.set_child(dismissSurface)

        const dismissGesture = new Gtk.GestureClick()
        dismissGesture.set_button(0)
        dismissGesture.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)
        dismissGesture.connect("pressed", () => this.hide())
        dismissSurface.add_controller(dismissGesture)

        this.window = new Astal.Window()
        this.window.name = LAUNCHER_WINDOW_NAME
        this.window.namespace = "wayle-app-launcher"
        this.window.layer = Astal.Layer.OVERLAY
        this.window.exclusivity = Astal.Exclusivity.IGNORE
        this.window.keymode = Astal.Keymode.EXCLUSIVE
        this.window.anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT
        this.window.marginTop = 52
        this.window.marginLeft = 18
        this.window.set_default_size(WIDTH, HEIGHT)
        this.window.set_resizable(false)

        const panel = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 0,
        })
        panel.add_css_class("launcher-panel")
        panel.set_size_request(WIDTH, HEIGHT)
        panel.hexpand = true
        panel.vexpand = true
        this.window.set_child(panel)

        const header = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 0,
        })
        header.add_css_class("launcher-header")
        panel.append(header)

        const titleColumn = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 2,
        })
        titleColumn.add_css_class("launcher-title-column")
        titleColumn.hexpand = true

        const titleRow = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 0,
        })
        titleRow.add_css_class("launcher-title-row")
        const titleIcon = Gtk.Image.new_from_icon_name("applications-all-symbolic")
        titleIcon.set_pixel_size(22)
        titleRow.append(titleIcon)

        this.title = Gtk.Label.new("固定收藏")
        this.title.add_css_class("launcher-title")
        this.title.xalign = 0
        titleRow.append(this.title)
        titleColumn.append(titleRow)

        this.resultCount = Gtk.Label.new("")
        this.resultCount.add_css_class("launcher-result-count")
        this.resultCount.xalign = 0
        titleColumn.append(this.resultCount)
        header.append(titleColumn)

        this.toggleButton = Gtk.Button.new()
        this.toggleButton.add_css_class("ghost-icon")
        this.toggleButton.set_has_frame(false)
        this.toggleButton.set_tooltip_text("显示全部应用")
        this.toggleIcon = Gtk.Image.new_from_icon_name("view-grid-symbolic")
        this.toggleIcon.set_pixel_size(18)
        this.toggleButton.set_child(this.toggleIcon)
        this.toggleButton.connect("clicked", () => {
            this.mode = this.mode === "favorites" ? "all" : "favorites"
            this.search.text = ""
            this.render()
        })
        header.append(this.toggleButton)

        const content = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 0,
        })
        content.add_css_class("launcher-content")
        content.vexpand = true
        panel.append(content)

        this.search = Gtk.SearchEntry.new()
        this.search.add_css_class("launcher-search")
        this.search.placeholder_text = "搜索应用..."
        this.search.hexpand = true
        this.search.connect("search-changed", () => this.render())
        this.search.connect("activate", () => {
            try {
                const first = this.visibleApplications()[0]
                if (first) {
                    this.launch(first)
                }
            } catch (error) {
                this.showError(error)
            }
        })
        content.append(this.search)

        this.status = Gtk.Label.new("")
        this.status.add_css_class("launcher-status")
        this.status.xalign = 0
        this.status.wrap = true
        this.status.visible = false
        content.append(this.status)

        const scrolled = new Gtk.ScrolledWindow({
            hscrollbar_policy: Gtk.PolicyType.NEVER,
            vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
        })
        scrolled.add_css_class("launcher-scrolled")
        scrolled.vexpand = true
        scrolled.min_content_height = 340
        content.append(scrolled)

        this.grid = new Gtk.FlowBox({
            selection_mode: Gtk.SelectionMode.NONE,
            homogeneous: true,
            min_children_per_line: 3,
            max_children_per_line: 3,
            row_spacing: 4,
            column_spacing: 4,
            valign: Gtk.Align.START,
        })
        this.grid.add_css_class("launcher-grid")
        this.grid.hexpand = true
        scrolled.set_child(this.grid)

        const keyController = new Gtk.EventControllerKey()
        keyController.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)
        keyController.connect("key-pressed", (_, keyval) => {
            if (keyval === Gdk.KEY_Escape) {
                this.hide()
                return true
            }
            return false
        })
        this.window.add_controller(keyController)

        this.window.connect("notify::visible", () => {
            if (this.window.visible) {
                this.dismissWindow.visible = true
                this.search.grab_focus()
            } else {
                this.dismissWindow.visible = false
                this.closeContextMenu()
            }
        })

        this.window.connect("notify::is-active", () => {
            if (
                this.window.visible
                && !this.window.is_active
                && !this.contextMenu?.visible
            ) {
                GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
                    if (
                        this.window.visible
                        && !this.window.is_active
                        && !this.contextMenu?.visible
                    ) {
                        this.hide()
                    }
                    return GLib.SOURCE_REMOVE
                })
            }
        })

        this.render()
    }

    show(): void {
        this.dismissWindow.visible = true
        this.window.visible = true
        this.search.grab_focus()
    }

    hide(): void {
        this.closeContextMenu()
        this.window.visible = false
        this.dismissWindow.visible = false
    }

    private visibleApplications(): DesktopApplication[] {
        const query = this.search.text
        if (this.mode === "favorites") {
            const result = this.favoriteIds.map((entry) => {
                const application = this.catalog.get(entry)
                if (!application) {
                    throw new Error(`favorite references unavailable desktop entry ${entry}`)
                }
                return application
            })
            return result.filter((application) => matches(application, query))
        }

        if (query.trim()) {
            return this.apps.fuzzy_query(query)
        }
        return sortedApplications(Array.from(this.catalog.values()))
    }

    private render(): void {
        this.closeContextMenu()
        while (this.grid.get_first_child()) {
            const child = this.grid.get_first_child()
            if (child) {
                this.grid.remove(child)
            }
        }

        let applications: DesktopApplication[] = []
        let renderError: string | null = null
        try {
            applications = this.visibleApplications()
        } catch (error) {
            renderError = errorMessage(error)
        }

        const favorites = this.mode === "favorites"
        this.title.label = favorites ? "固定收藏" : "全部应用"
        this.resultCount.label = `${applications.length} 个应用`
        this.toggleIcon.set_from_icon_name(
            favorites ? "view-grid-symbolic" : "starred-symbolic",
        )
        this.toggleButton.set_tooltip_text(
            favorites ? "显示全部应用" : "显示固定收藏",
        )

        applications.forEach((application) => {
            this.grid.append(this.makeApplicationButton(application))
        })

        if (renderError) {
            this.showError(renderError)
            return
        }
        if (this.stateError) {
            this.showError(`收藏状态不可用：${this.stateError}`)
            return
        }
        if (applications.length === 0) {
            this.status.remove_css_class("launcher-status-error")
            this.status.label = favorites && !this.search.text.trim()
                ? "还没有固定收藏。切换到全部应用后，右键应用即可加入。"
                : "没有匹配的应用"
            this.status.visible = true
        } else {
            this.status.visible = false
        }
    }

    private makeApplicationButton(application: DesktopApplication): Gtk.Button {
        const button = Gtk.Button.new()
        button.add_css_class("quick-action")
        button.add_css_class("launcher-app")
        button.set_has_frame(false)
        button.set_tooltip_text(application.name)

        const content = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 0,
        })
        content.halign = Gtk.Align.CENTER
        content.valign = Gtk.Align.CENTER

        const iconBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 0,
        })
        iconBox.add_css_class("quick-action-icon")
        iconBox.halign = Gtk.Align.CENTER
        const icon = this.applicationIcon(application)
        iconBox.append(icon)
        content.append(iconBox)

        const label = Gtk.Label.new(application.name)
        label.add_css_class("quick-action-label")
        label.halign = Gtk.Align.CENTER
        label.max_width_chars = 14
        label.ellipsize = Pango.EllipsizeMode.END
        content.append(label)
        button.set_child(content)

        button.connect("clicked", () => this.launch(application))

        const gesture = new Gtk.GestureClick()
        gesture.set_button(3)
        gesture.connect("pressed", () => this.showContextMenu(button, application))
        button.add_controller(gesture)
        return button
    }

    private applicationIcon(application: DesktopApplication): Gtk.Image {
        const iconName = application.icon_name
        if (iconName && GLib.path_is_absolute(iconName)) {
            const image = Gtk.Image.new_from_file(iconName)
            image.set_pixel_size(32)
            return image
        }

        const image = Gtk.Image.new_from_icon_name(
            iconName || "application-x-executable-symbolic",
        )
        image.set_pixel_size(32)
        return image
    }

    private launch(application: DesktopApplication): void {
        try {
            if (!application.launch()) {
                throw new Error(`desktop entry ${application.entry} refused to launch`)
            }
            this.hide()
        } catch (error) {
            this.showError(`无法打开 ${application.entry}：${errorMessage(error)}`)
        }
    }

    private showContextMenu(button: Gtk.Button, application: DesktopApplication): void {
        this.closeContextMenu()

        const context = Gtk.Popover.new()
        context.add_css_class("launcher-context")
        context.has_arrow = false
        context.autohide = true
        context.position = Gtk.PositionType.BOTTOM
        context.set_parent(button)

        const menu = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 2,
        })
        menu.add_css_class("launcher-context-menu")

        const open = makeMenuButton("system-run-symbolic", "打开")
        open.connect("clicked", () => {
            context.popdown()
            this.launch(application)
        })
        menu.append(open)

        const favorite = this.favoriteIds.includes(application.entry)
        const favoriteButton = makeMenuButton(
            favorite ? "list-remove-symbolic" : "list-add-symbolic",
            favorite ? "移除固定收藏" : "加入固定收藏",
        )
        favoriteButton.connect("clicked", () => {
            context.popdown()
            this.changeFavorite(application.entry, !favorite)
        })
        menu.append(favoriteButton)
        context.set_child(menu)

        context.connect("closed", () => {
            if (context.get_parent()) {
                context.unparent()
            }
            if (this.contextMenu === context) {
                this.contextMenu = null
            }
        })
        this.contextMenu = context
        context.popup()
    }

    private closeContextMenu(): void {
        if (this.contextMenu) {
            this.contextMenu.popdown()
            this.contextMenu = null
        }
    }

    private changeFavorite(entry: string, add: boolean): void {
        const next = [...this.favoriteIds]
        if (add) {
            if (next.includes(entry)) {
                this.showError(`应用 ${entry} 已经在固定收藏中`)
                return
            }
            next.push(entry)
        } else {
            const index = next.indexOf(entry)
            if (index < 0) {
                this.showError(`应用 ${entry} 不在固定收藏中`)
                return
            }
            next.splice(index, 1)
        }

        try {
            saveFavorites(next, this.catalog)
            this.favoriteIds = next
            this.render()
        } catch (error) {
            this.showError(`无法保存固定收藏：${errorMessage(error)}`)
        }
    }

    private showError(error: unknown): void {
        this.status.add_css_class("launcher-status-error")
        this.status.label = errorMessage(error)
        this.status.visible = true
    }
}

app.start({
    instanceName: INSTANCE_NAME,
    css: CSS_PATH,
    main() {
        const controller = new LauncherController()
        app.add_window(controller.dismissWindow)
        app.add_window(controller.window)
        controller.show()
    },
})

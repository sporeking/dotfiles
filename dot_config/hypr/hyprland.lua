-- Hyprland 0.56.2 configuration migrated from hyprland.conf.

local home = assert(os.getenv("HOME"), "HOME must be set")
local terminal = "kitty"
local menu = [[rofi -combi-modi window,drun,ssh -show combi -icon-theme "Papirus" -show-icons -run-shell-command '{terminal} -e zsh -ic "{cmd} && read"']]
local mainMod = "ALT"

------------------
---- MONITORS ----
------------------

hl.monitor({
    output = "HDMI-A-1",
    mode = "2560x1440@144",
    position = "0x0",
    scale = 1.066667,
})

-- 165Hz was requested by the old config but is not an available mode on
-- this panel; the running session currently uses its available 240Hz mode.
hl.monitor({
    output = "eDP-1",
    mode = "2560x1600@240",
    position = "2400x0",
    scale = 1.6,
    transform = 1,
})

hl.monitor({
    output = "eDP-2",
    mode = "2560x1600@240",
    position = "2400x0",
    scale = 1.6,
    transform = 1,
})

-------------------------------
---- ENVIRONMENT VARIABLES ----
-------------------------------

hl.env("MOZ_ENABLE_WAYLAND", "1")
hl.env("XCURSOR_SIZE", "32")
hl.env("HYPRCURSOR_THEME", "Bibata-Modern-Ice")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("XDG_CURRENT_DESKTOP", "Hyprland")
hl.env("XDG_SESSION_TYPE", "wayland")
hl.env("XDG_SESSION_DESKTOP", "Hyprland")
hl.env("EDITOR", "nvim")
hl.env("HYPRSHOT_DIR", home .. "/hyprshot_images")
hl.env("LIBVA_DRIVER_NAME", "nvidia")
hl.env("GBM_BACKEND", "nvidia-drm")
hl.env("__GLX_VENDOR_LIBRARY_NAME", "nvidia")
hl.env("HISTFILE", home .. "/.zsh_history")
hl.env("HISTSIZE", "10000")
hl.env("SAVEHIST", "10000")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("QT_QPA_PLATFORM_PLUGIN_PATH", "./plugins/platforms")
hl.env("QT_WAYLAND_DISABLE_WINDOWDECORATION", "1")
hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("CLUTTER_BACKEND", "wayland")
hl.env("QT_IM_MODULE", "fcitx")
hl.env("XMODIFIERS", "@im=fcitx")
hl.env("INPUT_METHOD", "fcitx")
hl.env("SDL_IM_MODULE", "fcitx")
hl.env("TERMINAL", terminal)
hl.env("GDK_SCALE", "1.5")

-----------------------
----- CONFIGURATION -----
-----------------------

hl.config({
    general = {
        gaps_in = 3,
        gaps_out = 5,
        border_size = 3,
        col = {
            active_border = "rgba(33E88Dee)",
        },
        resize_on_border = false,
        allow_tearing = false,
        layout = "dwindle",
        no_focus_fallback = false,
    },

    decoration = {
        rounding = 3,
        active_opacity = 1,
        inactive_opacity = 1,
        blur = {
            enabled = false,
            size = 12,
            passes = 3,
            new_optimizations = true,
            ignore_opacity = false,
            vibrancy = 0.1696,
        },
    },

    animations = {
        enabled = true,
    },

    dwindle = {
        preserve_split = true,
    },

    misc = {
        force_default_wallpaper = -1,
        disable_hyprland_logo = false,
        key_press_enables_dpms = true,
        mouse_move_enables_dpms = true,
    },

    input = {
        kb_layout = "us",
        follow_mouse = 1,
        accel_profile = "flat",
        sensitivity = -0.3,
        natural_scroll = true,
        scroll_factor = -0.9,
        touchpad = {
            scroll_factor = 1.0,
            natural_scroll = true,
            tap_and_drag = false,
        },
    },

    xwayland = {
        force_zero_scaling = true,
    },

    cursor = {
        no_hardware_cursors = true,
    },

    binds = {
        focus_preferred_method = 1,
    },
})

---------------------
---- ANIMATIONS -----
---------------------

hl.curve("myBezier", {
    type = "bezier",
    points = {{0.05, 0.9}, {0.1, 1.05}},
})

hl.animation({ leaf = "windows", enabled = true, speed = 7, bezier = "myBezier" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 7, bezier = "default", style = "popin 80%" })
hl.animation({ leaf = "border", enabled = true, speed = 10, bezier = "default" })
hl.animation({ leaf = "borderangle", enabled = true, speed = 8, bezier = "default" })
hl.animation({ leaf = "fade", enabled = true, speed = 7, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 6, bezier = "default" })

-------------------
---- AUTOSTART ----
-------------------

hl.on("hyprland.start", function()
    hl.exec_cmd(terminal)
    hl.exec_cmd("hyprpaper")
    hl.exec_cmd("env PATH=" .. home .. "/.local/bin:$PATH " .. home .. "/.local/bin/wayle panel start")
    hl.exec_cmd("clash-verge")
    hl.exec_cmd("xrdb -merge " .. home .. "/.Xresources")
    hl.exec_cmd("fcitx5 -d --replace")
    hl.exec_cmd("dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
    hl.exec_cmd("systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
    hl.exec_cmd("blueman-manager")
    hl.exec_cmd("hyprsunset")
    hl.exec_cmd("hypridle")
    hl.exec_cmd("udiskie")
    hl.exec_cmd("amixer set Master 20%")
    hl.exec_cmd("xremap " .. home .. "/.config/xremap/config.yml")
    hl.exec_cmd(home .. "/.config/hypr/autostart.sh")
    hl.exec_cmd("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")

    -- hyprpm loads enabled plugins after startup; reload once so plugin
    -- configuration below is evaluated with the plugin APIs available.
    hl.exec_cmd("hyprpm reload -n && hyprctl reload")
end)

---------------------
---- KEYBINDINGS ----
---------------------

hl.bind(mainMod .. " + Q", hl.dsp.exec_cmd(terminal))
hl.bind(mainMod .. " + W", hl.dsp.window.close())
hl.bind(mainMod .. " + M", hl.dsp.exit())
hl.bind(mainMod .. " + E", hl.dsp.exec_cmd("hyprshot -m region --clipboard-only"))
hl.bind(mainMod .. " + X", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mainMod .. " + R", hl.dsp.exec_cmd(menu .. " | xargs hyprctl dispatch exec --"))
hl.bind(mainMod .. " + P", hl.dsp.window.pseudo())

hl.bind("F12", hl.dsp.exec_cmd("hyprshot -m window --clipboard-only"))
hl.bind(mainMod .. " + F12", hl.dsp.exec_cmd("hyprshot -m output --clipboard-only"))
hl.bind(mainMod .. " + F11", hl.dsp.exec_cmd("hyprshot -m region --clipboard-only"))
hl.bind("code:232", hl.dsp.exec_cmd("xbacklight -dec 5"))
hl.bind("code:233", hl.dsp.exec_cmd("xbacklight -inc 5"))
hl.bind(mainMod .. " + F1", hl.dsp.exec_cmd("amixer set Master toggle"))
hl.bind(mainMod .. " + F2", hl.dsp.exec_cmd("amixer set Master 3%-"))
hl.bind(mainMod .. " + F3", hl.dsp.exec_cmd("amixer set Master 3%+"))

hl.bind(mainMod .. " + H", hl.dsp.focus({ direction = "left" }))
hl.bind(mainMod .. " + L", hl.dsp.focus({ direction = "right" }))
hl.bind(mainMod .. " + K", hl.dsp.focus({ direction = "up" }))
hl.bind(mainMod .. " + J", hl.dsp.focus({ direction = "down" }))

for i = 1, 8 do
    hl.bind(mainMod .. " + " .. i, hl.dsp.focus({ workspace = i }))
    hl.bind(mainMod .. " + SHIFT + " .. i, hl.dsp.window.move({ workspace = i }))
end

hl.bind(mainMod .. " + 9", hl.dsp.exec_cmd(home .. "/scripts/turn_down_light.sh 5"))
hl.bind(mainMod .. " + 0", hl.dsp.exec_cmd(home .. "/scripts/turn_light.sh 5"))
hl.bind(mainMod .. " + SHIFT + 9", hl.dsp.window.move({ workspace = 9 }))
hl.bind(mainMod .. " + SHIFT + 0", hl.dsp.window.move({ workspace = 10 }))

hl.bind(mainMod .. " + S", hl.dsp.workspace.toggle_special("magic"))
hl.bind(mainMod .. " + SHIFT + S", hl.dsp.window.move({ workspace = "special:magic" }))

hl.bind(mainMod .. " + SHIFT + right", hl.dsp.window.resize({ x = 20, y = 0, relative = true }))
hl.bind(mainMod .. " + SHIFT + left", hl.dsp.window.resize({ x = -20, y = 0, relative = true }))
hl.bind(mainMod .. " + SHIFT + up", hl.dsp.window.resize({ x = 0, y = -20, relative = true }))
hl.bind(mainMod .. " + SHIFT + down", hl.dsp.window.resize({ x = 0, y = 20, relative = true }))
hl.bind(mainMod .. " + SHIFT + L", hl.dsp.window.resize({ x = 140, y = 0, relative = true }))
hl.bind(mainMod .. " + SHIFT + H", hl.dsp.window.resize({ x = -140, y = 0, relative = true }))
hl.bind(mainMod .. " + SHIFT + K", hl.dsp.window.resize({ x = 0, y = -140, relative = true }))
hl.bind(mainMod .. " + SHIFT + J", hl.dsp.window.resize({ x = 0, y = 140, relative = true }))

hl.bind("mouse:274", hl.dsp.window.drag(), { mouse = true })
hl.bind("mouse:276", hl.dsp.window.resize(), { mouse = true })
hl.bind("mouse:275", hl.dsp.window.close(), { mouse = true })

hl.bind("SUPER + F5", hl.dsp.exec_cmd("bash " .. home .. "/scripts/turn_light.sh 3"))
hl.bind("SUPER + F6", hl.dsp.exec_cmd("bash " .. home .. "/scripts/turn_down_light.sh 3"))
hl.bind("SUPER + F10", hl.dsp.exec_cmd("sleep 1 && hyprctl dispatch dpms off"))

--------------------------------
---- WINDOWS AND WORKSPACES ----
--------------------------------

hl.window_rule({ name = "float-qq", match = { class = "QQ" }, float = true })
hl.window_rule({ name = "float-yesplaymusic", match = { class = ".*yesplaymusic$" }, float = true })
hl.window_rule({ name = "float-wechat-class", match = { class = "wechat" }, float = true })
hl.window_rule({ name = "float-wechat-name", match = { class = "微信" }, float = true })
hl.window_rule({ name = "float-clash-verge", match = { class = "clash-verge" }, float = true })
hl.window_rule({ name = "float-matplotlib", match = { class = "Matplotlib" }, float = true })
hl.window_rule({ name = "float-steam", match = { class = "steam" }, float = true })
hl.window_rule({ name = "float-nm-connection-editor", match = { class = "nm-connection-editor" }, float = true })
hl.window_rule({ name = "float-portal-gtk", match = { class = "xdg-desktop-portal-gtk" }, float = true })
hl.window_rule({ name = "float-nautilus", match = { class = "org.gnome.Nautilus" }, float = true })

--------------------------------
---- DYNAMIC CURSORS PLUGIN ----
--------------------------------

-- hyprpm may load this plugin after the initial Lua evaluation. The startup
-- reload above causes this block to run again after successful plugin loading.
local function configure_dynamic_cursors()
    if hl.plugin.dynamic_cursors == nil then
        return
    end

    hl.config({
        plugin = {
            dynamic_cursors = {
                enabled = true,
                mode = "tilt",
                threshold = 2,
                rotate = {
                    length = 20,
                    offset = 0.0,
                },
                tilt = {
                    limit = 5000,
                    activation = "negative_quadratic",
                },
                stretch = {
                    limit = 3000,
                    activation = "quadratic",
                },
                shake = {
                    enabled = true,
                    threshold = 6.0,
                    base = 4.0,
                    speed = 4.0,
                    influence = 0.0,
                    limit = 0.0,
                    timeout = 2000,
                    effects = false,
                    ipc = false,
                },
                hyprcursor = {
                    nearest = 1,
                    enabled = true,
                    resolution = -1,
                    fallback = "clientside",
                },
            },
        },
    })

    hl.plugin.dynamic_cursors.shape_rule({
        shape = "text",
        rotate = { offset = 90 },
    })
    hl.plugin.dynamic_cursors.shape_rule({
        shape = "grab",
        mode = "stretch",
        stretch = { limit = 2000 },
    })
    hl.plugin.dynamic_cursors.shape_rule({
        shape = "clientside",
        mode = "none",
    })
end

configure_dynamic_cursors()

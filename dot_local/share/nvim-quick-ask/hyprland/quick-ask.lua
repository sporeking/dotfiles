-- Source from Hyprland's Lua config; launcher installs app-specific window rules.
local source = debug.getinfo(1, "S").source
local root = assert(source:match("^@(.+)/hyprland/quick%-ask%.lua$"), "Cannot locate quick-ask project")
local function quote(value)
    return "'" .. value:gsub("'", "'\\''") .. "'"
end
local launcher = "python3 " .. quote(root .. "/bin/quick-ask")
hl.bind("ALT + A", hl.dsp.exec_cmd(launcher .. " toggle"))
hl.on("hyprland.start", function()
    hl.exec_cmd(launcher .. " start")
end)

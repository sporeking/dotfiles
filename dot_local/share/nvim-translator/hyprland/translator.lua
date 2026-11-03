-- Source with: dofile("/absolute/path/to/translator/hyprland/translator.lua")
-- Hyprland 0.55+ Lua configuration. Window rules are installed by the launcher.
local source = debug.getinfo(1, "S").source
local root = assert(source:match("^@(.+)/hyprland/translator%.lua$"), "Cannot locate translator project")
local function quote(value)
    return "'" .. value:gsub("'", "'\\''") .. "'"
end
local launcher = "python3 " .. quote(root .. "/bin/translator")
-- Match this desktop's main modifier (ALT); SUPER means the separate Win key.
hl.bind("ALT + T", hl.dsp.exec_cmd(launcher .. " toggle"))
hl.on("hyprland.start", function()
    hl.exec_cmd(launcher .. " start")
end)

# sporeking/dotfiles

![desktop preview](https://github.com/user-attachments/assets/9bf6330c-3069-4ff3-a53d-29a03437058c)

Linux (Hyprland) 下的个人配置仓库，用 **[chezmoi](https://www.chezmoi.io/)** 管理。  
目标：新机器一条命令落地；日常改配置后 re-add → commit → push 即可同步。

---

## 目录

- [技术栈](#技术栈)
- [仓库结构](#仓库结构)
- [快速开始](#快速开始)
- [日常同步工作流](#日常同步工作流)
- [chezmoi 约定](#chezmoi-约定)
- [组件说明](#组件说明)
  - [Hyprland](#hyprland)
  - [Hyprpanel / 壁纸 / 锁屏](#hyprpanel--壁纸--锁屏)
  - [Zsh](#zsh)
  - [Kitty](#kitty)
  - [Neovim (LazyVim)](#neovim-lazyvim)
  - [Rofi / Tofi / Mako / Waybar](#rofi--tofi--mako--waybar)
  - [Scripts](#scripts)
- [常用快捷键](#常用快捷键)
- [密钥与隐私](#密钥与隐私)
- [依赖清单](#依赖清单)
- [故障排查](#故障排查)

---

## 技术栈

| 角色 | 工具 |
|------|------|
| 窗口管理 | **Hyprland** |
| 状态栏 / 通知 | **Hyprpanel**（Waybar 配置保留作备用） |
| 终端 | **Kitty** |
| Shell | **Zsh** + **Zinit** + **Starship** + **zoxide** |
| 启动器 | **rofi-wayland**（tofi 备用） |
| 编辑器 | **Neovim** + **LazyVim** |
| 输入法 | **fcitx5** + rime |
| 壁纸 | **hyprpaper** |
| 锁屏 / 空闲 | **hyprlock** + **hypridle** |
| 点文件管理 | **chezmoi** |

其它常用工具：`fzf`、`rg`、`bat`、`btop`/`bottom`、`duf`/`dust`、`yazi`、`llm`、`sgpt`、`hyprshot`、`xremap`、`ddcutil`（外接显示器亮度）。

---

## 仓库结构

chezmoi 源目录在本机的路径是：

```text
~/.local/share/chezmoi/          # git clone 后的源仓库
├── README.md                    # 本文件
├── dot_zshrc                    # → ~/.zshrc
├── dot_p10k.zsh                 # → ~/.p10k.zsh（历史 p10k，现主用 starship）
├── dot_conda/
│   ├── environments.txt         # → ~/.conda/environments.txt
│   └── aau_token                # → ~/.conda/aau_token（机器相关，可忽略）
├── dot_config/
│   ├── hypr/
│   │   ├── hyprland.conf        # 主 WM 配置
│   │   ├── hyprpaper.conf       # 壁纸
│   │   ├── hypridle.conf        # 空闲 / 锁屏触发
│   │   ├── hyprlock.conf        # 锁屏外观
│   │   └── executable_autostart.sh  # → ~/.config/hypr/autostart.sh（SSH agent 等）
│   ├── hyprpanel/config.json
│   ├── kitty/kitty.conf
│   ├── nvim/                    # LazyVim 配置树
│   ├── rofi/config.rasi
│   ├── tofi/config
│   ├── mako/config              # 旧通知守护（现多用 hyprpanel）
│   └── waybar/                  # 旧状态栏配置（备用）
├── dot_pi/
│   └── agent/                   # → ~/.pi/agent/，pi 模型、扩展、MCP 与 npm 锁文件
├── private_dot_pi/
│   └── agent/env                # → ~/.pi/agent/env，私有权限的空密钥模板
├── dot_agents/
│   ├── skills/                  # → ~/.agents/skills/，已安装的用户 skills
│   └── .skill-lock.json         # → ~/.agents/.skill-lock.json
└── scripts/
    ├── executable_turn_light.sh      # → ~/scripts/turn_light.sh
    ├── executable_turn_down_light.sh # → ~/scripts/turn_down_light.sh
    ├── turn_kbd_backlight.sh
    └── private_executable_xremap.sh  # private_ → 不公开跟踪权限/内容策略
```

> **命名规则（chezmoi）**  
> - `dot_foo` → `~/.foo`  
> - `dot_config/bar` → `~/.config/bar`  
> - `executable_foo` → 目标文件可执行  
> - `private_foo` → 安装后权限更严格（通常 600/700）

---

## 快速开始

### 0. 前置

- Arch / 类 Arch 或其它能装 Hyprland 的发行版
- 已安装 `git`、`chezmoi`
- 能访问 GitHub（本仓库 remote 用 SSH：`git@github.com:sporeking/dotfiles.git`）

### 1. 一键拉取并应用

```bash
# 安装 chezmoi（Arch 示例）
sudo pacman -S chezmoi

# 用 chezmoi 初始化并 apply（会 clone 到 ~/.local/share/chezmoi）
chezmoi init --apply git@github.com:sporeking/dotfiles.git
```

或分步：

```bash
chezmoi init git@github.com:sporeking/dotfiles.git
chezmoi diff          # 先看会改什么
chezmoi apply         # 写入 $HOME
```

### 2. 新机器上必须本地改的地方

| 文件 | 要改什么 |
|------|----------|
| `~/.zshrc` | 填入 `ANTHROPIC_AUTH_TOKEN` 等密钥（仓库里是空字符串） |
| `~/.config/hypr/hyprland.conf` | `monitor=` 行按实际显示器改 |
| `~/.config/hypr/hyprpaper.conf` | 壁纸路径（默认 `~/Pictures/nordic-wallpapers/...`） |
| `~/scripts/*.sh` | 若用户名不是 `sporeking`，检查脚本内绝对路径 |
| `~/.config/xremap/config.yml` | 键位重映射（**未**纳入本仓库，需自备） |
| `~/.pi/agent/env` | 填入 `SPOREKING_GPT_API_KEY`、`SPOREKING_GROK_API_KEY`；仓库只保留空模板 |

### 3. 验证

```bash
chezmoi status        # 应接近干净（本地密钥差异可忽略）
hyprctl reload        # 若已在 Hyprland 会话中
exec zsh              # 重载 shell
```

---

## 日常同步工作流

本机改完配置后，**推到 GitHub**：

```bash
# 1) 把当前 $HOME 里的 managed 文件写回源目录
chezmoi re-add ~/.config/hypr/hyprland.conf
# 或一次 re-add 多个路径；也可以：
chezmoi re-add ~/.zshrc ~/.config/kitty/kitty.conf

# 2) 进源目录提交
cd ~/.local/share/chezmoi
git status
git diff
git add -A
git commit -m "YYYYMMDD short summary"
git push origin main
```

另一台机器 **拉下来**：

```bash
cd ~/.local/share/chezmoi
git pull
chezmoi apply
# 或
chezmoi update        # pull + apply
```

### 常用 chezmoi 命令

```bash
chezmoi managed              # 列出被管理的目标文件
chezmoi status               # 源 vs 目标差异（MM/DA 等）
chezmoi diff                 # 详细 diff
chezmoi cd                   # 进入源目录（~/.local/share/chezmoi）
chezmoi edit ~/.zshrc        # 编辑源文件并可选 apply
chezmoi add ~/.config/foo    # 开始管理新文件
chezmoi forget ~/.config/foo # 停止管理（不删目标文件）
chezmoi re-add PATH          # 用目标文件覆盖源文件（同步“本机改动”）
```

### `chezmoi status` 状态码速查

| 标记 | 含义 |
|------|------|
| `MM` | 源与目标都改了（相对上次 apply 状态） |
| ` M` | 仅目标（家目录）改了 |
| `M ` | 仅源（仓库）改了 |
| `A ` / ` A` | 新增 |
| `D ` / ` D` | 删除 |
| `DA` | 目标已删、源仍有（例如卸掉的 oh-my-zsh） |

---

## chezmoi 约定

1. **源真相在 git 仓库**，目标真相在 `$HOME`。`re-add` 把目标写回源；`apply` 把源写到目标。  
2. **不要**把 `~` 本身当成 git 仓库（本机若存在空的 `~/.git` 可忽略/删除，真正的 repo 在 `~/.local/share/chezmoi`）。  
3. **密钥不进 git**：token 用本地覆盖或 chezmoi `private_` / templates + `chezmoi.toml` 的 data（本仓库目前采用「空值 + 本地填写」）。  
4. 误加的缓存/历史（`.zsh_history`、`.sass-cache`、`nohup.out`）应 `forget` 并删源文件，不要提交。

---

## 组件说明

### Hyprland

路径：`~/.config/hypr/hyprland.conf`（源：`dot_config/hypr/hyprland.conf`）

| 区块 | 说明 |
|------|------|
| Monitors | 当前默认启用内置屏 `eDP-1/2`；外接 DP/HDMI 行已注释，按机器打开 |
| Programs | `$terminal=kitty`，`$fileManager=dolphin`，`$menu=rofi ...` |
| Autostart | kitty、hyprpaper、hyprpanel、clash-verge、fcitx5、hypridle、xremap、`autostart.sh`、polkit 等 |
| Env | Wayland / NVIDIA 相关变量、cursor 主题 |
| Input / decoration | 键盘布局、动画、dwindle layout |
| Binds | 见下方「常用快捷键」 |

**主修饰键**：`$mainMod = ALT`（不是 Super）。  
Super 仍用于部分亮度快捷键（`SUPER+F5/F6`）。

改完后：

```bash
hyprctl reload
# 或重启会话
```

`autostart.sh` 负责 SSH agent 持久化（写 `~/.ssh/agent/env` 并 `ssh-add`）。若密钥路径不同，编辑该脚本。

### Hyprpanel / 壁纸 / 锁屏

- **Hyprpanel**：`~/.config/hyprpanel/config.json` — 顶栏模块、主题。  
- **hyprpaper**：预加载 `~/Pictures/nordic-wallpapers/` 下若干图；当前 wallpaper 使用 block 语法 + `fit_mode = cover`。  
- **hypridle / hyprlock**：空闲锁屏与锁屏 UI。

壁纸目录不在本仓库内，需自行准备图片或改路径。

### Zsh

路径：`~/.zshrc`（源：`dot_zshrc`）

架构概览：

```text
keychain (ssh key)
  → PATH / Claude Code 环境变量
  → 历史选项 (INC_APPEND / SHARE / HIST_IGNORE_*)
  → 别名与函数 (fv / fcd / fo / eject_disk / ca ...)
  → conda 懒加载（首次调用 conda 才 hook，加快启动）
  → Zinit 插件：
       zsh-autosuggestions（Ctrl-E 接受建议）
       fast-syntax-highlighting
       starship 提示符
       fzf key-bindings + completion
  → zoxide
  → shell-gpt 集成（Ctrl-L 把当前行交给 sgpt --shell）
  → cargo / bun PATH
```

#### 别名

| 别名 | 作用 |
|------|------|
| `ll` | `ls -lh` |
| `v` | `nvim` |
| `ga` / `gs` / `gc` | git add / status / commit |
| `ca` | `conda activate` |
| `sp` | `scryer-prolog` |
| `sg` | `sgpt` |
| `ti` | `tgpt -i` |
| `fv` | rg + fzf 选文件并用 nvim 打开 |

#### 函数

| 函数 | 作用 |
|------|------|
| `fcd` | fzf 选文件后 `cd` 到其所在目录 |
| `fo` | fzf 选文件；按扩展名用 edge / xdg-open / nvim 打开 |
| `eject_disk <挂载点>` | `umount` + `udisksctl power-off` 安全弹出移动盘 |

#### Claude Code / Anthropic 代理

仓库中的 token 为空，本地需自行设置：

```bash
export ANTHROPIC_BASE_URL=https://opencode.ai/zen/go/v1
export ANTHROPIC_AUTH_TOKEN="你的token"   # 只放本地，勿 commit
export ANTHROPIC_MODEL=minimax-m3[1m]
# ... 其它 ANTHROPIC_* / CLAUDE_CODE_* 见 .zshrc
```

`chezmoi re-add ~/.zshrc` 前请确认不会把真 token 写进 git；提交前可：

```bash
grep -n 'TOKEN\|sk-' ~/.local/share/chezmoi/dot_zshrc
```

### Pi Coding Agent

pi 的可同步配置由以下文件管理：

```text
~/.pi/agent/settings.json       # 默认 provider/model、包与子代理设置
~/.pi/agent/models.json         # 自定义 provider 与模型定义（仅引用环境变量）
~/.pi/agent/mcp.json            # MCP server 配置
~/.pi/agent/extensions/         # 本地扩展
~/.pi/agent/npm/package*.json   # 插件的精确依赖版本
~/.agents/skills/               # 用户安装的 skills
```

在新机器运行 `chezmoi apply` 后，安装与本机一致版本的 pi 和插件依赖：

```bash
npm install -g @earendil-works/pi-coding-agent@0.80.6
cd ~/.pi/agent/npm && npm ci
```

然后在本机私有文件 `~/.pi/agent/env` 填入 API key，并重新打开终端或执行：

```bash
source ~/.zshrc
```

`models.json` 仅引用 `$SPOREKING_GPT_API_KEY` 和 `$SPOREKING_GROK_API_KEY`；`auth.json`、会话、运行历史和 context-mode 数据库均不受管理，不能提交。

### Kitty

`~/.config/kitty/kitty.conf` + `current-theme.conf`。  
中文字体推荐：**LXGW WenKai Mono / LXGW ZhenKai**（需系统已安装）。

### Neovim (LazyVim)

```text
~/.config/nvim/
├── init.lua
├── lazy-lock.json          # 插件锁，建议一并同步
├── lazyvim.json
└── lua/
    ├── config/
    │   ├── lazy.lua        # lazy.nvim 入口（未再 import copilot extra）
    │   ├── options.lua / keymaps.lua / autocmds.lua
    └── plugins/
        ├── copilot.lua     # blink-copilot 集成（替代旧 blink-cmp-copilot）
        └── example.lua
```

首次打开 nvim 会按 lock 装插件。Copilot 需本机已登录：

```bash
# 在 nvim 内
:Copilot auth
```

### Rofi / Tofi / Mako / Waybar

| 组件 | 状态 | 路径 |
|------|------|------|
| rofi | 主启动器 | `~/.config/rofi/config.rasi` |
| tofi | 备用 | `~/.config/tofi/config` |
| mako | 旧通知 | `~/.config/mako/config` |
| waybar | 旧状态栏 | `~/.config/waybar/` |

当前会话主路径是 **hyprpanel**；waybar/mako 配置保留方便回退。

### Scripts

安装后位于 `~/scripts/`：

| 脚本 | 作用 | 备注 |
|------|------|------|
| `turn_light.sh` | 提高显示器亮度 | 内部调用 `adjust_light.sh up`（该 helper 未入库，本机需自备或改脚本） |
| `turn_down_light.sh` | 降低显示器亮度 | 同上 |
| `turn_kbd_backlight.sh` | 键盘背光设为 0 | 写 sysfs，需 sudo |
| `xremap.sh`（private） | 启动 xremap | 依赖 `~/.config/xremap/config.yml` |

Hyprland 绑定示例：

- `ALT+9` / `ALT+0`：亮度 -5 / +5  
- `SUPER+F5` / `SUPER+F6`：亮度 +3 / -3  

外接显示器亮度通常依赖 **ddcutil** 与 i2c 权限：

```bash
sudo usermod -aG i2c $USER
# 重新登录后
ddcutil detect
```

---

## 常用快捷键

`$mainMod` = **ALT**

| 快捷键 | 动作 |
|--------|------|
| `ALT+Q` | 打开 Kitty |
| `ALT+W` | 关闭当前窗口 |
| `ALT+M` | 退出 Hyprland |
| `ALT+X` | 切换浮动 |
| `ALT+R` | Rofi 启动器 |
| `ALT+E` | 区域截图到剪贴板（hyprshot） |
| `F12` | 窗口截图 |
| `ALT+F12` | 输出（整屏）截图 |
| `ALT+F11` | 区域截图 |
| `ALT+H/J/K/L` | 焦点左/下/上/右 |
| `ALT+1..8` | 切到工作区 1–8 |
| `ALT+SHIFT+1..0` | 窗口移到工作区 1–10 |
| `ALT+S` | 特殊工作区 magic |
| `ALT+SHIFT+方向/HJKL` | 调整窗口大小 |
| `ALT+F1/F2/F3` | 静音 / 音量- / 音量+ |
| 鼠标侧键等 | 见 `hyprland.conf` bindm 段（移动/缩放/关闭） |

Shell：

| 快捷键 | 动作 |
|--------|------|
| `Ctrl-E` | 接受 zsh-autosuggestions 建议 |
| `Ctrl-L` | 当前命令行交给 `sgpt --shell` 改写 |

---

## 密钥与隐私

**已刻意不入库 / 入库为空：**

- `ANTHROPIC_AUTH_TOKEN`、`SPOREKING_*_API_KEY` 及任何 `sk-...` 形态密钥
- `~/.pi/agent/auth.json`、会话、运行历史与 context-mode 数据库
- SSH 私钥、`~/.ssh/`  
- 浏览器 / 聊天软件配置  
- xremap 设备节点相关隐私脚本策略（`private_` 前缀）

**仍在仓库、按需自删：**

- `dot_conda/aau_token`：历史遗留短 token，若无用可：

  ```bash
  chezmoi forget ~/.conda/aau_token
  rm ~/.local/share/chezmoi/dot_conda/aau_token
  # commit + push
  ```

提交前自检：

```bash
cd ~/.local/share/chezmoi
git grep -E 'sk-[A-Za-z0-9]{10,}|AUTH_TOKEN=.[^"]+' || echo "clean"
```

---

## 依赖清单

### 核心（Arch 包名示例）

```bash
# WM 与桌面
hyprland hyprpaper hypridle hyprlock hyprpicker hyprshot
# 终端与 shell
kitty zsh starship zoxide fzf ripgrep bat
# 启动器 / 面板
rofi-wayland   # hyprpanel 请按你安装方式（AUR/自编译）
# 输入法
fcitx5 fcitx5-rime fcitx5-configtool
# 编辑器
neovim git
# 工具
chezmoi ddcutil playerctl brightnessctl xorg-xbacklight
# 可选
clash-verge-rev blueman udiskie xremap-git keychain
```

### 字体

- 等宽中文：LXGW WenKai Mono、LXGW ZhenKai  
- Cursor：Bibata-Modern-Ice（`HYPRCURSOR_THEME`）

### 用户空间

```bash
# Zinit（.zshrc 会在缺失时自动 clone）
# Starship：也可系统包安装
# Conda：miniconda3 路径写死为 ~/miniconda3，换路径需改 .zshrc
# bun / cargo：可选 PATH
```

---

## 故障排查

### `chezmoi apply` 覆盖了我的本地 token

预期行为。密钥应只在 `$HOME` 维护，或改用：

```bash
# 仅 apply 指定路径，跳过 zshrc
chezmoi apply ~/.config/hypr
```

或把密钥移到 `~/.zshrc.local` 并在 `~/.zshrc` 末尾 `source`（可再 `chezmoi add` 一个空模板）。

### 显示器布局错乱

编辑 `hyprland.conf` 的 `monitor=` 行。查当前输出：

```bash
hyprctl monitors
```

### 亮度脚本无效

1. 确认 `~/scripts/adjust_light.sh` 是否存在（`turn_*.sh` 会 exec 它）  
2. 笔记本背光：`brightnessctl` / `xbacklight`  
3. 外接显示器：`ddcutil detect`，用户加入 `i2c` 组  

### xremap 没起来

- 配置文件：`~/.config/xremap/config.yml`（不在本仓库）  
- udev / input 组权限  
- 看 Hyprland 日志：`journalctl --user -u hyprland` 或会话输出  

### nvim 插件对不上

```bash
nvim --headless "+Lazy! restore" +qa
# 或同步 lock 后
chezmoi re-add ~/.config/nvim/lazy-lock.json
```

### 从 oh-my-zsh 迁走后提示符不对

本配置已用 **Zinit + Starship**，不再依赖 `~/.oh-my-zsh`。  
若仍 source 了旧 p10k，可忽略 `~/.p10k.zsh` 或自行删除。

### 推送失败

```bash
ssh -T git@github.com    # 应看到 Hi sporeking!
git -C ~/.local/share/chezmoi remote -v
```

---

## 推荐工作流小结

```text
改配置（直接改 ~/.config 或 ~/.zshrc）
        │
        ▼
chezmoi re-add <paths>     # 写回源目录
        │
        ▼
cd ~/.local/share/chezmoi
git diff && git add -A
git commit -m "YYYYMMDD ..."
git push
        │
        ▼
其它机器: chezmoi update   # git pull + apply
```

---

## License / 声明

个人配置，公开分享仅供参考。截图与壁纸版权归原作者。  
Clone 后请立刻替换密钥、显示器与路径相关项，再投入使用。

# 悬浮 Pi：原生界面与 Vim 浏览

## 目的

按 Alt+A 打开 Pi 原生终端界面，用同一个 agent 连续提问、读写文件和执行命令。窗口隐藏后任务继续。模型、工具展示、扩展、队列和会话管理全部使用 Pi 的现成功能。

本组件只负责 Kitty 悬浮窗口、双屏定位，以及少量 Vim 浏览键位。它没有另一套对话界面、RPC 后端或历史索引服务；原翻译器独立运行。

## 使用方法

依赖 Python 3.11+、Kitty、Hyprland 0.55+ Lua API 和已配置模型/认证的 Pi。当前验证版本为 Pi 1.5.0。沿用 Pi 的正常用户配置与扩展，字体和配色沿用 Kitty 配置。

| 按键 | 功能 |
| --- | --- |
| `Alt+A` | 打开 / 隐藏窗口；保留进程、当前输入和任务 |
| `Esc` | 从 Insert 进入 Normal 浏览模式 |
| Normal `j/k` | 向下 / 向上滚动对话历史 |
| Normal `Ctrl+U / Ctrl+D` | 向上 / 向下滚动半页 |
| Normal `gg / G` | 跳到开头 / 回到底部并跟随输出 |
| Normal `/` | Pi 原生对话全文搜索；Esc 关闭搜索 |
| Normal `i/a` | 回到底部，继续输入；保留原草稿 |
| Normal `h/l`、`0/$` | 移动输入光标；这里提供少量 Vim 编辑，不是完整 Vim |
| Normal 再按 `Esc` | Pi 原生取消 / 中断 |
| Insert `Enter` | Pi 原生发送；执行中的输入按 Pi 原有规则处理 |
| `Alt+Enter` | Pi 原生排队 follow-up |
| `Ctrl+L` / `Ctrl+O` | Pi 原生模型选择 / 工具输出展开 |

启动时处于 Insert，`j/k` 正常输入。Normal 的滚动针对整段对话，不是在旧输入记录之间切换。输入历史仍用 Pi 原生方向键；会话选择器等弹窗使用 Pi 原生按键。

在 Insert 输入 `/new` 新建会话、`/resume` 恢复会话、`/model` 换模型、`/quit` 退出。`Ctrl+G` 使用 Pi 原生外部编辑器，可在 Pi 配置 `externalEditor` 或设置 `$EDITOR` 为 Neovim。快捷键帮助用 `/hotkeys`。

## 工作目录、权限与数据

默认工作目录是 `~/agent-workspace`。配置在 `~/.config/nvim-quick-ask/config.toml`：

```toml
[pi]
command = "pi"

[agent]
workspace = "~/agent-workspace"
```

这是起始目录，不是沙箱。Pi 以普通用户身份运行，可以访问该账户有权限访问的其他路径。模型、思考档位、工具和扩展配置均由 Pi 管理；旧版组件配置中的 provider、model、thinking、timeout、web_extension、input_method 已不再使用。

原生会话继续存放在 `~/.local/share/nvim-quick-ask/sessions/`，每次启动使用 Pi `--continue` 恢复当前目录最近的会话，也可以 `/resume` 选择。已有 agent 的 JSONL 会话可直接沿用。更早的单轮问答和旧草稿数据库 `history.sqlite3` 原样保留作归档，不会自动变成 Pi 会话。

隐藏保留内存中的输入；退出后按 Pi 原生规则恢复会话，不额外承诺恢复尚未发送的草稿。认证仍由 Pi 管理。公开同步不包含历史、会话、密钥、工作目录文件或运行日志。

## 实现方式

[窗口启动器](bin/quick-ask)调用 Kitty，直接启动 `pi --tui-mode fullscreen --session-dir … --continue --extension …/vim-navigation.ts`。它沿用既有专用窗口标识、special workspace 与 Alt+A，打开时根据实际显示器的缩放、旋转和可用区域居中并聚焦。隐藏只改变窗口可见性；停止会请求 Pi 原生 SIGTERM 退出，并清理这个窗口拥有的进程。

[Vim 扩展](extensions/vim-navigation.ts)在 Pi 原生 CustomEditor 上添加模式和键位，直接调用 Pi 的滚动、搜索接口；原生布局、主题和工具展示均保留。[Hyprland 入口](hyprland/quick-ask.lua)负责快捷键与登录时隐藏启动。

运行控制：`quick-ask {start,show,hide,toggle,status,stop}`。私有运行目录为 `$XDG_RUNTIME_DIR/nvim-quick-ask/`，含 Kitty 控制 socket 和启动日志。`QUICK_ASK_CONFIG`、`QUICK_ASK_DB`、`QUICK_ASK_RUNTIME_DIR` 可隔离测试，其中 DB 路径仅用于定位相邻 sessions 目录，不会被新启动器打开或写入。详见 [控制约定](INTERFACE.md)。

## 部署和验证

```sh
python3 scripts/sync-dotfiles.py --dotfiles /path/to/dotfiles
chezmoi --source /path/to/dotfiles apply ~/.local/share/nvim-quick-ask ~/.local/bin/quick-ask ~/.config/nvim-quick-ask
quick-ask start
```

从旧 Neovim 版本升级时，先用旧启动器 `quick-ask stop` 保存并关闭已有窗口，再应用新版。同步脚本会移除公开源码中的旧界面/后端文件，保留数据库与会话；旧实现仍可在 Git 历史查看。

```sh
python3 -m unittest discover -s tests -p test_launcher.py
python3 tests/native_pi_smoke.py
# 桌面验证先关闭已有窗口，不调用模型；测试后可重新 quick-ask start。
python3 tests/desktop_smoke.py
```

原生 Pi 的 PTY 测试使用明确标注的合成对话，验证真实的 j/k、半页、gg/G、搜索、输入保留与退出，不发起模型请求；桌面测试检查隐藏/复用、双屏焦点与定位、原生会话恢复，并核对原翻译器和其他窗口布局。测试数据留在私有 `.runtime/`。

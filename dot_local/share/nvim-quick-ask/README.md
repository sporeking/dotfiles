# Quick Agent：Vim 悬浮文件与命令助手

## 目的

按 Alt+A 调出一个小窗口，用自然语言处理文件、运行命令或连续追问。问题区使用原生 Vim 多行编辑，下方按顺序显示对话、工具进度和结果。后端复用 Pi 的模型配置、持续会话与工具执行，和原翻译器各自独立。

例如先说“在当前目录创建 notes.md，写三条待办”，再说“给刚才那个文件加上日期”。后一次请求会带着同一会话的上下文。隐藏窗口后任务继续运行，再次打开即可查看结果。

## 使用方法

依赖 Python 3.11+、Neovim 0.11+、Kitty、Hyprland 0.55+ Lua API，以及已经配置模型和认证的 Pi。当前集成基于 Pi 1.5.0 RPC 协议。可选的网页搜索需要 `pi-web-access`：

```sh
pi install npm:pi-web-access
```

| 按键 / 命令 | 功能 |
| --- | --- |
| `Alt+A` | 打开 / 隐藏窗口 |
| `i` / `Esc` | 编辑 / 返回 Normal |
| `Enter` | 继续当前会话；任务运行中则排队下一条消息 |
| `Ctrl+C` | 运行中取消任务和队列；空闲时提交 |
| `:NewChat` | 开始独立的新会话，空闲时可用 |
| Normal `/` 或 `:History` | 搜索会话和旧问答记录 |
| 历史列表 `j/k`、`Enter`、`Esc` | 选择、恢复、返回 |
| `Tab` | 空闲时切换专用 `web_search` 工具可用性 |
| `Ctrl+D` / `Ctrl+U` | 滚动下方对话 |
| `:q` / `:q!` | 保存并隐藏；任务继续 |
| `:qa!` | 保存、停止本工具拥有的任务并退出 |

问题区固定三行，可滚动编辑更多内容；用 `o/O` 或 Insert 下 `Ctrl+J` 换行，`j/k` 保留原生 Vim 行移动。正在运行时也可以编辑下一条草稿。提交确认只清空尚未被改动的那份草稿。取消后，尚未执行的排队消息放回草稿；已经完成的文件修改不会自动回滚。

`/` 按字面关键词、不区分大小写搜索全部问题和回答，支持中文和 Unicode casefold，不使用 Vim 正则。查询框沿用上次关键词，`Ctrl+U` 可清空。搜索包含压缩上下文以前的原始记录。选择会话会恢复其上下文；旧版本的单轮问答仍可搜索和查看，按 Enter 会在新 agent 会话重新提问，不会串入其他对话。

## 工作目录和权限

默认工作目录为 `~/agent-workspace`，新会话会自动创建并使用该目录。修改 `~/.config/nvim-quick-ask/config.toml` 可以更换：

```toml
[agent]
workspace = "~/agent-workspace"
```

这只是默认工作起点，不是沙箱。文件工具和命令以你的普通用户身份运行，也可以访问该账户有权限访问的其他路径；没有额外的逐命令确认流程。第一版提供 Pi 原生 `read`、`write`、`edit`、`bash`、`grep`、`find`、`ls`。不添加浏览器点击或图形界面控制工具。

已有会话保留原来的工作目录；新配置作用于新会话。Vim `:cd` 不会改变 Pi 会话的目录。Tab 仅控制专用网页搜索工具，不提供网络隔离，也不要求每次都执行搜索。

Pi 继续管理模型、认证和密钥。`[pi] provider/model` 留空时沿用 Pi 默认值。`thinking = "off"` 是请求值，实际档位取决于模型支持；例如当前 DeepSeek V4.1 Flash 在 Pi 中最低为 `low`。持久 agent 没有整个任务的 180 秒运行限制；`pi.timeout` 仍供旧单轮接口及有上限的 RPC 响应等待使用。

## 实现方式与数据

- 独立 Kitty / Neovim 实例、app-id `nvim-quick-ask`、special workspace 和 socket。启动时隐藏；在缩放、旋转屏幕的实际工作区中定位和聚焦。
- 编辑器保持一个 Python NDJSON 服务；服务管理当前对话的原生 `pi --mode rpc` 进程。连续追问使用同一个会话，运行中的请求进入 Pi 原生 follow-up 队列。
- Pi 负责工具循环、重试、上下文压缩与 JSONL 持久化；客户端等 `agent_settled` 才认为任务结束。`Ctrl+C` 先清队列再 abort，关闭编辑器则回收拥有的进程。
- 工具输出更新是累计快照，界面替换预览，不重复拼接。原生会话保留完整记录；下方只展示工具名称、路径或命令及简短输出。界面不显示模型思考或原始服务诊断。
- SQLite 保留旧问答、会话索引和草稿状态。会话使用绝对路径恢复，从 JSONL 的用户/助手消息建立完整搜索索引，不用当前压缩后的短历史代替原始历史。
- 模型与认证沿用 Pi；本工具关闭自动加载的扩展、MCP、skills 和上下文文件，仅显式开放上述工具及可选搜索扩展。

源码入口：[启动器](bin/quick-ask)、[Vim 界面](nvim/lua/quick_ask/init.lua)、[NDJSON 服务](quick_ask_backend/server.py)、[Pi RPC 进程](quick_ask_backend/agent.py)和[历史索引](quick_ask_backend/store.py)。

默认位置：

| 内容 | 位置 |
| --- | --- |
| 配置 | `~/.config/nvim-quick-ask/config.toml` |
| 历史 / 状态 | `~/.local/share/nvim-quick-ask/history.sqlite3` |
| 原生会话 | `~/.local/share/nvim-quick-ask/sessions/` |
| 运行 socket / 日志 | `$XDG_RUNTIME_DIR/nvim-quick-ask/` |

数据库和会话使用私有权限。公开同步采用文件与配置字段白名单，不包含认证、历史、会话、工作目录内容或运行日志。`QUICK_ASK_CONFIG`、`QUICK_ASK_DB`、`QUICK_ASK_RUNTIME_DIR` 可用于隔离测试，目录详情及事件格式见 [接口说明](INTERFACE.md)。

## 部署和验证

从此目录运行：

```sh
python3 scripts/sync-dotfiles.py --dotfiles /path/to/dotfiles
chezmoi --source /path/to/dotfiles apply ~/.local/share/nvim-quick-ask ~/.local/bin/quick-ask ~/.config/nvim-quick-ask
quick-ask start
```

Hyprland 的 `hyprland/quick-ask.lua` 负责 Alt+A 和登录时隐藏启动。终端可用 `quick-ask {start,show,hide,toggle,status,stop}`，原翻译器快捷键不变。

```sh
python3 -m unittest discover -s tests -p 'test_*.py'
nvim --headless -u NONE -l tests/nvim_smoke.lua
# 桌面回归需先停止已有窗口；默认模拟 Pi，不调用模型。
quick-ask stop
python3 tests/desktop_smoke.py
# 可选真实 Pi：实际创建文件、连续修改并运行命令。
python3 tests/desktop_smoke.py --live
quick-ask start
```

测试数据隔离在 `.runtime/`。本机 41 项 Python 测试与 Neovim smoke 已通过；模拟和真实 Pi 的桌面回归均通过。真实两轮任务先创建并读回文件，再根据“刚才那个文件”追加内容并执行命令统计行数，确认了上下文与实际操作。协议测试覆盖队列与取消、工具快照、压缩前历史、原生目录恢复、失败及退出清理；Vim 测试覆盖连续对话、草稿竞态、隐藏继续、历史选择、输入法和退出。桌面回归也检查两屏定位/焦点和会话重启恢复，原翻译器及其他窗口布局保持一致。

# Quick Ask：Vim 悬浮快速问答

## 目的

随时调出一个小窗口，输入简单问题，得到简短回答。支持普通问答、带来源的联网问答，以及搜索全部历史的问题和答案。使用独立的 Kitty / Neovim 实例、socket、草稿和 SQLite 历史；可与翻译器同时使用。

## 使用方法

依赖 Python 3.11+、Neovim 0.11+、Kitty、Hyprland 0.55+ Lua API，以及已配置可用模型与认证的 Pi。联网功能还需要 `pi-web-access`：

```sh
pi install npm:pi-web-access
```

先在 Pi 中确认普通提问可成功回答。Quick Ask 复用 Pi 的模型、认证和搜索服务配置，不保存另一份 API 密钥。模型服务返回 401 时，需要更新 Pi 的认证；程序会显示错误，失败的回答不写入历史。

默认 `Alt+A` 调出 / 隐藏；翻译器仍为 `Alt+T`。

| 操作 | 行为 |
| --- | --- |
| `i / a / o / O`、`w / b / ciw / u` | 原生 Vim 编辑，支持多行粘贴 |
| `Enter` | 提交；生成中则取消旧请求并重新提交 |
| `Ctrl+C` | 空闲时提交，生成中取消 |
| `Esc` | 退出 Insert，保留草稿 |
| `Tab` | 切换下一次提问的普通 / 联网模式，保留输入与光标 |
| Normal 下 `/`，或 `:History` | 搜索全部历史的问题与完整答案 |
| 历史列表 `j / k`、`Enter` | 选择并恢复问答，不重新请求模型 |
| 历史查询 / 列表 `Esc` | 返回搜索前的草稿、模式和答案位置 |
| `Ctrl+D / Ctrl+U` | 滚动答案 |
| `:q` / `:q!` | 保存并隐藏 |
| `:qa!` | 真正退出实例 |

问题区固定显示三行，可滚动编辑更多内容；Insert 中也可以用 `Ctrl+J` 换行。答案使用内置 Markdown 高亮和自动折行。联网模式先搜索，再依据结果简短作答；来源链接单独列出。没有取得有效来源时明确报错。

`/` 使用不区分大小写的字面关键词搜索，支持中文和 Unicode casefold；不是 Vim 正则表达式。空关键词列出全部历史。命中列表同时显示问题与答案片段，故仅出现在答案中的关键词也能找到。历史记录从新到旧排列。每次提问独立处理，恢复历史后按 Enter 可以重新提问并获取新答案。

### 安装与启动

开发目录启动：

```sh
python3 bin/quick-ask config
python3 bin/quick-ask start
python3 bin/quick-ask toggle
```

`config` 输出需要加入 Hyprland 配置的 `dofile(...)`。引入后执行 `hyprctl reload`；登录时自动启动隐藏实例。窗口每次显示时按实际显示器的旋转、缩放和面板预留区域重新定位；默认上限 900×600，四周留 24 逻辑像素，小屏幕缩小。

通过 dotfiles 安装：

```sh
python3 scripts/sync-dotfiles.py --dotfiles /path/to/dotfiles
chezmoi apply ~/.local/share/nvim-quick-ask ~/.local/bin/quick-ask ~/.config/nvim-quick-ask
quick-ask start
```

Hyprland 主配置需引入安装后的片段：

```lua
dofile(os.getenv("HOME") .. "/.local/share/nvim-quick-ask/hyprland/quick-ask.lua")
```

控制命令为 `quick-ask start / show / hide / toggle / status / stop / config`。`start` 只启动隐藏实例，`stop` 保存并退出。

### 配置与数据

配置位置为 `~/.config/nvim-quick-ask/config.toml`，字段见 [示例](config.toml.example)。默认 provider / model 留空，继承 Pi 的选择；可以单独指定两者来使用更快的模型。`thinking` 默认为 `off`，实际支持的推理级别由所选模型决定。`timeout` 是整次请求的秒数，默认 180。

`ui.input_method=true` 时，显示窗口先记录 Fcitx 状态，Normal 使用英文，Insert 和历史关键词输入恢复此前的输入状态，隐藏时还原。普通 / 联网切换不改变输入语言。配置为 `false` 则不调用输入法命令。

历史和草稿保存在 `~/.local/share/nvim-quick-ask/history.sqlite3`；socket 和控制锁位于 `$XDG_RUNTIME_DIR/nvim-quick-ask`。支持 `QUICK_ASK_CONFIG`、`QUICK_ASK_DB`、`QUICK_ASK_RUNTIME_DIR` 做隔离覆盖。配置只存 Pi 的调用选项，Pi 的认证仍由 Pi 管理。同步脚本只拷贝公开源码及白名单配置字段，忽略历史、日志、缓存和运行数据。

## 实现方式

[启动器](bin/quick-ask) 为 `nvim-quick-ask` app-id 创建独立浮动窗口，放入 `special:quick-ask`，用 headless Neovim RPC 调用显示 / 隐藏生命周期。[Hyprland 片段](hyprland/quick-ask.lua) 注册快捷键与登录启动。

[Neovim 界面](nvim/lua/quick_ask/init.lua) 管理多行输入、只读答案、历史选择器、输入法与状态保存。每次提问启动 [Python 后端](quick_ask_backend/__main__.py)，以 NDJSON 接收文本增量、进度及最终结果。数据按完整行解码，处理 UTF-8 分包并节流刷新。修改草稿、切模式、进入历史、隐藏或取消都会使旧请求失效。

[Pi 适配](quick_ask_backend/pi.py) 在临时空目录启动一次无会话 Pi，禁用项目上下文、skills、MCP、其他扩展及本机代码工具。普通模式不启用工具；联网只加载 [专用搜索扩展](extensions/web-search.ts)，调用已安装 `pi-web-access` 的搜索核心，返回真实标题、链接和摘要。不会加载完整扩展的后台工作流。Python 只转发回答文本，不展示模型思考内容。最终助手回答、Pi settled 状态和进程退出均成功后才入库；联网还要求有实际来源。取消和超时会清理 Pi 子进程组。

[SQLite 存储](quick_ask_backend/store.py) 保存成功问答，以及草稿、UTF-8 字节光标、所选问答、答案滚动位置、提问模式和最近历史关键词。历史搜索覆盖全库，不限于屏幕上显示的记录。协议见 [INTERFACE](INTERFACE.md)。

## 验证

```sh
python3 -m unittest discover -s tests -p 'test_*.py' -v
nvim --headless -u NONE -l tests/nvim_smoke.lua
python3 tests/desktop_smoke.py
# 真实模型与联网端到端验证：需有效 Pi 认证，会产生实际服务调用。
python3 tests/desktop_smoke.py --live
```

当前 26 项 Python 行为测试通过，另有 Neovim smoke 覆盖流式拆包、取消后的迟到输出、1101 条历史、答案命中、Unicode 搜索、多行编辑、输入法和退出行为。实际 Hyprland 桌面回归使用隔离的模拟 Pi，验证了两屏位置、普通 / 联网事件、`/` 历史选择与重启恢复，原翻译器及其他窗口布局保持一致。测试遇会话锁屏时明确跳过 compositor 键盘焦点断言。真实 Pi 搜索扩展已完成无模型启动检查；真实模型回答与检索总结仍需有效认证后运行 `--live` 验证。

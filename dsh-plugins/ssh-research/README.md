# SSH 科研工作台

## 目的

在 DSH 里连接服务器、打开终端、传文件，并直接查看文本、图片和 CSV。

这是基于 [dsh-ssh 0.4.16](https://github.com/zhu1090093659/dsh-web) 修改的版本，增加了远程登录认证、文件预览，并修复断线后重复执行命令的问题。当前版本 **0.1.2**，已在 **DSH 0.2.2-rc.2** 验证。

## 使用方法

### 安装

需要已安装 DSH 和 Node.js 24.9+。这里带有构建好的文件，安装前不用运行 npm。

1. 在 DSH 的「插件」页停用原版 `@linxin666/dsh-ssh`（如果装过）。
2. 添加本地目录：`~/.local/share/chezmoi/dsh-plugins/ssh-research`。
3. 刷新网页，打开左侧「SSH」。如果插件管理器提示重启，先重启 DSH。

这个目录在 dotfiles 源仓库里，`chezmoi apply` 不会自动安装它。

### 日常使用

- **主机**：添加服务器，或从 `~/.ssh/config` 导入；原有服务器配置可继续用。
- **终端**：连接服务器后输入命令，聊天里的 `ssh_*` 工具也能用。
- **传输**：选择主机、浏览目录、点击文件即可预览。支持文本、日志、CSV 和 PNG/JPEG/GIF/WebP 图片；超过 2 MiB 请下载，CSV 过大时只显示前面一部分。
- **隧道**：转发端口在运行 DSH 的电脑上。页面的实验服务映射入口需要另装 `dsh-port-mapper`；不保证兼容所有 Jupyter/WebSocket 服务。

更新后通过插件管理器重新安装，按提示重启并刷新网页。停用或卸载也在插件管理器操作，不会删除服务器配置。

配置保存在 `$DSH_HOME/dsh-ssh.json`，通常是 `~/.dsh/dsh-ssh.json`。实际服务器配置、私钥和密码留在本机，不随仓库同步。只允许 DSH 已登录的 owner 使用；密码沿用原插件的本地保存方式，没有额外加密。

连接中断时，已经发出的命令不会自动重跑。看到“执行状态未知”时先检查远端结果，避免重复提交实验。

## 实现方式

后端入口是 `src/index.ts`，认证和文件接口在 `src/access.ts`、`src/routes.ts`，SSH 连接在 `src/engine/`。前端在 `src/client/`，通过 DSH 原生侧栏显示。构建脚本是 `scripts/build.mjs`，产物放在 `lib/`。

修改代码后运行：

```sh
npm ci --ignore-scripts --legacy-peer-deps
node scripts/link-dsh-sdk.mjs
npm test
npm pack --ignore-scripts
```

SDK 脚本只链接本机已安装的 DSH，不修改 DSH 本身。宿主集成测试目前使用 Arch 的默认全局安装路径，其他位置需调整测试中的源码路径。`npm test` 会先构建；0.1.2 通过63项测试，实际浏览器已验证侧栏、主机列表、远程目录和文本预览。

保留上游 Apache-2.0 许可和版权，修改过的源码有 fork 标记。依赖许可见 `THIRD-PARTY-LICENSES.txt`。本目录不是上游官方发布。

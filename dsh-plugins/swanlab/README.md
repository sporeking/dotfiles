# SwanLab 实验面板

## 目的

在 DSH 右侧查看 SwanLab 的实验、曲线、配置、日志和 HTML／图片报告。它只读取已有数据，不启动训练或修改实验。

## 使用方法

### 安装

已在 DSH 0.2.2-rc.2 验证；需要 Node.js 24.9+ 和已运行的 SwanLab 服务。Python 环境要装好 SwanLab SDK；目前验证过的版本是 **0.10.4**。

1. 在 DSH「插件」页添加本地目录：`~/.local/share/chezmoi/dsh-plugins/swanlab`。
2. 刷新网页，在右侧栏添加「SwanLab 实验」标签。若提示重启，先重启 DSH。
3. 选项目，再选实验，即可查看数据。隐藏面板会停止自动刷新。

### 连接自己的 SwanLab

默认连接运行 DSH 的电脑上的 `http://127.0.0.1:8000`。把 API Key 存在本机的 `~/.config/dsh-swanlab/swanlab.env`，文件内容为 `SWANLAB_API_KEY=你的密钥`，权限设为600，别提交到 Git。

如果 Python、密钥文件或服务地址不同，在启动 DSH 的环境中设置这三个变量，然后重启 DSH：

```sh
export DSH_SWANLAB_PYTHON=/path/to/venv/bin/python
export DSH_SWANLAB_ENV_FILE=/path/to/swanlab.env
export DSH_SWANLAB_API_HOST=http://127.0.0.1:8000
```

使用后台服务启动 DSH 时，也要在该服务的启动环境里设置。插件本身不会帮你启动 SwanLab。

曲线最多显示1000个采样点；日志只显示已上传的内容。HTML／媒体单项上限2 MiB。「完整 SwanLab」嵌入页只适用于本机8000端口，远程浏览器和其他端口使用前面的轻量面板。

更新后通过插件管理器重新安装，按提示重启并刷新；停用或卸载也在插件管理器操作，不会删除实验数据。

## 实现方式

`client/index.js` 注册右侧栏。`src/index.js` 检查 DSH 登录身份，再调用 `src/query.py`，通过 Python SDK 读取 SwanLab。密钥只留在后端，HTML 报告放在隔离框架中显示；不增加 Agent 工具或提示词。图表折叠状态保存在浏览器里，不影响实验数据。

没有额外构建步骤，修改后运行：

```sh
npm run check
npm test
```

默认测试不连接真实 SwanLab；可选联调参数见 [后端说明](src/API.md)。客户端测试按 Arch 的系统级 DSH 安装路径编写，其他安装位置需调整测试里的路径。代码采用 MIT 许可。

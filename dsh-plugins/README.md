# 自维护 DSH 插件

## 目的

把我们自己的 DSH 插件放在一起，方便备份、换机器和继续开发。

- [SSH 科研工作台](ssh-research/README.md)：连接服务器、传文件、查看文本、图片和 CSV。
- [SwanLab 实验面板](swanlab/README.md)：在右侧栏查看实验曲线、配置、日志和报告。

## 使用方法

打开 DSH 的「插件」页，添加对应的本地目录。例如：

```text
~/.local/share/chezmoi/dsh-plugins/ssh-research
```

这是 dotfiles 源仓库中的路径。`chezmoi apply` 不会自动安装这里的插件。具体用法见各插件的 README。

## 实现方式与维护

每个插件一个文件夹，放代码、安装文件和说明。修改后先测试、构建，再通过插件管理器更新；需要重启时按提示操作，最后刷新网页。

服务器配置、私钥、密码和运行记录留在本机，不上传到这里。

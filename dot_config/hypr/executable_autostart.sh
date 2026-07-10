#!/bin/bash

# --- SSH Agent Management ---
SSH_ENV="$HOME/.ssh/agent/env"

# 函数：启动 SSH Agent 并添加密钥
start_ssh_agent_and_add_key() {
  echo "Starting new SSH agent and adding keys..."

  # 启动 ssh-agent 并将环境变量写入文件
  /usr/bin/ssh-agent -s >"${SSH_ENV}"
  chmod 600 "${SSH_ENV}"

  # 加载环境变量
  . "${SSH_ENV}" >/dev/null

  # 添加你的 SSH 私钥
  # 提示：根据你的密钥类型修改路径
  /usr/bin/ssh-add ~/.ssh/id_rsa # 你的默认 RSA 密钥
  # /usr/bin/ssh-add ~/.ssh/id_ed25519 # 如果你使用 Ed25519 密钥
  # 可以添加多个密钥，根据你的需要
}

# 检查 SSH Agent 是否正在运行
if [ -f "${SSH_ENV}" ]; then
  . "${SSH_ENV}" >/dev/null
  # 如果 SSH_AGENT_PID 存在，检查进程是否存活
  if ! kill -0 "${SSH_AGENT_PID}" 2>/dev/null; then
    # Agent 已死，重新启动
    start_ssh_agent_and_add_key
  fi
else
  # 环境文件不存在，Agent 可能从未启动，或上次启动失败，重新启动
  start_ssh_agent_and_add_key
fi

# --- 其他 Hyprland 启动项 (如果需要) ---
# 例如：
# exec-once waybar &
# exec-once nm-applet --indicator &
# exec-once dunst &
# ...

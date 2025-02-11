#!/bin/bash

# 检查是否提供了亮度参数
if [ -z "$1" ]; then
  echo "Usage: $0 <brightness>"
  echo "Please provide a brightness value between 0 and 100."
  exit 1
fi

# 提供的亮度值
BRIGHTNESS=$1

# 检查亮度值是否在合理范围内
MONITOR_COUNT=$(ddcutil detect | grep -c "Display")

# 如果没有检测到显示器，退出
if [ "$MONITOR_COUNT" -eq 0 ]; then
  echo "No displays detected."
  exit 1
fi

# 循环设置每个显示器的亮度
for i in $(seq 1 "$MONITOR_COUNT"); do
  echo "Setting brightness to $BRIGHTNESS for display $i"
  ddcutil setvcp 10 + $BRIGHTNESS --display "$i"
done

echo "Brightness adjustment complete."

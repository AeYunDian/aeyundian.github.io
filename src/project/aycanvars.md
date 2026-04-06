---
icon: pen-ruler
date: 2026-04-06
title: 'AyCanvars'
prev: false
next: false
---
适用于触屏和鼠标的简易绘图软件。 [安装包下载](/aycanvars/download/release/1.1.0.exe)
<!-- more -->
## 简介

AyCanvars 是一款基于 C# 和 .NET Framework 4.6.2 开发的绘图程序，专为课堂批注、自由绘画等场景设计。支持触屏与鼠标双重操作，界面原创，图标独立设计。

## 主要功能

- 画笔：可调节颜色、粗细（1~100px），抗锯齿渲染。
- 橡皮擦：大小自动为画笔的10倍，二次点击可清空画板。
- 文本工具：自定义字体、字号、样式、颜色，点击画布输入。
- 撤销重做：最多64步历史记录。
- 导出图片：支持 PNG、JPEG、BMP、GIF。
- 画板缩放：窗口自适应。
- 触屏优化：多点触控，文本输入时自动弹出屏幕键盘。

## 技术参数

- 语言：C#
- 框架：.NET Framework 4.6.2
- 开发环境：Visual Studio 2026
- 图形：Graphics Device Interface+
- 触摸：Windows Touch API
- 配置存储：Initialization File
- 日志：自研 LogFile
- 安装包：Inno Setup，大小约2.37 MB，实际程序大小约124 KB

## 下载与安装

当前版本：v1.1.0（2026-04-06）
[下载链接](/aycanvars/download/release/1.1.0.exe)
支持系统：Windows 7/8/10/11（需 .NET Framework 4.6.2）
安装步骤：运行安装包，按提示选择安装模式、路径，同意 GPL v3.0 协议即可。

## 使用说明

1. 启动后底部工具栏：鼠标选择、画笔、橡皮擦、更多功能。
2. 单击画笔橡皮擦激活，再次单击打开设置（颜色、粗细）。
3. 更多菜单中包含撤销、重做、文本工具、导出图片、清理内存。
4. 左侧边栏：菜单（关于、设置、更新）、退出。
5. 文本工具：点击画布弹出输入框，支持字体、颜色设置。
6. 触屏设备：单指多指绘图，文本输入时自动弹出系统键盘。

## 更新日志
v1.1.0（2026-04-06）
- 新增关于对话框、设置窗口（自动保存、管理员启动、更新渠道）
- 新增检查更新功能（正式版测试版自定义源）
- 优化撤销重做栈限制为64步
- 修复画板缩放偏移及触屏橡皮擦大小问题

v1.0.0（2026-03-28）
- 首个稳定版本。
- 实现画笔、橡皮擦、文本、撤销/重做、导出图片等核心功能。
- 支持触屏和鼠标。

## 许可与版权

开源协议：GNU General Public License v3.0  
作者：韵典（AeYunDian）  
版权年份：2025-2026  
GitHub：[https://github.com/AeYunDian/AyCanvars](https://github.com/AeYunDian/AyCanvars)  
著作权：已提交中国版权保护中心（受理中）

## 联系

网站：[https://undz.cn](https://undz.cn)  
B站：[https://space.bilibili.com/3494370328185235/](https://space.bilibili.com/3494370328185235/)  
邮箱：admin@undz.cn
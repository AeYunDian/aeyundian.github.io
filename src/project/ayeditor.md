---
icon: pen-ruler
date: 2026-07-07
title: "AyEditor"
prev: false
next: false
---

本文介绍了由我开发的轻量级网页代码编辑器 AyEditor，专为快速编写、调试与保存代码而设计。

<!-- more -->

## 简介

AyEditor 是一款基于 Web 技术构建的在线代码编辑器，内核采用 Monaco Editor（VS Code 同源），为开发者、学生和极客提供一个无需安装、随时可用的编码环境。它支持主流编程语言的语法高亮、自动补全、多光标编辑，并提供本地存储、一键导出文件、实时光标状态显示等功能，适合日常笔记、原型验证及教学演示。

## 主要功能

- **多语言支持**：内置 JavaScript、TypeScript、HTML、CSS、Python、Java 等 50 余种语言的高亮与智能提示。
- **本地持久化**：编辑内容自动存入 localStorage，刷新页面不丢失，并可手动保存为 `.js`、`.py` 等格式文件。
- **光标信息栏**：实时显示当前行号、列号及选中字符数，方便定位与统计。
- **快捷键保存**：支持 `Ctrl+S` / `Cmd+S` 触发系统下载对话框，文件命名自动匹配当前语言后缀。
- **主题适配**：内置深色主题“GitHub Blue”，护眼且美观。
- **响应式布局**：自适应屏幕尺寸，在桌面与平板设备上均能流畅使用。
- **离线可用**：所有资源加载后，核心编辑功能可离线运行（配合 Service Worker 更佳）。
- **云端保存**：通过 AyAccount，实现云端保存，随时随地都能打开编辑/查看。

## 技术参数

- **语言**：JavaScript (ES6+)、HTML5、CSS3
- **编辑器内核**：Monaco Editor v0.39.0
- **存储**：Web localStorage（内容）、会话存储（语言偏好）
- **字体**：Fira Code（等宽）、Noto Sans SC（中文）
- **构建工具**：Vite（开发）、Rollup（打包）
- **兼容性**：Chrome 90+、Firefox 88+、Edge 90+、Safari 14+
- **包体积**：首次加载约 2.8 MB（含 Monaco 核心），后续利用缓存加速。

## 下载与安装

AyEditor 为纯 Web 应用，无需安装，直接访问即可使用。

- **在线体验**：[https://editor.undz.cn](https://editor.undz.cn)
- **源码仓库**：[https://github.com/AeYunDian/AyEditor](https://github.com/AeYunDian/AyEditor)
- **离线包**（可选）：下载 ZIP 解压后，用任意 HTTP 服务器（如 `serve`、`nginx`）托管即可运行。

## 使用说明

1. 打开页面，编辑器默认加载 JavaScript 示例代码。
2. 在编辑区直接敲击代码，语法高亮和智能提示即时生效。
3. 底部状态栏显示当前光标位置（行、列）以及选中文本长度。
4. 按下 `Ctrl+S`（Windows/Linux）或 `Cmd+S`（macOS），浏览器自动下载当前代码文件，文件名根据语言自动生成（如 `code.js`）。
5. 点击右上角“切换语言”下拉菜单可更改当前文件语法模式（仅影响高亮，不影响内容）。
6. 所有编辑内容自动保存在浏览器的 localStorage 中，刷新页面后自动恢复。
7. 如想重置内容，可清空编辑器后手动保存空文件，或调用控制台 `localStorage.removeItem('ae_content')`。

## 更新日志

**v1.0.0（2026-07-07）**

- 首个公开版本，基于 Monaco Editor 构建。
- 实现多语言语法高亮、自动补全、光标信息栏。
- 支持 `Ctrl+S` 下载保存，文件后缀自动匹配语言。
- 内置 GitHub Blue 深色主题，并支持通过 `defineTheme` 扩展。
- 实现 localStorage 内容持久化及语言偏好保存。
- 提供示例页面和简洁 UI，兼容主流浏览器。

## 许可与版权

- 开源协议：MIT License
- 作者：韵典（AeYunDian）
- 版权年份：2026
- 项目主页：[https://github.com/AeYunDian/AyEditor](https://github.com/AeYunDian/AyEditor)

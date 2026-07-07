---
icon: bell
date: 2026-07-07
title: "AyWebToast"
prev: false
next: false
---

本文介绍了我开发的轻量级 Web Toast 提示组件，专为快速展示加载、成功、错误等反馈信息而设计，零依赖，即插即用。

<!-- more -->

## 简介

AyWebToast 是一款纯 JavaScript 与 CSS 构建的 Toast 轻提示组件，专为 Web 应用设计。它提供了加载中、成功提示、错误提示等常见反馈样式，支持自定义显示时长，可手动关闭，适配移动端与桌面端。

## 主要功能

- **三种提示类型**：普通信息（info）、加载中（loading）、错误（error），自动切换图标。
- **灵活显示时长**：支持自定义超时时间（毫秒），传入 `0` 则不自动关闭。
- **手动控制**：提供 `AyCloseToast()` 方法，随时手动关闭当前 Toast。
- **自适应内容**：宽度自动适应文字长度，支持多行文本，最大宽度限制 80%。
- **视觉反馈**：加载图标旋转动画，视觉清晰。
- **移动端优化**：适配触屏操作，在移动设备上表现良好。
- **零依赖**：无需任何第三方库，引入即可使用。

## 技术参数

- **语言**：JavaScript（ES5+）、CSS3
- **运行环境**：浏览器（Chrome、Firefox、Edge、Safari 等）
- **依赖**：无
- **样式方案**：纯 CSS，自带重置与动画
- **图标**：内联 Base64 图片，无需额外资源
- **兼容性**：IE11+、现代浏览器全支持

## 快速开始

### 引入方式

```html
<!-- 引入 CSS -->

<!-- 移动端专属  移动端和桌面端的CSS应该分开加载 
  <link rel="stylesheet" href="https://online.undz.cn/login/mobile/toast.css" /> -->

<link rel="stylesheet" href="https://online.undz.cn/login/toast.css" />

<!-- 引入 JS -->
<script src="https://online.undz.cn/login/toast.js"></script>
```

### 基本用法

```javascript
// 显示加载中（不自动关闭）
AyShowResult("加载中...", "loading", 0);

// 显示成功信息（1.1 秒后自动关闭）
AyShowResult("操作成功！", "info", 1100);

// 显示错误信息
AyShowResult("网络请求失败", "error", 2000);

// 手动关闭
AyCloseToast();

// 支持传入 Error 对象
try {
  // ...
} catch (err) {
  AyShowResult(err);
}
```

### API 说明

---

icon: bell
date: 2026-07-07
title: "AyWebToast"
prev: false
next: false

---

本文介绍了我开发的轻量级 Web Toast 提示组件，专为快速展示加载、成功、错误等反馈信息而设计，零依赖，即插即用。

<!-- more -->

## 简介

AyWebToast 是一款纯 JavaScript 与 CSS 构建的 Toast 轻提示组件，专为 Web 应用设计。它提供了加载中、成功提示、错误提示等常见反馈样式，支持自定义显示时长，可手动关闭，适配移动端与桌面端。

## 主要功能

- **三种提示类型**：普通信息（info）、加载中（loading）、错误（error），自动切换图标。
- **灵活显示时长**：支持自定义超时时间（毫秒），传入 `0` 则不自动关闭。
- **手动控制**：提供 `AyCloseToast()` 方法，随时手动关闭当前 Toast。
- **自适应内容**：宽度自动适应文字长度，支持多行文本，最大宽度限制 80%。
- **视觉反馈**：加载图标旋转动画，视觉清晰。
- **移动端优化**：适配触屏操作，在移动设备上表现良好。
- **零依赖**：无需任何第三方库，引入即可使用。

## 技术参数

- **语言**：JavaScript（ES5+）、CSS3
- **运行环境**：浏览器（Chrome、Firefox、Edge、Safari 等）
- **依赖**：无
- **样式方案**：纯 CSS，自带重置与动画
- **图标**：内联 Base64 图片，无需额外资源
- **兼容性**：IE11+、现代浏览器全支持

## 快速开始

### 引入方式

```html
<!-- 引入 CSS -->

<!-- 移动端专属  移动端和桌面端的CSS应该分开加载 
  <link rel="stylesheet" href="https://online.undz.cn/login/mobile/toast.css" /> -->

<link rel="stylesheet" href="https://online.undz.cn/login/toast.css" />

<!-- 引入 JS -->
<script src="https://online.undz.cn/login/toast.js"></script>
```

### 基本用法

```javascript
// 显示加载中（不自动关闭）
AyShowResult("加载中...", "loading", 0);

// 显示成功信息（1.1 秒后自动关闭）
AyShowResult("操作成功！", "info", 1100);

// 显示错误信息
AyShowResult("网络请求失败", "error", 2000);

// 手动关闭
AyCloseToast();

// 支持传入 Error 对象
try {
  // ...
} catch (err) {
  AyShowResult(err);
}
```
### API 说明

| 函数 | 参数 | 说明 |
|------|------|------|
| `AyShowResult(data, type, timeout)` | `data`: 消息内容（字符串或 Error 对象）<br>`type`: `'info'`、`'loading'`、`'error'`<br>`timeout`: 自动关闭毫秒数（默认 1100） | 显示 Toast |
| `AyCloseToast()` | 无 | 手动关闭当前 Toast |

## 许可与版权

- 开源协议：MIT License
- 作者：韵典（AeYunDian）
- 版权年份：2026

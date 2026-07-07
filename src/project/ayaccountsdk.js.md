---
icon: key
date: 2026-07-07
title: "AyAccountSDK"
prev: false
next: false
---

本文介绍了我自主开发的轻量级用户认证 JavaScript SDK，专为 Web 应用快速集成登录、注册及账号管理功能而设计。

<!-- more -->

## 简介

AyAccountSDK 是一款纯前端 JavaScript 库，旨在帮助开发者以最少代码量为 Web 应用添加完整的用户认证体系。它内置美观的登录/注册弹窗界面，支持多语言国际化、人机验证、令牌自动刷新等功能，开箱即用，兼容主流浏览器。

## 主要功能

- **登录与注册**：弹出模态框，用户填写表单，SDK 自动处理请求与验证。
- **多语言支持**：内置简体中文、繁体中文、英文，支持自定义翻译和动态切换语言。
- **人机验证**：集成极验（Geetest）行为验证，有效防止机器人攻击。
- **令牌管理**：自动携带 Cookie，支持 access_token 验证与刷新。
- **密码修改**：提供修改密码接口，支持旧密码验证和人机验证。
- **自定义配置**：可传入 appId 标识应用，支持自定义 I18n 翻译包。
- **移动端适配**：自动检测移动设备，加载对应优化的界面。
- **跨域通信**：基于 postMessage 实现父页面与 iframe 的安全通信。

## 技术参数

- **语言**：JavaScript（ES6+）
- **运行环境**：浏览器（Chrome 90+、Firefox 88+、Edge 90+、Safari 14+）
- **依赖**：无外部依赖，动态加载 Geetest 与 AyToast 组件
- **通信机制**：postMessage + iframe
- **会话管理**：基于 Cookie（HttpOnly，由服务端设置）
- **打包格式**：UMD，支持 `<script>` 标签直接引入

## 快速开始

### 安装

通过 CDN 引入：

```html
<script src="https://online.undz.cn/lib/auth-sdk.js"></script>
```

### 基本用法

```javascript
// 1. 初始化 SDK
const account = new AyAccount({
  appId: "your-app-id", // 应用标识
  i18n: "zh-cn", // 语言：'zh-cn' | 'zh-hk' | 'en-us'
});

// 2. 调用登录
try {
  const userInfo = await account.login();
  if (userInfo) {
    console.log("登录成功", userInfo);
  } else {
    console.log("用户关闭了登录窗口");
  }
} catch (err) {
  console.error("登录失败", err);
}

// 3. 注册
await account.register();

// 4. 切换语言
account.changeLanguage("en-us");

// 5. 登出
await account.logout();

// 6. 验证当前令牌
const { valid, user } = await account.verify();

// 7. 修改密码
await account.changePassword("oldPass", "newPass");
```

### 自定义翻译

```javascript
const account = new AyAccount({
  appId: "xxx",
  i18n: {
    lang: "ja",
    fallbackLang: "zh-cn",
    translations: {
      ja: {
        "title.login": "ログイン",
        "btn.login": "ログイン",
      },
    },
  },
});
```

## 许可与版权

- 开源协议：MIT License
- 作者：韵典（AeYunDian）
- 版权年份：2026
- GitHub：[https://github.com/AeYunDian/api/blob/main/api-assets/lib/auth-sdk-o.js](https://github.com/AeYunDian/api/blob/main/api-assets/lib/auth-sdk-o.js)
- 欢迎 Star、Fork 和贡献代码！

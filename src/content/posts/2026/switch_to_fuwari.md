---
published: 2026-08-08
title: 从 VuePress 迁移到 Fuwari

description: "本文记录了我将个人博客从 VuePress 迁移到基于 Astro 的 Fuwari 主题的全过程，包括遇到的各种环境问题、配置难点以及最终的解决方案。希望能给同样想换主题或迁移到 Astro 的朋友一些参考。"
---

---

## 为什么迁移？

之前我的博客一直用 VuePress 搭建，整体还算稳定。但随着内容增多，我对博客的需求也在变化：

- **更好的性能**：我希望有几乎零 JavaScript 的纯静态页面，交互交给浏览器端按需加载。
- **更现代化的开发体验**：Astro 的 Islands 架构和组件隔离很吸引我。
- **更丰富的功能**：Fuwari 主题集成了代码高亮、数学公式、图表、搜索、暗色模式等，开箱即用。

正好看到 **Fuwari** 这个基于 Astro 的博客主题，设计清新、功能完整，于是决定迁移。

---

## 依赖安装——exFAT 盘上的问题

我的项目放在 G 盘（移动硬盘，格式为 exFAT），执行 `pnpm install` 时反复报错：

```
ERR_PNPM_ENOENT: ENOENT: no such file or directory, rename ... -> ... .ignored_language-server
```

搜索后发现，**exFAT 不支持符号链接（symlink）**，而 pnpm 默认使用符号链接来管理依赖。虽然 `.npmrc` 中设置了 `node-linker=hoisted`，但不知为何没生效。

据网上查询最终解决方案有两种：

1. **在项目根目录创建 `.npmrc` 文件**，加入：

   ```
   node-linker=hoisted
   ```

   并删除 `node_modules` 和 `pnpm-lock.yaml`，重新执行 `pnpm install`。

2. **直接使用命令行强制指定**：
   ```bash
   pnpm install --config.node-linker=hoisted
   ```

我原本是在项目根目录创建 `.npmrc` 文件，奈何尝试几次没有用，于是直接使用命令行强制指定

---

## 迁移隐私协议弹窗组件

VuePress 时代我使用了一个 Vue 组件，用于显示隐私政策、Cookie 政策和服务条款的同意弹窗。现在要迁移到 Fuwari 中，Fuwari 使用 Svelte，所以我用 Svelte 重写了这个组件。

### 迁移过程中遇到的语法问题

1. **`class:disabled={condition}` 报错**  
   这种写法在某些 Svelte 版本中会被误判为空简写，改为字符串拼接：

   ```svelte
   <div class="checkbox-group {!canEnableCheckbox ? 'disabled' : ''}">
   ```

2. **`{@html modalContent}` 的位置错误**  
   我一开始写在了开始标签里，导致 `attribute_empty_shorthand` 错误。应放在元素内容区域：

   ```svelte
   <div class="modal-body">
     {@html modalContent}
   </div>
   ```

3. **A11y 警告**  
   Svelte 对无障碍性要求严格，给点击的 `<div>` 加上 `role="button"`、`tabindex="0"` 和键盘事件处理即可消除警告。

最终得到了一个完全无错误、无警告的 Svelte 组件，配合 `client:load` 指令在 Astro 布局中加载，实现了原来的功能，但UI真的不行。

---

## 最终效果与感受

经过几天的折腾，我的博客终于跑起来了。Fuwari 带来的体验除了UI我觉得好看，其他没什么不同。

哦，对了， Fuwari 的文章配置比 VuePress 少了好多配置……

迁移过程中虽然踩了不少坑，但也学到了很多关于 Astro、pnpm、Svelte 的知识。

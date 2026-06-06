---
icon: pen-to-square
date: 2026-06-03
title: AyWebHosting
---
# AyWebHosting——更简单的个人静态网站托管

## 免费托管，无限可能

您将免费获得一个类似 `https://undz.cn/yourname/` 的网站路径，或者一个三级子域名（例如 `yourname.undz.cn`、`yourname.io.hb.cn` 等）。

支持以下域名格式：
- `yourname.undz.cn`
- `yourname.io.hb.cn`
- `yourname.exm2.eu.cc`
- `yourname.ayd2.eu.cc`
- `yourname.net2.eu.cc`
- `yourname.net3.eu.cc`
- `yourname.eu.cc`

## 如何申请？

如果您需要托管个人静态网站，请联系我：
- **QQ好友添加**：[点击此处唤起QQ](https://api.undz.cn/addqq?uid=2768223712)
- **B站私信**：[https://space.bilibili.com/3494370328185235](https://space.bilibili.com/3494370328185235)
- **邮箱**：[admin@exm.undz.cn](mailto:admin@exm.undz.cn) 或 [zhanghaoyu19281@gmail.com](mailto:zhanghaoyu19281@gmail.com)

## 服务承诺

- ✅ **完全免费**：无需信用卡，无隐藏费用。
- 🚫 **无广告**：您的网站就是您自己的，我们绝不会在上面投放任何广告。
- ⏱️ **99.99% 正常运行时间**：接近100%的可用性，让您的网站全天候开放。

::: info
当前自动化部署系统正在开发中，由于正在准备期末考和毕业考，较忙，预计于7月1日开放，预计还有 <span id="remaining_days"></span>
:::

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const targetDate = new Date(2026, 6, 1) // 注意：月份从0开始，7月是6
  const today = new Date()
  const diffTime = targetDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const daysSpan = document.getElementById('remaining_days')
  if (daysSpan) {
    daysSpan.textContent = diffDays > 0 ? `${diffDays} 天` : '已开放'
  }
})
</script>
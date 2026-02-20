---
title: 赞助
index: false
icon: hand-holding-heart
article: false
sidebar: false
pageInfo: false
contributors: false
lastUpdated: false
draft: true
prev: false
next: false
breadcrumb: false
backtotop: false
---
 
<!-- more -->

如果您觉得我的内容对您有帮助，欢迎通过以下方式支持我的创作。您的每一份支持都是我持续创作的动力！
所有赞助将用于网站维护、服务器费用以及内容创作。

::: info 您可点击图片唤起客户端
:::

<div id="qr-container" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin: 30px 0;">
  <div style="text-align: center;">
    <img src="/alipay.jpg" alt="支付宝收款码" class="alipay-link" width="290" height="290" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    <p style="margin-top: 8px; font-weight: 500;">支付宝</p>
  </div>
  <div style="text-align: center;">
    <img src="/wechat-pay.jpg" alt="微信收款码" width="290" class="wechat-link" height="290" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    <p style="margin-top: 8px; font-weight: 500;">微信支付</p>
  </div>
</div>

<script setup>
import { onMounted } from 'vue';

// 仅在浏览器环境执行
if (typeof window !== 'undefined') {
  onMounted(() => {
    console.log('赞助页面组件挂载');

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const infoContainer = document.querySelector('div.hint-container.info');
    
    if (infoContainer) {
      infoContainer.style.setProperty('display', isMobile ? 'block' : 'none', 'important');
    }

    // 移动端绑定点击事件
    if (isMobile) {
      const container = document.getElementById('qr-container');
      if (container) {
        const handleImageClick = (e) => {
          const target = e.target;
          if (target.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
          }
          if (target.classList.contains('alipay-link')) {
            window.location.href = 'https://qr.alipay.com/fkx19538tldpvgxawbq0d22';
          } else if (target.classList.contains('wechat-link')) {
            alert('暂未接入微信支付');
          }
        };
        // 先移除旧监听器（避免重复绑定，但组件每次重建，实际不会重复）
        container.removeEventListener('click', handleImageClick);
        container.addEventListener('click', handleImageClick);
      }
    }
  });
}
</script>

感谢你的支持！
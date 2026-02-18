---
title: 赞助
index: false
icon: hand-holding-heart
article: false
sidebar: false
pageInfo: false
contributors: false
lastUpdated: false
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

<script>
(function() {
  if (typeof window === 'undefined') return;

  // 延迟执行，确保 DOM 已更新
  setTimeout(function() {
    console.log('赞助页面脚本执行 (直接)'); 
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    console.log('是否为移动端:', isMobile); 

    // 控制 info 容器显示/隐藏
    const infoContainer = document.querySelector('div.hint-container.info');
    if (infoContainer) {
      infoContainer.style.setProperty('display', isMobile ? 'block' : 'none', 'important');
      console.log('info容器已设置display为:', isMobile ? 'block' : 'none');
    } else {
      console.warn('未找到 .hint-container.info 元素');
    }

    // 移动端绑定点击事件
    if (isMobile) {
      const container = document.getElementById('qr-container');
      if (container) {
        // 移除之前可能绑定的监听器（防止重复）
        container.removeEventListener('click', handleImageClick);
        container.addEventListener('click', handleImageClick);
        console.log('图片点击事件监听已绑定');
      } else {
        console.warn('未找到 #qr-container 元素');
      }
    }
  }, 0);

  // 定义事件处理函数（需具名以便移除）
  function handleImageClick(e) {
    const target = e.target;
    if (target.tagName === 'IMG') {
      e.preventDefault();
      e.stopPropagation();
      console.log('图片点击已拦截'); 
    }
    if (target.classList.contains('alipay-link')) {
      window.location.href = 'https://qr.alipay.com/fkx19538tldpvgxawbq0d22';
    } else if (target.classList.contains('wechat-link')) {
      alert('暂未接入微信支付');
    }
  }
})();
</script>


感谢你的支持！
---
prev: false
next: false
comment: false
lastUpdated: false
index: false
draft: true
navbar: false
sidebar: false
breadcrumb: false
pageInfo: false
contributors: false
editLink: false
footer: false
backtotop: false
head:
  - - meta
    - name: robots
      content: noindex
--- 

<div class="go-container" v-if="showConfirm">
  <div class="confirm">
    <p>{{ confirmMsg }}</p>
    <div class="buttons">
      <button @click="continueJump" class="btn primary">继续访问</button>
      <button @click="cancelJump" class="btn secondary">取消</button>
    </div>
  </div>
</div>
<div class="go-container" v-else>
  <div class="loading">
    <div class="spinner"></div>
    <p>正在跳转，请稍候...</p>
  </div>
</div>

<script setup>
import { ref, onMounted } from 'vue';

const showConfirm = ref(false);
const confirmMsg = ref('');
let targetUrl = '';
let fallbackUrl = '/';

function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// 替换当前历史记录进行跳转
function redirect(url) {
  window.location.replace(url);
}

// 获取回退地址（优先级：rb 参数 > 根目录）
function getFallbackUrl() {
  const rb = getUrlParam('rb');
  if (rb) {
    return decodeURIComponent(rb);
  }
  return '/';
}

// 用户确认跳转
function continueJump() {
  if (targetUrl) {
    redirect(targetUrl);
  } else {
    redirect(fallbackUrl);
  }
}

// 用户取消：先尝试后退，失败则使用回退地址
function cancelJump() {
  // 尝试返回上一页（来源页）
  if (document.referrer && document.referrer !== '') {
    // 有来源页，尝试后退
    history.back();
    // 设置一个定时器，如果 300ms 后还在当前页，说明后退失败，则使用回退地址
    setTimeout(() => {
      // 检查当前 URL 是否还是此页面（简单判断）
      if (window.location.pathname.includes('go.html')) {
        redirect(fallbackUrl);
      }
    }, 300);
  } else {
    // 无来源页，直接使用回退地址
    redirect(fallbackUrl);
  }
}

async function main() {
  // 获取必要参数
  const to = getUrlParam('to');
  fallbackUrl = getFallbackUrl();

  // 缺少 to 参数 → 直接回退
  if (!to) {
    redirect(fallbackUrl);
    return;
  }

  const timestamp = Date.now();
  const apiUrl = `https://api.undz.cn/go/parse?t=${timestamp}&link=${encodeURIComponent(to)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.code === 200 && data.data?.link) {
      targetUrl = data.data.link;
      const needTip = data.data.tip === true; // 只有明确 true 才显示确认框
      if (needTip) {
        confirmMsg.value = `即将跳转到 ${targetUrl}，该链接安全性未知，是否继续？`;
        showConfirm.value = true;
      } else {
        redirect(targetUrl);
      }
    } else {
      // API 返回非 200 或无 link → 回退
      console.warn('API 返回异常，回退至', fallbackUrl);
      redirect(fallbackUrl);
    }
  } catch (err) {
    console.error('请求失败，回退至', fallbackUrl, err);
    redirect(fallbackUrl);
  }
}

onMounted(() => {
  main();
});
</script>

<style scoped>
.go-container {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.loading, .confirm {
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  border: 4px solid #e2e8f0;
  border-top-color: var(--vp-c-accent, #3b82f6);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.confirm p {
  margin-bottom: 24px;
  color: #1e293b;
  word-break: break-all;
}

.buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: var(--vp-c-accent, #3b82f6);
  color: white;
}

.btn.primary:hover {
  background: var(--vp-c-accent-dark, #2563eb);
  transform: translateY(-1px);
}

.btn.secondary {
  background: #f1f5f9;
  color: #334155;
}

.btn.secondary:hover {
  background: #e2e8f0;
}

@media (prefers-color-scheme: dark) {
  .loading, .confirm {
    background: #1e293b;
  }
  .confirm p {
    color: #f1f5f9;
  }
  .btn.secondary {
    background: #334155;
    color: #e2e8f0;
  }
  .btn.secondary:hover {
    background: #475569;
  }
}
</style>
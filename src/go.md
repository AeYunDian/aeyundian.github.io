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
    <p v-html="confirmMsg"></p>
    <div class="buttons">
      <button @click="continueJump" class="btn primary">继续访问</button>
      <button @click="cancelJump" class="btn secondary">取消</button>
    </div>
  </div>
</div>
<div class="go-container" v-else>
  <div class="loading">
    <div class="indeterminate-progress"></div>
  </div>
</div>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showConfirm = ref(false);
const confirmMsg = ref('');
let targetUrl = '';
let fallbackUrl = '/';

function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
function isInternalUrl(url) {
  if (!url) return false;
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return true;
  if (!/^https?:\/\//i.test(url)) return true;
  return false;
}
// 替换当前历史记录进行跳转
function redirect(url) {
  if (isInternalUrl(url)) {
    router.replace(url);
  } else {
    window.location.replace(url);
  }
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
  if (document.referrer && document.referrer !== '') {
    history.back();
    setTimeout(() => {
      if (window.location.pathname.includes('go.html')) {
        router.replace(fallbackUrl);
      }
    }, 300);
  } else {
    router.replace(fallbackUrl);
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
        confirmMsg.value = `即将跳转到 <a href="${window.location}" target="_self" >${targetUrl}</a>，该链接安全性未知，是否继续？`;
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
}

.loading, .confirm {
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 不确定进度条容器 */
.indeterminate-progress {
  width: 100%;
  max-width: 300px;
  margin: 0 auto 20px;
  height: 13px;
  background-color: #e2e8f0;
  border-radius: 1px;
  overflow: hidden;
  position: relative;
}

.indeterminate-progress::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: var(--vp-c-accent, #299764);
  animation: indeterminate-slide 3s linear infinite;
}


@keyframes indeterminate-slide {
  0% {
    left: -100%;
  }
  100% {
    left: 103%;
    /* 结束后不是直接从头开始，而是等一会 */
  }
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
  background: var(--vp-c-accent, #299764);
  color: white;
}

.btn.primary:hover {
  background: var(--vp-c-accent-hover, #2563eb);
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
    .indeterminate-progress {
    background-color: #334155;
  }
}
</style>
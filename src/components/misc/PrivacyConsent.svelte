<script>
  import { onMount, onDestroy } from "svelte";

  // ===== 配置 =====
  const PRIVACY_VERSION = 3;
  const EXEMPT_PATHS = [
    "/privacy_policy/",
    "/cookie_policy/",
    "/about/",
    "/contact_me/",
    "/terms/",
  ];

  // ===== 状态 =====
  let consentGiven = true;
  let agreeChecked = false;
  let privacyPolicyRead = true;
  let cookiePolicyRead = true;
  let termsPolicyRead = true;
  let modalVisible = false;
  let modalType = "";
  let modalTitle = "";
  let modalContent = "";

  // ===== 计算属性 =====
  $: canEnableCheckbox =
    privacyPolicyRead && cookiePolicyRead && termsPolicyRead;

  // ===== 辅助函数 =====
  function isExemptPath(path) {
    return EXEMPT_PATHS.some((prefix) => path.startsWith(prefix));
  }

  function checkRoute() {
    const currentPath = window.location.pathname;
    if (isExemptPath(currentPath)) {
      consentGiven = true;
      return;
    }

    const stored = localStorage.getItem("cookieConsent");
    if (stored) {
      try {
        const consent = JSON.parse(stored);
        if (consent.version === PRIVACY_VERSION) {
          consentGiven = true;
          return;
        }
      } catch (e) {
        console.error("解析 cookieConsent 失败", e);
      }
    }
    consentGiven = false;
  }

  // ===== 事件处理 =====
  function openModal(type) {
    modalType = type;
    if (type === "privacy") {
      modalTitle = "隐私政策";
      modalContent = `
        <p>本政策将帮助您了解我们收集哪些数据、收集这些数据的原因以及您与这些数据相关的权利。</p>
        <ul>
          <li>详情请阅读完整版<a href="/privacy_policy/" target="_blank" style="#2c7da0">《隐私政策》</a>。</li>
        </ul>
        <p>若您有任何疑问，可通过邮件联系我们。</p>
      `;
    } else if (type === "cookie") {
      modalTitle = "Cookie 政策";
      modalContent = `
        <p>本政策将帮助您了解我们使用哪些Cookie和跟踪技术、我们如何使用它们以及您享有的相关权利。</p>
        <ul>
          <li>详情请阅读完整版<a href="/cookie_policy/" target="_blank" style="#2c7da0">《Cookie 政策》</a>。</li>
        </ul>
        <p>若您有任何疑问，可通过邮件联系我们。</p>
      `;
    } else if (type === "terms") {
      modalTitle = "服务条款";
      modalContent = `
        <p>本服务条款适用于您对本网站及其内容、服务的使用。请仔细阅读以下条款。</p>
        <ul>
          <li>详情请阅读完整版<a href="/terms/" target="_blank" style="#2c7da0">《服务条款》</a>。</li>
        </ul>
        <p>若您有任何疑问，可通过邮件联系我们。</p>
      `;
    }
    modalVisible = true;
  }

  function confirmRead() {
    if (modalType === "privacy") privacyPolicyRead = true;
    else if (modalType === "cookie") cookiePolicyRead = true;
    else if (modalType === "terms") termsPolicyRead = true;
    modalVisible = false;
  }

  function closeModal() {
    modalVisible = false;
  }

  function acceptAll() {
    const consent = {
      type: "all",
      preferences: { necessary: true, analytics: true, advertising: true },
      version: PRIVACY_VERSION,
      timestamp: Date.now(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    consentGiven = true;
    window.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: consent }),
    );
  }

  function acceptNecessaryOnly() {
    const consent = {
      type: "necessary",
      preferences: { necessary: true, analytics: false, advertising: false },
      version: PRIVACY_VERSION,
      timestamp: Date.now(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    consentGiven = true;
    window.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: consent }),
    );
  }

  // 键盘事件：按 ESC 关闭模态框
  function handleModalKeydown(event) {
    if (event.key === "Escape") closeModal();
  }

  // ===== 生命周期 =====
  let swupUnsubscribe = null;

  onMount(() => {
    checkRoute();
    if (window.swup) {
      const handler = () => checkRoute();
      window.swup.on("contentReplaced", handler);
      swupUnsubscribe = () => window.swup.off("contentReplaced", handler);
    }
  });

  onDestroy(() => {
    if (swupUnsubscribe) swupUnsubscribe();
  });
</script>

{#if !consentGiven}
  <div class="privacy-consent-overlay">
    <div class="consent-card">
      <div class="card-header">
        <div class="header-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9c0-.5-.04-1-.13-1.5C20.6 10 20 10 20 10h-2V9c0-1-1-1-1-1h-2V7c0-1-1-1-1-1h-1V4c0-1-1-1-1-1M9.5 6A1.5 1.5 0 0 1 11 7.5 1.5 1.5 0 0 1 9.5 9 1.5 1.5 0 0 1 8 7.5 1.5 1.5 0 0 1 9.5 6m-3 4A1.5 1.5 0 0 1 8 11.5 1.5 1.5 0 0 1 6.5 13 1.5 1.5 0 0 1 5 11.5 1.5 1.5 0 0 1 6.5 10m5 1a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5m5 2a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5M11 16a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 11 19a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 11 16"
            ></path>
          </svg>
        </div>
        <h3 class="card-title">我们重视您的隐私</h3>
      </div>

      <div class="card-body">
        <p class="description">
          继续使用本網站即表示你同意以下协议及隱私政策中所述的 Cookie 使用方式。
        </p>
        <div class="consent-options">
          <p class="description">
            点击「接受全部（协议及所有 Cookie）」即表示您同意我們使用所有
            Cookie，您也可以点击「接受协议和仅必要 Cookie」来同意我們使用必要的
            Cookie 类型。
          </p>

          <div class="checkbox-group {!canEnableCheckbox ? 'disabled' : ''}">
            <label class="checkbox-label">
              <input
                type="checkbox"
                bind:checked={agreeChecked}
                disabled={!canEnableCheckbox}
              />
              <span class="checkbox-text">
                我已阅读并同意
                <button
                  type="button"
                  class="link-btn"
                  on:click={() => openModal("privacy")}>《隐私政策》</button
                >
                、
                <button
                  type="button"
                  class="link-btn"
                  on:click={() => openModal("cookie")}>《Cookie 政策》</button
                >
                和
                <button
                  type="button"
                  class="link-btn"
                  on:click={() => openModal("terms")}>《服务条款》</button
                >
              </span>
            </label>
          </div>
          {#if !canEnableCheckbox}
            <div class="warning-message">
              您还需要阅读《隐私政策》、《Cookie
              政策》和《服务条款》后方可勾选该复选框
            </div>
          {/if}

          <div class="button-group">
            <button
              class="btn btn-primary"
              disabled={!agreeChecked}
              on:click={acceptAll}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path
                  d="M.41 13.41L6 19l1.41-1.42L1.83 12m20.41-6.42L11.66 16.17L7.5 12l-1.43 1.41L11.66 19l12-12M18 7l-1.41-1.42l-6.35 6.35l1.42 1.41z"
                ></path>
              </svg>
              接受全部（协议及所有 Cookie）
            </button>
            <button
              class="btn btn-secondary"
              disabled={!agreeChecked}
              on:click={acceptNecessaryOnly}
            >
              接受协议和仅必要 Cookie
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框（修复 @html 位置，并添加 ARIA 角色消除 a11y 警告） -->
    {#if modalVisible}
      <div
        class="modal-overlay"
        role="button"
        tabindex="0"
        on:click={closeModal}
        on:keydown={handleModalKeydown}
      >
        <div class="modal-card" role="presentation" on:click|stopPropagation>
          <div class="modal-header">
            <h4>{modalTitle}</h4>
            <button class="modal-close" on:click={closeModal}>✕</button>
          </div>
          <div class="modal-body">
            {@html modalContent}
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" on:click={confirmRead}
              >我已阅读并理解</button
            >
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  /* ===== 全部样式，与原来一致，但使用通用 CSS 变量 ===== */
  .privacy-consent-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 201312140;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
  }

  .consent-card {
    height: 40%;
    max-width: 700px;
    width: 100%;
    background-color: var(--color-bg, #fff);
    border-radius: 1.5rem;
    box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-border, #e9ecef);
    background-color: var(--color-bg, #fff);
  }

  .header-icon {
    display: flex;
    align-items: center;
    color: var(--color-text, #3c3c43);
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
    color: var(--color-text, #3c3c43);
  }

  .card-body {
    padding: 1.25rem 1.5rem 1.5rem;
  }

  .description {
    font-size: 0.875rem;
    color: var(--color-text, #3c3c43);
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  .checkbox-group {
    background-color: var(--color-bg-soft, #f8f9fa);
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--color-border, #e9ecef);
  }

  .checkbox-group.disabled {
    opacity: 0.7;
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    cursor: pointer;
  }

  .checkbox-label input {
    margin-top: 0.125rem;
    width: 1rem;
    height: 1rem;
  }

  .checkbox-text {
    font-size: 0.8rem;
    color: var(--color-text, #3c3c43);
    line-height: 1.4;
  }

  .link-btn {
    background: none;
    border: none;
    color: #2c7da0;
    text-decoration: underline;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0;
    font-weight: 500;
  }

  .link-btn:hover {
    color: #1f5068;
  }

  .warning-message {
    font-size: 0.7rem;
    color: #e53e3e;
    margin-top: 0.5rem;
    padding-left: 1.5rem;
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 2rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
    background: none;
  }

  .btn-primary {
    background-color: #2c7da0;
    color: white;
  }
  .btn-primary:hover:not(:disabled) {
    background-color: #1f5e7a;
    transform: translateY(-1px);
  }

  .btn-secondary {
    background-color: #e9ecef;
    color: #2d3748;
    border-color: #ced4da;
  }
  .btn-secondary:hover:not(:disabled) {
    background-color: #dee2e6;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 模态框样式（背景已改为 role="button"，需重置按钮样式） */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 201312143;
    padding: 1rem;
    border: none;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  /* 为了保持背景按钮的语义，重置 button 默认样式 */
  .modal-overlay {
    background: rgba(0, 0, 0, 0.6); /* 覆盖按钮背景 */
  }

  .modal-card {
    background: var(--color-bg, #fff);
    border-radius: 1rem;
    max-width: 550px;
    width: 100%;
    color: var(--color-text, #3c3c43);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    cursor: default;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .modal-header h4 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #718096;
  }

  .modal-body {
    padding: 1.25rem;
    overflow-y: auto;
    flex: 1;
  }

  .modal-footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  @media (max-width: 640px) {
    .consent-card {
      height: 80%;
      margin-bottom: 0;
      border-radius: 1rem 1rem 0 0;
    }
    .privacy-consent-overlay {
      align-items: flex-end;
      padding: 0;
    }
    .button-group {
      flex-direction: column;
    }
    .btn {
      width: 100%;
    }
  }
</style>

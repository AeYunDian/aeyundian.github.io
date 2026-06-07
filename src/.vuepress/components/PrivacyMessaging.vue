<template>
    <ClientOnly>
        <div v-if="!consentGiven" class="privacy-consent-overlay">
            <div class="consent-card">
                <!-- 头部 -->
                <div class="card-header">
                    <div class="header-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
                            fill="currentColor">
                            <path
                                d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9c0-.5-.04-1-.13-1.5C20.6 10 20 10 20 10h-2V9c0-1-1-1-1-1h-2V7c0-1-1-1-1-1h-1V4c0-1-1-1-1-1M9.5 6A1.5 1.5 0 0 1 11 7.5 1.5 1.5 0 0 1 9.5 9 1.5 1.5 0 0 1 8 7.5 1.5 1.5 0 0 1 9.5 6m-3 4A1.5 1.5 0 0 1 8 11.5 1.5 1.5 0 0 1 6.5 13 1.5 1.5 0 0 1 5 11.5 1.5 1.5 0 0 1 6.5 10m5 1a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5m5 2a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5M11 16a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 11 19a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 11 16">
                            </path>
                        </svg>
                    </div>
                    <h3 class="card-title">隐私与协议</h3>
                </div>

                <div class="card-body">
                    <p class="description">继续使用本網站即表示你同意以下协议及隱私政策中所述的 Cookie 使用方式。</p>

                    <div class="consent-options">
                        <p class="description">点击「接受全部」即表示您同意我們使用所有 Cookie，您也可以点击「僅必要 Cookie」来同意我們使用必要的 Cookie 类型。</p>

                        <!-- 同意复选框区域 -->
                        <div class="checkbox-group" :class="{ 'disabled': !canEnableCheckbox }">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="agreeChecked" :disabled="!canEnableCheckbox">
                                <span class="checkbox-text">
                                    我已阅读并同意
                                    <button type="button" class="link-btn"
                                        @click="openAgreementModal('privacy')">《隐私政策》</button>
                                </span>
                            </label>
                        </div>
                        <div v-if="!canEnableCheckbox" class="warning-message">
                            您还需要阅读《隐私政策》后方可勾选该复选框
                        </div>

                        <!-- 操作按钮组 -->
                        <div class="button-group">
                            <button class="btn btn-primary" :disabled="!agreeChecked" @click="acceptAll">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                    fill="currentColor">
                                    <path
                                        d="M.41 13.41L6 19l1.41-1.42L1.83 12m20.41-6.42L11.66 16.17L7.5 12l-1.43 1.41L11.66 19l12-12M18 7l-1.41-1.42l-6.35 6.35l1.42 1.41z">
                                    </path>
                                </svg>
                                接受全部
                            </button>
                            <button class="btn btn-secondary" :disabled="!agreeChecked" @click="acceptNecessaryOnly">
                                仅必要 Cookie
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 协议内容模态框（用户协议/隐私政策） -->
            <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
                <div class="modal-card">
                    <div class="modal-header">
                        <h4>{{ modalTitle }}</h4>
                        <button class="modal-close" @click="closeModal">✕</button>
                    </div>
                    <div class="modal-body" v-html="modalContent"></div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="confirmRead">我已阅读并理解</button>
                    </div>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>

<script>
export default {
    name: 'PrivacyConsentBanner',
    data() {
        return {
            PrivacyVersion: 1,              // 版本号，便于未来更新时管理
            consentGiven: false,          // 是否已给出同意
            agreeChecked: false,          // 同意复选框是否勾选
            privacyPolicyRead: true,     // 是否已阅读隐私政策（默认已阅读）
            modalVisible: false,          // 协议弹窗显示状态
            modalType: '',                // 'privacy'
            modalTitle: '',
            modalContent: '',
        };
    },
    computed: {
        // 复选框是否可启用（协议已阅读过）
        canEnableCheckbox() {
            return this.privacyPolicyRead;
        }
    },
    mounted() {
        // 检查是否已存储过同意记录
        const storedConsent = localStorage.getItem('cookieConsent');
        if (storedConsent && JSON.parse(storedConsent).version === this.PrivacyVersion) {
            this.consentGiven = true;
        }
        const url = new URL(window.location.href);
        const doNotDisplay = url.searchParams.get('doNotDisplayPrivacy') === 'true';
        if (doNotDisplay) {
            this.consentGiven = true; // 直接标记为已同意，暂时跳过弹窗
        }
        // 此处不做自动弹出前的其他操作
    },
    methods: {
        // 打开协议模态框
        openAgreementModal(type) {
            this.modalType = type;
            if (type === 'privacy') {
                this.modalTitle = '隐私政策';
                this.modalContent = `
          <p>我们高度重视您的隐私。本政策说明我们如何收集、使用和保护您的信息。</p>
          <ul>
            <li>详情请阅读完整版<a href="/privacy_policy/zh-cn.html?doNotDisplayPrivacy=true" target="_blank">《隐私政策》</a>。</li>
          </ul>
          <p>若您有任何疑问，可通过邮件联系我们。</p>
        `;
            }
            this.modalVisible = true;
        },
        // 关闭协议模态框并标记已读
        confirmRead() {
            if (this.modalType === 'privacy') {
                this.privacyPolicyRead = true;
            }
            this.modalVisible = false;
        },
        closeModal() {
            this.modalVisible = false;
        },
        // 接受全部
        acceptAll() {
            const consentData = {
                type: 'all',
                preferences: { necessary: true, analytics: true, advertising: true },
                version: this.PrivacyVersion,
                timestamp: Date.now()
            };
            localStorage.setItem('cookieConsent', JSON.stringify(consentData));
            this.consentGiven = true;
            // 可以在此处执行实际启用所有cookie的代码
        },
        // 仅必要 Cookie
        acceptNecessaryOnly() {
            const consentData = {
                type: 'necessary',
                preferences: { necessary: true, analytics: false, advertising: false },
                version: this.PrivacyVersion,
                timestamp: Date.now()
            };
            localStorage.setItem('cookieConsent', JSON.stringify(consentData));
            this.consentGiven = true;
        },
    }
};
</script>

<style scoped>
/* 遮罩层 */
.privacy-consent-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 201312141; /* 小巧思，可能和身份z和**日期有关 */
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
}

/* 主卡片 */
.consent-card {
    max-width: 700px;
    width: 100%;
    background-color: #fff;
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

/* 头部 */
.card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e9ecef;
    background-color: #fafbfc;
}

.header-icon {
    display: flex;
    align-items: center;
    color: #1b1b1b;
}

.card-title {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
    color: #1e2a3e;
}

/* 主体 */
.card-body {
    padding: 1.25rem 1.5rem 1.5rem;
}

.consent-options {
    margin-top: 0.5rem;
}

.description {
    font-size: 0.875rem;
    color: #4a5568;
    margin-bottom: 1.25rem;
    line-height: 1.5;
}

.checkbox-group {
    background-color: #f8f9fa;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
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
    color: #2d3748;
    line-height: 1.4;
}

.link-btn {
    background: none;
    border: none;
    color: var(--vp-c-accent, #2c7da0);
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

.disabled {
    opacity: 0.7;
}

/* 按钮组 */
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
    background-color: var(--vp-c-accent, #2c7da0);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: var(--vp-c-accent-hover, #1f5e7a);
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

.btn-outline {
    background-color: white;
    border-color: #cbd5e0;
    color: #2d3748;
}

.btn-outline:hover:not(:disabled) {
    background-color: #f1f5f9;
    border-color: #94a3b8;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 模态框通用样式 */
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 201312143;
    padding: 1rem;
}

.modal-card {
    background: white;
    border-radius: 1rem;
    max-width: 550px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
<template>
    <ClientOnly>
        <div v-if="!consentGiven" class="risk-detector-overlay">
            <div class="consent-card">
                <!-- 头部 -->
                <div class="card-header">
                    <h3 class="card-title">您此次游览存在风险</h3>
                </div>

                <div class="card-body">
                    <p class="description">{{ description }}</p>

                    <div class="consent-options">


                        <div class="alicom4">
                            <button class="btn btn-risk" :disabled="!isCanVerification" id="start-verification">
                                点击开始校验
                            </button>
                        </div>

                        <!-- 操作按钮组 -->
                        <div class="button-group">
                            <button class="btn btn-risk" :disabled="!agreeChecked" @click="continueAll()">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                    fill="currentColor">
                                    <path
                                        d="M.41 13.41L6 19l1.41-1.42L1.83 12m20.41-6.42L11.66 16.17L7.5 12l-1.43 1.41L11.66 19l12-12M18 7l-1.41-1.42l-6.35 6.35l1.42 1.41z">
                                    </path>
                                </svg>
                                继续游览
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </ClientOnly>
</template>

<!-- <script>
export default {
    name: 'RiskDetector',
    data() {
        return {
            consentGiven: true,
            agreeChecked: false,
            isCanVerification: false,
            numberOfVerification: 0,
            description: '检测到您的环境异常，请您通过以下检测',
        };
    },
    // computed: {
    //     // 复选框是否可启用（协议已阅读过）
    //     canEnableCheckbox() {
    //         return this.privacyPolicyRead;
    //     }
    // },
    async mounted() {
        await this.loadAlicomScript();
        const self = this;
        const scanMixedContent = () => {
            const mixed = []
            // 获取所有可能引用外部资源的标签
            const elements = [
                ...document.querySelectorAll('link[rel="stylesheet"]'),
                ...document.querySelectorAll('script[src]'),
                ...document.querySelectorAll('img[src]'),
                ...document.querySelectorAll('iframe[src]'),
                ...document.querySelectorAll('video[src]'),
                ...document.querySelectorAll('audio[src]')
            ]
            elements.forEach(el => {
                let url = el.getAttribute('src') || el.getAttribute('href')
                if (url && url.startsWith('http:')) {
                    // 只取简短描述
                    const shortUrl = url.length > 40 ? url.slice(0, 40) + '…' : url
                    if (!mixed.includes(shortUrl)) mixed.push(shortUrl)
                }
            })
            return mixed
        }
        initAlicom4({
            captchaId: "420680785844799d0a512a27082dd6ad",
            product: "bind",
        },
            function (captchaObj) {
                captchaObj
                    .onNextReady(() => {
                        self.isCanVerification = true;
                    })
                    .onSuccess(() => {
                        self.isCanVerification = false;
                        self.numberOfVerification += 1;
                        self.agreeChecked = true;
                        self.description = '验证成功，请继续游览';
                        setTimeout(() => {
                            self.continueAll();
                        }, 1000);
                        captchaObj.reset();
                    })
                    .onError(() => {
                        self.isCanVerification = true;
                        self.numberOfVerification += 1;
                        if (self.numberOfVerification >= 3) {
                            self.description = '验证失败次数过多，请稍后再试';
                            self.isCanVerification = false;
                            return;
                        } else { self.description = '验证失败，请重试'; }
                    });
                // 按钮提交事件
                document.getElementById('start-verification').addEventListener('click', function () {
                    captchaObj.showCaptcha();
                });
            }
        );
        let isRisky = false;
        // 检查是否已存储过同意记录
        // const storedConsent = localStorage.getItem('RiskDetectorConsent');
        // if (storedConsent && (JSON.parse(storedConsent).timestamp + 86400 < Math.floor(Date.now() / 1000))) {
        //     isRisky = true;
        // } 这没有问题

        // 检测是否是本地开发环境（localhost / 127.0.0.1）—— 仅提示，不算风险
        const isLocalhost = ['localhost', '127.0.0.1', '::1'].some(host => window.location.hostname.includes(host))
        if (isLocalhost) {
            // 这里我们不算风险，但可以选择显示一个提示，告知用户这是本地环境
            console.warn('您正在本地环境中访问，某些功能可能无法正常工作。');
        }

        // 检测 HTTPS
        const isHttps = window.location.protocol === 'https:'
        if (!isHttps && !isLocalhost) {
            isRisky = true;
        }

        // 检测是否在 iframe 中（点击劫持风险）
        const isInIframe = window.self !== window.top
        if (isInIframe) {
            isRisky = true;
        }

        // 混合内容检测（扫描页面中所有 http:// 的外部资源）
        const mixedResources = scanMixedContent()
        if (mixedResources.length > 0) {
            isRisky = true;
        }



        const isAnOfficialDomain = ['undz.cn', 'io.hb.cn', 'ayd2.eu.cc',
            'main.exm2.eu.cc', 'main.net3.eu.cc', 'main.net2.eu.cc',
            'main.zyy2.eu.cc', 'undz.cn', 'io.hb.cn'
        ].some(domain => window.location.hostname.endsWith(domain));
        if (!isAnOfficialDomain && !isLocalhost) {
            isRisky = true;
        }

        if (isRisky) {
            this.consentGiven = false;

        } else {
            this.consentGiven = true;
            return;
        }

    },
    methods: {
        loadAlicomScript() {
            return new Promise((resolve, reject) => {
                // 如果已经存在且 initAlicom4 已定义，直接 resolve
                if (window.initAlicom4) {
                    this.scriptLoaded = true;
                    resolve();
                    return;
                }

                // 检查是否已经添加过脚本标签（避免重复添加）
                if (document.querySelector('#alicaptcha-script')) {
                    // 已添加但未加载完，等待加载
                    const script = document.querySelector('#alicaptcha-script');
                    script.onload = () => {
                        this.scriptLoaded = true;
                        resolve();
                    };
                    script.onerror = () => reject(new Error('脚本加载失败'));
                    return;
                }

                // 创建新的 script 标签
                const script = document.createElement('script');
                script.id = 'alicaptcha-script';
                script.src = '/ct4.js';   // 你的脚本路径
                script.type = 'text/javascript';
                script.charset = 'utf-8';
                script.onload = () => {
                    if (window.initAlicom4) {
                        this.scriptLoaded = true;
                        resolve();
                    } else {
                        reject(new Error('脚本加载完成但 initAlicom4 未定义'));
                    }
                };
                script.onerror = () => reject(new Error('脚本加载失败'));
                document.head.appendChild(script);
            });
        },
        continueAll() {
            const consentData = {
                type: 'passed',
                timestamp: Math.floor(Date.now() / 1000)
            };
            localStorage.setItem('RiskDetectorConsent', JSON.stringify(consentData));
            this.consentGiven = true;
        },
    }
};
</script> -->
<script>
export default {
    name: 'RiskDetector',
    data() {
        return {
            consentGiven: true,  // 默认同意，只有检测到风险时才显示弹窗
            agreeChecked: false,
            isCanVerification: false,
            numberOfVerification: 0,
            description: '检测到您的环境异常，请您通过以下检测',
            scriptLoaded: false,   // 标记脚本是否加载完成
        };
    },
    async mounted() {
        // 1. 先加载阿里云验证码脚本
        await this.loadAlicomScript();

        // 2. 脚本加载完成后再做风险检测和初始化验证码
        this.checkRisksAndInit();
    },
    methods: {
        // 动态加载脚本，返回 Promise
        loadAlicomScript() {
            return new Promise((resolve, reject) => {
                // 如果已经存在且 initAlicom4 已定义，直接 resolve
                if (window.initAlicom4) {
                    this.scriptLoaded = true;
                    resolve();
                    return;
                }

                // 检查是否已经添加过脚本标签（避免重复添加）
                if (document.querySelector('#alicaptcha-script')) {
                    // 已添加但未加载完，等待加载
                    const script = document.querySelector('#alicaptcha-script');
                    script.onload = () => {
                        this.scriptLoaded = true;
                        resolve();
                    };
                    script.onerror = () => reject(new Error('脚本加载失败'));
                    return;
                }

                // 创建新的 script 标签
                const script = document.createElement('script');
                script.id = 'alicaptcha-script';
                script.src = '/ct4.js';   // 你的脚本路径
                script.type = 'text/javascript';
                script.charset = 'utf-8';
                script.onload = () => {
                    if (window.initAlicom4) {
                        this.scriptLoaded = true;
                        resolve();
                    } else {
                        reject(new Error('脚本加载完成但 initAlicom4 未定义'));
                    }
                };
                script.onerror = () => reject(new Error('脚本加载失败'));
                document.head.appendChild(script);
            });
        },

        // 风险检测 + 验证码初始化
        async checkRisksAndInit() {
            // 先执行你原有的风险检测逻辑
            const scanMixedContent = () => {
                const mixed = [];
                const elements = [
                    ...document.querySelectorAll('link[rel="stylesheet"]'),
                    ...document.querySelectorAll('script[src]'),
                    ...document.querySelectorAll('img[src]'),
                    ...document.querySelectorAll('iframe[src]'),
                    ...document.querySelectorAll('video[src]'),
                    ...document.querySelectorAll('audio[src]')
                ];
                elements.forEach(el => {
                    let url = el.getAttribute('src') || el.getAttribute('href');
                    if (url && url.startsWith('http:')) {
                        const shortUrl = url.length > 40 ? url.slice(0, 40) + '…' : url;
                        if (!mixed.includes(shortUrl)) mixed.push(shortUrl);
                    }
                });
                return mixed;
            };

            let isRisky = false;

            const isLocalhost = ['localhost', '127.0.0.1', '::1'].some(host => window.location.hostname.includes(host));
            if (isLocalhost) console.warn('本地开发环境'); isRisky = true;
            try {
                const res = await fetch('https://api.undz.cn/ip');
                const data = await res.json();
                if (data.code === 200 && data.country && data.country !== 'CN' && data.tlsVersion && data.tlsVersion !== 'TLSv1.3') isRisky = true;
            } catch (error) {
                console.error("风测接口调用失败:", error);
                isRisky = true; // 接口调用失败时，默认认为有风险
            }

            const isHttps = window.location.protocol === 'https:';
            if (!isHttps && !isLocalhost) isRisky = true; console.warn("!isHttps && !isLocalhost");

            const isInIframe = window.self !== window.top;
            if (isInIframe) isRisky = true; console.warn("isInIframe");

            const mixedResources = scanMixedContent();
            if (mixedResources.length > 0) isRisky = true; console.warn("mixedResources.length > 0)");
 
            const isAnOfficialDomain = ['undz.cn', 'io.hb.cn', 'ayd2.eu.cc',
                'main.exm2.eu.cc', 'main.net3.eu.cc', 'main.net2.eu.cc',
                'main.zyy2.eu.cc', 'www.undz.cn', 'www.io.hb.cn'
            ].some(domain => window.location.hostname === domain);
            if (!isAnOfficialDomain && !isLocalhost) isRisky = true; console.warn("!isAnOfficialDomain && !isLocalhost");

            if (isRisky) {
                // 有风险，显示弹窗并初始化验证码
                this.consentGiven = false;
                this.initCaptcha();
            }


        },

        // 初始化验证码
        initCaptcha() {
            const self = this;
            // 确保 initAlicom4 可用
            if (!window.initAlicom4) {
                console.error('initAlicom4 仍未定义，请检查脚本');
                return;
            }

            window.initAlicom4({
                captchaId: "420680785844799d0a512a27082dd6ad",
                //captchaId: "8848b0418f53cc0c2cc6853c6d20c6d3",
                product: "bind",
            }, function (captchaObj) {
                // 这里的回调函数中 this 指向 window，所以用 self
                captchaObj.onNextReady(() => {
                    self.isCanVerification = true;
                }).onSuccess(() => {

                    self.isCanVerification = false;
                    self.numberOfVerification += 1;
                    self.description = '验证成功，请继续游览';
                    self.agreeChecked = true;
                    setTimeout(() => {
                        self.continueAll();
                    }, 1000);
                    captchaObj.destroy(); // 销毁验证码实例，防止重复验证
                }).onFail(() => {
                    self.isCanVerification = true;
                    self.numberOfVerification += 1;
                    if (self.numberOfVerification >= 3) {
                        self.description = '验证失败次数过多，请稍后再试';
                        self.isCanVerification = false;
                        return;
                    } else {
                        self.description = '验证失败，请重试';
                    }
                }).onError(() => {
                    self.isCanVerification = false;
                    self.description = '验证发生错误，请尝试刷新页面';
                }).onClose(() => {
                    self.isCanVerification = true;
                    self.description = '验证已关闭，您可以重新尝试';
                    captchaObj.reset(); // 重置验证码状态，允许用户再次尝试
                });

                // 绑定按钮事件（避免重复绑定）
                const btn = document.getElementById('start-verification');
                if (btn && !btn._captchaBound) {
                    btn.addEventListener('click', () => {
                        captchaObj.showCaptcha();
                    });
                    btn._captchaBound = true;
                }
            });
        },

        continueAll() {
            const consentData = {
                type: 'passed',
                timestamp: Math.floor(Date.now() / 1000)
            };
            localStorage.setItem('RiskDetectorConsent', JSON.stringify(consentData));
            this.consentGiven = true;
        },

    }
};
</script>
<style scoped>
/* 遮罩层 */
.risk-detector-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 65535;
    /* 小巧思，可能和身份z和**日期有关 */
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
    background-color: var(--vp-c-bg, #fff);
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
    background-color: var(--vp-c-bg, #fff);
}

.header-icon {
    display: flex;
    align-items: center;
    color: var(--vp-c-text, rgb(60, 60, 67));
}

.card-title {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
    color: var(--vp-c-text, rgb(60, 60, 67));
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
    color: var(--vp-c-text, rgb(60, 60, 67));
    margin-bottom: 1.25rem;
    line-height: 1.5;
}

.checkbox-group {
    background-color: var(--vp-c-bg-elv-soft);
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--vp-c-bg-elv);
}

.alicom4 {
    background-color: var(--vp-c-bg);
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
    color: var(--vp-c-text, rgb(60, 60, 67));
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

.btn-risk {
    background-color: var(--vp-c-accent, #2c7da0);
    color: white;
}

.btn-risk:hover:not(:disabled) {
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

@media (max-width: 640px) {
    .consent-card {
        margin-bottom: 0;
        border-radius: 1rem 1rem 0 0;
    }

    .risk-detector-overlay {
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
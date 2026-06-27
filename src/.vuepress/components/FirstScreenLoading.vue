<template>
    <ClientOnly>
        <div v-if="enable">
            <div v-if="shouldLoading" id="app-loading">
                <div class="loading-wrapper">
                    <svg class="circular" viewBox="0 0 20 20">
                        <g class="loading-path" stroke-width="0" style="animation: none; stroke: none">
                            <circle r="3.375" class="dot1" cx="0" cy="0" />
                            <circle r="3.375" class="dot2" cx="0" cy="0" />
                            <circle r="3.375" class="dot4" cx="0" cy="0" />
                            <circle r="3.375" class="dot3" cx="0" cy="0" />
                        </g>
                    </svg>
                </div>
                <div class="loading-text">加载中...</div>
            </div>
        </div>
    </ClientOnly>
</template>

<script>
export default {
    name: 'FirstScreenLoading',
    data() {
        return {
            enable: false,
            shouldLoading: true,
            timer: null,
            startTime: null,
        };
    },
    created() {
        this.startTime = Date.now();
    },
    mounted() {
        const art = `
      __      __          .----------------.  .----------------.  .----------------. 
      \\ \\    / /         | .--------------. || .--------------. || .--------------. |
  _____\\ \\  / /_____     | |      __      | || |  ____  ____  | || |  ________    | |
 |______\\ \\/ /______|    | |     /  \\     | || | |_  _||_  _| | || | |_   ___ \`.  | |
         \\  /            | |    / /\\ \\    | || |   \\ \\  / /   | || |   | |   \`. \\ | |
          \\/             | |   / ____ \\   | || |    \\ \\/ /    | || |   | |    | | | |
                         | | _/ /    \\ \\_ | || |    _|  |_    | || |  _| |___.' / | |
                         | ||____|  |____|| || |   |______|   | || | |________.'  | |
                         | |              | || |              | || |              | |
                         | '--------------' || '--------------' || '--------------' |
                          '----------------'  '----------------'  '----------------' 
                                                       Powered by vuepress@2.0.0-rc.26
                                                                 Powered by Cloudflare
                                                            Copyright © 2026 AeYunDian
`;
        console.info(`%c${art}`, 'color: #4C9FFF;');
        console.info("%c vuepress %c v2.0.0-rc.26 ", 
        "padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #FF6699; font-weight: bold;", 
        "padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #FF9999; font-weight: bold;")
        console.info(
        '%c 欢迎来到 undz.cn  🚀',
        'color: #ffb74d; font-size: 14px; font-weight: bold; background: #ffc;'
        );
        if (this.enable === true) {
            const MIN_DISPLAY = 0.8; // 最小显示秒数
            const elapsed = (Date.now() - this.startTime) / 1000; // 已过秒数
            const delay = Math.max(0, MIN_DISPLAY - elapsed) * 1000; // 转为毫秒

            this.timer = setTimeout(() => {
                const loading = document.getElementById('app-loading');
                if (loading) {
                    loading.classList.add('hide');
                    setTimeout(() => {
                        if (loading.parentNode) loading.remove();
                    }, 600);
                }
            }, delay);
        }

    },
    beforeDestroy() {

        if (this.enable === true) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            // 确保移除元素（如果动画未完成）
            const loading = document.getElementById('app-loading');
            if (loading && loading.parentNode) {
                loading.remove();
            }
        }
    },
};
</script>

<style scoped>
#app-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    z-index: 210000000;
    transition: opacity 0.6s ease;
    pointer-events: all;
}

#app-loading.hide {
    opacity: 0;
    pointer-events: none;
}

/* ===== 加载器 ===== */
.loading-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
}

.circular {
    display: inline;
    height: 30px;
    width: 30px;
    animation: loading-rotate 1.3s linear infinite;
}

.loading-path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #409eff;
    stroke-linecap: round;
}

.loading-path .dot1 {
    transform: translate(3.75px, 3.75px);
    fill: #409eff;
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
}

.loading-path .dot2 {
    transform: translate(calc(100% - 3.75px), 3.75px);
    fill: #409eff;
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 0.4s;
}

.loading-path .dot3 {
    transform: translate(3.75px, calc(100% - 3.75px));
    fill: #409eff;
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 1.2s;
}

.loading-path .dot4 {
    transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
    fill: #409eff;
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 0.8s;
}

/* ===== 关键帧动画 ===== */
@keyframes loading-rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes dot-fade {
    to {
        opacity: 1;
    }
}

@keyframes loading-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
    }

    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
    }
}

@keyframes custom-spin-move {
    to {
        opacity: 1;
    }
}

.loading-text {
    margin-top: 16px;
    font-size: 14px;
    color: #909399;
    letter-spacing: 0.5px;
}
</style>
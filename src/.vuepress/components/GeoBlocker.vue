<template>
    <ClientOnly>
        <div v-if="shouldBlock" class="geo-blocker">
            <div class="geo-blocker-content">
                <h1>403</h1>
                <hr>
                <p>Access Restricted, Region unavailable</p>
            </div>
        </div>
    </ClientOnly>
</template>

<script>
export default {
    name: 'GeoBlocker',
    data() {
        return {
            shouldBlock: false,
        };
    },
    async mounted() {
        
        try {
            // 使用高德 API 获取 IP 归属地
            const res = await fetch('https://restapi.amap.com/v3/ip?key=9584879dc3893767f7f5adbc86afd516&output=JSON');
            const data = await res.json();
            if (data.status === '1' && data.adcode && data.adcode.startsWith('7100')) {
                this.shouldBlock = true;
                document.body.style.overflow = 'hidden';
                this.blockKeyboardAndCopy();
            }
        } catch (err) {
            console.warn('Unable to check the location', err);
        }
    },
    methods: {
        blockKeyboardAndCopy() {
            // 阻止键盘全选和复制
            const onKeydown = (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            window.addEventListener('keydown', onKeydown);
            // 存储以便清理
            this._cleanupSelectAll = () => {
                window.removeEventListener('keydown', onKeydown);
            };
        },
    },
    beforeDestroy() {
        // 组件销毁时恢复滚动
        if (this.shouldBlock) {
            document.body.style.overflow = '';
            if (this._cleanup) this._cleanup();
        }
    },
};
</script>

<style scoped>
.geo-blocker {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f3f4f6;
    z-index: 999999;
    display: flex;
    align-items: center;
    pointer-events: auto;
    justify-content: center;
    font-family: sans-serif;
    flex-direction: column;
    text-align: center;
    user-select: auto;
    -webkit-user-select: auto;
}

.geo-blocker-content h1 {
    font-size: 4.6rem;
    margin: 0;
}

.geo-blocker-content hr {
    width: 75%;
    border: 1px solid #ccc;
    margin: 1rem auto;
}

.geo-blocker-content p {
    font-size: 1.3rem;
}
</style>
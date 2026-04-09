window.debugMode = window.debugMode;
(function() {
    function initBanner() {
        const STORAGE_KEY = 'domainSaleBannerClosed';
        if (localStorage.getItem(STORAGE_KEY) === 'true') return;

        // 创建横幅容器
        const banner = document.createElement('div');
        banner.id = 'domain-sale-banner';
        banner.style.cssText = `
            width: 100%;
            height: 30px;
            line-height: 30px;
            background: #fff0e3;
            font-size: 13px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #e58900;
            box-sizing: border-box;
            overflow: hidden;
            padding: 0 10px 0 0;
        `;

        // 滚动文字容器
        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = `
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            height: 100%;
        `;

        // 滚动文本元素
        const textSpan = document.createElement('span');
        textSpan.innerHTML = 'This domain name is for sale, click to see details! ';
        textSpan.style.cssText = `
            display: inline-block;
            white-space: nowrap;
            position: relative;
            animation: fade-blink 2s ease-in-out infinite;
        `;
        scrollContainer.appendChild(textSpan);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            background: rgba(0,0,0,0);
            border: none;
            font-size: 16px;
            color: #e58900;
            cursor: pointer;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
            flex-shrink: 0;
        `;
        closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(0,0,0,0.2)'; closeBtn.style.color = '#b06d00'; };
        closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(0,0,0,0)'; closeBtn.style.color = '#e58900'; };

        banner.appendChild(scrollContainer);
        banner.appendChild(closeBtn);

        // 添加淡入淡出关键帧
        if (!document.querySelector('#dynamic-styles')) {
            const style = document.createElement('style');
            style.id = 'dynamic-styles';
            style.textContent = `
                @keyframes fade-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.55; }
                }
            `;
            document.head.appendChild(style);
        }

        // 滚动动画控制
        let startTime = null;
        const duration = 15000;
        let containerWidth = scrollContainer.clientWidth;
        let textWidth = textSpan.clientWidth;
        let animationId = null;

        function updateDimensions() {
            containerWidth = scrollContainer.clientWidth;
            textWidth = textSpan.clientWidth;
        }

        function animateScroll(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % duration) / duration;
            const translateX = containerWidth - (progress * (containerWidth + textWidth));
            textSpan.style.transform = `translateX(${translateX}px)`;
            animationId = requestAnimationFrame(animateScroll);
        }

        window.addEventListener('resize', () => {
            updateDimensions();
            startTime = null;
        });

        function startAnimation() {
            updateDimensions();
            startTime = null;
            animationId = requestAnimationFrame(animateScroll);
        }

        function insertBanner() {
            const hero = document.querySelector('.vp-blog-hero');
            if (hero && hero.parentNode) {
                hero.parentNode.insertBefore(banner, hero.nextSibling);
                setTimeout(startAnimation, 100);
                return true;
            }
            return false;
        }

        if (!insertBanner()) {
            const observer = new MutationObserver(() => {
                if (insertBanner()) observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                if (!document.body.contains(banner)) {
                    //document.body.insertBefore(banner, document.body.firstChild);
                    //startAnimation();
                }
            }, 5000);
        }

        const removalObserver = new MutationObserver(() => {
            if (!document.body.contains(banner)) {
                if (animationId) cancelAnimationFrame(animationId);
                removalObserver.disconnect();
            }
        });
        removalObserver.observe(document.body, { childList: true, subtree: true });

        // 按钮则移除横幅，否则跳转
        banner.addEventListener('click', (e) => {
            e.stopPropagation();
            if (closeBtn === e.target || closeBtn.contains(e.target)) {
                banner.remove();
                if (animationId) cancelAnimationFrame(animationId);
                // localStorage.setItem(STORAGE_KEY, 'true');
            } else {
                window.location.href = "/sale_the_domain_name.html";
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBanner);
    } else {
        initBanner();
    }
})();
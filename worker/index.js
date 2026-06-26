const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|phone|webos|kindle|tablet/i;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const userAgent = request.headers.get('User-Agent') || '';
        const platform = request.headers.get('sec-ch-ua-platform') || '';
        const hostname = url.hostname;
        const cookie = request.headers.get('Cookie') || '';
        const isWechat = !!userAgent.match(/MicroMessenger/i);
        const clientIP = request.headers.get('CF-Connecting-IP');
        const isMobile = mobileRegex.test(userAgent) || false;

        if (url.protocol === 'http:' && !request.headers.get('User-Agent')?.includes('MSIE')) {
            const newUrl = new URL(request.url);
            newUrl.protocol = 'https:';
            // 如果原端口是 80，则移除（使用 HTTPS 默认 443）
            if (newUrl.port === '80') {
                newUrl.port = '';
            }
            return new Response(null, {
                status: 301,
                headers: { 'Location': newUrl.toString() }
            });
        }

        if (decodeURI(path) === '/我们毕业啦.html' || decodeURI(path) === '/我们毕业啦') {
            if (isMobile) {
                return new Response(null, {
                    status: 301,
                    headers: { 'Location': 'https://net.undz.cn/static/mp4/9e7e0f7e8a3f752c47bf759d7f1f606f.mp4' }
                });
            } else {
                return new Response(null, {
                    status: 301,
                    headers: { 'Location': 'https://www.bilibili.com/video/BV1GJ411x7h7/' }
                });
            }

        }

        if (path.startsWith("/api/")) {
            return new Response(JSON.stringify({ name: "Cloudflare" }), {
                headers: { "Content-Type": "application/json" },
            });
        } // 预留测试

        return env.ASSETS.fetch(request);
    },
};
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

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

        if (url.pathname.startsWith("/api/")) {
            return new Response(JSON.stringify({ name: "Cloudflare" }), {
                headers: { "Content-Type": "application/json" },
            });
        } // 预留测试

        return env.ASSETS.fetch(request);
    },
};
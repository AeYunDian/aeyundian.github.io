const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|phone|webos|kindle|tablet/i;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        let path;
        try {
            path = decodeURIComponent(url.pathname);
        } catch {
            path = url.pathname; // 解码失败时直接使用原路径
        }
        const userAgent = request.headers.get('User-Agent') || '';
        const platform = request.headers.get('sec-ch-ua-platform') || '';
        const hostname = url.hostname;
        const cookie = request.headers.get('Cookie') || '';
        const isWechat = !!userAgent.match(/MicroMessenger/i);
        const clientIP = request.headers.get('CF-Connecting-IP');
        const isMobile = mobileRegex.test(userAgent) || false;

        if (url.protocol === 'http:' && (!userAgent.includes('MSIE') || !userAgent.includes('Trident'))) {
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

        if (path.startsWith('/我们毕业啦')) {
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
            return new Response(JSON.stringify({ code: 200, name: "Cloudflare edge server", userAgent, platform, isWechat, clientIP, isMobile }), {
                headers: { "Content-Type": "application/json" },
            });
        } // 预留测试

        if (path.endsWith('.br') || path.endsWith('.gz')) {
            return env.ASSETS.fetch(request);
        }

        const acceptEncoding = request.headers.get('Accept-Encoding') || '';
        const supportsBr = acceptEncoding.includes('br');
        const supportsGzip = acceptEncoding.includes('gzip');

        // 尝试返回 .br 版本
        if (supportsBr) {
            const brUrl = new URL(request.url);
            brUrl.pathname = path + '.br';
            const brRequest = new Request(brUrl.toString(), request);
            const brResponse = await env.ASSETS.fetch(brRequest);

            if (brResponse.status === 200) {
                // 构造新响应，保留原响应体，修改头部
                const newHeaders = new Headers(brResponse.headers);
                newHeaders.set('Content-Encoding', 'br');
                newHeaders.delete('Content-Length');   // 压缩后长度改变，必须删除
                newHeaders.set('Vary', 'Accept-Encoding');

                return new Response(brResponse.body, {
                    status: brResponse.status,
                    statusText: brResponse.statusText,
                    headers: newHeaders,
                });
            }
        }

        // 如果 .br 不存在（或客户端不支持 br），尝试 .gz
        if (supportsGzip) {
            const gzUrl = new URL(request.url);
            gzUrl.pathname = path + '.gz';
            const gzRequest = new Request(gzUrl.toString(), request);
            const gzResponse = await env.ASSETS.fetch(gzRequest);

            if (gzResponse.status === 200) {
                const newHeaders = new Headers(gzResponse.headers);
                newHeaders.set('Content-Encoding', 'gzip');
                newHeaders.delete('Content-Length');
                newHeaders.set('Vary', 'Accept-Encoding');

                return new Response(gzResponse.body, {
                    status: gzResponse.status,
                    statusText: gzResponse.statusText,
                    headers: newHeaders,
                });
            }
        }

        // 4. 默认返回原文件（无压缩）
        return env.ASSETS.fetch(request);
    },
};
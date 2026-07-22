const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|phone|webos|kindle|tablet/i;

function arrayBufferToBase64Url(buf) {
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToArrayBuffer(str) {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4 ? '='.repeat(4 - base64.length % 4) : '';
    const binary = atob(base64 + padding);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
}
async function deriveKey(ip) {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(digest)
}
async function encryptData(data, keyBytes) {
    // GCM 推荐使用 12 字节的 Nonce（IV），比 CBC 的 16 字节更高效
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );
    const encoder = new TextEncoder();
    const plaintext = encoder.encode(JSON.stringify(data));

    // 加密后返回的 ArrayBuffer 实际上包含“密文+认证标签”（标签自动附加在末尾）
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        plaintext
    );

    const ivBase64 = arrayBufferToBase64Url(iv);
    const cipherBase64 = arrayBufferToBase64Url(ciphertext);
    return ivBase64 + '.' + cipherBase64;
}
async function decryptData(token, keyBytes) {
    const parts = token.split('.');
    if (parts.length !== 2) throw new Error('Invalid token format');

    const iv = base64UrlToArrayBuffer(parts[0]);
    // 这里读取的是“密文+标签”的合并数据，无需手动拆分
    const ciphertext = base64UrlToArrayBuffer(parts[1]);

    const key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    // 若认证失败（数据被篡改或密钥错误），此处会抛出异常
    const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        ciphertext
    );

    const decoder = new TextDecoder();
    const json = decoder.decode(plaintext);
    return JSON.parse(json);
}
async function validateRequest(request, url) {
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || '';
    const protocol = url.protocol;
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc, c) => {
        const [name, value] = c.trim().split('=');
        if (name) acc[name] = value;
        return acc
    }, {});
    const token = cookies['ayFirewall'];
    if (!token) return {
        valid: false,
        reason: 'no_cookie'
    };
    try {
        const keyBytes = await deriveKey(clientIP);
        const data = await decryptData(token, keyBytes);
        if (data.ua !== userAgent) return {
            valid: false,
            reason: 'ua_mismatch'
        };
        if (data.protocol !== protocol) return {
            valid: false,
            reason: 'protocol_mismatch'
        };
        const now = Date.now();
        const diff = now - data.timestamp;
        if (diff > 5 * 60 * 1000) return {
            valid: false,
            reason: 'expired'
        };
        if (diff < 0) return {
            valid: false,
            reason: 'future'
        };
        return {
            valid: true,
            data
        }
    } catch (e) {
        return {
            valid: false,
            reason: 'decrypt_fail'
        }
    }
}

function generateChallengePage(token) {
    return `<!DOCTYPE html>
    <html lang="zh-CN">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport"content="width=device-width, initial-scale=1.0">
    <style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}</style>
    <title>AyWAF</title><style>html{text-align:center}</style>
    </head>
    <body
    ><h3>Ay Web Application Firewall</h3>
    <p>正在进行安全校验，请稍后...</p>
    <hr><p>此网站使用Ay Web Application Firewall保护站点安全。</p>
    <p>WAF</p>
    <script>document.cookie="ayFirewall=${token}; path=/; max-age=300; SameSite=Lax; Secure";location.reload();</script></body></html>`
}

function shouldValidate(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const ua = request.headers.get('User-Agent') || '';    // 放行主流搜索引擎爬虫
    const botRegex = /Googlebot|Baiduspider|bingbot|Sogou|360Spider|YandexBot|facebookexternalhit|Twitterbot/i;
    if (botRegex.test(ua)) return false;
    if (request.method === 'OPTIONS') return false;
    if (path.startsWith('/api/')) return false;
    if (path.startsWith('/.well-known/')) return false;
    const skipExact = [
        '/_redirects',

        // 根目录 Logo 文件
        '/logo.png',
        '/logo.svg',
        '/logo.uhd.png',
        '/logo.webp',
        '/favicon.ico',
        '/default-avatar.svg',

        // 常见协议/标准文件
        '/robots.txt',
        '/humans.txt',
        '/security.txt',
        '/ads.txt',
        '/app-ads.txt',

        // 订阅
        '/sitemap',
        '/sitemap_index',
        '/feed',
        '/rss',
        '/atom',

        // 移动端/通用链接
        '/apple-app-site-association',
        '/assetlinks.json',
        '/browserconfig.xml',
        '/site.webmanifest',
        '/manifest.json',
    ];
    if (skipExact.includes(path)) return false;

    const staticExts = [
        // 图片
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.svg', '.webp',
        '.tiff', '.tif', '.heic', '.heif', '.avif',
        // 样式与脚本
        '.css', '.scss', '.less', '.sass', '.styl',
        '.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx', '.map',
        // 字体
        '.woff', '.woff2', '.ttf', '.otf', '.eot', '.fon',
        // 视频音频
        '.mp4', '.webm', '.ogv', '.avi', '.mov', '.wmv', '.flv', '.mkv',
        '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma',
        // 文档
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.odt', '.ods', '.odp', '.rtf', '.txt', '.csv', '.md',
        '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
        // 压缩包
        '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.tgz',
        // 订阅
        '.rss', '.atom',
        // 其他网络资源
        '.manifest', '.webapp', '.wasm', '.crx', '.xpi',
        // 可执行文件
        '.exe', '.msi', '.apk', '.dmg', '.pkg', '.deb', '.rpm', '.jar'
    ];
    if (staticExts.some(ext => path.endsWith(ext))) return false;
    return true
}
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        let _tm_path;
        try {
            _tm_path = decodeURIComponent(url.pathname)
        } catch {
            _tm_path = url.pathname
        }
        const path = _tm_path;
        const userAgent = request.headers.get('User-Agent') || '';
        const platform = request.headers.get('sec-ch-ua-platform') || '';
        const hostname = url.hostname;
        const cookie = request.headers.get('Cookie') || '';
        const isWechat = !!userAgent.match(/MicroMessenger/i);
        const clientIP = request.headers.get('CF-Connecting-IP');
        const isMobile = mobileRegex.test(userAgent) || false;
        if (url.protocol === 'http:' && (!userAgent.includes('MSIE') && !userAgent.includes('Trident'))) {
            const newUrl = new URL(request.url);
            newUrl.protocol = 'https:';
            if (newUrl.port === '80') {
                newUrl.port = ''
            }
            return new Response(null, {
                status: 301,
                headers: {
                    'Location': newUrl.toString()
                }
            })
        }
        if (shouldValidate(request)) {
            const result = await validateRequest(request, url);
            if (!result.valid) {
                const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
                const ua = request.headers.get('User-Agent') || '';
                const protocol = url.protocol;
                const dataToEncrypt = {
                    ua, protocol, timestamp: Date.now()
                };
                const keyBytes = await deriveKey(ip);
                const token = await encryptData(dataToEncrypt, keyBytes);
                const html = generateChallengePage(token);
                return new Response(html, {
                    headers: {
                        'Content-Type': 'text/html;charset=UTF-8',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                    }
                })
            }
        }
        if (path.startsWith('/我们毕业啦')) {
            if (isMobile) {
                return new Response(null, {
                    status: 302,
                    headers: {
                        'Location': 'https://net.undz.cn/static/mp4/9e7e0f7e8a3f752c47bf759d7f1f606f.mp4'
                    }
                })
            } else {
                return new Response(null, {
                    status: 302,
                    headers: {
                        'Location': 'https://www.bilibili.com/video/BV1GJ411x7h7/'
                    }
                })
            }
        }
        if (path.startsWith("/api/")) {
            return new Response(JSON.stringify({
                code: 200,
                name: "Cloudflare edge server",
                userAgent,
                platform,
                isWechat,
                clientIP,
                isMobile
            }), {
                headers: {
                    "Content-Type": "application/json"
                },
            })
        }
        return env.ASSETS.fetch(request)
    },
};
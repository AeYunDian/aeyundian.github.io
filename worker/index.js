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
    <script>document.cookie="ayFirewall=${token}; path=/; max-age=${60 * 60 * 24 * 3}; SameSite=Lax; Secure";location.reload();</script></body></html>`
}

function shouldValidate(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const ua = request.headers.get('User-Agent') || '';
    const cf = request.cf || {};
    const country = (cf && cf.country) || '';
    const asn = (cf && cf.asn) ? parseInt(cf.asn, 10) : 0;

    // ----- 1. 搜索引擎爬虫白名单（直接放行） -----
    const botRegex = /Googlebot|Baiduspider|bingbot|Sogou|360Spider|YandexBot|facebookexternalhit|Twitterbot/i;
    if (botRegex.test(ua)) return false;

    // ----- 2. 强跳路径（完全不需要验证） -----
    if (request.method === 'OPTIONS') return false;
    if (path.startsWith('/api/')) return false;
    if (path.startsWith('/.well-known/')) return false;

    const skipExact = [
        '/_redirects', '/logo.png', '/logo.svg', '/logo.uhd.png',
        '/logo.webp', '/favicon.ico', '/default-avatar.svg',
        '/robots.txt', '/humans.txt', '/security.txt', '/ads.txt',
        '/app-ads.txt', '/sitemap', '/sitemap_index', '/feed',
        '/rss', '/atom', '/apple-app-site-association',
        '/assetlinks.json', '/browserconfig.xml', '/site.webmanifest',
        '/manifest.json'
    ];
    if (skipExact.includes(path)) return false;

    // ----- 3. 高危国家 / 空UA / 扫描器UA / 恶意ASN（任一命中则需验证） -----
    const dangerousCountries = ['RU', 'UA', 'TR'];
    if (dangerousCountries.includes(country.toUpperCase())) return true;

    if (ua === '' || ua === 'undefined') return true;

    const badKeywords = [
        'masscan', 'nmap', 'zmap', 'zgrab', 'WPScan', 'sqlmap',
        'fimap', 'Acunetix', 'FHscan', 'Gscan', 'Researchscan',
        'Wprecon', 'BackDoorBot', 'Zeus'
    ];
    const lowerUA = ua.toLowerCase();
    if (badKeywords.some(kw => lowerUA.includes(kw.toLowerCase()))) return true;

    const badASNs = new Set([
        210644, 216246, 211522, 214351, 213194, 214196, 44477,
        215789, 214943, 48589, 202685, 57523, 136897, 45104,
        45103, 45102, 37963, 59055, 59054, 59053, 59052, 59051,
        59028, 269939, 206798, 45090, 132203, 132591, 133478,
        131444, 63727, 63655, 61348, 134963, 34947, 55990,
        141180, 139144, 139124, 137876, 140723, 136907, 211914,
        149167, 206204, 200756, 398324, 14618, 10912, 24940,
        14061, 16276, 36352, 53667, 60781, 5065, 6207, 35624,
        43444, 198571, 33993, 209847, 35478, 58854, 138915,
        140666, 265443
    ]);
    if (badASNs.has(asn)) return true;
    const isChineseASN = /china|telecom|unicom|mobile|cnnic|aliyun|tencent|cloud/i.test(asOrganization);
    if (country.toUpperCase() === 'CN') {
        // 请求来自中国，但 ASN 不是中国 → 可能使用代理/VPN
        if (!isChineseASN) return true;
    } else {
        // 请求来自国外，但 ASN 是中国 → 可能伪装或使用国内代理
        if (isChineseASN) return true;
    }
    // ----- 3.6 时区一致性检查（针对中国） -----
    const timezone = cf.timezone || '';
    if (country.toUpperCase() === 'CN') {
        // 中国法定时区为东八区（UTC+8），常见时区名称列表
        const cnTimezones = [
            'Asia/Shanghai',
            'Asia/Hong_Kong',
            'Asia/Macau',
            'Asia/Chongqing',
            'Asia/Harbin',
            'Asia/Taipei',
            'Asia/Urumqi'   // 乌鲁木齐虽为东六区，但部分地区可能使用
        ];
        // 如果时区不在列表中，且时区不为空（避免误判空值），则触发验证
        if (timezone && !cnTimezones.includes(timezone)) {
            return true;
        }
    }
    // ----- 4. 强跳后缀（静态资源）直接放行 -----
    const staticExts = [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.svg',
        '.webp', '.tiff', '.tif', '.heic', '.heif', '.avif',
        '.css', '.scss', '.less', '.sass', '.styl',
        '.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx', '.map',
        '.woff', '.woff2', '.ttf', '.otf', '.eot', '.fon',
        '.mp4', '.webm', '.ogv', '.avi', '.mov', '.wmv', '.flv',
        '.mkv', '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a',
        '.wma', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt',
        '.pptx', '.odt', '.ods', '.odp', '.rtf', '.txt', '.csv',
        '.md', '.json', '.xml', '.yaml', '.yml', '.toml', '.ini',
        '.cfg', '.conf', '.zip', '.rar', '.7z', '.tar', '.gz',
        '.bz2', '.xz', '.tgz', '.rss', '.atom', '.manifest',
        '.webapp', '.wasm', '.crx', '.xpi', '.exe', '.msi',
        '.apk', '.dmg', '.pkg', '.deb', '.rpm', '.jar'
    ];
    if (staticExts.some(ext => path.endsWith(ext))) return false;

    // ----- 5. 综合用户信息（TLS / HTTP 协议等异常检测） -----
    const tlsVersion = cf.tlsVersion || '';
    // 只允许 TLSv1.2 和 TLSv1.3
    if (tlsVersion && !/TLSv1\.[23]/.test(tlsVersion)) {
        return true;
    }

    const httpProtocol = cf.httpProtocol || '';
    // 拒绝 HTTP/1.0 及更早版本
    if (httpProtocol && /HTTP\/1\.[01]/.test(httpProtocol)) {
        return true;
    }

    // （可选）检查其他字段，如 clientAcceptEncoding 等

    // 默认放行
    return false;
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
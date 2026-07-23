const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|phone|webos|kindle|tablet/i;
// ===========================================================工具函数
/**
 * MD5 哈希函数（纯 JavaScript 实现）
 * @param {string|Uint8Array} input - 要计算哈希的字符串或字节数组
 * @returns {string} 32 位小写十六进制 MD5 摘要
 */
function md5(input) {
    // 将输入转换为 Uint8Array
    let data;
    if (typeof input === 'string') {
        data = new TextEncoder().encode(input);
    } else if (input instanceof Uint8Array) {
        data = input;
    } else {
        throw new TypeError('Input must be string or Uint8Array');
    }

    // MD5 辅助函数（位运算）
    const rotateLeft = (value, shift) => (value << shift) | (value >>> (32 - shift));
    const F = (x, y, z) => (x & y) | (~x & z);
    const G = (x, y, z) => (x & z) | (y & ~z);
    const H = (x, y, z) => x ^ y ^ z;
    const I = (x, y, z) => y ^ (x | ~z);

    // 初始化 MD5 缓冲区（小端序）
    let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

    // 补位函数：将字节数组转换为 32 位字数组（小端）
    function toWords(bytes) {
        const words = [];
        for (let i = 0; i < bytes.length; i += 4) {
            words.push(
                (bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0
            );
        }
        return words;
    }

    // 填充：消息长度（比特）占 64 位，低位在前
    const bitLength = data.length * 8;
    const padded = new Uint8Array(data.length + 1 + 8 + ((56 - (data.length + 1) % 64) % 64) + 8);
    padded.set(data, 0);
    padded[data.length] = 0x80; // 补 1 位

    // 在最后 8 字节写入长度（小端序 64 位）
    const view = new DataView(padded.buffer);
    for (let i = 0; i < 8; i++) {
        view.setUint8(padded.length - 8 + i, (bitLength >>> (i * 8)) & 0xff);
    }

    // 按 512 位（64 字节）分块处理
    const words = toWords(padded);
    for (let i = 0; i < words.length; i += 16) {
        const M = words.slice(i, i + 16);
        let A = a, B = b, C = c, D = d;

        // 四轮变换（每轮 16 步）
        // 第一轮
        for (let j = 0; j < 16; j++) {
            const k = j;
            const s = [7, 12, 17, 22][j % 4];
            const T = (0x100000000 * Math.abs(Math.sin(j + 1))) >>> 0; // 伪随机常数
            A = (A + F(B, C, D) + M[k] + T) >>> 0;
            A = rotateLeft(A, s) + B;
            [A, B, C, D] = [D, A, B, C];
        }
        // 第二轮
        for (let j = 0; j < 16; j++) {
            const k = (1 + 5 * j) % 16;
            const s = [5, 9, 14, 20][j % 4];
            const T = (0x100000000 * Math.abs(Math.sin(j + 1 + 16))) >>> 0;
            A = (A + G(B, C, D) + M[k] + T) >>> 0;
            A = rotateLeft(A, s) + B;
            [A, B, C, D] = [D, A, B, C];
        }
        // 第三轮
        for (let j = 0; j < 16; j++) {
            const k = (5 + 3 * j) % 16;
            const s = [4, 11, 16, 23][j % 4];
            const T = (0x100000000 * Math.abs(Math.sin(j + 1 + 32))) >>> 0;
            A = (A + H(B, C, D) + M[k] + T) >>> 0;
            A = rotateLeft(A, s) + B;
            [A, B, C, D] = [D, A, B, C];
        }
        // 第四轮
        for (let j = 0; j < 16; j++) {
            const k = (7 * j) % 16;
            const s = [6, 10, 15, 21][j % 4];
            const T = (0x100000000 * Math.abs(Math.sin(j + 1 + 48))) >>> 0;
            A = (A + I(B, C, D) + M[k] + T) >>> 0;
            A = rotateLeft(A, s) + B;
            [A, B, C, D] = [D, A, B, C];
        }

        a = (a + A) >>> 0;
        b = (b + B) >>> 0;
        c = (c + C) >>> 0;
        d = (d + D) >>> 0;
    }

    // 将四个 32 位整数转换为小端字节序列，再转十六进制
    function wordToHex(word) {
        const bytes = [
            word & 0xff,
            (word >>> 8) & 0xff,
            (word >>> 16) & 0xff,
            (word >>> 24) & 0xff
        ];
        return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}
function ipInCIDR(ip, cidr) {
    const [network, prefixLen] = cidr.split('/');
    const prefix = parseInt(prefixLen, 10);
    // 如果任一包含冒号，尝试按 IPv6 处理
    if (ip.includes(':') || network.includes(':')) {
        try {
            const ipBig = ipv6ToBigInt(ip);
            const netBig = ipv6ToBigInt(network);
            const allOnes = (BigInt(1) << BigInt(128)) - BigInt(1);
            const netMask = allOnes ^ ((BigInt(1) << BigInt(128 - prefix)) - BigInt(1));
            return (ipBig & netMask) === (netBig & netMask);
        } catch (_) {
            return false;
        }
    }
    if (isIPv4(ip) && isIPv4(network)) {
        const ipNum = ipv4ToNum(ip);
        const netNum = ipv4ToNum(network);
        const mask = ~0 >>> (32 - prefix);
        return (ipNum & mask) === (netNum & mask);
    }

    return false;
}
function isIPv4(ip) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
}
function isIPv6(ip) {
    return /^([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}$/.test(ip) ||
        /^::/.test(ip) ||
        /^::ffff:(\d{1,3}\.){3}\d{1,3}$/.test(ip) ||
        /^::(\d{1,3}\.){3}\d{1,3}$/.test(ip);
}
function ipv4ToNum(ip) {
    const parts = ip.split('.').map(Number);
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}
function ipv6ToBigInt(ip) {
    // 去除可能的 CIDR 后缀（如果有）
    if (ip.includes('/')) ip = ip.split('/')[0];
    let parts = ip.split(':');
    let ipv4Part = null;
    if (parts.length > 1 && parts[parts.length - 1].includes('.')) {
        ipv4Part = parts.pop();
        const ipv4Groups = ipv4Part.split('.').map(Number);
        if (ipv4Groups.length !== 4 || ipv4Groups.some(v => v < 0 || v > 255)) {
            throw new Error('Invalid IPv4 part in IPv6 address');
        }
        // 将 IPv4 转换为两个 16 位组：前两个八位组为一组，后两个为一组
        const group1 = (ipv4Groups[0] << 8) | ipv4Groups[1];
        const group2 = (ipv4Groups[2] << 8) | ipv4Groups[3];
        parts.push(group1.toString(16).padStart(4, '0'), group2.toString(16).padStart(4, '0'));
    }
    let fullParts = [];
    let hasDoubleColon = false;
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === '') {
            if (hasDoubleColon) throw new Error('Multiple "::" in IPv6 address');
            hasDoubleColon = true;
            const missing = 8 - (parts.length - 1); // 减去空字符串本身
            for (let j = 0; j < missing; j++) {
                fullParts.push('0');
            }
        } else {
            fullParts.push(parts[i]);
        }
    }
    if (!hasDoubleColon && fullParts.length !== 8) {
        throw new Error('Invalid IPv6: wrong number of groups');
    }
    while (fullParts.length < 8) {
        fullParts.push('0');
    }
    let big = BigInt(0);
    for (const g of fullParts) {
        const val = parseInt(g, 16);
        if (isNaN(val) || val < 0 || val > 0xFFFF) {
            throw new Error('Invalid IPv6 group: ' + g);
        }
        big = (big << BigInt(16)) + BigInt(val);
    }
    return big;
}
async function getBotIPList(env) {
    const now = Date.now();

    try {
        const result = await env.DB.prepare('SELECT allow_bot_ip FROM ayFirewall LIMIT 1').first();
        if (!result) {
            console.warn('No bot IP list found in DB');
            return null;
        }
        const data = JSON.parse(result.allow_bot_ip);
        return data;
    } catch (e) {
        console.error('Failed to read bot IP list:', e);
        return null;
    }
}

/**
 * 更新数据库中的 allow_bot_ip
 */
async function updateBotIPListInDB(env, prefixes) {
    const updateTime = new Date().toISOString();
    const json = JSON.stringify({ updateTime, prefixes });
    // 如果表为空则插入，否则更新
    const existing = await env.DB.prepare('SELECT COUNT(*) as cnt FROM ayFirewall').first();
    if (existing.cnt === 0) {
        await env.DB.prepare('INSERT INTO ayFirewall (id, allow_bot_ip) VALUES (1, ?)').bind(json).run();
    } else {
        await env.DB.prepare('UPDATE ayFirewall SET allow_bot_ip = ?').bind(json).run();
    }
}

/**
 * 从网络拉取搜索引擎 IP 列表并合并
 */
async function fetchAndMergeBotIPs() {
    const googleUrl = 'https://www.gstatic.com/ipranges/goog.json';
    const bingUrl = 'https://www.bing.com/toolbox/bingbot.json';

    const [googleResp, bingResp] = await Promise.all([
        fetch(googleUrl),
        fetch(bingUrl)
    ]);

    const googleData = await googleResp.json();
    const bingData = await bingResp.json();
    // 合并所有 prefixes
    const allPrefixes = [];
    if (googleData.prefixes) {
        for (const p of googleData.prefixes) {
            if (p.ipv4Prefix) allPrefixes.push({ ipv4Prefix: p.ipv4Prefix });
            if (p.ipv6Prefix) allPrefixes.push({ ipv6Prefix: p.ipv6Prefix });
        }
    }
    if (bingData.prefixes) {
        for (const p of bingData.prefixes) {
            if (p.ipv4Prefix) allPrefixes.push({ ipv4Prefix: p.ipv4Prefix });
            if (p.ipv6Prefix) allPrefixes.push({ ipv6Prefix: p.ipv6Prefix });
        }
    }
    return allPrefixes;
}
/**
 * 判断是否为合法的搜索引擎爬虫（基于 UA 和 IP）
 */
async function isSearchEngineBot(request, env) {
    const ua = request.headers.get('User-Agent') || '';
    const ip = request.headers.get('CF-Connecting-IP') || '';

    if (!ip) return false;
    // 匹配主流搜索引擎 UA
    const botMatch = ua.match(/\b(Googlebot|Bingbot|Baiduspider)\b/i);
    if (!botMatch) return false;
    const botList = await getBotIPList(env);
    if (!botList || !botList.prefixes) {
        return false;
    }
    for (const entry of botList.prefixes) {
        const prefix = entry.ipv4Prefix || entry.ipv6Prefix;
        if (prefix && ipInCIDR(ip, prefix)) {
            return true; // 合法爬虫
        }
    }
    return false; // UA 匹配但 IP 不在白名单
}
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
// ===========================================================主要函数
function generateChallengePage(token) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport"content="width=device-width, initial-scale=1.0">
<style>html{text-align:center}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}</style>
<title>AyWAF</title></head>
<body><h3>Ay Web Application Firewall</h3>
<p>正在进行安全校验，请稍后...</p>
<hr><p>此网站使用 Ay Web Application Firewall 保护站点安全。</p>
<p>WAF</p>
<script>document.cookie="ayFirewall=${token}; path=/; max-age=${60 * 60 * 24 * 3}; SameSite=Lax; Secure";location.reload();</script></body></html>`
}

async function shouldValidate(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const ua = request.headers.get('User-Agent') || '';
    const cf = request.cf || {};
    const country = (cf && cf.country) || '';
    const asn = (cf && cf.asn) ? parseInt(cf.asn, 10) : 0;

    const isBot = await isSearchEngineBot(request, env);
    if (isBot) {
        return false;
    }

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

    // ---------- 危险 UA 黑名单（触发验证） ----------
    const dangerousUAKeywords = [
        // “禁止搜索引擎”列表
        '2345Explorer', 'curl', 'wget', 'webZIP', 'qihoobot',
        // 微信/QQ
        'MicroMessenger', 'QQTheme',
        'WPScan',
    ];
    // 以上列表已去重，且移除了主流搜索引擎
    const lowerUA = ua.toLowerCase();
    if (dangerousUAKeywords.some(kw => lowerUA.includes(kw.toLowerCase()))) {
        return true;
    }

    // ----- 高危国家 / 空UA / 扫描器UA / 恶意ASN（任一命中则需验证） -----
    const dangerousCountries = ['RU', 'UA', 'TR'];
    if (dangerousCountries.includes(country.toUpperCase())) return true;

    if (ua === '' || ua === 'undefined') return true;

    const badKeywords = [
        'masscan', 'nmap', 'zmap', 'zgrab', 'WPScan', 'sqlmap',
        'fimap', 'Acunetix', 'FHscan', 'Gscan', 'Researchscan',
        'Wprecon', 'BackDoorBot', 'Zeus'
    ];
    if (badKeywords.some(kw => lowerUA.includes(kw.toLowerCase()))) return true;

    const badASNs = new Set([
        0,
        210644, 216246, 211522, 214351, 213194, 214196, 44477,
        215789, 214943, 48589, 202685, 57523, 136897,
        398324, 14618, 10912, 24940, 13335, 36351, 31898,
        14061, 16276, 36352, 53667, 60781, 5065, 6207, 35624,
        43444, 198571, 33993, 209847, 35478, 58854, 138915,
        140666,
        34947, 37963, 45102, 45103, 45104, 59028, 59051, 59052, 59053, 59054, 59055, 134963, 211914, // 阿里
        45090, 132203, 132591, 133478, 137876, // 腾讯
        55990, 61348, 63655, 63727, 131444, 136907, 139124, 139144, 140723, 141180, 149167, 200756, 206204, 206798, 265443, 269939, // 华为
        38365, 38627, 45076, 45085, 55967, 63288, 63728, 63729, 131138, 131139, 131140, 131141, 133746, 199506, // 百度云
        9786, 59077, 135377 // 优刻得
    ]);
    if (badASNs.has(asn)) return true;

    const asOrganization = (cf && cf.asOrganization) || '';
    const isChineseASN = /china|telecom|unicom|mobile|cnnic|aliyun|tencent|cloud/i.test(asOrganization);
    if (country.toUpperCase() === 'CN') {
        if (!isChineseASN) return true;
    } else {
        if (isChineseASN) return true;
    }
    // ----- 3.6 时区一致性检查（针对中国） -----
    const timezone = cf.timezone || '';
    if (country.toUpperCase() === 'CN') {
        // 中国法定时区为东八区（UTC+8），常见时区名称列表
        const cnTimezones = [
            // 中国大陆常用时区
            'Asia/Shanghai',    // 北京时间（主流）
            'Asia/Chongqing',   // 重庆时间（西南地区）
            'Asia/Harbin',      // 哈尔滨时间（东北地区）
            'Asia/Urumqi',      // 乌鲁木齐时间（新疆，实际使用 UTC+6，但系统可能仍用此名）
            'Asia/Kashgar',     // 喀什时间（新疆西部）
            'Asia/Chungking',   // 旧称，兼容个别老旧系统

            // 港澳台地区
            'Asia/Hong_Kong',
            'Asia/Macau',
            'Asia/Taipei',
        ];
        if (!timezone || !cnTimezones.includes(timezone)) return true;
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
        if (hostname === 'gy.undz.cn') {
            return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport"content="width=device-width, initial-scale=1.0">
<style>html{text-align:center}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}</style>
<title>AyWAF</title></head>
<body><h3>Ay Web Application Firewall</h3>
<p>尊敬的访客，您好：</p>
<p>您当前访问的页面已被管理员关闭，如有疑问，请<a href="https://undz.cn/contact_me/zh-cn.html">通过这些方式联系管理员</a>。</p>
<hr><p>此网站使用 Ay Web Application Firewall 保护站点安全。</p>
<p>WAF</p>
`, {
                status: 404, headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                }
            })
        }
        const ignore = [
            '/.env', '/.flaskenv', '/env', '/.envrc', '/env', '/env.js', '/.env.js',
            '/.env.test.local', '/.env.development.local', '/.env.production.local', '/.env.template',
            '/.env.dist', '/.env.sample', '/.env.example', '/.env~', '/.env.swp',
            '/.env.tmp', '/.env.bak', '/.env.old', '/.env.save', '/.env.backup',
            '/.env.staging', '/.env.test', '/.env.prod', '/.env.dev', '/.env.development',
            '/.env.production', '/.env.local', '/.config', '/config', '/.git/config',
            '/.git/HEAD', '/_vti_pvt/zzcanary-c209086eca9aebb', '/.ssh/zzcanary-11cee87706275787', '/_vti_pvt/service.pwd', '/.ssh/id_rsa',
            '/.ssh/id_ecdsa', '/.ssh/id_ed25519', '/.svn/zzcanary-7f24d6347052d904', '/actuator/zzcanary-745f4a4ad776a1b4', '/backup.tar.gz',
            '/actuator/heapdump', '/.svn/wc.db', '/backup.zip', '/dump.sql', '/dump.sql', '/database.sql',
        ];
        if (ignore.some(ext => path.toLowerCase() === ext)) {
            return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport"content="width=device-width, initial-scale=1.0">
<style>html{text-align:center}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}</style>
<title>AyWAF</title></head>
<body><h3>Ay Web Application Firewall</h3>
<p>危险操作，已被拦截</p>
<hr><p>此网站使用 Ay Web Application Firewall 保护站点安全。</p>
<p>WAF</p>
`, {
                status: 404,
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                }
            })
        }
        if (await shouldValidate(request, env)) {
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
            if (path === '/api/firewall/init' && request.method === 'GET') {
                const key = md5(url.searchParams.get('key'));
                const expectedKey = env.KEY;
                if (key !== expectedKey) {
                    return new Response(null, {
                        status: 302,
                        headers: { 'Location': '/' }
                    });
                }
                try {
                    await env.DB.prepare(`
                    CREATE TABLE IF NOT EXISTS ayFirewall (
                        id INTEGER PRIMARY KEY CHECK (id = 1),
                        allow_bot_ip TEXT NOT NULL
                    )
                `).run();
                    const prefixes = await fetchAndMergeBotIPs();
                    await updateBotIPListInDB(env, prefixes);
                    return new Response(JSON.stringify({ success: true, message: 'Initialized' }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                } catch (e) {
                    return new Response(JSON.stringify({ error: e.message }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }
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
    async scheduled(controller, env, ctx) {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS ayFirewall (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            allow_bot_ip TEXT NOT NULL
          )
        `).run();
        try {
            const prefixes = await fetchAndMergeBotIPs();
            await updateBotIPListInDB(env, prefixes);
            console.log('Bot IP list updated successfully');
        } catch (e) {
            console.error('Failed to update bot IP list:', e);
        }
    }
};
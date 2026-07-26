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
// 985YXWmlk7jiVUT43tsrqponhgfedcbaZSRQ6PONMLK20zyxwvuJIHGF1EDCBA+/
//     function base64Encode(input) {
//     const base64Chars = '985YXWmlk7jiVUT43tsrqponhgfedcbaZSRQ6PONMLK20zyxwvuJIHGF1EDCBA+/';

//     // 将字符串转换为 UTF-8 字节
//     let utf8Bytes = new TextEncoder().encode(input);

//     // 将每个字节转换为二进制字符串
//     let binaryString = '';
//     for (let i = 0; i < utf8Bytes.length; i++) {
//         binaryString += utf8Bytes[i].toString(2).padStart(8, '0');
//     }

//     // 按 6 位拆分
//     const chunks = [];
//     for (let i = 0; i < binaryString.length; i += 6) {
//         chunks.push(binaryString.slice(i, i + 6));
//     }

//     // 如果最后一组少于 6 位，进行填充
//     if (chunks[chunks.length - 1].length < 6) {
//         chunks[chunks.length - 1] = chunks[chunks.length - 1].padEnd(6, '0');
//     }

//     // 查找对应的 Base64 字符
//     let base64Encoded = chunks.map(chunk => {
//         const index = parseInt(chunk, 2); // 将二进制转换为数字
//         return base64Chars.charAt(index);
//     }).join('');

//     // 添加填充字符
//     while (base64Encoded.length % 4 !== 0) {
//         base64Encoded += '=';
//     }

//     return base64Encoded;
// }
// ===========================================================主要函数
function generateChallengePage(token) {
    const r = () => Math.random().toString(16).substring(2, 8).padEnd(6, '0').toUpperCase();
    const p = r();
    let M = '';
    for (let i = 0; i < token.length; i++) {
        const code = token.charCodeAt(i) ^ p.charCodeAt(i % p.length);
        M += String.fromCharCode(code);
    }
    const len = M.length;
    const perm = Array.from({ length: len }, (_, i) => i);
    for (let i = len - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    let arg1 = '';
    for (let i = 0; i < len; i++) {
        arg1 += M[perm[i]];
    }
    const permHex = perm.map(v => '0x' + v.toString(16)).join(',');
    const pHex = Array.from(p).map(ch => '0x' + ch.charCodeAt(0).toString(16)).join(',');
    function stringToBase64(str) { const encoder = new TextEncoder(); const data = encoder.encode(str); const binary = Array.from(data, byte => String.fromCharCode(byte)).join(''); return btoa(binary); }
    // jn = Javascript name
    // el = 元素
    // fu = 函数
    const V_arg1 = '_0x' + r();
    const V_m = '_0x' + r();
    const V_pHex = '_0x' + r();
    const V_p = '_0x' + r();
    const V_q = '_0x' + r(); // 还原后的 M
    const V_x = '_0x' + r();
    const V_y = '_0x' + r();
    const V_i = '_0x' + r();
    const V_code = '_0x' + r();
    const V_tip = 'el' + r();
    const V_tipend = '_0x' + r();
    const V_decode = 'fu' + r();
    const V_decode_input = '_0x' + r();
    const V_decode_b64chars = '_0x' + r();
    const V_decode_decodedBytes = '_0x' + r();
    const V_decode_binaryString = '_0x' + r();
    const V_removeUselessTestLogo = '_0x' + r();
    const V_verification_failed = 'fu' + r();
    const V_decode_return = '_0x' + r();
    const V_token = '_0x' + r();
    const V_el1 = 'el' + r();
    const V_el2 = 'el' + r();
    const V_el3 = 'el' + r();
    const V_el4 = 'el' + r();
    const V_el5 = 'el' + r();
    const V_el6 = 'el' + r();
    const V_el7 = 'el' + r();
    const V_el8 = 'el' + r();
    const V_radiobtn_sel = 'el' + r();
    const V_radiobtn_none = 'el' + r();
    const V_script = `
    (function() {
    var ${V_verification_failed} = () => "\\u9a8c\\u8bc1\\u5931\\u8d25";
    function wait(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
    function ${V_decode}(${V_decode_input}) {
    const ${V_decode_b64chars} = '\\x39\\x38\\x35\\x59\\x58\\x57\\x6d\\x6c\\x6b\\x37\\x6a\\x69\\x56\\x55\\x54\\x34\\x33\\x74\\x73\\x72\\x71\\x70\\x6f\\x6e\\x68\\x67\\x66\\x65\\x64\\x63\\x62\\x61\\x5a\\x53\\x52\\x51\\x36\\x50\\x4f\\x4e\\x4d\\x4c\\x4b\\x32\\x30\\x7a\\x79\\x78\\x77\\x76\\x75\\x4a\\x49\\x48\\x47\\x46\\x31\\x45\\x44\\x43\\x42\\x41\\x2b\\x2f';
    ${V_decode_input} = ${V_decode_input}.replace(/=/g, '');
    let ${V_decode_binaryString} = '';
    for (let i = 0; i < ${V_decode_input}.length; i++) {
    const index = ${V_decode_b64chars}['\\u0069\\u006E\\u0064\\u0065\\u0078\\u004F\\u0066'](${V_decode_input}.charAt(i));${V_decode_binaryString} += index['\\u0074\\u006F\\u0053\\u0074\\u0072\\u0069\\u006E\\u0067'](2)['\\u0070\\u0061\\u0064\\u0053\\u0074\\u0061\\u0072\\u0074'](6, '0'); }
    let ${V_decode_decodedBytes} = [];
    for (let i = 0; i < Math.floor((${V_decode_input}.length * 6) / (2 ** 3)) * (2 ** 3); i += (2 ** 3)) {const byte = ${V_decode_binaryString}.slice(i, i + 8);${V_decode_decodedBytes}.push(parseInt(byte, 2));}
    let ${V_decode_return} = new TextDecoder().decode(new Uint8Array(${V_decode_decodedBytes}));
    return ${V_decode_return};}
    document[${V_decode}('dnpPdNPrgovPhFtxdZ==')]('.${V_el8}')[${V_decode}('hot6tngPeNtVfnUIgoEPdZ==')]("click",async function(){
    document[${V_decode}('dnpPdNPrgovPhFtxdZ==')]('.${V_radiobtn_none}')[${V_decode}('hGvSdFUVfnUI')][${V_decode}('hot6')]('${V_radiobtn_sel}');
    document[${V_decode}('dnpPdNPrgovPhFtxdZ==')]('.${V_radiobtn_none}')[${V_decode}('hGvSdFUVfnUI')][${V_decode}('dOpzeFgP')]('${V_radiobtn_none}');
    document[${V_decode}('dnpPdNPrgovPhFtxdZ==')]('.${V_radiobtn_sel}')[${V_decode}('cmp1cXUxeNtPeN3=')] = "✓";
    await wait(500); 
    document[${V_decode}('dnpPdNPrgovPhFtxdZ==')]('.${V_el8}').style.display = "none";
    document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}').style.display = "block"
    var _0x37de8d=_0x4e16;(function(_0x2eb1ac,_0x19f981){var _0x50bbd2=_0x4e16;var _0x3d0e46=_0x2eb1ac();while(!![]){try{var _0x3ec900=-parseInt(_0x50bbd2(0xe5))/0x1*(-parseInt(_0x50bbd2(0xe9))/0x2)+-parseInt(_0x50bbd2(0xe8))/0x3*(-parseInt(_0x50bbd2(0xe6))/0x4)+parseInt(_0x50bbd2(0xeb))/0x5*(parseInt(_0x50bbd2(0xe0))/0x6)+-parseInt(_0x50bbd2(0xed))/0x7*(parseInt(_0x50bbd2(0xe2))/0x8)+-parseInt(_0x50bbd2(0xe7))/0x9*(-parseInt(_0x50bbd2(0xdf))/0xa)+parseInt(_0x50bbd2(0xdc))/0xb*(-parseInt(_0x50bbd2(0xea))/0xc)+parseInt(_0x50bbd2(0xe3))/0xd;if(_0x3ec900===_0x19f981){break;}else{_0x3d0e46['push'](_0x3d0e46['shift']());}}catch(_0x8216ae){_0x3d0e46['push'](_0x3d0e46['shift']());}}}(_0x27c8,0x92c2b));function _0x27c8(){var _0x1369e6=['\x36\x31\x36\x34\x32\x36\x32\x75\x74\x6e\x71\x59\x70','\x70\x6c\x75\x67\x69\x6e\x73','\x33\x38\x65\x5a\x44\x6c\x7a\x55','\x38\x34\x34\x56\x4f\x64\x6f\x6c\x65','\x35\x38\x37\x36\x32\x38\x39\x63\x54\x6e\x77\x64\x62','\x32\x39\x34\x59\x47\x4c\x7a\x64\x62','\x33\x34\x37\x39\x38\x6d\x58\x69\x57\x49\x67','\x31\x30\x38\x79\x46\x55\x71\x55\x6e','\x32\x30\x65\x4a\x4d\x44\x4e\x42','\x63\x68\x72\x6f\x6d\x65','\x32\x34\x32\x32\x37\x49\x65\x4d\x67\x66\x69','\x34\x34\x33\x33\x31\x31\x51\x6c\x48\x6b\x70\x79','\x74\x65\x73\x74','\x77\x65\x62\x64\x72\x69\x76\x65\x72','\x31\x30\x56\x77\x57\x67\x44\x64','\x35\x33\x33\x38\x30\x38\x78\x4b\x73\x62\x58\x79','\x75\x73\x65\x72\x41\x67\x65\x6e\x74','\x32\x37\x37\x36\x74\x4a\x4a\x6a\x4a\x6d'];_0x27c8=function(){return _0x1369e6;};return _0x27c8();}function _0x4e16(_0x515b1a,_0x3ff53d){var _0x27c8a4=_0x27c8();_0x4e16=function(_0x4e163f,_0x599fb8){_0x4e163f=_0x4e163f-0xdc;var _0x4151fd=_0x27c8a4[_0x4e163f];return _0x4151fd;};return _0x4e16(_0x515b1a,_0x3ff53d);}if(navigator[_0x37de8d(0xde)]===!![]||/HeadlessChrome/['\x74\x65\x73\x74'](navigator[_0x37de8d(0xe1)])||navigator[_0x37de8d(0xe4)]['\x6c\x65\x6e\x67\x74\x68']===0x0||screen['\x63\x6f\x6c\x6f\x72\x44\x65\x70\x74\x68']!==0x18||screen['\x77\x69\x64\x74\x68']<0x3e8&&!/android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|phone|webos|kindle|tablet/i[_0x37de8d(0xdd)](navigator[_0x37de8d(0xe1)])||!window[_0x37de8d(0xec)]&&!/Firefox|Safari/['\x74\x65\x73\x74'](navigator[_0x37de8d(0xe1)])){document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}')[${V_decode}('cmp1cXUxeNtPeN3=')] = ${V_verification_failed}();document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}').style.color = "#FF3333";return;}
    if (typeof initGeetest4 === 'undefined') {document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}')[${V_decode}('cmp1cXUxeNtPeN3=')] = ${V_verification_failed}();document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}').style.color = "#FF3333";return;}
    (function(_0x2c62bd,_0x373942){const _0x47c10a=_0x5912;const _0x11340e=_0x2c62bd();while(!![]){try{const _0x4ec6f5=-parseInt(_0x47c10a(0xaa))/0x1+parseInt(_0x47c10a(0xaf))/0x2*(parseInt(_0x47c10a(0xa8))/0x3)+parseInt(_0x47c10a(0xab))/0x4+-parseInt(_0x47c10a(0xa6))/0x5+-parseInt(_0x47c10a(0xb1))/0x6+parseInt(_0x47c10a(0xa5))/0x7+parseInt(_0x47c10a(0xad))/0x8;if(_0x4ec6f5===_0x373942){break;}else{_0x11340e['push'](_0x11340e['shift']());}}catch(_0x4ad41e){_0x11340e['push'](_0x11340e['shift']());}}}(_0x1ecd,0x76dbd));function ${V_removeUselessTestLogo}(){const _0x6d4fce=_0x5912;const _0xed898f=new MutationObserver(()=>{const _0x6dc772=_0x5912;const _0x5eaa10=document[_0x6dc772(0xa9)]('\x2e\x67\x65\x65\x74\x65\x73\x74\x5f\x62\x6f\x78\x5f\x6c\x6f\x67\x6f\x2c\x20\x2e\x67\x65\x65\x74\x65\x73\x74\x5f\x66\x65\x65\x64\x62\x61\x63\x6b');if(_0x5eaa10[_0x6dc772(0xb0)]){_0x5eaa10[_0x6dc772(0xae)](_0x125084=>_0x125084[_0x6dc772(0xac)]['\x64\x69\x73\x70\x6c\x61\x79']='\x6e\x6f\x6e\x65');_0xed898f['\x64\x69\x73\x63\x6f\x6e\x6e\x65\x63\x74']();}});_0xed898f['\x6f\x62\x73\x65\x72\x76\x65'](document[_0x6d4fce(0xa7)],{'\x63\x68\x69\x6c\x64\x4c\x69\x73\x74':!![],'\x73\x75\x62\x74\x72\x65\x65':!![]});}function _0x5912(_0x3d4192,_0x2e899a){const _0x1ecda7=_0x1ecd();_0x5912=function(_0x59125f,_0x323fd4){_0x59125f=_0x59125f-0xa5;let _0x597fa5=_0x1ecda7[_0x59125f];return _0x597fa5;};return _0x5912(_0x3d4192,_0x2e899a);}function _0x1ecd(){const _0x18331e=['\x32\x32\x38\x35\x38\x35\x62\x78\x4d\x53\x47\x43','\x71\x75\x65\x72\x79\x53\x65\x6c\x65\x63\x74\x6f\x72\x41\x6c\x6c','\x38\x33\x35\x32\x36\x36\x66\x4f\x47\x55\x75\x68','\x38\x30\x33\x30\x30\x30\x46\x66\x52\x51\x70\x66','\x73\x74\x79\x6c\x65','\x31\x35\x39\x38\x31\x39\x30\x34\x68\x58\x53\x62\x41\x59','\x66\x6f\x72\x45\x61\x63\x68','\x32\x56\x52\x4b\x70\x75\x75','\x6c\x65\x6e\x67\x74\x68','\x31\x39\x37\x37\x34\x39\x38\x6f\x56\x45\x56\x77\x4d','\x32\x32\x37\x32\x31\x33\x63\x63\x41\x77\x55\x6e','\x33\x32\x37\x37\x32\x34\x30\x4a\x6c\x58\x4a\x51\x48','\x62\x6f\x64\x79'];_0x1ecd=function(){return _0x18331e;};return _0x1ecd();}
    initGeetest4({
            captchaId: ${V_decode}('VGgQgQXHVY6wTo3JUmkJUrk1VQqGUYZIUQgRVr7RgrV='),
            product: 'bind',
          }, function (captcha) {
            captcha.onReady(function () {
              ${V_removeUselessTestLogo}();
              captcha.showBox();
            }).onSuccess(async function () {
              const result = captcha.getValidate();
              if (!result) {document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}')[${V_decode}('cmp1cXUxeNtPeN3=')] = ${V_verification_failed}();document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}').style.color = "#FF3333";return;}
              var ${V_arg1} = ${JSON.stringify(arg1)};
              var ${V_m} = [${permHex}];
              var ${V_tipend} = () => "\\u7b49\\u5f85\\u670d\\u52a1\\u5668\\u54cd\\u5e94\\u3002";
              var ${V_pHex} = [${pHex}];
              var ${V_p} = '';
              for (var ${V_i} = 0; ${V_i} < ${V_pHex}.length; ${V_i}++) {
                  ${V_p} += String.fromCharCode(${V_pHex}[${V_i}]);
              }
              var ${V_q} = [];
              for (var ${V_x} = 0; ${V_x} < ${V_arg1}.length; ${V_x}++) {
                  for (var ${V_y} = 0; ${V_y} < ${V_m}.length; ${V_y}++) {
                      if (${V_m}[${V_y}] == ${V_x}) {
                          ${V_q}[${V_y}] = ${V_arg1}[${V_x}];
                          break;
              }}}
              var M_recovered = ${V_q}.join('');
              var ${V_token} = '';
              for (var ${V_i} = 0; ${V_i} < M_recovered.length; ${V_i}++) {
                  var ${V_code} = M_recovered.charCodeAt(${V_i}) ^ ${V_p}.charCodeAt(${V_i} % ${V_p}.length);
                  ${V_token} += String.fromCharCode(${V_code});
              }
              document[${V_decode}('hGAxfGPP')] = ${V_decode}('hnPmfn7PcGW0eYI') + ${V_token} + ${V_decode}('Tu8whntM4sBCkmHSb5HSgGqA') + ( (x) => (y) => (z) => (w) => x * y * z * w )( ~-61 )( ~-61 )( 0x18 )( ~~Math.PI ) + ${V_decode}('Tu8rhoHPqGPIgrHVhnZCkWUPhFpug3==');
              document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}')[${V_decode}('cmp1cXUxeNtPeN3=')] = "\\u6821\\u9a8c\\u5df2\\u901a\\u8fc7\\uff0c\\u6b63\\u5728" + ${V_tipend}();
              document['\\u006c\\u006f\\u0063\\u0061\\u0074\\u0069\\u006f\\u006e'][${V_decode}('dOp0eGW6')]();
            }).onError(function (error) {
              document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}')[${V_decode}('cmp1cXUxeNtPeN3=')] = ${V_verification_failed}();document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}').style.color = "#FF3333";return;
            }).onClose(async function () {
              document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}')[${V_decode}('cmp1cXUxeNtPeN3=')] = ${V_decode}('Dj+FEfDVEMR3DfKVDj+8');document[${V_decode}('gGpItovPeopycX7Eso3')]('${V_tip}').style.color = "#FF3333";
              function wait(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
              await wait(1000);
              document['\\u006c\\u006f\\u0063\\u0061\\u0074\\u0069\\u006f\\u006e'][${V_decode}('dOp0eGW6')]();
            });});});
})();
    `
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport"content="width=device-width, initial-scale=1.0"><script src="//net.undz.cn/static/js/15ead1e091a17a8278ce160fb3e2abd0.js"></script><style>html{text-align:center}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}.${V_radiobtn_sel}{margin-right: 5px;display: inline-block;vertical-align: middle;background: #0075ff;height: 16px;width: 16px;border-radius: 5px;border: solid #0075ff 1px;color: #fff;font-weight: bolder;font-size: 12px;}.${V_radiobtn_none}{margin-right: 5px;cursor: pointer; display: inline-block;vertical-align: middle;background: #fff;height: 16px;width: 16px;border-radius: 5px;border: solid #000 1px;}.${V_el7}{display: inline-block;margin-block-start: 1em;margin-block-end: 1em;margin-inline-start: 0px;margin-inline-end: 0px;}.${V_el8}{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}</style><title>WAF</title></head><body><h3 id="${V_el1}" class="${V_el2}">Ay Web Application Firewall</h3>
<p id="${V_tip}" style="display: none">正在进行安全校验，请稍后...</p>
<div class="${V_el8}"><div class="${V_radiobtn_none}"></div><p class="${V_el7}">点击以证明您不是恶意机器人</p></div>
<hr /><p id="${V_el3}" class="${V_el4}">此网站使用 Ay Web Application Firewall 保护站点安全。</p>
<p id="${V_el5}" class="${V_el6}">WAF</p><script src="data:text/javascript;base64,${stringToBase64(V_script)}"></script></body></html>`;
}

async function shouldValidate(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const ua = request.headers.get('User-Agent') || '';
    const cf = request.cf || {};
    const country = (cf && cf.country) || '';
    const asn = (cf && cf.asn) ? parseInt(cf.asn, 10) : 0;
    if (url.searchParams.get('waf') != null) { return true }
    const isBot = await isSearchEngineBot(request, env);
    if (isBot) {
        return false;
    }

    if (request.method === 'OPTIONS') return false;
    if (path.startsWith('/api/')) return false;
    if (path.startsWith('/.well-known/')) return false;

    const skipExact = [
        '/logo.png', '/logo.svg', '/logo.uhd.png',
        '/logo.webp', '/favicon.ico', '/default-avatar.svg', '/BingSiteAuth.xml',
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

    // ----- 强跳后缀（静态资源）直接放行 -----
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
    if (tlsVersion && !/TLSv1\.[23]/.test(tlsVersion)) {
        return true;
    }
    const httpProtocol = cf.httpProtocol || '';
    if (httpProtocol && /HTTP\/1\.[01]/.test(httpProtocol)) {
        return true;
    }
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
                }
            })
        }
        const ignore = [
            '/.env', '/.flaskenv', '/env', '/.envrc', '/env', '/env.js', '/.env.js',
            '/.env.test.local', '/.env.development.local', '/.env.production.local', '/.env.template',
            '/.env.dist', '/.env.sample', '/.env.example', '/.env~', '/.env.swp',
            '/.env.tmp', '/.env.bak', '/.env.old', '/.env.save', '/.env.backup',
            '/.env.staging', '/.env.test', '/.env.prod', '/.env.dev', '/.env.development',
            '/.env.production', '/.env.local', '/.config', '/config',
            '/.git/HEAD', '/_vti_pvt/zzcanary-c209086eca9aebb', '/_vti_pvt/service.pwd',
            '/database.sql', '/_redirects',
            '/backup.tar.gz', '/dump.sql', '/dump.sql',
            '/backup.zip',
            '/db.sqlite',
            '/database.sqlite',
            '/web.config', '/console', '/server-status', '/info.php',
        ];
        const ignorePath = [
            '/.vuepress/dist', '/backup', '/.ssh', '/.git', '/login', '/wp-admin', '/.htaccess', '/actuator', '/.svn', '/.vuepress/',
        ];
        if (ignore.some(ext => path.toLowerCase() === ext) || ignorePath.some(ext => path.startsWith(ext))) {
            return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport"content="width=device-width, initial-scale=1.0">
<style>html{text-align:center}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}</style>
<title>AyWAF</title></head>
<body><h3>Ay Web Application Firewall</h3>
<p>已阻止不安全的请求</p>
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
                code: 404,
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
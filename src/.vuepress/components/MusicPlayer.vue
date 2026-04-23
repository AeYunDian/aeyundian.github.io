<template>
    <div class="music-player-container" aria-label="音乐播放器">
        <div ref="playerContainer" class="aplayer-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

// 定义 props
const props = defineProps({
    server: {
        type: String,
        required: true,
        validator: (val) => ['netease', 'qq', 'xiami'].includes(val)
    },
    type: {
        type: String,
        required: true,
        validator: (val) => ['song', 'playlist', 'album'].includes(val)
    },
    id: {
        type: String,
        required: true
    },
    autoplay: {
        type: Boolean,
        default: false,
        required: false
    },
    mini: {
        type: Boolean,
        default: false,
        required: false
    },
    fixed: {
        type: Boolean,
        default: false,
        required: false
    },
    showLrc: {
        type: Boolean,
        default: true,
        required: false
    },
    mutex: {
        type: Boolean,
        default: true,
        required: false
    },
    volume: {
        type: Number,
        default: 0.7,
        required: false
    },
    audioType: {
        type: String,
        default: 'auto',
        required: false
    }
});

const GET_IP_URL = 'https://nextmusic.toubiec.cn/api/getip';
const GET_SONG_URL_API = 'https://nextmusic.toubiec.cn/api/getSongUrl';
const GET_SONG_LRC_API = 'https://nextmusic.toubiec.cn/api/getSongLyric';
const GET_SONG_INFO_API = 'https://nextmusic.toubiec.cn/api/getSongInfo';
const SECRET_PREFIX = 'suxiaoqings:';
const LEVEL = 'jymaster';


// 目前仅支持 netease + song + id
if (props.server !== 'netease') {
    console.error(`[MusicPlayer] 不支持的平台: ${props.server}，目前仅支持 netease`);
}
if (props.type !== 'song') {
    console.error(`[MusicPlayer] 不支持的播放类型: ${props.type}，目前仅支持 song`);
}

const playerContainer = ref(null);
let player = null;

// 只有在支持的情况下才初始化
const isSupported = props.server === 'netease' && props.type === 'song';

watch(() => props.id, (newId, oldId) => {
    if (newId === oldId) return;
    // 销毁当前播放器
    if (player) {
        player.destroy();
        player = null;
    }
    // 清空容器内容
    if (playerContainer.value) {
        playerContainer.value.innerHTML = '';
    }
    // 重新加载新歌曲
    loadSong();
});


async function getUserIP() {
    const res = await fetch(GET_IP_URL);
    const data = await res.json();
    if (data.code === 200 && data.data?.ip) return data.data.ip;
    throw new Error('获取 IP 失败');
}

function generateToken(ip) {
    return md5(SECRET_PREFIX + ip);
}

async function getSongUrl(token) {
    const res = await fetch(GET_SONG_URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: props.id, level: LEVEL, token })
    });
    const data = await res.json();
    if (data.code === 200 && data.data?.url) return data.data.url;
    throw new Error('获取歌曲链接失败');
}

async function getSongLrc(token) {
    const res = await fetch(GET_SONG_LRC_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: props.id, token })
    });
    const data = await res.json();
    if (data.code === 200 && data.data?.lrc) {
        let lrcText = data.data.lrc;
        const timeTagRegex = /\[\d{1,5}:\d{2}(?:\.\d{2,3})?\]/;
        if (!timeTagRegex.test(lrcText)) {
            lrcText = "[00:00.00]*该歌词不支持自动滚动*" + ('\n' + lrcText).replace(/\n/g, '\n[99:99.99]');
        }
        return lrcText;
    }
    return '';
}

async function getSongInfo(token) {
    const res = await fetch(GET_SONG_INFO_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: props.id, token })
    });
    const data = await res.json();
    if (data.code === 200 && data.data) return data.data;
    throw new Error('获取歌曲信息失败');
}

function initPlayer(audioUrl, audioLrc, audioInfo) {
    const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--vp-c-accent')
        .trim() || '#68a4ff';

    player = new APlayer({
        container: playerContainer.value,
        lrcType: (props.showLrc ? 1 : 0),
        mutex: props.mutex,
        audio: [{
            name: audioInfo.name,
            artist: audioInfo.singer,
            url: audioUrl,
            lrc: audioLrc,
            cover: audioInfo.picimg,
            type: props.audioType
        }],
        theme: accentColor,
        volume: props.volume,
        mini: props.mini,
        fixed: props.fixed,
        autoplay: props.autoplay
    });
}
async function loadSong() {
    if (!isSupported) return;
    try {
        const ip = await getUserIP();
        const token = generateToken(ip);
        const [audioUrl, audioLrc, audioInfo] = await Promise.all([
            getSongUrl(token),
            getSongLrc(token),
            getSongInfo(token)
        ]);
        initPlayer(audioUrl, audioLrc, audioInfo);
    } catch (err) {
        console.error(err);
        showError();
    }
}

function showError() {
    if (playerContainer.value) {
        playerContainer.value.innerHTML = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height="86" src="//music.163.com/outchain/player?type=2&id=${props.id}&auto=1&height=66"></iframe>`;
    }
}

onMounted(() => {
    if (!isSupported) return;
    loadSong();
});

onBeforeUnmount(() => {
    if (player && !player.paused) {
        player.pause();
    }
});
</script>
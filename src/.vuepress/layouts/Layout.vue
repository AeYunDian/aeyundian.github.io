<script setup lang="ts">
import { Layout } from "vuepress-theme-hope/client";

</script>
<template>
    <Layout>
        <template #contentAfter>
            <br />
            <hr />
            分享至：
            <Share colorful :services="['adsterra', 'qq', 'qzone', 'twitter', 'facebook', 'reddit',
                'telegram', 'whatsapp', 'tumblr', 'email', 'qrcode', 'linkedin',
                'sms', 'snapchat', 'wordpress', 'line', 'flipboard', 'pinterest',
                'evernote', 'messenger', 'buffer', 'vk']" />
        </template>
    </Layout>

</template>

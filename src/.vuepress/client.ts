import Blog from "./layouts/Blog.vue";
import Layout from "./layouts/Layout.vue";
import { defineClientConfig } from '@vuepress/client';
import RTLToggle from './components/RTLToggle.vue';
import SettingsMenu from './components/SettingsMenu.vue';
import SaleBanner from './components/SaleBanner.vue';
import SaleBlock from './components/SaleBlock.vue';
import GeoBlocker from './components/GeoBlocker.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import TopNavBeautify from './components/TopNavBeautify.vue';
import HeroBG from './components/HeroBG.vue';
import PrivacyConsentBanner from './components/PrivacyMessaging.vue';
import RiskDetector from './components/RiskDetector.vue';
import FirstScreenLoading from './components/FirstScreenLoading.vue'
export default defineClientConfig({
  layouts: {
    Blog: Blog,
    Layout: Layout
  },
  rootComponents: [
    HeroBG,
    TopNavBeautify,
    RiskDetector,
    FirstScreenLoading,
    GeoBlocker,
    PrivacyConsentBanner
  ],

  enhance({ app, router, siteData }) {
    //app.config.compilerOptions.isCustomElement = (tag) => tag === 'meting-js';
    // 注册全局组件
    app.component('MusicPlayer', MusicPlayer)
    app.component('RTLToggle', RTLToggle)
    app.component('SettingsMenu', SettingsMenu)
    app.component('SaleBanner', SaleBanner)
    app.component('SaleBlock', SaleBlock)
  },

  setup: function () {
    if (typeof window !== 'undefined') {
      var updateRuntime = function () {
        var startTime = new Date('2025-02-22T13:42:00Z').getTime();;
        var now = Date.now();
        var diff = Math.floor((now - startTime) / 1000);
        var days = Math.floor(diff / 86400);
        var hours = Math.floor((diff % 86400) / 3600);
        var minutes = Math.floor((diff % 3600) / 60);
        var seconds = diff % 60;
        var runtimeSpan = document.getElementById('runtime-value');
        if (runtimeSpan) {
          runtimeSpan.textContent = days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds';
        }
      };
      updateRuntime();
      setInterval(updateRuntime, 800);
    }
  }
});
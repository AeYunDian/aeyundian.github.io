import Blog from "./layouts/Blog.vue";
import { defineClientConfig } from '@vuepress/client'
import RTLToggle from './components/RTLToggle.vue'
import SettingsMenu from './components/SettingsMenu.vue'
import SaleBanner from './components/SaleBanner.vue'
import SaleBlock from './components/SaleBlock.vue'
import TopNavBeautify from './components/TopNavBeautify.vue'
import HeroBG from './components/HeroBG.vue'

export default defineClientConfig({
  layouts: {
    Blog: Blog
  },
  rootComponents: [
    TopNavBeautify,
    HeroBG
  ],

 enhance({ app, router, siteData }) {

    // 注册全局组件
    app.component('RTLToggle', RTLToggle)
    app.component('SettingsMenu', SettingsMenu)
    app.component('SaleBanner', SaleBanner)
    app.component('SaleBlock', SaleBlock)
  },

  setup: function() {
    if (typeof window !== 'undefined') {
      var updateRuntime = function() {
        var startTime = new Date('2025-02-22T13:42:00Z');
        var now = new Date();
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
      setInterval(updateRuntime, 1000);
    }
  }
});
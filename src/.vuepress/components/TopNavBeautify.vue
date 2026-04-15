<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// const route = useRoute();

const CheckSidebarOpen = () => {
  CheckScrollTopClass();
};

const CheckScrollTopClass = () => {
  return;
  const themeElms = document.getElementsByClassName('theme-container');
  if (themeElms.length < 1) {
    return null;
  }
  const themeElm = themeElms[0];

  const blogHeroElms = document.getElementsByClassName('vp-blog-hero');
  let blogHeroElm;
  if (blogHeroElms.length > 0) {
    blogHeroElm = blogHeroElms[0];
  }

  if (blogHeroElm) {
    themeElm.classList.add('ayund-blog-hero');
  } else {
    themeElm.classList.remove('ayund-blog-hero');
  }

  const scrollTop = document.documentElement.scrollTop;
  if (scrollTop < 60) {
    themeElm.classList.add('ayund-scroll-top');
  } else {
    themeElm.classList.remove('ayund-scroll-top');
  }

  if (blogHeroElm) {
    if (scrollTop < blogHeroElm.clientHeight - 30) {
      themeElm.classList.add('ayund-scroll-blog-hero-inner');
    } else {
      themeElm.classList.remove('ayund-scroll-blog-hero-inner');
    }
  }

  const toggleSidebarElms = document.getElementsByClassName('vp-toggle-sidebar-button');

  if (toggleSidebarElms.length > 0) {
    const toggleSidebarElm = toggleSidebarElms[0];
    toggleSidebarElm.removeEventListener('click', CheckSidebarOpen);
    toggleSidebarElm.addEventListener('click', CheckSidebarOpen);
  }
  checkRootPath();
};


const checkRootPath = () => {
  return;
  const themeElms = document.getElementsByClassName('theme-container');
  if (themeElms.length === 0) return;
  const themeElm = themeElms[0];
  if (!themeElm) return;
  // if (route.path !== '/') {
  //   themeElm.classList.remove('ayund-scroll-blog-hero-inner');
  // }
};
onMounted(() => {
  nextTick(() => {
    console.debug('TopNavBeautify mounted');
    CheckScrollTopClass(); // 切换时顶栏修改

    window.removeEventListener('scroll', () => {});
    window.addEventListener('scroll', () => {
      CheckScrollTopClass();
    });
  });

  const router = useRouter();

  router.afterEach(() => {
    nextTick(() => {
      setTimeout(() => {
        CheckScrollTopClass(); // 切换时顶栏修改
      }, 50);
    });
  });
});
</script>

<template>
  <ClientOnly>
    <div class="none">TopNavBeautify mounted</div>
  </ClientOnly>
</template>

<style lang="scss">

// 当导航栏在首页导到达顶部时
.theme-container.ayund-scroll-top.ayund-blog-hero {
  .vp-navbar {
    box-shadow: none;
  }
}

// hero 背景置顶
.theme-container .vp-page.vp-blog-home {
  padding-top: 0;
}

.blog-page-wrapper {
  .vp-blog-main {
    min-height: 710px;
  }
}

.theme-container.ayund-blog-hero {
  .blog-page-wrapper {
    .vp-blog-main {
      margin-top: 0.4em;
    }
  }
}

.theme-container {
  .vp-navbar {
    background: transparent;
  }
}
.theme-container.ayund-blog-hero.ayund-scroll-top {
  .vp-navbar {
    backdrop-filter: none;
  }
}


#main-content {
  .vp-toc-placeholder {
    transition: top 0.3s;
  }
}

// 白天
[data-theme='light'] {
  .theme-container {
    .vp-navbar {
      backdrop-filter: blur(2px);
    }
  }

  .theme-container.ayund-scroll-blog-hero-inner {
    .vp-appearance-button {
      color: #eee;
    }
    .settings-menu-wrapper {
      color: #eee;
    }
    .rtl-toggle-item > .label {
      color: var(--vp-c-text, rgb(60, 60, 67));
   }

    // 左边的名字颜色调整
    .vp-site-name {
      color: #eee;
      text-shadow: 0.05rem 0.05rem 0.1rem rgb(0 0 0 / 50%);
      opacity: 0.85;
      &:hover {
        color: var(--theme-color-light);
        opacity: 1;
      }
    }

    .vp-dropdown-title {
      color: #eee;
    }
    .vp-navbar {
      .vp-nav-item > .auto-link {
        color: #eee;
      }
      .vp-dropdown-title .i18n-icon {
        color: #eee;
      }
      .vp-outlook-button {
        color: #eee;
      }
      .vp-dropdown-title .arrow {
        display: none;
      }
    }
    .vp-toggle-sidebar-button::before,
    .vp-toggle-sidebar-button::after,
    .vp-toggle-sidebar-button .icon {
      background: #eee;
    }

    .vp-toggle-navbar-button .vp-top,
    .vp-toggle-navbar-button .vp-middle,
    .vp-toggle-navbar-button .vp-bottom {
      background: #eee;
    }
  }
}

// 黑夜细节
[data-theme='dark'] {
  .theme-container {
    .vp-navbar {
      backdrop-filter: blur(2px);
    }
  }

  .theme-container.ayund-scroll-blog-hero-inner {
    .vp-navbar {
      // 去除下拉图标
      .vp-dropdown-title .arrow {
        display: none;
      }
    }
  }
}
</style>

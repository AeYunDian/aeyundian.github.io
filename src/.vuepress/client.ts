import { defineClientConfig } from "vuepress/client";
import Blog from "./layouts/Blog.vue";
import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";

export default defineClientConfig({
  layouts: {
    Blog,
  },

  setup() {
    setupRunningTimeFooter(
      new Date("2025-02-22T13:42:00Z"),
      {
        "/": "Running time: :day days :hour hours :minute minutes :second seconds",
      },
      true,
    );
  },
});
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import * as dataLoader from "@/data/dataLoader";
import BaiduMap from "vue-baidu-map-3x";
import "@/assets/fonts/font.css";

async function run() {
  // await dataLoader.loadData();
  const app = createApp(App);
  app.use(BaiduMap, {
    ak: "xsfg4NDlGqYMfYty9IRTLGCoxtMrrp8g",
  });
  app.use(store).use(router).mount("#app");

  app.directive("animate", {
    mounted: function (el, binding) {
      binding.addClass = () => {
        const { left } = el.getBoundingClientRect();
        const w =
          document.documentElement.clientWidth || document.body.clientWidth;
        if (left < w) {
          if (el.className.indexOf(binding.value) == -1) {
            el.className = binding.value + " " + el.className;
          }
          if (binding.addClass) {
            window.removeEventListener("scroll", binding.addClass);
          }
        }
      };
      window.addEventListener("scroll", binding.addClass, true);
      binding.addClass();
    },
    unbind: function (el, binding) {
      if (binding.addClass) {
        window.removeEventListener("scroll", binding.addClass);
      }
    },
  });
}

run();

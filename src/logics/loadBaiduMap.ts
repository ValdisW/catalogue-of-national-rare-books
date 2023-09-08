import type { App } from "vue";
import BaiduMap from "vue-baidu-map-3x";

export function loadBaiduMap(app: App) {
  app.use(BaiduMap, {
    ak: "xsfg4NDlGqYMfYty9IRTLGCoxtMrrp8g",
  });
}

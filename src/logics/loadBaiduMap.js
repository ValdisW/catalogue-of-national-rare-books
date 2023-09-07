import BaiduMap from "vue-baidu-map-3x";

export function loadBaiduMap(app) {
  app.use(BaiduMap, {
    ak: "xsfg4NDlGqYMfYty9IRTLGCoxtMrrp8g",
  });
}

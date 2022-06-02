import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store';
import * as dataLoader from "@/data/dataLoader";
import BaiduMap from 'vue-baidu-map-3x'



async function run() {
    await dataLoader.loadData();
    const app = createApp(App);
    app.use(BaiduMap, {
        ak: 'xsfg4NDlGqYMfYty9IRTLGCoxtMrrp8g'
    })
    app.use(store).use(router).mount('#app');
}

run();
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store';
import * as dataLoader from "@/data/dataLoader";



async function run() {
    await dataLoader.loadData();
    const app = createApp(App);
    app.use(store).use(router).mount('#app');
}

run();
import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/fonts/font.css";

import { setupStore } from "@/store";
import { setupRouter } from "@/router";

async function run() {
  const app = createApp(App);

  setupStore(app);
  setupRouter(app);

  app.mount("#app");
}

run();

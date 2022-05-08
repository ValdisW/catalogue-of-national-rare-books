import { createRouter, createWebHistory } from "vue-router";
import Introduction from "../views/Introduction.vue";

const routes = [
  {
    path: "/",
    name: "Introduction",
    component: Introduction,
  },
  {
    path: "/exploration",
    name: "Exploration",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Exploration.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

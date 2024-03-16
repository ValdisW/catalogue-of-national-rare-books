import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Introduction",
    meta: { title: "名録介紹 | 國家珍貴古籍名録" },
    component: () => import("../views/Introduction.vue"),
  },
  {
    path: "/exploration",
    name: "Exploration",
    meta: { title: "名録瀏覽 | 國家珍貴古籍名録" },
    component: () => import("../views/Exploration.vue"),
  },
  {
    path: "/relationship",
    name: "Relationship",
    meta: { title: "名録分析 | 國家珍貴古籍名録" },
    component: () => import("../views/Relationship.vue"),
  },
  // {
  //   path: "/relationship-new",
  //   name: "Relationship",
  //   meta: { title: "流傳分析 | 國家珍貴古籍名録" },
  //   component: () => import("../views/Relationship.vue"),
  // },
  {
    path: "/about",
    name: "About",
    meta: { title: "研發團隊 | 國家珍貴古籍名録" },
    component: () => import("../views/About.vue"),
  },
  {
    path: "/book/:bookID",
    name: "BookDetail",
    meta: { title: "古籍详情" },
    component: () => import("../views/detail/BookDetail.vue"),
  },
  {
    path: "/person/:personID",
    name: "PersonDetail",
    meta: { title: "人物详情" },
    component: () => import("../views/detail/PersonDetail.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 设置title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export function setupRouter(app: App) {
  app.use(router);
}

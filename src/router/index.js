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
    name: "Relationship_old",
    meta: { title: "名録分析 | 國家珍貴古籍名録" },
    component: () => import("../views/Relationship_old.vue"),
  },
  {
    path: "/relationship-new",
    name: "Relationship",
    meta: { title: "流傳分析 | 國家珍貴古籍名録" },
    component: () => import("../views/Relationship.vue"),
  },
  {
    path: "/about",
    name: "About",
    meta: { title: "研發團隊 | 國家珍貴古籍名録" },
    component: () => import("../views/About.vue"),
  },
  // {
  //   path: "/book-detail/:bookID",
  //   name: "BookDetail",
  //   meta: { title: "古籍详情" },
  //   component: () => import("../views/BookDetail.vue"),
  // },
  // {
  //   path: "/person-detail/:personID",
  //   name: "PersonDetail",
  //   meta: { title: "人物详情" },
  //   component: () => import("../views/PersonDetail.vue"),
  // },
  // {
  //   path: "/institution-detail/:institutionID",
  //   name: "InstitutionDetail",
  //   meta: { title: "机构详情" },
  //   component: () => import("../views/InstitutionDetail.vue"),
  // },
  // {
  //   path: "/streamgraph",
  //   name: "StreamGraph",
  //   component: () => import("../views/Exploration-Stream.vue"),
  // },
  // {
  //   path: "/stack",
  //   name: "Stack",
  //   component: () => import("../views/Exploration-Stack.vue"),
  // },
  // {
  //   path: "/map",
  //   name: "Map",
  //   component: () => import("../views/Exploration-BaiduMap.vue"),
  // },
  // {
  //   path: "/flow",
  //   name: "Flow",
  //   component: () => import("../views/Exploration-Flow.vue"),
  // },
  // {
  //   path: "/exploration-unit",
  //   name: "Exploration-Unit",
  //   component: () =>
  //     import("../views/Exploration-Unit.vue"),
  // },
  // {
  //   path: "/exploration-map",
  //   name: "Exploration-Map",
  //   component: () =>
  //     import("../views/Exploration-Map.vue"),
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;

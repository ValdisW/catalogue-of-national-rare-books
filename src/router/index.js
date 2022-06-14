import { createRouter, createWebHistory } from "vue-router";
import Introduction from "../views/Introduction.vue";

const routes = [
  {
    path: "/",
    name: "Introduction",
    meta: { title: "古籍介绍" },
    component: Introduction,
  },
  {
    path: "/exploration",
    name: "Exploration",
    meta: { title: "古籍浏览" },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Exploration.vue"),
  },
  {
    path: "/vis-test",
    name: "VisTest",
    meta: { title: "可视化测试" },
    component: () => import("../views/VisTest.vue"),
  },
  {
    path: "/book-detail/:bookID",
    name: "BookDetail",
    meta: { title: "古籍详情" },
    component: () => import("../views/BookDetail.vue"),
  },
  {
    path: "/person-detail/:personID",
    name: "PersonDetail",
    meta: { title: "人物详情" },
    component: () => import("../views/PersonDetail.vue"),
  },
  {
    path: "/institution-detail/:institutionID",
    name: "InstitutionDetail",
    meta: { title: "机构详情" },
    component: () => import("../views/InstitutionDetail.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;

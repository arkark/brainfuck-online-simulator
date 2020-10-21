import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "top",
  },
  {
    path: "/15puzzle",
    name: "15puzzle",
  },
  {
    path: "*",
    redirect: { name: "top" },
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: "history",
  routes,
});

export default router;

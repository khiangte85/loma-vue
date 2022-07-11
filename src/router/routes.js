
const routes = [
  {
    name: "auth.login",
    path: "/auth/login",
    component: () => import("src/pages/Login.vue"),
  },
  {
    path: "/",
    meta: { requiresAuth: true },
    component: () => import("src/layouts/Layout.vue"),
    children: [
      {
        path: "/",
        component: () => import("src/pages/Home.vue"),
        meta: { title: "Users" },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;

// 路由配置
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Overview",
        component: () => import("../views/dashboard/Overview.vue"),
      },
      {
        path: "users",
        name: "UserManagement",
        component: () => import("../views/dashboard/UserManagement.vue"),
      },
      {
        path: "content",
        name: "ContentManagement",
        component: () => import("../views/dashboard/ContentManagement.vue"),
      },
      {
        path: "activities",
        name: "ActivityManagement",
        component: () => import("../views/dashboard/ActivityManagement.vue"),
      },
      {
        path: "notifications",
        name: "NotificationManagement",
        component: () => import("../views/dashboard/NotificationManagement.vue"),
      },
      {
        path: "analytics",
        name: "Analytics",
        component: () => import("../views/dashboard/Analytics.vue"),
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("../views/dashboard/Settings.vue"),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

export default routes;

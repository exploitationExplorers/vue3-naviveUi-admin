import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

// 全局样式
import "./style.css";
import "animate.css";

// 路由配置
import routes from "./router";

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 创建Pinia实例
const pinia = createPinia();

// 创建应用实例
const app = createApp(App);

// 使用插件
app.use(router);
app.use(pinia);

// 挂载应用
app.mount("#app");

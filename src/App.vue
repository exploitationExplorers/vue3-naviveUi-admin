<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "./stores/app";
import { useUserStore } from "./stores/user";
import { NConfigProvider, NMessageProvider, NNotificationProvider, zhCN, darkTheme } from "naive-ui";

// 获取路由和状态
const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();

// 主题配置
const theme = computed(() => (appStore.darkMode ? darkTheme : null));

// 初始化应用设置
onMounted(() => {
  appStore.initSettings();

  // 应用暗色模式
  if (appStore.darkMode) {
    document.body.classList.add('dark-theme');
  }

  // 检查登录状态
  if (!userStore.checkLoginState()) {
    // 未登录跳转到登录页面，但允许访问登录页面本身
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login');
    }
  } else {
    // 已登录状态下，如果访问根路径或登录页，重定向到仪表盘
    if (router.currentRoute.value.path === '/' || router.currentRoute.value.path === '/login') {
      router.push('/dashboard');
    }
  }
});

// 监听主题变化
watch(() => appStore.darkMode, (isDark) => {
  if (isDark) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
});
</script>

<template>
  <n-config-provider :theme="theme" :locale="zhCN">
    <n-notification-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style>
/* 全局样式已在style.css中定义 */
</style>

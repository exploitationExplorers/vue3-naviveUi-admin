import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  // 侧边栏折叠状态
  const siderCollapsed = ref(false);

  // 主题模式（light/dark）
  const darkMode = ref(false);

  // 设置侧边栏折叠状态
  const toggleSider = () => {
    siderCollapsed.value = !siderCollapsed.value;
  };

  // 设置主题模式
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    // 保存偏好设置
    localStorage.setItem("darkMode", darkMode.value ? "dark" : "light");
  };

  // 初始化设置
  const initSettings = () => {
    // 从localStorage读取主题设置
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      darkMode.value = savedMode === "dark";
    } else {
      // 如果没有保存，则使用系统默认
      darkMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  };

  return {
    siderCollapsed,
    darkMode,
    toggleSider,
    toggleDarkMode,
    initSettings,
  };
});

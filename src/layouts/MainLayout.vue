<script setup lang="ts">
import { ref, computed, watch, onMounted, h, Component } from "vue";
import { useRouter } from "vue-router";
import {
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  NMenu,
  NIcon,
  NAvatar,
  NBadge,
  NDropdown,
  NButton,
  NSpace,
  NSwitch,
  NPageHeader,
  useMessage,
  darkTheme
} from "naive-ui";
import { useUserStore } from "../stores/user";
import { useAppStore } from "../stores/app";
import {
  UserOutlined,
  HomeOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  TeamOutlined,
  AppstoreOutlined,
  PictureOutlined,
} from "@vicons/antd";
import { RouterView } from "vue-router";

// Store
const userStore = useUserStore();
const appStore = useAppStore();

// 路由
const router = useRouter();

// UI组件
const message = useMessage();

// 页面标题
const pageTitle = ref("仪表盘");

// 计算属性
const menuOptions = computed(() => [
  {
    label: "仪表盘",
    key: "dashboard",
    icon: renderIcon(HomeOutlined),
    onClick: () => navigateTo("Overview", "")
  },
  {
    label: "用户管理",
    key: "users",
    icon: renderIcon(TeamOutlined),
    onClick: () => navigateTo("用户管理", "users")
  },
  {
    label: "社区内容管理",
    key: "content",
    icon: renderIcon(AppstoreOutlined),
    onClick: () => navigateTo("社区内容管理", "content")
  },
  {
    label: "活动管理",
    key: "activities",
    icon: renderIcon(PictureOutlined),
    onClick: () => navigateTo("活动管理", "activities")
  },
  {
    label: "消息通知管理",
    key: "notifications",
    icon: renderIcon(MessageOutlined),
    onClick: () => navigateTo("消息通知管理", "notifications")
  },
  {
    label: "数据分析",
    key: "analytics",
    // icon: renderIcon(ChartLineOutlined),
    onClick: () => navigateTo("数据分析", "analytics")
  },
  {
    label: "系统设置",
    key: "settings",
    icon: renderIcon(SettingOutlined),
    onClick: () => navigateTo("系统设置", "settings")
  }
]);

const userDropdownOptions = [
  {
    label: "个人信息",
    key: "profile",
    icon: renderIcon(UserOutlined)
  },
  {
    label: "系统设置",
    key: "settings",
    icon: renderIcon(SettingOutlined)
  },
  {
    type: "divider",
    key: "d1"
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogoutOutlined)
  }
];

// 当前激活的菜单项
const activeKey = ref("dashboard");

// 在组件挂载时检查登录状态
onMounted(() => {
  // 检查登录状态
  if (!userStore.checkLoginState()) {
    router.push("/login");
  }

  // 初始化应用设置
  appStore.initSettings();

  // 根据当前路由设置activeKey
  const path = router.currentRoute.value.path;
  if (path.includes("users")) {
    activeKey.value = "users";
    pageTitle.value = "用户管理";
  } else if (path.includes("content")) {
    activeKey.value = "content";
    pageTitle.value = "社区内容管理";
  } else if (path.includes("activities")) {
    activeKey.value = "activities";
    pageTitle.value = "活动管理";
  } else if (path.includes("notifications")) {
    activeKey.value = "notifications";
    pageTitle.value = "消息通知管理";
  } else if (path.includes("analytics")) {
    activeKey.value = "analytics";
    pageTitle.value = "数据分析";
  } else if (path.includes("settings")) {
    activeKey.value = "settings";
    pageTitle.value = "系统设置";
  } else {
    activeKey.value = "dashboard";
    pageTitle.value = "仪表盘";
  }
});

// 监听主题变化
watch(() => appStore.darkMode, (isDark) => {
  if (isDark) {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
});

// 处理用户下拉菜单选择
const handleUserSelect = (key: string) => {
  if (key === "logout") {
    userStore.logout();
    router.push("/login");
    message.success("退出登录成功");
  } else if (key === "settings") {
    router.push("/dashboard/settings");
  }
};

// 渲染图标
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// 导航到指定页面
const navigateTo = (title: string, path: string) => {
  pageTitle.value = title;
  router.push(`/dashboard/${path}`);
};
</script>

<template>
  <n-layout class="layout" :class="{ 'dark-theme': appStore.darkMode }">
    <n-layout-header class="header">
      <div class="header-left">
        <n-button quaternary circle @click="appStore.toggleSider">
          <n-icon size="20">
            <menu-unfold-outlined v-if="appStore.siderCollapsed" />
            <menu-fold-outlined v-else />
          </n-icon>
        </n-button>
        <h1 class="logo">听障交友后台管理系统</h1>
      </div>
      <div class="header-right">
        <n-space>
          <n-switch
            :value="appStore.darkMode"
            @update:value="appStore.toggleDarkMode"
            size="medium"
            v-slot="props"
          >
            <n-icon v-if="props.value" size="16" color="#FFCC33">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            </n-icon>
            <n-icon v-else size="16" color="#FFCC33">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            </n-icon>
          </n-switch>
          <n-badge :value="5" :max="99" type="error">
            <n-button quaternary circle>
              <n-icon size="20">
                <bell-outlined />
              </n-icon>
            </n-button>
          </n-badge>
          <n-dropdown
            trigger="click"
            :options="userDropdownOptions"
            @select="handleUserSelect"
          >
            <n-avatar
              round
              size="medium"
              class="avatar-btn"
              :src="userStore.userInfo?.avatar || ''"
            >
              {{ userStore.userInfo?.username.charAt(0).toUpperCase() || 'A' }}
            </n-avatar>
          </n-dropdown>
        </n-space>
      </div>
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="appStore.siderCollapsed"
        show-trigger
        @collapse="appStore.toggleSider"
        :theme="appStore.darkMode ? darkTheme : undefined"
        class="sider"
      >
        <n-menu
          :collapsed="appStore.siderCollapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :value="activeKey"
        />
      </n-layout-sider>
      <n-layout-content class="content">
        <n-page-header :title="pageTitle" />
        <div class="content-main">
          <router-view />
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.layout {
  height: 100vh;
}

.header {
  height: var(--header-height);
  padding: 0 16px;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all var(--transition-duration) ease;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  margin-left: 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}

.header-right {
  display: flex;
  align-items: center;
}

.avatar-btn {
  cursor: pointer;
  background-color: var(--primary-color);
}

.sider {
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  transition: all var(--transition-duration) ease;
}

.content {
  padding: 16px;
  background-color: var(--bg-color);
  transition: all var(--transition-duration) ease;
  height: calc(100vh - var(--header-height));
  overflow: auto;
}

.content-main {
  padding: 16px;
  background-color: var(--card-bg);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: calc(100% - 72px);
  margin-top: 16px;
}
</style>

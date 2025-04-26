<script setup lang="ts">
import { useRouter } from "vue-router";
import { NResult, NButton } from "naive-ui";
import { useAppStore } from "../stores/app";

const router = useRouter();
const appStore = useAppStore();

const goHome = () => {
  router.push("/dashboard");
};
</script>

<template>
  <div class="not-found" :class="{ 'dark-theme': appStore.darkMode }">
    <n-result
      status="404"
      title="404 页面丢失"
      description="您访问的页面不存在或已删除"
      size="large"
    >
      <template #footer>
        <n-button type="primary" @click="goHome">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color);
}
</style>

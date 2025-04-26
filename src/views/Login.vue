<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NCheckbox,
  NIcon,
  NResult,
  useMessage
} from "naive-ui";
import {
  UserOutlined,
  LockOutlined,
  SoundOutlined
} from "@vicons/antd";
import { useUserStore } from "../stores/user";
import { useAppStore } from "../stores/app";
import gsap from "gsap";

// 获取router和store
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const message = useMessage();

// 登录表单数据
const model = reactive({
  username: "",
  password: "",
  rememberMe: false
});

// 登录状态
const loading = ref(false);
const error = ref("");

// 验证规则
const rules = {
  username: {
    required: true,
    message: "请输入用户名",
    trigger: "blur"
  },
  password: {
    required: true,
    message: "请输入密码",
    trigger: "blur"
  }
};

// 组件引用
const formRef = ref(null);
const cardRef = ref(null);
const titleRef = ref(null);
const formContentRef = ref(null);

// 处理登录
const handleLogin = () => {
  if (formRef.value) {
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        try {
          loading.value = true;
          error.value = "";

          // 调用登录
          await userStore.login(model.username, model.password);

          // 登录成功
          message.success("登录成功");
          router.push("/dashboard");
        } catch (err: any) {
          error.value = err.message || "登录失败，请检查用户名和密码";
          message.error(error.value);
        } finally {
          loading.value = false;
        }
      }
    });
  }
};

// 在组件挂载时添加动画
onMounted(() => {
  // 初始化设置
  appStore.initSettings();

  // 应用暗色模式
  if (appStore.darkMode) {
    document.body.classList.add('dark-theme');
  }

  // 卡片动画
  gsap.from(cardRef.value, {
    duration: 0.8,
    opacity: 0,
    y: 30,
    ease: "power2.out"
  });

  // 标题动画
  gsap.from(titleRef.value, {
    duration: 0.8,
    opacity: 0,
    y: 20,
    delay: 0.3,
    ease: "power2.out"
  });

  // 表单内容动画
  gsap.from(formContentRef.value, {
    duration: 0.8,
    opacity: 0,
    y: 20,
    delay: 0.5,
    ease: "power2.out"
  });
});
</script>

<template>
  <div class="login-container" :class="{ 'dark-theme': appStore.darkMode }">
    <div class="login-card" ref="cardRef">
      <n-card class="login-form-card">
        <div class="login-header" ref="titleRef">
          <div class="logo-container">
            <n-icon size="36" color="#7269ef">
              <sound-outlined />
            </n-icon>
          </div>
          <h1 class="login-title">听障交友管理系统</h1>
          <p class="login-subtitle">后台管理系统</p>
        </div>

        <div ref="formContentRef" class="form-container">
          <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            size="large"
            label-placement="left"
          >
            <n-form-item path="username">
              <n-input
                v-model:value="model.username"
                placeholder="用户名 (admin)"
                clearable
              >
                <template #prefix>
                  <n-icon size="18">
                    <user-outlined />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="password">
              <n-input
                v-model:value="model.password"
                type="password"
                placeholder="密码 (admin123)"
                clearable
                show-password-on="click"
              >
                <template #prefix>
                  <n-icon size="18">
                    <lock-outlined />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <div class="login-options">
              <n-checkbox v-model:checked="model.rememberMe">
                记住我
              </n-checkbox>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>

            <n-button
              type="primary"
              block
              :loading="loading"
              @click="handleLogin"
              class="login-button"
            >
              登 录
            </n-button>
          </n-form>

          <div v-if="error" class="login-error">
            <n-result size="small" status="error" :description="error" />
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  background-image: linear-gradient(135deg, rgba(114, 105, 239, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%);
  transition: all var(--transition-duration) ease;
}

.login-card {
  width: 420px;
  max-width: 90%;
}

.login-form-card {
  background-color: var(--card-bg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: all var(--transition-duration) ease;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.login-title {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 8px;
  font-weight: 600;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.8;
}

.form-container {
  padding: 8px 0;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  background-color: var(--primary-color);
  transition: all 0.3s ease;
  height: 44px;
  font-size: 16px;
}

.login-button:hover {
  background-color: var(--primary-color-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(114, 105, 239, 0.2);
}

.login-error {
  margin-top: 16px;
}
</style>

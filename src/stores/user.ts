import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  // 用户信息
  const userInfo = ref<{
    id: string;
    username: string;
    avatar: string;
    role: string;
    token: string;
  } | null>(null);

  // 是否已登录
  const isLoggedIn = ref(false);

  // 登录方法
  const login = (username: string, password: string) => {
    // 模拟API调用
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // 模拟登录成功
        if (username === "admin" && password === "admin123") {
          userInfo.value = {
            id: "1",
            username: "admin",
            avatar: "",
            role: "admin",
            token: "mock-token-" + Math.random().toString(36).substring(2, 15),
          };
          isLoggedIn.value = true;
          localStorage.setItem("token", userInfo.value.token);
          resolve();
        } else {
          reject(new Error("用户名或密码错误"));
        }
      }, 800);
    });
  };

  // 退出登录
  const logout = () => {
    userInfo.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem("token");
  };

  // 检查登录状态
  const checkLoginState = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // 实际应用中应该调用API验证token
      userInfo.value = {
        id: "1",
        username: "admin",
        avatar: "",
        role: "admin",
        token,
      };
      isLoggedIn.value = true;
      return true;
    }
    return false;
  };

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    checkLoginState,
  };
});

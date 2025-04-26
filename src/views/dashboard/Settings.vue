<script setup lang="ts">
import { ref, h } from "vue";
import {
  NCard,
  NSpace,
  NButton,
  NInput,
  NInputNumber,
  NForm,
  NFormItem,
  NTabs,
  NTabPane,
  NSwitch,
  NSelect,
  NList,
  NListItem,
  NDivider,
  NTag,
  NModal,
  NAvatar,
  NIcon,
  NPopconfirm,
  NDataTable,
  useMessage
} from "naive-ui";
import {
  UserOutlined,
  LockOutlined,
  SettingOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined
} from "@vicons/antd";
import { useAppStore } from "../../stores/app";

const appStore = useAppStore();
const message = useMessage();

// 系统设置表单
const systemSettings = ref({
  siteName: "听障交友平台",
  siteDescription: "为听障人士提供社交和学习的专业平台",
  logo: "/logo.png",
  recordsPerPage: 10,
  allowRegistration: true,
  requireEmailVerification: true,
  userDefaultQuota: 50,
  userDefaultRole: "user",
  maintenance: false,
  maintenanceMessage: "系统维护中，请稍后再试...",
  contactEmail: "admin@example.com",
  smtpHost: "smtp.example.com",
  smtpPort: 587,
  smtpUser: "notification@example.com",
  smtpPassword: "********",
  filesAllowedTypes: "jpg,jpeg,png,gif,mp4,pdf,doc,docx",
  maxFileSize: 10
});

// 管理员用户列表
const adminUsers = ref([
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    role: "superadmin",
    lastLogin: "2025-04-25 10:30:22",
    status: "active"
  },
  {
    id: 2,
    username: "moderator1",
    email: "moderator1@example.com",
    role: "moderator",
    lastLogin: "2025-04-24 15:45:36",
    status: "active"
  },
  {
    id: 3,
    username: "editor1",
    email: "editor1@example.com",
    role: "editor",
    lastLogin: "2025-04-23 09:20:15",
    status: "active"
  },
  {
    id: 4,
    username: "analyst1",
    email: "analyst1@example.com",
    role: "analyst",
    lastLogin: "2025-04-22 14:10:05",
    status: "inactive"
  }
]);

// 系统日志
const systemLogs = ref([
  {
    id: 1,
    time: "2025-04-25 10:30:22",
    level: "info",
    message: "管理员登录成功",
    user: "admin"
  },
  {
    id: 2,
    time: "2025-04-25 09:15:10",
    level: "warning",
    message: "用户尝试访问未授权资源",
    user: "user123"
  },
  {
    id: 3,
    time: "2025-04-24 18:22:45",
    level: "error",
    message: "数据库连接失败",
    user: "system"
  },
  {
    id: 4,
    time: "2025-04-24 16:40:12",
    level: "info",
    message: "系统备份完成",
    user: "system"
  },
  {
    id: 5,
    time: "2025-04-24 12:05:33",
    level: "info",
    message: "用户内容审核通过",
    user: "moderator1"
  }
]);

// 管理员用户表格列
const adminColumns = [
  {
    title: "ID",
    key: "id",
    width: 60
  },
  {
    title: "用户名",
    key: "username",
    width: 120
  },
  {
    title: "邮箱",
    key: "email",
    width: 200
  },
  {
    title: "角色",
    key: "role",
    width: 120,
    render(row: any) {
      const roleMap: Record<string, { type: string; text: string }> = {
        superadmin: { type: "error", text: "超级管理员" },
        admin: { type: "warning", text: "管理员" },
        moderator: { type: "success", text: "内容审核员" },
        editor: { type: "info", text: "编辑" },
        analyst: { type: "default", text: "数据分析师" }
      };
      const role = roleMap[row.role] || { type: "default", text: row.role };
      return h(NTag, { type: role.type as any, size: "small" }, { default: () => role.text });
    }
  },
  {
    title: "最后登录",
    key: "lastLogin",
    width: 160
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    render(row: any) {
      return h(
        NTag,
        {
          type: row.status === "active" ? "success" : "warning",
          size: "small"
        },
        { default: () => row.status === "active" ? "活跃" : "非活跃" }
      );
    }
  },
  {
    title: "操作",
    key: "actions",
    width: 200,
    render(row: any) {
      return h(
        NSpace,
        { align: "center" },
        {
          default: () => [
            h(
              NButton,
              {
                type: "info",
                size: "small",
                ghost: true,
                onClick: () => showEditAdminModal(row)
              },
              { default: () => "编辑" }
            ),
            h(
              NButton,
              {
                type: "warning",
                size: "small",
                ghost: true,
                disabled: row.role === "superadmin",
                onClick: () => resetPassword(row.id)
              },
              { default: () => "重置密码" }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => deleteAdmin(row.id),
                disabled: row.role === "superadmin"
              },
              {
                trigger: () => h(
                  NButton,
                  {
                    type: "error",
                    size: "small",
                    ghost: true,
                    disabled: row.role === "superadmin"
                  },
                  {
                    icon: () => h(NIcon, null, { default: () => h(DeleteOutlined) }),
                    default: () => "删除"
                  }
                ),
                default: () => "确定要删除此管理员吗？"
              }
            )
          ]
        }
      );
    }
  }
];

// 日志表格列
const logColumns = [
  {
    title: "ID",
    key: "id",
    width: 60
  },
  {
    title: "时间",
    key: "time",
    width: 180
  },
  {
    title: "级别",
    key: "level",
    width: 100,
    render(row: any) {
      const levelMap: Record<string, { type: string }> = {
        info: { type: "info" },
        warning: { type: "warning" },
        error: { type: "error" },
        success: { type: "success" }
      };
      const level = levelMap[row.level] || { type: "default" };
      return h(NTag, { type: level.type as any, size: "small" }, { default: () => row.level });
    }
  },
  {
    title: "消息",
    key: "message",
    width: 300
  },
  {
    title: "用户",
    key: "user",
    width: 120
  }
];

// 分页设置
const pagination = {
  pageSize: 10
};

// 编辑管理员模态框
const showAdminModal = ref(false);
const isEditMode = ref(false);
const currentAdmin = ref({
  id: 0,
  username: "",
  email: "",
  role: "moderator",
  password: "",
  confirmPassword: ""
});

// 显示编辑管理员模态框
const showEditAdminModal = (admin: any) => {
  isEditMode.value = true;
  currentAdmin.value = { ...admin, password: "", confirmPassword: "" };
  showAdminModal.value = true;
};

// 显示添加管理员模态框
const showAddAdminModal = () => {
  isEditMode.value = false;
  currentAdmin.value = {
    id: 0,
    username: "",
    email: "",
    role: "moderator",
    password: "",
    confirmPassword: ""
  };
  showAdminModal.value = true;
};

// 保存系统设置
const saveSystemSettings = () => {
  message.success("系统设置已保存");
};

// 保存管理员
const saveAdmin = () => {
  if (currentAdmin.value.password !== currentAdmin.value.confirmPassword) {
    message.error("两次输入的密码不一致");
    return;
  }

  if (isEditMode.value) {
    const index = adminUsers.value.findIndex(u => u.id === currentAdmin.value.id);
    if (index !== -1) {
      adminUsers.value[index] = {
        ...adminUsers.value[index],
        username: currentAdmin.value.username,
        email: currentAdmin.value.email,
        role: currentAdmin.value.role
      };
      message.success("管理员信息已更新");
    }
  } else {
    const newId = Math.max(...adminUsers.value.map(u => u.id)) + 1;
    adminUsers.value.push({
      id: newId,
      username: currentAdmin.value.username,
      email: currentAdmin.value.email,
      role: currentAdmin.value.role,
      lastLogin: "-",
      status: "active"
    });
    message.success("管理员已添加");
  }

  showAdminModal.value = false;
};

// 重置密码
const resetPassword = (id: number) => {
  message.success(`已向管理员ID ${id} 的邮箱发送密码重置链接`);
};

// 删除管理员
const deleteAdmin = (id: number) => {
  adminUsers.value = adminUsers.value.filter(admin => admin.id !== id);
  message.success("管理员已删除");
};

// 角色选项
const roleOptions = [
  { label: "超级管理员", value: "superadmin" },
  { label: "管理员", value: "admin" },
  { label: "内容审核员", value: "moderator" },
  { label: "编辑", value: "editor" },
  { label: "数据分析师", value: "analyst" }
];
</script>

<template>
  <div :class="{ 'dark-theme': appStore.darkMode }">
    <n-tabs type="card" animated>
      <!-- 基础设置 -->
      <n-tab-pane name="basic" tab="基础设置">
        <n-card>
          <n-form
            :model="systemSettings"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="网站名称" path="siteName">
              <n-input v-model:value="systemSettings.siteName" />
            </n-form-item>

            <n-form-item label="网站描述" path="siteDescription">
              <n-input v-model:value="systemSettings.siteDescription" type="textarea" />
            </n-form-item>

            <n-form-item label="每页记录数" path="recordsPerPage">
              <n-input-number v-model:value="systemSettings.recordsPerPage" :min="5" :max="100" />
            </n-form-item>

            <n-form-item label="允许注册" path="allowRegistration">
              <n-switch v-model:value="systemSettings.allowRegistration" />
            </n-form-item>

            <n-form-item label="要求邮箱验证" path="requireEmailVerification">
              <n-switch v-model:value="systemSettings.requireEmailVerification" />
            </n-form-item>

            <n-form-item label="维护模式" path="maintenance">
              <n-switch v-model:value="systemSettings.maintenance" />
            </n-form-item>

            <n-form-item v-if="systemSettings.maintenance" label="维护提示信息" path="maintenanceMessage">
              <n-input v-model:value="systemSettings.maintenanceMessage" type="textarea" />
            </n-form-item>

            <n-form-item label="联系邮箱" path="contactEmail">
              <n-input v-model:value="systemSettings.contactEmail" />
            </n-form-item>

            <n-divider>文件上传设置</n-divider>

            <n-form-item label="允许的文件类型" path="filesAllowedTypes">
              <n-input v-model:value="systemSettings.filesAllowedTypes" placeholder="用逗号分隔，例如：jpg,png,pdf" />
            </n-form-item>

            <n-form-item label="最大文件大小(MB)" path="maxFileSize">
              <n-input-number v-model:value="systemSettings.maxFileSize" :min="1" :max="100" />
            </n-form-item>

            <n-space justify="end">
              <n-button type="primary" @click="saveSystemSettings">
                <template #icon>
                  <n-icon>
                    <save-outlined />
                  </n-icon>
                </template>
                保存设置
              </n-button>
            </n-space>
          </n-form>
        </n-card>
      </n-tab-pane>

      <!-- 邮件设置 -->
      <n-tab-pane name="email" tab="邮件设置">
        <n-card>
          <n-form
            :model="systemSettings"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="SMTP服务器" path="smtpHost">
              <n-input v-model:value="systemSettings.smtpHost" />
            </n-form-item>

            <n-form-item label="SMTP端口" path="smtpPort">
              <n-input-number v-model:value="systemSettings.smtpPort" :min="1" :max="65535" />
            </n-form-item>

            <n-form-item label="SMTP用户名" path="smtpUser">
              <n-input v-model:value="systemSettings.smtpUser" />
            </n-form-item>

            <n-form-item label="SMTP密码" path="smtpPassword">
              <n-input
                v-model:value="systemSettings.smtpPassword"
                type="password"
                show-password-on="click"
              />
            </n-form-item>

            <n-space justify="end">
              <n-button>发送测试邮件</n-button>
              <n-button type="primary" @click="saveSystemSettings">
                <template #icon>
                  <n-icon>
                    <save-outlined />
                  </n-icon>
                </template>
                保存设置
              </n-button>
            </n-space>
          </n-form>
        </n-card>
      </n-tab-pane>

      <!-- 管理员设置 -->
      <n-tab-pane name="admins" tab="管理员设置">
        <n-card>
          <n-space justify="end" style="margin-bottom: 16px;">
            <n-button type="primary" @click="showAddAdminModal">
              <template #icon>
                <n-icon>
                  <plus-outlined />
                </n-icon>
              </template>
              添加管理员
            </n-button>
          </n-space>

          <n-data-table
            :columns="adminColumns"
            :data="adminUsers"
            :pagination="pagination"
            :bordered="false"
          />
        </n-card>
      </n-tab-pane>

      <!-- 系统日志 -->
      <n-tab-pane name="logs" tab="系统日志">
        <n-card>
          <n-data-table
            :columns="logColumns"
            :data="systemLogs"
            :pagination="pagination"
            :bordered="false"
          />
        </n-card>
      </n-tab-pane>
    </n-tabs>

    <!-- 添加/编辑管理员模态框 -->
    <n-modal
      v-model:show="showAdminModal"
      :title="isEditMode ? '编辑管理员' : '添加管理员'"
      preset="card"
      :style="{ width: '500px' }"
    >
      <n-form
        :model="currentAdmin"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="用户名" path="username" required>
          <n-input v-model:value="currentAdmin.username" placeholder="请输入用户名" />
        </n-form-item>

        <n-form-item label="邮箱" path="email" required>
          <n-input v-model:value="currentAdmin.email" placeholder="请输入邮箱" />
        </n-form-item>

        <n-form-item label="角色" path="role" required>
          <n-select v-model:value="currentAdmin.role" :options="roleOptions" />
        </n-form-item>

        <n-form-item
          v-if="!isEditMode"
          label="密码"
          path="password"
          required
        >
          <n-input
            v-model:value="currentAdmin.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
          />
        </n-form-item>

        <n-form-item
          v-if="!isEditMode"
          label="确认密码"
          path="confirmPassword"
          required
        >
          <n-input
            v-model:value="currentAdmin.confirmPassword"
            type="password"
            show-password-on="click"
            placeholder="请再次输入密码"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showAdminModal = false">取消</n-button>
          <n-button type="primary" @click="saveAdmin">
            确定
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<style scoped>
.n-form-item {
  margin-bottom: 18px;
}

.role-tag {
  margin-right: 8px;
}
</style>

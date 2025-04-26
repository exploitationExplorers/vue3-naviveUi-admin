<script setup lang="ts">
import { ref, h, reactive, onMounted } from "vue";
import {
  NCard,
  NDataTable,
  NButton,
  NSpace,
  NInput,
  NSelect,
  NPopconfirm,
  NModal,
  NForm,
  NFormItem,
  NTag,
  NAvatar,
  NDrawer,
  NDrawerContent,
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NIcon
} from "naive-ui";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from "@vicons/antd";
import { useMessage } from "naive-ui";

// 消息组件
const message = useMessage();

// 用户列表数据
const userList = ref([
  {
    id: 1,
    name: "张明",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    gender: "男",
    age: 28,
    email: "zhangming@example.com",
    phone: "13812345678",
    joinDate: "2025-01-15",
    lastActive: "2025-04-24",
    status: "active",
    userType: "regular",
    interests: ["音乐", "电影", "旅行"],
    hearingLevel: "中度听障"
  },
  {
    id: 2,
    name: "李华",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    gender: "男",
    age: 32,
    email: "lihua@example.com",
    phone: "13987654321",
    joinDate: "2025-02-18",
    lastActive: "2025-04-23",
    status: "active",
    userType: "vip",
    interests: ["体育", "摄影", "烹饪"],
    hearingLevel: "轻度听障"
  },
  {
    id: 3,
    name: "王芳",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    gender: "女",
    age: 25,
    email: "wangfang@example.com",
    phone: "13576548901",
    joinDate: "2025-03-05",
    lastActive: "2025-04-10",
    status: "inactive",
    userType: "regular",
    interests: ["绘画", "阅读", "手工"],
    hearingLevel: "重度听障"
  },
  {
    id: 4,
    name: "陈晓",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    gender: "男",
    age: 30,
    email: "chenxiao@example.com",
    phone: "13609873214",
    joinDate: "2025-01-28",
    lastActive: "2025-04-25",
    status: "active",
    userType: "vip",
    interests: ["电影", "游戏", "旅行"],
    hearingLevel: "中度听障"
  },
  {
    id: 5,
    name: "林小雨",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    gender: "女",
    age: 22,
    email: "linxiaoyu@example.com",
    phone: "13745678932",
    joinDate: "2025-04-01",
    lastActive: "2025-04-22",
    status: "active",
    userType: "regular",
    interests: ["音乐", "舞蹈", "美食"],
    hearingLevel: "轻度听障"
  }
]);

// 表格加载状态
const loading = ref(false);

// 检索条件
const searchParams = reactive({
  keyword: "",
  status: null,
  userType: null
});

// 用户状态选项
const statusOptions = [
  {
    label: "全部状态",
    value: null
  },
  {
    label: "活跃",
    value: "active"
  },
  {
    label: "非活跃",
    value: "inactive"
  },
  {
    label: "已冻结",
    value: "suspended"
  }
];

// 用户类型选项
const userTypeOptions = [
  {
    label: "全部类型",
    value: null
  },
  {
    label: "普通用户",
    value: "regular"
  },
  {
    label: "VIP用户",
    value: "vip"
  }
];

// 表格分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});

// 表格列定义
const columns = [
  {
    title: "用户信息",
    key: "name",
    width: 180,
    fixed: 'left',
    render(row: any) {
      return h(
        NSpace,
        { align: "center" },
        {
          default: () => [
            h(NAvatar, {
              src: row.avatar,
              size: "small",
              round: true
            }),
            h('div', { style: { display: 'flex', flexDirection: 'column' } }, [
              h('div', { style: { fontWeight: 'bold' } }, row.name),
              h('div', { style: { fontSize: '12px', opacity: '0.7' } }, row.email)
            ])
          ]
        }
      );
    }
  },
  {
    title: "性别",
    key: "gender",
    width: 80
  },
  {
    title: "年龄",
    key: "age",
    width: 80
  },
  {
    title: "注册日期",
    key: "joinDate",
    width: 110
  },
  {
    title: "最后活跃",
    key: "lastActive",
    width: 110
  },
  {
    title: "账户状态",
    key: "status",
    width: 100,
    render(row: any) {
      const statusMap: Record<string, { type: string; text: string }> = {
        active: { type: "success", text: "活跃" },
        inactive: { type: "warning", text: "非活跃" },
        suspended: { type: "error", text: "已冻结" }
      };
      const status = statusMap[row.status] || { type: "default", text: row.status };
      return h(NTag, { type: status.type as any, size: "small" }, { default: () => status.text });
    }
  },
  {
    title: "类型",
    key: "userType",
    width: 100,
    render(row: any) {
      const typeMap: Record<string, { type: string; text: string }> = {
        regular: { type: "default", text: "普通用户" },
        vip: { type: "primary", text: "VIP用户" }
      };
      const type = typeMap[row.userType] || { type: "default", text: row.userType };
      return h(NTag, { type: type.type as any, size: "small" }, { default: () => type.text });
    }
  },
  {
    title: "听障等级",
    key: "hearingLevel",
    width: 110
  },
  {
    title: "操作",
    key: "actions",
    width: 150,
    fixed: 'right',
    render(row: any) {
      return h(
        NSpace,
        {
          align: "center",
          style: {
            display: 'inline-flex'
          }
        },
        {
          default: () => [
            h(
              NButton,
              {
                type: "primary",
                size: "small",
                ghost: true,
                onClick: () => showUserDetail(row)
              },
              { default: () => "查看" }
            ),
            h(
              NButton,
              {
                type: "info",
                size: "small",
                ghost: true,
                onClick: () => openEditModal(row)
              },
              {
                icon: () => h(NIcon, null, { default: () => h(EditOutlined) }),
                default: () => "编辑"
              }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => deleteUser(row.id)
              },
              {
                trigger: () => h(
                  NButton,
                  {
                    type: "error",
                    size: "small",
                    ghost: true
                  },
                  {
                    icon: () => h(NIcon, null, { default: () => h(DeleteOutlined) }),
                    default: () => "删除"
                  }
                ),
                default: () => "确定要删除此用户吗？"
              }
            )
          ]
        }
      );
    }
  }
];

// 用户表单
const userForm = reactive({
  id: null,
  name: "",
  gender: "",
  age: null,
  email: "",
  phone: "",
  status: "active",
  userType: "regular",
  hearingLevel: ""
});

// 抽屉和模态框状态
const showDrawer = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);
const currentUser = ref(null);

// 打开用户详情抽屉
const showUserDetail = (user: any) => {
  currentUser.value = user;
  showDrawer.value = true;
};

// 打开编辑模态框
const openEditModal = (user: any) => {
  isEditMode.value = true;
  Object.assign(userForm, user);
  showModal.value = true;
};

// 打开新增模态框
const openAddModal = () => {
  isEditMode.value = false;
  // 重置表单
  userForm.id = null;
  userForm.name = "";
  userForm.gender = "男";
  userForm.age = null;
  userForm.email = "";
  userForm.phone = "";
  userForm.status = "active";
  userForm.userType = "regular";
  userForm.hearingLevel = "轻度听障";

  showModal.value = true;
};

// 删除用户
const deleteUser = (id: number) => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    userList.value = userList.value.filter(user => user.id !== id);
    message.success("删除成功");
    loading.value = false;
  }, 500);
};

// 保存用户
const saveUser = () => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    if (isEditMode.value) {
      // 编辑模式
      const index = userList.value.findIndex(u => u.id === userForm.id);
      if (index !== -1) {
        userList.value[index] = { ...userList.value[index], ...userForm };
        message.success("更新成功");
      }
    } else {
      // 新增模式
      const newId = Math.max(...userList.value.map(u => u.id)) + 1;
      const newUser = {
        ...userForm,
        id: newId,
        avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        interests: []
      };
      userList.value.unshift(newUser);
      message.success("添加成功");
    }
    showModal.value = false;
    loading.value = false;
  }, 500);
};

// 搜索用户
const searchUsers = () => {
  loading.value = true;
  // 模拟API调用
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// 重置搜索条件
const resetSearch = () => {
  searchParams.keyword = "";
  searchParams.status = null;
  searchParams.userType = null;
  searchUsers();
};

// 组件挂载
onMounted(() => {
  // 加载初始数据
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<template>
  <div>
    <n-card class="search-card">
      <n-space justify="space-between">
        <n-space>
          <n-input
            v-model:value="searchParams.keyword"
            placeholder="搜索用户名/邮箱/电话"
            clearable
            style="width: 250px"
          >
            <template #prefix>
              <n-icon>
                <search-outlined />
              </n-icon>
            </template>
          </n-input>

          <n-select
            v-model:value="searchParams.status"
            :options="statusOptions"
            placeholder="状态"
            clearable
            style="width: 130px"
          />

          <n-select
            v-model:value="searchParams.userType"
            :options="userTypeOptions"
            placeholder="用户类型"
            clearable
            style="width: 130px"
          />

          <n-button type="primary" @click="searchUsers">搜索</n-button>
          <n-button @click="resetSearch">重置</n-button>
        </n-space>

        <n-button type="primary" @click="openAddModal">
          <template #icon>
            <n-icon>
              <plus-outlined />
            </n-icon>
          </template>
          添加用户
        </n-button>
      </n-space>
    </n-card>

    <n-card class="table-card">
      <n-data-table
        :columns="columns"
        :data="userList"
        :loading="loading"
        :pagination="pagination"
        :bordered="false"
        stripe
        size="medium"
      />
    </n-card>

    <!-- 用户详情抽屉 -->
    <n-drawer v-model:show="showDrawer" :width="500" placement="right">
      <n-drawer-content v-if="currentUser" :title="`${currentUser.name} 的详细资料`">
        <n-space vertical>
          <div class="user-profile-header">
            <n-avatar
              :src="currentUser.avatar"
              size="large"
              round
              :style="{ marginRight: '12px' }"
            />
            <div>
              <h3 style="margin: 0">{{ currentUser.name }}</h3>
              <n-tag :type="currentUser.userType === 'vip' ? 'primary' : 'default'" size="small">
                {{ currentUser.userType === 'vip' ? 'VIP用户' : '普通用户' }}
              </n-tag>
              <n-tag
                :type="
                  currentUser.status === 'active'
                    ? 'success'
                    : currentUser.status === 'inactive'
                    ? 'warning'
                    : 'error'
                "
                style="margin-left: 8px"
                size="small"
              >
                {{
                  currentUser.status === 'active'
                    ? '活跃'
                    : currentUser.status === 'inactive'
                    ? '非活跃'
                    : '已冻结'
                }}
              </n-tag>
            </div>
          </div>

          <n-divider />

          <n-descriptions label-placement="left" bordered>
            <n-descriptions-item label="性别">
              {{ currentUser.gender }}
            </n-descriptions-item>
            <n-descriptions-item label="年龄">
              {{ currentUser.age }}
            </n-descriptions-item>
            <n-descriptions-item label="听障等级">
              {{ currentUser.hearingLevel }}
            </n-descriptions-item>
            <n-descriptions-item label="联系电话">
              <n-space align="center">
                <n-icon>
                  <phone-outlined />
                </n-icon>
                {{ currentUser.phone }}
              </n-space>
            </n-descriptions-item>
            <n-descriptions-item label="电子邮箱">
              <n-space align="center">
                <n-icon>
                  <mail-outlined />
                </n-icon>
                {{ currentUser.email }}
              </n-space>
            </n-descriptions-item>
            <n-descriptions-item label="注册日期">
              {{ currentUser.joinDate }}
            </n-descriptions-item>
            <n-descriptions-item label="最后活跃时间">
              {{ currentUser.lastActive }}
            </n-descriptions-item>
            <n-descriptions-item label="兴趣爱好">
              <n-space>
                <n-tag
                  v-for="interest in currentUser.interests"
                  :key="interest"
                  size="small"
                  type="success"
                >
                  {{ interest }}
                </n-tag>
              </n-space>
            </n-descriptions-item>
          </n-descriptions>

          <n-space justify="end">
            <n-button type="primary" @click="openEditModal(currentUser)">编辑资料</n-button>
            <n-button @click="showDrawer = false">关闭</n-button>
          </n-space>
        </n-space>
      </n-drawer-content>
    </n-drawer>

    <!-- 编辑/添加用户模态框 -->
    <n-modal
      v-model:show="showModal"
      :title="isEditMode ? '编辑用户' : '添加用户'"
      preset="card"
      :style="{ width: '500px' }"
    >
      <n-form
        :model="userForm"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="姓名" path="name" required>
          <n-input v-model:value="userForm.name" placeholder="请输入姓名" />
        </n-form-item>

        <n-form-item label="性别" path="gender">
          <n-select
            v-model:value="userForm.gender"
            :options="[
              { label: '男', value: '男' },
              { label: '女', value: '女' },
              { label: '其他', value: '其他' }
            ]"
          />
        </n-form-item>

        <n-form-item label="年龄" path="age">
          <n-input
            v-model:value="userForm.age"
            placeholder="请输入年龄"
            type="number"
          />
        </n-form-item>

        <n-form-item label="邮箱" path="email" required>
          <n-input
            v-model:value="userForm.email"
            placeholder="请输入电子邮箱"
            type="email"
          />
        </n-form-item>

        <n-form-item label="电话" path="phone">
          <n-input
            v-model:value="userForm.phone"
            placeholder="请输入联系电话"
          />
        </n-form-item>

        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="userForm.status"
            :options="[
              { label: '活跃', value: 'active' },
              { label: '非活跃', value: 'inactive' },
              { label: '已冻结', value: 'suspended' }
            ]"
          />
        </n-form-item>

        <n-form-item label="用户类型" path="userType">
          <n-select
            v-model:value="userForm.userType"
            :options="[
              { label: '普通用户', value: 'regular' },
              { label: 'VIP用户', value: 'vip' }
            ]"
          />
        </n-form-item>

        <n-form-item label="听障等级" path="hearingLevel">
          <n-select
            v-model:value="userForm.hearingLevel"
            :options="[
              { label: '轻度听障', value: '轻度听障' },
              { label: '中度听障', value: '中度听障' },
              { label: '重度听障', value: '重度听障' },
              { label: '极重度听障', value: '极重度听障' }
            ]"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button
            type="primary"
            :loading="loading"
            @click="saveUser"
          >
            保存
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.user-profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
</style>

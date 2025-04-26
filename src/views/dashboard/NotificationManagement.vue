<script setup lang="ts">
import { ref, h } from "vue";
import { NCard, NSpace, NButton, NDataTable, NTag, NInput, NSelect, NPopconfirm, NIcon, NBadge } from "naive-ui";
import { SearchOutlined, PlusOutlined, DeleteOutlined, BellOutlined } from "@vicons/antd";
import { useAppStore } from "../../stores/app";

const appStore = useAppStore();

// 通知数据
const notificationList = ref([
  {
    id: 1,
    title: "系统更新通知",
    content: "亲爱的用户，我们的系统将于2025年5月15日进行更新维护，期间可能会有短暂的服务中断，请您谅解。",
    type: "system",
    target: "all",
    sendTime: "2025-04-10 10:30:00",
    status: "sent",
    readCount: 986
  },
  {
    id: 2,
    title: "新活动邀请",
    content: "我们将于下周六举办'手语学习工作坊'活动，欢迎您报名参加！",
    type: "activity",
    target: "regular",
    sendTime: "2025-04-15 14:20:00",
    status: "sent",
    readCount: 542
  },
  {
    id: 3,
    title: "会员权益更新",
    content: "尊敬的VIP会员，我们为您更新了一系列专属权益，包括更多的交友机会和专属活动。",
    type: "member",
    target: "vip",
    sendTime: "2025-04-18 09:15:00",
    status: "sent",
    readCount: 215
  },
  {
    id: 4,
    title: "内容审核提醒",
    content: "您发布的内容'如何学习手语'已通过审核，感谢您的分享。",
    type: "content",
    target: "user:10023",
    sendTime: "2025-04-20 16:45:00",
    status: "sent",
    readCount: 1
  },
  {
    id: 5,
    title: "节日问候",
    content: "在即将到来的五一劳动节，祝愿所有用户节日快乐！",
    type: "greeting",
    target: "all",
    sendTime: "",
    status: "draft",
    readCount: 0
  }
]);

// 表格列定义
const columns = [
  {
    title: "ID",
    key: "id",
    width: 60
  },
  {
    title: "标题",
    key: "title",
    width: 150,
    render(row: any) {
      return h(
        NSpace,
        { align: "center" },
        {
          default: () => [
            h(NBadge, {
              dot: true,
              color: row.type === 'system' ? 'error' :
                     row.type === 'activity' ? 'success' :
                     row.type === 'member' ? 'warning' :
                     row.type === 'greeting' ? 'info' : 'default'
            }, {
              default: () => h(BellOutlined)
            }),
            h('span', { style: { marginLeft: '8px' } }, row.title)
          ]
        }
      );
    }
  },
  {
    title: "内容摘要",
    key: "content",
    width: 250,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "通知类型",
    key: "type",
    width: 100,
    render(row: any) {
      const typeMap: Record<string, { type: string; text: string }> = {
        system: { type: "error", text: "系统通知" },
        activity: { type: "success", text: "活动通知" },
        member: { type: "warning", text: "会员通知" },
        content: { type: "info", text: "内容通知" },
        greeting: { type: "default", text: "问候通知" }
      };
      const type = typeMap[row.type] || { type: "default", text: row.type };
      return h(NTag, { type: type.type as any, size: "small" }, { default: () => type.text });
    }
  },
  {
    title: "目标用户",
    key: "target",
    width: 120,
    render(row: any) {
      if (row.target === 'all') {
        return "所有用户";
      } else if (row.target === 'regular') {
        return "普通用户";
      } else if (row.target === 'vip') {
        return "VIP用户";
      } else if (row.target.startsWith('user:')) {
        return `用户ID: ${row.target.split(':')[1]}`;
      }
      return row.target;
    }
  },
  {
    title: "发送时间",
    key: "sendTime",
    width: 150
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    render(row: any) {
      const statusMap: Record<string, { type: string; text: string }> = {
        sent: { type: "success", text: "已发送" },
        draft: { type: "warning", text: "草稿" },
        scheduled: { type: "info", text: "计划中" },
        failed: { type: "error", text: "发送失败" }
      };
      const status = statusMap[row.status] || { type: "default", text: row.status };
      return h(NTag, { type: status.type as any, size: "small" }, { default: () => status.text });
    }
  },
  {
    title: "已读数",
    key: "readCount",
    width: 80
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
                type: "primary",
                size: "small",
                ghost: true
              },
              { default: () => "查看" }
            ),
            row.status === 'draft' ? h(
              NButton,
              {
                type: "success",
                size: "small",
                ghost: true
              },
              { default: () => "发送" }
            ) : null,
            h(
              NButton,
              {
                type: "info",
                size: "small",
                ghost: true,
                disabled: row.status === 'sent'
              },
              { default: () => "编辑" }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => {}
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
                default: () => "确定要删除此通知吗？"
              }
            )
          ]
        }
      );
    }
  }
];

// 搜索参数
const searchParams = ref({
  keyword: "",
  type: null,
  status: null
});

// 类型选项
const typeOptions = [
  { label: "全部类型", value: null },
  { label: "系统通知", value: "system" },
  { label: "活动通知", value: "activity" },
  { label: "会员通知", value: "member" },
  { label: "内容通知", value: "content" },
  { label: "问候通知", value: "greeting" }
];

// 状态选项
const statusOptions = [
  { label: "全部状态", value: null },
  { label: "已发送", value: "sent" },
  { label: "草稿", value: "draft" },
  { label: "计划中", value: "scheduled" },
  { label: "发送失败", value: "failed" }
];

// 分页设置
const pagination = {
  pageSize: 10
};

// 加载状态
const loading = ref(false);
</script>

<template>
  <div :class="{ 'dark-theme': appStore.darkMode }">
    <n-card class="search-card">
      <n-space justify="space-between">
        <n-space>
          <n-input
            v-model:value="searchParams.keyword"
            placeholder="搜索通知标题/内容"
            clearable
            style="width: 220px"
          >
            <template #prefix>
              <n-icon>
                <search-outlined />
              </n-icon>
            </template>
          </n-input>

          <n-select
            v-model:value="searchParams.type"
            :options="typeOptions"
            placeholder="通知类型"
            clearable
            style="width: 120px"
          />

          <n-select
            v-model:value="searchParams.status"
            :options="statusOptions"
            placeholder="状态"
            clearable
            style="width: 120px"
          />

          <n-button type="primary">搜索</n-button>
          <n-button>重置</n-button>
        </n-space>

        <n-button type="primary">
          <template #icon>
            <n-icon>
              <plus-outlined />
            </n-icon>
          </template>
          新建通知
        </n-button>
      </n-space>
    </n-card>

    <n-card class="table-card">
      <n-data-table
        :columns="columns"
        :data="notificationList"
        :loading="loading"
        :pagination="pagination"
        :bordered="false"
      />
    </n-card>
  </div>
</template>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}
</style>

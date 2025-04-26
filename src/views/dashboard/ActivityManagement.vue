<script setup lang="ts">
import { ref, h } from "vue";
import { NCard, NSpace, NButton, NDataTable, NTag, NInput, NSelect, NPopconfirm, NIcon, NProgress } from "naive-ui";
import { SearchOutlined, PlusOutlined, DeleteOutlined } from "@vicons/antd";
import { useAppStore } from "../../stores/app";

const appStore = useAppStore();

// 活动数据
const activityList = ref([
  {
    id: 1,
    title: "线下交友活动 - 上海",
    organizer: "张明",
    location: "上海市静安区文化广场",
    startDate: "2025-05-15",
    endDate: "2025-05-15",
    participants: 42,
    capacity: 50,
    status: "active"
  },
  {
    id: 2,
    title: "手语学习工作坊",
    organizer: "李华",
    location: "北京市朝阳区青年中心",
    startDate: "2025-05-22",
    endDate: "2025-05-22",
    participants: 28,
    capacity: 30,
    status: "full"
  },
  {
    id: 3,
    title: "线上游戏派对",
    organizer: "王芳",
    location: "线上活动",
    startDate: "2025-05-10",
    endDate: "2025-05-10",
    participants: 15,
    capacity: 40,
    status: "active"
  },
  {
    id: 4,
    title: "听障交友茶话会",
    organizer: "陈晓",
    location: "广州市天河区文化中心",
    startDate: "2025-06-05",
    endDate: "2025-06-05",
    participants: 10,
    capacity: 35,
    status: "active"
  },
  {
    id: 5,
    title: "听障人士职业发展论坛",
    organizer: "林小雨",
    location: "深圳市南山区科技中心",
    startDate: "2025-06-12",
    endDate: "2025-06-12",
    participants: 5,
    capacity: 50,
    status: "upcoming"
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
    title: "活动名称",
    key: "title",
    width: 180
  },
  {
    title: "组织者",
    key: "organizer",
    width: 100
  },
  {
    title: "地点",
    key: "location",
    width: 180
  },
  {
    title: "活动日期",
    key: "startDate",
    width: 120,
    render(row: any) {
      return `${row.startDate} ${row.startDate !== row.endDate ? '至 ' + row.endDate : ''}`;
    }
  },
  {
    title: "参与情况",
    key: "participants",
    width: 100,
    render(row: any) {
      return `${row.participants}/${row.capacity}`;
    }
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    render(row: any) {
      const statusMap: Record<string, { type: string; text: string }> = {
        active: { type: "success", text: "进行中" },
        full: { type: "warning", text: "已满" },
        upcoming: { type: "info", text: "即将开始" },
        ended: { type: "error", text: "已结束" }
      };
      const status = statusMap[row.status] || { type: "default", text: row.status };
      return h(NTag, { type: status.type as any, size: "small" }, { default: () => status.text });
    }
  },
  {
    title: "进度",
    key: "progress",
    width: 140,
    render(row: any) {
      const percentage = Math.floor((row.participants / row.capacity) * 100);
      return h(NProgress, {
        percentage,
        indicatorPlacement: "inside",
        status: percentage >= 100 ? "success" : "processing",
        showIndicator: true,
        height: 15
      });
    }
  },
  {
    title: "操作",
    key: "actions",
    width: 160,
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
            h(
              NButton,
              {
                type: "info",
                size: "small",
                ghost: true
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
                default: () => "确定要删除此活动吗？"
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
  status: null,
  location: null
});

// 状态选项
const statusOptions = [
  { label: "全部状态", value: null },
  { label: "进行中", value: "active" },
  { label: "已满", value: "full" },
  { label: "即将开始", value: "upcoming" },
  { label: "已结束", value: "ended" }
];

// 地点选项
const locationOptions = [
  { label: "全部地点", value: null },
  { label: "线上活动", value: "线上活动" },
  { label: "上海", value: "上海" },
  { label: "北京", value: "北京" },
  { label: "广州", value: "广州" },
  { label: "深圳", value: "深圳" }
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
            placeholder="搜索活动名称/组织者"
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
            v-model:value="searchParams.status"
            :options="statusOptions"
            placeholder="状态"
            clearable
            style="width: 120px"
          />

          <n-select
            v-model:value="searchParams.location"
            :options="locationOptions"
            placeholder="地点"
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
          创建活动
        </n-button>
      </n-space>
    </n-card>

    <n-card class="table-card">
      <n-data-table
        :columns="columns"
        :data="activityList"
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

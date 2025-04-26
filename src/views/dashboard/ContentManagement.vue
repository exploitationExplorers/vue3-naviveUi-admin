<script setup lang="ts">
import { ref, h } from "vue";
import { NCard, NSpace, NButton, NDataTable, NTag, NInput, NSelect, NPopconfirm, NIcon } from "naive-ui";
import { SearchOutlined, PlusOutlined, DeleteOutlined } from "@vicons/antd";
import { useAppStore } from "../../stores/app";

const appStore = useAppStore();

// 内容状态数据
const contentList = ref([
  {
    id: 1,
    title: "手语学习技巧分享",
    author: "张明",
    category: "学习",
    publishDate: "2025-04-15",
    views: 128,
    likes: 45,
    status: "published"
  },
  {
    id: 2,
    title: "听障人士的日常生活分享",
    author: "李华",
    category: "生活",
    publishDate: "2025-04-18",
    views: 256,
    likes: 78,
    status: "published"
  },
  {
    id: 3,
    title: "听力辅助设备使用心得",
    author: "王芳",
    category: "科技",
    publishDate: "2025-04-20",
    views: 187,
    likes: 62,
    status: "pending"
  },
  {
    id: 4,
    title: "与听障人士交流的正确方式",
    author: "陈晓",
    category: "社交",
    publishDate: "2025-04-22",
    views: 312,
    likes: 98,
    status: "published"
  },
  {
    id: 5,
    title: "如何提高读唇语能力",
    author: "林小雨",
    category: "学习",
    publishDate: "2025-04-24",
    views: 176,
    likes: 55,
    status: "pending"
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
    width: 200
  },
  {
    title: "作者",
    key: "author",
    width: 100
  },
  {
    title: "分类",
    key: "category",
    width: 100
  },
  {
    title: "发布日期",
    key: "publishDate",
    width: 120
  },
  {
    title: "浏览量",
    key: "views",
    width: 80
  },
  {
    title: "点赞数",
    key: "likes",
    width: 80
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    render(row: any) {
      const statusMap: Record<string, { type: string; text: string }> = {
        published: { type: "success", text: "已发布" },
        pending: { type: "warning", text: "待审核" },
        rejected: { type: "error", text: "已拒绝" }
      };
      const status = statusMap[row.status] || { type: "default", text: row.status };
      return h(NTag, { type: status.type as any, size: "small" }, { default: () => status.text });
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
                default: () => "确定要删除此内容吗？"
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
  category: null
});

// 状态选项
const statusOptions = [
  { label: "全部状态", value: null },
  { label: "已发布", value: "published" },
  { label: "待审核", value: "pending" },
  { label: "已拒绝", value: "rejected" }
];

// 分类选项
const categoryOptions = [
  { label: "全部分类", value: null },
  { label: "学习", value: "学习" },
  { label: "生活", value: "生活" },
  { label: "科技", value: "科技" },
  { label: "社交", value: "社交" }
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
            placeholder="搜索内容标题/作者"
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
            v-model:value="searchParams.category"
            :options="categoryOptions"
            placeholder="分类"
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
          新增内容
        </n-button>
      </n-space>
    </n-card>

    <n-card class="table-card">
      <n-data-table
        :columns="columns"
        :data="contentList"
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

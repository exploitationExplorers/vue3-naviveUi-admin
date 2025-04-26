<script setup lang="ts">
import { ref, onMounted, h, reactive } from "vue";
import {
  NGrid,
  NGridItem,
  NCard,
  NDivider,
  NDataTable,
  NSpace,
  NTag,
  NIcon,
  NProgress,
  NButton,
  NSelect
} from "naive-ui";
import {
  UserOutlined,
  CommentOutlined,
  HeartOutlined,
  CalendarOutlined
} from "@vicons/antd";
import { useAppStore } from "../../stores/app";
import gsap from "gsap";

// 获取store
const appStore = useAppStore();

// 统计数据

const statisticsCards = reactive([
  {
    id: 'totalUsers',
    value: 1258,
    label: '注册用户',
    icon: UserOutlined,
    iconClass: 'user-icon'
  },
  {
    id: 'activeUsers',
    value: 865,
    label: '活跃用户',
    icon: HeartOutlined,
    iconClass: 'active-icon'
  },
  {
    id: 'newPosts',
    value: 152,
    label: '新增帖子',
    icon: CommentOutlined,
    iconClass: 'post-icon'
  },
  {
    id: 'pendingActivities',
    value: 38,
    label: '待审核活动',
    icon: CalendarOutlined,
    iconClass: 'activity-icon'
  }
]);

// 活动列表数据
const activities = ref([
  {
    id: 1,
    title: "线下交友活动 - 上海",
    date: "2025-05-15",
    participants: 42,
    capacity: 50,
    status: "active"
  },
  {
    id: 2,
    title: "手语学习工作坊",
    date: "2025-05-22",
    participants: 28,
    capacity: 30,
    status: "full"
  },
  {
    id: 3,
    title: "线上游戏派对",
    date: "2025-05-10",
    participants: 15,
    capacity: 40,
    status: "active"
  },
  {
    id: 4,
    title: "听障交友茶话会",
    date: "2025-06-05",
    participants: 10,
    capacity: 35,
    status: "active"
  }
]);

// 最新用户
const recentUsers = ref([
  {
    id: 1,
    name: "张明",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    registerDate: "2025-04-20",
    posts: 15,
    status: "active"
  },
  {
    id: 2,
    name: "李华",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    registerDate: "2025-04-19",
    posts: 8,
    status: "active"
  },
  {
    id: 3,
    name: "王芳",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    registerDate: "2025-04-18",
    posts: 5,
    status: "inactive"
  },
  {
    id: 4,
    name: "陈晓",
    avatar: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
    registerDate: "2025-04-17",
    posts: 12,
    status: "active"
  }
]);

// 表格列定义
const activityColumns = [
  {
    title: "活动名称",
    key: "title"
  },
  {
    title: "日期",
    key: "date"
  },
  {
    title: "参与人数",
    key: "participants",
    render(row: any) {
      return `${row.participants}/${row.capacity}`;
    }
  },
  {
    title: "状态",
    key: "status",
    render(row: any) {
      const statusMap: Record<string, { type: string; text: string }> = {
        active: { type: "success", text: "活跃" },
        full: { type: "warning", text: "已满" },
        ended: { type: "error", text: "已结束" }
      };
      const status = statusMap[row.status] || { type: "default", text: row.status };
      return h(NTag, { type: status.type as any }, { default: () => status.text });
    }
  },
  {
    title: "进度",
    key: "progress",
    render(row: any) {
      const percentage = Math.floor((row.participants / row.capacity) * 100);
      return h(NProgress, {
        percentage,
        indicatorPlacement: "inside",
        status: percentage >= 100 ? "success" : "info",
        showIndicator: true,
        height: 15
      });
    }
  }
];

const userColumns = [
  {
    title: "用户",
    key: "name",
    render(row: any) {
      return h(
        NSpace,
        { align: "center" },
        {
          default: () => [
            h('img', {
              src: row.avatar,
              style: {
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                marginRight: '4px'
              }
            }),
            row.name
          ]
        }
      );
    }
  },
  {
    title: "注册日期",
    key: "registerDate"
  },
  {
    title: "发布内容数",
    key: "posts"
  },
  {
    title: "状态",
    key: "status",
    render(row: any) {
      const statusMap: Record<string, { type: string; text: string }> = {
        active: { type: "success", text: "活跃" },
        inactive: { type: "warning", text: "非活跃" },
        suspended: { type: "error", text: "已冻结" }
      };
      const status = statusMap[row.status] || { type: "default", text: row.status };
      return h(NTag, { type: status.type as any }, { default: () => status.text });
    }
  }
];

// 时间范围选择
const timeRange = ref("week");
const timeOptions = [
  {
    label: "本周",
    value: "week"
  },
  {
    label: "本月",
    value: "month"
  },
  {
    label: "本季度",
    value: "quarter"
  },
  {
    label: "本年",
    value: "year"
  }
];

// 动画处理
const countUp = (target: number, elementId: string) => {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 1.5,
    ease: "power1.out",
    onUpdate: function() {
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = Math.floor(obj.val).toString();
      }
    }
  });
};

// 在组件挂载时添加动画
onMounted(() => {
  // 数字动画
  statisticsCards.forEach(card => {
    countUp(card.value, `stat-value-${card.id}`);
  });

  // 卡片动画
  const cards = document.querySelectorAll('.stat-card');
  cards.forEach((card, index) => {
    gsap.from(card, {
      duration: 0.5,
      y: 20,
      opacity: 0,
      delay: 0.1 * index,
      ease: "power1.out"
    });
  });

  // 表格动画
  const tables = document.querySelectorAll('.data-table-card');
  tables.forEach((table, index) => {
    gsap.from(table, {
      duration: 0.6,
      y: 30,
      opacity: 0,
      delay: 0.4 + (0.2 * index),
      ease: "power2.out"
    });
  });
});
</script>

<template>
  <div :class="{ 'dark-theme': appStore.darkMode }">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="card in statisticsCards" :key="card.id" class="w-full">
        <n-card class="stat-card w-full min-w-[200px]" size="small">
          <div class="stat-content">
            <div class="stat-icon" :class="card.iconClass">
              <n-icon size="24">
                <component :is="card.icon" />
              </n-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value" :id="`stat-value-${card.id}`">0</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <n-divider />

    <!-- 数据表格 -->
    <n-grid cols="1 l:2" :x-gap="12" :y-gap="12">
      <n-grid-item>
        <n-card title="最近活动" class="data-table-card">
          <template #header-extra>
            <n-select v-model:value="timeRange" :options="timeOptions" size="small" />
          </template>
          <n-data-table
            :columns="activityColumns"
            :data="activities"
            :pagination="false"
            :bordered="false"
          />
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="最新注册用户" class="data-table-card">
          <template #header-extra>
            <n-button text size="small">查看所有用户</n-button>
          </template>
          <n-data-table
            :columns="userColumns"
            :data="recentUsers"
            :pagination="false"
            :bordered="false"
          />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.stat-card {
  background-color: var(--card-bg);
  transition: all 0.3s ease;
  min-height: 100px;
  width: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.user-icon {
  background-color: rgba(114, 105, 239, 0.15);
  color: var(--primary-color);
}

.active-icon {
  background-color: rgba(80, 200, 120, 0.15);
  color: #50c878;
}

.post-icon {
  background-color: rgba(255, 159, 67, 0.15);
  color: #ff9f43;
}

.activity-icon {
  background-color: rgba(232, 65, 72, 0.15);
  color: #e84148;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.7;
}

.data-table-card {
  height: 100%;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NCard, NSpace, NGrid, NGridItem, NSelect, NDivider, NDatePicker, NTabs, NTabPane } from "naive-ui";
import { useAppStore } from "../../stores/app";

const appStore = useAppStore();

// 时间范围
const timeRange = ref("month");
const timeOptions = [
  { label: "今日", value: "day" },
  { label: "本周", value: "week" },
  { label: "本月", value: "month" },
  { label: "本季度", value: "quarter" },
  { label: "本年", value: "year" },
  { label: "自定义", value: "custom" }
];

// 自定义日期范围
const dateRange = ref(null);

// 用户统计数据
const userStats = ref({
  totalUsers: 1258,
  newUsers: 86,
  activeUsers: 523,
  retentionRate: 78,
  gender: {
    male: 720,
    female: 538
  },
  age: {
    '0-18': 126,
    '19-24': 328,
    '25-34': 478,
    '35-44': 212,
    '45+': 114
  },
  hearingLevel: {
    light: 356,
    medium: 552,
    severe: 270,
    profound: 80
  }
});

// 内容统计数据
const contentStats = ref({
  totalPosts: 3256,
  newPosts: 125,
  comments: 8745,
  likes: 12567,
  shares: 2345,
  categories: {
    life: 956,
    learning: 845,
    tech: 528,
    social: 620,
    other: 307
  }
});

// 活动统计数据
const activityStats = ref({
  totalActivities: 48,
  ongoingActivities: 12,
  completedActivities: 28,
  upcomingActivities: 8,
  participation: {
    online: 758,
    offline: 438
  },
  activityTypes: {
    social: 22,
    learning: 15,
    support: 8,
    other: 3
  }
});

// 初始化图表
onMounted(() => {
  // 在实际应用中，这里将初始化图表
  // 例如使用 ECharts 或其他图表库
});

// 切换时间范围
const handleTimeRangeChange = (value: string) => {
  timeRange.value = value;
  // 更新统计数据
  // 在实际应用中，这里将根据选择的时间范围重新加载数据
};

// 选择自定义日期范围
const handleDateRangeChange = (value: any) => {
  dateRange.value = value;
  // 更新统计数据
  // 在实际应用中，这里将根据选择的日期范围重新加载数据
};
</script>

<template>
  <div :class="{ 'dark-theme': appStore.darkMode }">
    <!-- 筛选器 -->
    <n-card class="filter-card">
      <n-space justify="end">
        <n-select
          v-model:value="timeRange"
          :options="timeOptions"
          @update:value="handleTimeRangeChange"
          style="width: 120px"
        />

        <n-date-picker
          v-if="timeRange === 'custom'"
          v-model:value="dateRange"
          type="daterange"
          clearable
          @update:value="handleDateRangeChange"
        />
      </n-space>
    </n-card>

    <!-- 用户统计 -->
    <n-card title="用户数据统计" class="stat-card">
      <n-grid cols="1 m:2 l:4" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <n-card size="small" class="metric-card">
            <div class="metric-title">总注册用户</div>
            <div class="metric-value">{{ userStats.totalUsers }}</div>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card size="small" class="metric-card">
            <div class="metric-title">新增用户</div>
            <div class="metric-value">{{ userStats.newUsers }}</div>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card size="small" class="metric-card">
            <div class="metric-title">活跃用户</div>
            <div class="metric-value">{{ userStats.activeUsers }}</div>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card size="small" class="metric-card">
            <div class="metric-title">用户留存率</div>
            <div class="metric-value">{{ userStats.retentionRate }}%</div>
          </n-card>
        </n-grid-item>
      </n-grid>

      <n-divider />

      <n-grid cols="1 l:3" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <n-card size="small" title="性别分布">
            <div class="chart-placeholder">
              <!-- 这里将放置性别分布图表 -->
              <div class="chart-info">
                <div>男性: {{ userStats.gender.male }} ({{ Math.round(userStats.gender.male / userStats.totalUsers * 100) }}%)</div>
                <div>女性: {{ userStats.gender.female }} ({{ Math.round(userStats.gender.female / userStats.totalUsers * 100) }}%)</div>
              </div>
            </div>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card size="small" title="年龄分布">
            <div class="chart-placeholder">
              <!-- 这里将放置年龄分布图表 -->
              <div class="chart-info">
                <div v-for="(value, key) in userStats.age" :key="key">
                  {{ key }}: {{ value }} ({{ Math.round(value / userStats.totalUsers * 100) }}%)
                </div>
              </div>
            </div>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card size="small" title="听障程度分布">
            <div class="chart-placeholder">
              <!-- 这里将放置听障程度分布图表 -->
              <div class="chart-info">
                <div>轻度: {{ userStats.hearingLevel.light }} ({{ Math.round(userStats.hearingLevel.light / userStats.totalUsers * 100) }}%)</div>
                <div>中度: {{ userStats.hearingLevel.medium }} ({{ Math.round(userStats.hearingLevel.medium / userStats.totalUsers * 100) }}%)</div>
                <div>重度: {{ userStats.hearingLevel.severe }} ({{ Math.round(userStats.hearingLevel.severe / userStats.totalUsers * 100) }}%)</div>
                <div>极重度: {{ userStats.hearingLevel.profound }} ({{ Math.round(userStats.hearingLevel.profound / userStats.totalUsers * 100) }}%)</div>
              </div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 内容和活动统计 -->
    <n-tabs type="line" animated>
      <n-tab-pane name="content" tab="内容数据">
        <n-card class="stat-card">
          <n-grid cols="1 m:2 l:4" :x-gap="12" :y-gap="12">
            <n-grid-item>
              <n-card size="small" class="metric-card">
                <div class="metric-title">总内容数</div>
                <div class="metric-value">{{ contentStats.totalPosts }}</div>
              </n-card>
            </n-grid-item>

            <n-grid-item>
              <n-card size="small" class="metric-card">
                <div class="metric-title">新增内容</div>
                <div class="metric-value">{{ contentStats.newPosts }}</div>
              </n-card>
            </n-grid-item>

            <n-grid-item>
              <n-card size="small" class="metric-card">
                <div class="metric-title">评论数</div>
                <div class="metric-value">{{ contentStats.comments }}</div>
              </n-card>
            </n-grid-item>

            <n-grid-item>
              <n-card size="small" class="metric-card">
                <div class="metric-title">点赞数</div>
                <div class="metric-value">{{ contentStats.likes }}</div>
              </n-card>
            </n-grid-item>
          </n-grid>

          <n-divider />

          <n-card size="small" title="内容分类分布">
            <div class="chart-placeholder">
              <!-- 这里将放置内容分类分布图表 -->
              <div class="chart-info">
                <div>生活: {{ contentStats.categories.life }} ({{ Math.round(contentStats.categories.life / contentStats.totalPosts * 100) }}%)</div>
                <div>学习: {{ contentStats.categories.learning }} ({{ Math.round(contentStats.categories.learning / contentStats.totalPosts * 100) }}%)</div>
                <div>科技: {{ contentStats.categories.tech }} ({{ Math.round(contentStats.categories.tech / contentStats.totalPosts * 100) }}%)</div>
                <div>社交: {{ contentStats.categories.social }} ({{ Math.round(contentStats.categories.social / contentStats.totalPosts * 100) }}%)</div>
                <div>其他: {{ contentStats.categories.other }} ({{ Math.round(contentStats.categories.other / contentStats.totalPosts * 100) }}%)</div>
              </div>
            </div>
          </n-card>
        </n-card>
      </n-tab-pane>

      <n-tab-pane name="activity" tab="活动数据">
        <n-card class="stat-card">
          <n-grid cols="1 m:2 l:4" :x-gap="12" :y-gap="12">
            <n-grid-item>
              <n-card size="small" class="metric-card">
                <div class="metric-title">总活动数</div>
                <div class="metric-value">{{ activityStats.totalActivities }}</div>
              </n-card>
            </n-grid-item>

            <n-grid-item>
              <n-card size="small" class="metric-card">
                <div class="metric-title">进行中活动</div>
                <div class="metric-value">{{ activityStats.ongoingActivities }}</div>
              </n-card>
            </n-grid-item>

            <n-grid-item>
              <n-card size="small" class="metric-card">
                <div class="metric-title">已结束活动</div>
                <div class="metric-value">{{ activityStats.completedActivities }}</div>
              </n-card>
            </n-grid-item>

            <n-grid-item>
              <n-card size="small" class="metric-card">
                <div class="metric-title">即将开始活动</div>
                <div class="metric-value">{{ activityStats.upcomingActivities }}</div>
              </n-card>
            </n-grid-item>
          </n-grid>

          <n-divider />

          <n-grid cols="1 l:2" :x-gap="12" :y-gap="12">
            <n-grid-item>
              <n-card size="small" title="参与情况">
                <div class="chart-placeholder">
                  <!-- 这里将放置参与情况图表 -->
                  <div class="chart-info">
                    <div>线上: {{ activityStats.participation.online }} 人次</div>
                    <div>线下: {{ activityStats.participation.offline }} 人次</div>
                  </div>
                </div>
              </n-card>
            </n-grid-item>

            <n-grid-item>
              <n-card size="small" title="活动类型分布">
                <div class="chart-placeholder">
                  <!-- 这里将放置活动类型分布图表 -->
                  <div class="chart-info">
                    <div>社交活动: {{ activityStats.activityTypes.social }} ({{ Math.round(activityStats.activityTypes.social / activityStats.totalActivities * 100) }}%)</div>
                    <div>学习活动: {{ activityStats.activityTypes.learning }} ({{ Math.round(activityStats.activityTypes.learning / activityStats.totalActivities * 100) }}%)</div>
                    <div>支持活动: {{ activityStats.activityTypes.support }} ({{ Math.round(activityStats.activityTypes.support / activityStats.totalActivities * 100) }}%)</div>
                    <div>其他活动: {{ activityStats.activityTypes.other }} ({{ Math.round(activityStats.activityTypes.other / activityStats.totalActivities * 100) }}%)</div>
                  </div>
                </div>
              </n-card>
            </n-grid-item>
          </n-grid>
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
.filter-card {
  margin-bottom: 16px;
}

.stat-card {
  margin-bottom: 16px;
}

.metric-card {
  text-align: center;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.metric-title {
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--primary-color);
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.chart-info {
  text-align: center;
}
</style>

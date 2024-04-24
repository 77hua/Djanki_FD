<template>
  <div class="statistics-wrapper">
    <header>
      <h2 class="title">学习统计</h2>
      <el-button @click="baToHomeSelect">
        < 返回</el-button>
    </header>
    <el-row>
      <el-col>
        <!-- 饼状图 -->
        <div ref="pieChart" class="chart-container"></div>
      </el-col>
    </el-row>
    <div class="flipping-cards">
      <div class="flipping-card" @mouseover="handleHover('TotalRepetitions')" @mouseleave="handleMouseLeave">
        <div class="flipping-card-inner">
          <div class="flipping-card-front">
            <h3>总重复次数</h3>
            <p>{{ statistics.total_repetitions }}</p>
          </div>
          <div class="flipping-card-back">
            <h3>复习次数统计</h3>
            <p>详细数据...</p>
          </div>
        </div>
      </div>

      <div class="flipping-card" @mouseover="handleHover('LearningDays')" @mouseleave="handleMouseLeave">
        <div class="flipping-card-inner">
          <div class="flipping-card-front">
            <h3>学习天数</h3>
            <p>{{ statistics.learning_days }}</p>
          </div>
          <div class="flipping-card-back">
            <h3>学习时间统计</h3>
            <p>更多详情...</p>
          </div>
        </div>
      </div>

      <div class="flipping-card" @mouseover="handleHover('LastReview')" @mouseleave="handleMouseLeave">
        <div class="flipping-card-inner">
          <div class="flipping-card-front">
            <h3>上次复习日期</h3>
            <p>{{ statistics.last_review_date }}</p>
          </div>
          <div class="flipping-card-back">
            <h3>复习日期信息</h3>
            <p>详细复习信息...</p>
          </div>
        </div>
      </div>

      <div class="flipping-card" @mouseover="handleHover('FarthestReview')" @mouseleave="handleMouseLeave">
        <div class="flipping-card-inner">
          <div class="flipping-card-front">
            <h3>最远复习日期</h3>
            <p>{{ statistics.farthest_review_date }}</p>
          </div>
          <div class="flipping-card-back">
            <h3>复习日期统计</h3>
            <p>更多详情...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();

const pieChart = ref(null); // 引用饼状图元素
const statistics = ref({}); // 存储统计数据

const fetchStatistics = async () => {
  try {
    const token = sessionStorage.getItem('access');
    const response = await axios.get(
      'http://127.0.0.1:8081/api/learn/courses/learning-statistics/',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    statistics.value = response.data; // 存储数据
  } catch (error) {
    console.error("错误:", error);
  }
};

const createPieChart = () => {
  const pieChartInstance = echarts.init(pieChart.value);
  const pieChartOption = {
    title: { text: '试题总数学习情况', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { top: 'bottom' },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: statistics.value.learned_count, name: '已学习' },
          { value: statistics.value.mastered_count, name: '已掌握' },
        ],
        label: { show: true, formatter: '{b}: {c}' },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  pieChartInstance.setOption(pieChartOption);

  const handleResize = () => pieChartInstance.resize();
  window.addEventListener('resize', handleResize);

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
};

onMounted(async () => {
  await fetchStatistics(); // 获取数据
  createPieChart(); // 创建饼状图
});
// 返回首页
const baToHomeSelect = () => {
  router.push({ name: 'HomeSelect' })
}
const hoverCard = ref(null); // 用于处理悬停效果
const handleHover = (card) => {
  hoverCard.value = card; // 设置悬停卡片
};

const handleMouseLeave = () => {
  hoverCard.value = null; // 重置悬停卡片
};
</script>

<style scoped>
.statistics-wrapper {
  padding: 20px;
  background: #f5f5f5;
  /* 浅灰色背景 */
  border-radius: 15px;
  /* 圆角 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  /* 阴影 */
}

header {
  display: flex;
  justify-content: space-between;
}

.title {
  color: #45b8ff;
  /* 标题颜色 */
  margin-top: 0;
}

.chart-container {
  height: 300px;
  /* 图表高度 */
  width: 300px;
  margin-bottom: 15px;
  margin: 0 auto;
}

.flipping-cards {
  display: flex;
  justify-content: space-around;
  /* 调整布局 */
  flex-wrap: wrap;
  /* 使卡片可以换行 */
}

.flipping-card {
  position: relative;
  width: 200px;
  height: 250px;
  perspective: 1000px;
  /* 3D透视效果 */
}

.flipping-card-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  /* 过渡效果 */
  transform-style: preserve-3d;
  /* 保持3D变换 */
}

.flipping-card-front,
.flipping-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  /* 隐藏背面 */
  border-radius: 10px;
  /* 圆角 */
}

.flipping-card-front {
  background: linear-gradient(135deg, #ff7b7b, #f7b731);
  /* 前面的背景色 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.flipping-card-back {
  background: linear-gradient(135deg, #f7b731, #ff7b7b);
  /* 后面的背景色 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: rotateY(180deg);
  /* 后面的反转 */
}

.flipping-card:hover .flipping-card-inner {
  transform: rotateY(180deg);
  /* 翻转效果 */
}

.flipping-card-front h3,
.flipping-card-back h3 {
  color: #ffffff;
  /* 标题颜色 */
  transition: all 0.3s ease;
  /* 过渡效果 */
}

.flipping-card:hover h3 {
  transform: scale(1.2);
  /* 悬停时放大 */
}
</style>

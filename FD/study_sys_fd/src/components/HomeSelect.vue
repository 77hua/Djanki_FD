<template>
  <main class="user-selection">
    <!-- 动态波浪 -->
    <div class="wave-background"></div>
    <div class="card" @click="toStudy">
      <div class="card-content">
        <img :src="BookOpenIcon" alt="课程库" class="card-icon" />
        <h2 class="card-title">课程库</h2>
        <p class="card-description">选择一门课程，开始尽情刷题，提升自己吧。</p>
      </div>
    </div>
    <div class="card" @click="toStatistics">
      <div class="card-content">
        <img :src="ChartLineIcon" alt="学习统计" class="card-icon" />
        <h2 class="card-title">学习统计</h2>
        <p class="card-description">查看你的学习进度和统计信息。</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import BookOpenIcon from '@/assets/icon/book-open-solid.svg';
import ChartLineIcon from '@/assets/icon/chart-line-solid.svg';
import { useRouter } from 'vue-router';

const router = useRouter();

const toStudy = () => {
  router.push({ name: 'Study' });
};

const toStatistics = () => {
  router.push({ name: 'Statistics' });
};
</script>

<style scoped>
/* 波浪动效 */
@keyframes waveBackgroundAnimation {
  0% {
    background-position: 0% 0%; /* 初始位置 */
  }
  50% {
    background-position: 100% 100%; /* 波浪在对角线移动 */
  }
  100% {
    background-position: 0% 0%; /* 返回初始位置 */
  }
}

.user-selection {
  position: relative; /* 容纳绝对定位元素 */
  display: flex;
  justify-content: space-around; /* 卡片之间的间距 */
  padding: 20px;
  border-radius: 10px; /* 圆角 */
  overflow: hidden; /* 防止溢出 */
}

.wave-background {
  position: absolute; /* 波浪背景置于底层 */
  top: 0; /* 顶部开始 */
  left: 0; /* 左侧开始 */
  width: 100%; /* 覆盖整个容器 */
  height: 100%; /* 覆盖整个容器 */
  background: linear-gradient(to bottom right, #3c3c3c, #2f2f2f, #4a4a4a); /* 渐变背景 */
  background-size: 200% 200%; /* 背景大小 */
  animation: waveBackgroundAnimation 5s linear infinite; /* 动画 */
}

.card {
  position: relative; /* 保证在波浪背景上层 */
  z-index: 1; /* 确保在前面 */
  width: 280px; /* 卡片宽度 */
  text-align: center;
  border-radius: 12px; /* 圆角 */
  padding: 20px; /* 内边距 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 动效 */
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  cursor: pointer; /* 鼠标手型 */
}

.card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); /* 悬停效果 */
  transform: scale(1.05); /* 悬停时放大 */
}
.card-icon {
  height: 60px; /* 图标高度 */
  margin-bottom: 10px; /* 图标与标题之间的间距 */
}
.card-content {
  padding: 10px;
}

.card-title {
  font-size: 24px; /* 标题字体大小 */
  color: #ffffff; /* 标题颜色 */
}

.card-description {
  font-size: 16px; /* 文字字体大小 */
  color: #dddddd; /* 浅灰色 */
}
</style>

<!-- 用户选择 -->
<template>
  <main>
    <div class="card" @click="toStudy">
      <img :src="BookOpenIcon" alt="课程库" class="icon">
      <h2>课程库</h2>
      <p>选择一门课程开始尽情刷题，提升自己吧。</p>
    </div>
    <div class="card">
      <img :src="ChartLineIcon" alt="课程库" class="icon" />
      <h2>学习统计</h2>
      <p>查看你的学习进度和统计信息。</p>
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
}
</script>
<style scoped>
.card {
  width: 300px;
  text-align: center;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.card img {
  width: 100%;
  border-radius: 4px;
}

.card h2 {
  color: #123456;
}

.icon {
  height: 47px;
}
main {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}
</style>

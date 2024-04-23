<template>
  <div class="study-container">
    <header>
      <el-button class="back-button" @click="backToHome">返回主页</el-button>
    </header>
    <h1 class="title">课程列表</h1>
    <div class="courses-container" v-if="courses.length">
      <div class="course" v-for="course in courses" :key="course.id" @mouseenter="hover = true"
        @mouseleave="hover = false">
        <div class="course-content">
          <h2>{{ course.name }}</h2>
          <p>{{ course.description }}</p>
        </div>
        <div class="course-overlay" v-show="hover">
          <button class="start-button" @click="startExercises(course.id)">刷题情况</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>正在加载课程...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const courses = ref([]);
const hover = ref(false); // 动画

// 获取课程列表
const fetchCourses = async () => {
  try {
    const token = sessionStorage.getItem('access');
    const response = await axios.get('http://127.0.0.1:8081/api/teach_admin/courses/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    courses.value = response.data; // 使用后端返回的课程数组
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

onMounted(fetchCourses); // 页面加载后获取课程列表

// 开始刷题
const startExercises = (courseId) => {
  router.push({ name: 'Exercises', params: { id: courseId } });
};

const backToHome = () => {
  router.push({ name: 'HomeSelect' });
};
</script>

<style scoped>
.study-container {
  padding: 20px;
  margin: 0 auto;
  background: linear-gradient(135deg, #3c3c3c, #2f2f2f); /* 渐变背景 */
  color: #ffffff; /* 白色字体 */
  border-radius: 15px; /* 圆角 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); /* 阴影 */
}

.header {
  text-align: right; /* 将按钮对齐到右侧 */
}

.back-button {
  background-color: #3498db; /* 按钮背景色 */
  color: #ffffff; /* 按钮字体色 */
}

.back-button:hover {
  background-color: #2980b9; /* 悬停颜色 */
}

.title {
  text-align: center; /* 标题居中 */
  font-size: 36px; /* 标题大小 */
  margin-bottom: 20px; /* 标题下方间距 */
}

.courses-container {
  display: flex;
  flex-wrap: wrap; /* 允许多行卡片 */
  gap: 20px; /* 卡片之间的间距 */
  justify-content: center; /* 卡片居中 */
}

.course {
  position: relative;
  flex: 0 1 300px; /* 固定宽度 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 边框阴影 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 动效 */
}

.course:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3); /* 悬停效果 */
  transform: scale(1.05); /* 悬停时放大 */
}

.course-content {
  padding: 20px; /* 内边距 */
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  transition: opacity 0.3s ease; /* 动效 */
}

.course-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(52, 152, 219, 0.8); /* 浅蓝色 */
  display: flex;
  justify-content: center; /* 居中 */
  align-items: center; /* 居中 */
  opacity: 0;
  transition: opacity 0.3s ease; /* 动效 */
}

.course:hover .course-overlay {
  opacity: 1; /* 悬停显示 */
}

.start-button {
  padding: 10px 20px; /* 按钮内边距 */
  font-size: 18px; /* 按钮字体大小 */
  background-color: #2c3e50; /* 深蓝色背景 */
  color: white; /* 白色字体 */
  border: none; /* 无边框 */
  border-radius: 5px; /* 按钮圆角 */
  cursor: pointer; /* 鼠标手型 */
}

.start-button:hover {
  background-color: #34495e; /* 悬停颜色 */
}
</style>

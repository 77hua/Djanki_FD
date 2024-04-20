<template>
  <div class="study-container">
    <header>
      <el-button @click="backToHome">返回主页</el-button>
    </header>
    <h1>课程列表</h1>
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
    // 从 sessionStorage 中获取 token
    const token = sessionStorage.getItem('access');

    const response = await axios.get('http://127.0.0.1:8081/api/teach_admin/courses/', {
      headers: {
        'Content-Type': 'application/json',
        // 使用 Bearer 方案携带 token
        'Authorization': `Bearer ${token}`
      }
    });

    // Axios 自动处理 JSON 数据，所以无需手动解析
    courses.value = response.data; // 使用后端返回的课程数组
  } catch (error) {
    console.error("Error fetching courses:", error);

  }
};
onMounted(fetchCourses);  // 写在函数定义后面

// 开始刷题
const startExercises = (courseId)  =>{
  router.push({ name: 'Exercises', params: { id: courseId } });
}

const backToHome = () =>{
  router.push({ name: 'HomeSelect' });
}

</script>

<style scoped>
.study-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.courses-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  max-height: 600px;
  overflow-y: auto;
}

.course {
  position: relative;
  flex: 0 1 300px;
  border: 1px solid #d3d3d3;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* 确保 overlay 不溢出卡片 */
}

.course-content {
  transition: opacity 0.3s ease;
}

.course-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(187, 220, 243, 0.85);
  /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.course:hover .course-overlay {
  opacity: 1;
  pointer-events: auto;
  /* 重新启用交互 */
}

.start-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #2980b9;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.start-button:hover {
  background-color: #3498db;
}
</style>

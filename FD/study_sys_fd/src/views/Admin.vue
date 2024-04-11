<!-- 后台管理首页 -->
<template>
  <div class="admin-container">
    <el-container style="height: 100%;">
      <el-header style="padding:0;">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">课程管理</el-menu-item>
        </el-menu>
      </el-header>

      <el-main>
        <div v-if="activeIndex === '1'">
          <!-- 课程管理组件 -->
          <course-management></course-management>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CourseManagement from '../components/CourseManagement.vue';

const activeIndex = ref('1');


const handleSelect = (index) => {
  activeIndex.value = index;
};
</script>

<style scoped>
.admin-container {
  height: 100vh;
  background-color: #f5f5f5;
  opacity: 0.9;
  margin: 0 10px 5px 10px;
  border-radius: 7px;
}
</style>

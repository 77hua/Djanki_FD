<template>
  <div class="admin-wrapper">
    <div class="admin-header">
      <div class="admin-menu">
        <div class="menu-item" :class="{ active: activeTab === 'course-management' }" @click="setActiveTab('course-management')">
          课程管理
        </div>
      </div>
      <div class="admin-info">
        您好! {{username}}
      </div>
    </div>
    <div class="admin-content">
      <!-- 内容区域，根据 activeTab 显示不同组件 -->
      <div v-if="activeTab === 'course-management'">
        <course-management />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CourseManagement from '../components/CourseManagement.vue';

const activeTab = ref('course-management');
const username = sessionStorage.getItem('username');
const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>

<style scoped>
.admin-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #1f1f1f, #3f3f3f); /* 渐变背景 */
  padding: 10px
}

.admin-header {
  display: flex;
  justify-content: space-between; /* 水平对齐 */
  align-items: center; /* 确保垂直居中 */
  padding: 10px;
  background: rgba(0, 0, 0, 0.5); /* 标题栏背景透明 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
}

.admin-menu {
  display: flex;
  align-items: center; /* 确保菜单项垂直居中 */
}

.menu-item {
  color: #ffffff;
  margin-right: 20px;
  padding: 10px;
  cursor: pointer; /* 鼠标手型 */
  transition: all 0.3s ease;
  &:hover {
    color: #4db8ff; /* 悬停时颜色变化 */
    background: rgba(255, 255, 255, 0.2); /* 背景透明度 */
  }
  &.active {
    color: #4db8ff;
    border-bottom: 2px solid #4db8ff; /* 激活线 */
  }
}

.admin-info {
  font-size: 18px;
  color: #ffffff; /* 确保颜色与背景对比 */
  transition: color 0.3s ease;
  cursor: pointer;
}
.admin-info:hover {
  color: #4db8ff; /* 悬停颜色变化 */
}
.admin-content {
  flex: 1; /* 填充剩余空间 */
  padding: 20px;
  background: rgba(255, 255, 255, 0.85); /* 内容区域背景 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* 阴影 */
}
</style>

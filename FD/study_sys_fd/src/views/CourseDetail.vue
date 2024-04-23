<template>
  <div class="course-detail-wrapper">
    <div class="header">
      <div class="menu">
        <div class="menu-item" :class="{ active: activeIndex === '1' }" @click="handleSelect('1')">
          知识点
        </div>
        <div class="menu-item" :class="{ active: activeIndex === '2' }" @click="handleSelect('2')">
          试题库
        </div>
        <div class="menu-item" :class="{ active: activeIndex === '3' }" @click="handleSelect('3')">
          课程目标
        </div>
        <div class="menu-item-right" @click="goBack">
          <el-icon>
            <Back />
          </el-icon>返回
        </div>
      </div>
    </div>

    <div class="content">
      <div v-if="activeIndex === '1'">
        <category :courseId="Number(courseId)" />
      </div>
      <div v-if="activeIndex === '2'">
        <question :courseId="Number(courseId)" />
      </div>
      <div v-if="activeIndex === '3'">
        <SupportObjective :courseId="Number(courseId)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Category from '../components/Category.vue';
import Question from '../components/Question.vue';
import SupportObjective from '../components/SupportObjective.vue';
import { useRouter, useRoute } from 'vue-router';
import { Back } from '@element-plus/icons-vue';

const activeIndex = ref('1');

const router = useRouter();
const courseId = useRoute().params.id;

const handleSelect = (index) => {
  activeIndex.value = index;
};

const goBack = () => {
  router.push({ name: 'Admin' });
};
</script>

<style scoped>
.course-detail-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #1f1f1f, #3f3f3f); /* 渐变背景 */
}

.header {
  display: flex;
  justify-content: space-between; /* 水平对齐 */
  align-items: center; /* 确保垂直居中 */
  padding: 10px;
  background: rgba(0, 0, 0, 0.5); /* 标题栏背景透明 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
}

.menu {
  display: flex; /* 水平菜单 */
}

.menu-item {
  color: #ffffff;
  margin-right: 20px;
  padding: 10px;
  cursor: pointer; /* 鼠标手型 */
  transition: all 0.3s ease;
  &:hover {
    color: #4db8ff; /* 悬停效果 */
    background: rgba(255, 255, 255, 0.2);
  }
  &.active {
    color: #4db8ff;
    border-bottom: 2px solid #4db8ff; /* 激活状态 */
  }
}

.menu-item-right {
  display: flex;
  align-items: center; /* 确保垂直居中 */
  color: #ffffff;
  padding: 0 15px;
  border-radius: 5px; /* 圆角 */
  background: #4db8ff;
  cursor: pointer;
}

.menu-item-right:hover {
  background: #3a94d4; /* 悬停效果 */
}

.content {
  flex: 1; /* 填充剩余空间 */
  background: rgba(255, 255, 255, 0.85); /* 内容区域背景 */
  padding: 20px;
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* 较深的阴影 */
}
</style>
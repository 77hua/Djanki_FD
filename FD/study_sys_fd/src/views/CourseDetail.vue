<!-- 课程详细 -->
<template>
  <div class="course-detail-container">
    <el-container style="height: 100%;">
      <el-header style="padding:0;">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" class="header-menu">
          <el-menu-item index="1">知识点</el-menu-item>
          <el-menu-item index="2">试题库</el-menu-item>
          <!-- 返回选项 -->
          <el-menu-item index="3" class="menu-item-right" @click="goBack"><el-icon>
            <Back />
          </el-icon>返回</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <div v-if="activeIndex === '1'">
          <!-- 知识点组件 -->
          <category :courseId="Number(courseId)"></category>
        </div>
        <div v-if="activeIndex === '2'">
          <!-- 试题库组件 -->
          <question></question>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref,toRefs } from 'vue';
import Category from '../components/Category.vue';
import Question from '../components/Question.vue';
import { useRouter,useRoute } from 'vue-router';
import { Back } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

const activeIndex = ref('1');

const courseId = route.params.id;

const handleSelect = (index) => {
  activeIndex.value = index;
};

const goBack = () => {
  router.push({ name: 'Admin' });
};


</script>
<style scoped>
.course-detail-container {
  height: 100vh;
  background-color: #f5f5f5;
  opacity: 0.9;
  margin: 0 10px 5px 10px;
  border-radius: 7px;
}
.header-menu {
  display: flex;
}

.menu-item-right {
  right: 0;
  background-color: #9ac6f1;
  color: white;
}
</style>
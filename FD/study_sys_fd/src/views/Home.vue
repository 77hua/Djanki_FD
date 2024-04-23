<template>
  <div class="home-container">
    <header>
      <h1 class="home-title">学习平台</h1>
      <nav>
        <!-- 用户信息或登录链接 -->
        <div class="user-info" @click="backToLogin">
          您好, {{ username }}
        </div>
      </nav>
    </header>
    <main>
      <!-- 用户选择 -->
      <router-view /> <!-- 子路由组件将在这里渲染 -->
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const username = sessionStorage.getItem('username'); // 获取用户名
const router = useRouter();

const backToLogin = () => {
  router.push({ name: 'Login' }); // 返回登录页面
};
</script>

<style scoped>
.home-container {
  height: 100vh;
  background: linear-gradient(135deg, #1f1f1f, #3f3f3f); /* 渐变背景 */
  color: #ffffff; /* 字体颜色 */
  padding: 10px;
}

header {
  display: flex;
  justify-content: space-between; /* 水平对齐 */
  align-items: center; /* 确保垂直居中 */
  padding:0 10px;
  background: rgba(0, 0, 0, 0.5); /* 标题栏背景透明 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
}

header:hover {
  background: rgba(0, 0, 0, 0.7); /* 悬停时背景变化 */
}

.home-title {
  font-size: 24px; /* 标题字体大小 */
  color: #ffffff; /* 标题颜色 */
}

.user-info {
  font-size: 16px; /* 用户信息字体大小 */
  cursor: pointer; /* 鼠标手型 */
  transition: color 0.3s ease; /* 悬停效果 */
}

.user-info:hover {
  color: #4db8ff; /* 悬停时颜色变化 */
}

main {
  flex: 1; /* 填充剩余空间 */
  overflow-y: auto; /* 启用垂直滚动 */
  border-radius: 10px; /* 圆角 */
}
</style>

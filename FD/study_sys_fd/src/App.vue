<template>
  <div id="app">
    <div class="header">
      <img class="logo" src="./assets/images/logo.png" alt="">
      <h1 class="title" @click="toHome">基于SM-2的自适应刷题系统</h1>
    </div>
    <router-view /> <!-- 确保 router-view 不覆盖 header -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const toHome = () => {
  router.push({ name: 'Login' });
}
// 解决ERROR ResizeObserver loop completed with undelivered notifications的 BUG
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
};
</script>

<style lang="less">
body {
  position: relative;
  min-width: 800px;
  background: linear-gradient(135deg, #1f1f1f, #3f3f3f); /* 渐变背景 */
  color: #ffffff; /* 保证文本对比度 */
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5); /* 标题栏背景 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
  transition: all 0.3s ease; /* 动效 */
  &:hover {
    background: rgba(0, 0, 0, 0.7); /* 悬停效果 */
  }
  .logo {
    width: 60px;
    height: auto;
    background-color: #ffffff;
    transition: transform 0.3s ease; /* 动画效果 */
    &:hover {
      transform: scale(1.1); /* 悬停放大 */
    }
  }
  .title {
    font-size: 28px;
    color: #ffffff;
    margin-left: 20px;
    transition: color 0.3s ease;
    cursor: pointer;
    &:hover {
      color: #4db8ff; /* 悬停颜色变化 */
    }
  }
}

</style>
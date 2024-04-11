<template>
  <div id="app">
    <div class="img-box">
      <img src="./assets/images/logo.png" alt="">
      <h1 class="title">教考分离——自适应刷题系统</h1>
    </div>
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="less">
body {
  position: relative;
  min-width: 800px;
}
body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('./assets/images/scenery.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  opacity: 0.4; /* 设置透明度 */
  z-index: -1; /* 确保伪元素处于内容之下 */
}

/* 移入动画 */
.slide-enter-active {
  transition: transform 0.5s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-enter-to {
  transform: translateX(0);
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column; // 确保内容垂直排列
  .img-box{
    display: flex;
    padding-left: 10px;
    img{
      width: 80px; 
      height: auto; /* 高度自适应 */
      object-fit: contain;
    }
    .title{
      text-shadow:#f3f3f3 1px 1px 0, #b2b2b2 1px 2px 0; // 字体阴影
      margin-left: 30px;
      margin-top: 10px;
      color: #1B7EC6;
      font-size: 40px;
    }
  }
}
</style>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
// 决定要不要添加移入动画
const transitionName = computed(() => route.meta.transitionName || '');

</script>
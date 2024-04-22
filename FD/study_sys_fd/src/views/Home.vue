<template>
  <div class="home-container">
    <header>
      <h1>学习平台</h1>
      <nav>
        <!-- 用户信息或登录链接 -->
        <div class="user" @click="backToLogin">
          您好, {{ username }}
        </div>
      </nav>
    </header>
    <main>
      <!-- 用户选择 -->
      <router-view></router-view> <!-- 子路由组件将在这里渲染 -->
    </main>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
const username = sessionStorage.getItem('username');
const router = useRouter();
const backToLogin = () =>{
  router.push({name:"Login"})
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  background-color: #f5f5f5;
  margin: 0 10px 5px 10px;
  border-radius: 7px;
}

header {
  background: #123456;
  color: #ffffff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  margin: 0;
}
.user {
  cursor: pointer;
}

</style>
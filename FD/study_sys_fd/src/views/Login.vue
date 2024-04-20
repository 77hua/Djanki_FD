<!-- 登录页 -->
<template>
  <div class="login" id="login">
    <el-form class="login-form" @submit.prevent="login">
      <div class="title">
        <h1 class="login-title">登录</h1>
        <router-link  class="toRegister" to="/register">没账号？点我</router-link>
      </div>
      <el-form-item prop="username">
        <el-input v-model="credentials.username" placeholder="请输入用户名">
          <template #prepend>
            <el-icon>
              <user />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="credentials.password" show-password placeholder="请输入密码">
          <template #prepend>
            <el-icon>
              <lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 0;">
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted} from 'vue';
import axios from 'axios';
import { User, Lock } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { useRouter,onBeforeRouteLeave } from 'vue-router';
onMounted(() => {
  // 当组件加载时重置滚动条
  document.body.style.overflowX = 'hidden';
  document.body.style.overflowY = 'hidden';
});
onBeforeRouteLeave(() => {
  document.body.style.overflowX = '';
  document.body.style.overflowY = '';
});
const router = useRouter();

const credentials = reactive({
  username: 'qqh',
  password: '777',
});
const login = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8081/api/users/login/', {
      username:credentials.username,
      password:credentials.password
    });
    // console.log(response.data);
    ElNotification({
      title: '成功',
      message: '登录成功！',
      type: 'success',
    });
    // 登录成功后的操作，比如保存token，跳转到主页等
    sessionStorage.setItem('refresh', response.data.refresh);
    sessionStorage.setItem('id', response.data.id);
    sessionStorage.setItem('access', response.data.access);
    sessionStorage.setItem('username', response.data.username);
    sessionStorage.setItem('role', response.data.role);
    if(response.data.role == '学生') router.push('/home')
    else router.push('/admin')
  } catch (error) {
    // console.log(error);
    // 处理登录错误
    ElNotification({
      title: '登录失败',
      message: error.response.data.error,
      type: 'error',
    });
  }
};
</script>

<style scoped>
.login {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.login-form {
  max-width: 600px;
  min-width: 400px;
  margin: auto;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  background-color: rgba(255, 255, 255, 0.8); /* 这里使用了白色背景和0.8的透明度 */
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  width: 100%;
  height: 50px;
  font-size: 18px;
}

.el-input,
.el-select {
  width: 100%;
}
.title {
  display: flex;
  justify-content: space-between;
}
.login-title {
  margin-top: 0;
  color: #79bbff;
  text-align: left;
}
.toRegister{
  align-self: center;
  color: #2e96fe
}

</style>
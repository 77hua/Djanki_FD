<!-- 注册页 -->
<template>
  <div id="register">
    <el-form ref="registerForm" :model="user" class="register-form" @submit.prevent="register">
      <div class="title">
        <h1 class="register-title">注册</h1>
        <router-link class="toBack" to="/login"><el-icon>
            <Back />
          </el-icon>返回</router-link>
      </div>
      <el-form-item prop="username">
        <el-input v-model="user.username" placeholder="请输入用户名">
          <template #prepend>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="user.password" show-password placeholder="请输入密码">
          <template #prepend>
            <el-icon>
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select v-model="user.role" placeholder="请选择你的身份">
          <el-option label="学生" value="学生"></el-option>
          <el-option label="教师" value="教师"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button type="primary" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive,onMounted } from 'vue';
import axios from 'axios';
import { ElNotification } from 'element-plus'
import { User, Lock, Back } from '@element-plus/icons-vue';
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
const user = reactive({
  username: '',
  password: '',
  role: '', // 默认角色
});
const router = useRouter();
const register = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8081/api/users/register/', {
      username: user.username,
      password: user.password,
      role: user.role
    });
    // console.log('注册成功', response);
    // 注册成功，显示成功提示
    ElNotification({
      title: '成功',
      message: '注册成功！',
      type: 'success',
    });
    router.push('/login'); // 修改为你的登录页面路由
  } catch (error) {
    // console.error('注册失败', error.response.data.error);
    // 显示错误提示
    ElNotification({
      title: '注册失败',
      message: error.response.data.error,
      type: 'error',
    });
  }
};
</script>

<!-- 可以根据需要添加一些 CSS 样式来进一步美化页面 -->
<style scoped>
/* 确保注册表单本身不会过于宽或高 */
#register {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* 使用视口高度确保至少占满整个屏幕高度 */
}

.register-form {
  max-width: 600px;
  min-width: 400px;
  margin: 50px auto;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  background-color: rgba(255, 255, 255, 0.8);
  /* 这里使用了白色背景和0.8的透明度 */
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  width: 100%;
  /* 设置按钮宽度为100% */
  height: 50px;
  font-size: 18px;
  /* 设置按钮高度 */
}

.el-input,
.el-select {
  width: 100%;
  /* 确保输入框和选择器宽度为100% */
}

.register-title {
  margin-top: 0;
  color: #79bbff;
  text-align: left;
}

.title {
  display: flex;
  justify-content: space-between;
}

.toBack {
  align-self: center;
  color: #2e96fe
}
</style>

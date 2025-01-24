<template>
  <el-container class="exercises-wrapper">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu default-active="2" class="el-menu-vertical-demo">
        <el-menu-item index="1" @click="backToStudy">
          <el-icon><Back /></el-icon>
          <span slot="title">返回</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 主体学习情况 -->
    <el-container>
      <el-header style="text-align: center; line-height: 60px;">
        学习情况 - {{ courseName }}
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="box-card" style="--status-color: #4c8cf6;">
              <div class="clearfix">
                <div class="float-left">未学习</div>
                <div class="float-right">{{ learningStatus.not_learned }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" style="--status-color: #fca130;">
              <div class="clearfix">
                <div class="float-left">复习中</div>
                <div class="float-right">{{ learningStatus.reviewing }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" style="--status-color: #49cc90;">
              <div class="clearfix">
                <div class="float-left">已掌握</div>
                <div class="float-right">{{ learningStatus.mastered }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <div style="margin-top: 20px;">
          <el-form>
            <el-form-item label="题组数">
              <el-select v-model="question_num" placeholder="选择题组数">
                <el-option label="5题" value="5"></el-option>
                <el-option label="10题" value="10"></el-option>
                <el-option label="15题" value="15"></el-option>
                <el-option label="20题" value="20"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div style="margin-top: 20px;">
          <el-button type="success" @click="startPractice">学习新题</el-button>
          <el-button type="info" @click="startReview">复习试题</el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute,useRouter } from 'vue-router';
import { useQuestionStore  } from '@/store/question_num';
import { Back } from '@element-plus/icons-vue';

const questionStore = useQuestionStore();

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;
const courseName = ref('');
const learningStatus = ref({ not_learned: 0, reviewing: 0, mastered: 0 });
const question_num = ref('2'); // 题组数

onMounted(async () => {
  await fetchCourseStatusData();
});

// 获取课程的刷题情况
const fetchCourseStatusData = async () => {
  try {
    const token = sessionStorage.getItem('access');
    const response = await axios.get(`http://127.0.0.1:8081/api/learn/courses/${courseId}/question-stats/`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    courseName.value = response.data.course_name;
    learningStatus.value = response.data.learning_status;
  } catch (error) {
    console.error('错误:', error);
  }
};

// 返回课程选择
const backToStudy = ()=>{
  router.push({name:'Study'})
}
// 学习新试题
const startPractice = () => {
  questionStore.setQuestionNum(question_num.value);  // 设置 question_num
  router.push({ name: 'QuizPage', params: { id: courseId }, query: { mode: 'new' } });
};
// 复习试题
const startReview = () => {
  questionStore.setQuestionNum(question_num.value);  // 设置 question_num
  router.push({ name: 'QuizPage', params: { id: courseId }, query: { mode: 'review' } });
};
</script>

<style scoped>
.exercises-wrapper{
  margin-top: 20px;
  background-color: #333;
}

.box-card {
  height: 120px;
  line-height: 120px;
  color: #fff;
  font-size: 16px;
  background-color: var(--status-color);
}

.box-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); /* 悬停阴影 */
  transform: translateY(-8px); /* 悬停时悬空 */
}
.float-left {
  float: left;
  margin-left: 10px;
}
.float-right {
  float: right;
  margin-right: 10px;
}
.el-header {
  background-color: #b3c0d1;
}

.el-aside {
  background-color: #eef1f6;
  color: #333;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
@keyframes waveBackgroundAnimation {
  0% {
    background-position: 0% 0%; /* 初始位置 */
  }
  50% {
    background-position: 100% 100%; /* 波浪在对角线移动 */
  }
  100% {
    background-position: 0% 0%; /* 返回初始位置 */
  }
}

.exercises-wrapper {
  position: relative; /* 容纳绝对定位元素 */
  display: flex;
  justify-content: space-around; /* 卡片之间的间距 */
  padding: 20px;
  border-radius: 10px; /* 圆角 */
  overflow: hidden; /* 防止溢出 */
}

.wave-background {
  position: absolute; /* 波浪背景置于底层 */
  top: 0; /* 顶部开始 */
  left: 0; /* 左侧开始 */
  width: 100%; /* 覆盖整个容器 */
  height: 100%; /* 覆盖整个容器 */
  background: linear-gradient(to bottom right, #3c3c3c, #2f2f2f, #4a4a4a); /* 渐变背景 */
  background-size: 200% 200%; /* 背景大小 */
  animation: waveBackgroundAnimation 5s linear infinite; /* 动画 */
}
</style>

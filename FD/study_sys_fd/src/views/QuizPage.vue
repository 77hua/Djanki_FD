<template>
  <div class="quiz-container" v-if="isDataLoaded">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span >题目 {{ currentQuestion + 1 }}/{{ questions.length }}</span>
            <el-button style="float: right; padding: 5px 10px;color:#626aef " text
              @click="backToExercises">返回</el-button>
          </div>
          <div>
            <h2 class="dialog-title">题型：{{ questions[currentQuestion].question_type }}</h2>
            <p class="dialog-summary">简介：{{ questions[currentQuestion].summary }}</p>
            <h2 class="dialog-subtitle">题目</h2>
            <el-card class="answer-card">
              <md-preview v-model="questions[currentQuestion].content_markdown" />
            </el-card>
            <el-button @click="toggleAnswer">查看答案</el-button>
            <div v-if="showAnswer">
              <h2 class="dialog-subtitle">答案</h2>
              <el-card class="answer-card">
                <md-preview v-model="questions[currentQuestion].answer_markdown" />
              </el-card>
              <h2 class="dialog-subtitle">解析</h2> 
              <el-card class="explanation-card">
                <md-preview v-model="questions[currentQuestion].explanation_markdown" />
              </el-card>
              <div class="response-buttons">
                <el-button v-for="option in responseOptions" :key="option.value" :type="option.type"
                  @click="submitResponse(option.value)">
                  {{ option.label }}
                </el-button>
              </div>
            </div>
          </div>
          <!-- 答题反馈 -->
          <div>
            困难：{{ feedbackCounts.hard }}
            稳定：{{ feedbackCounts.stable }}
            容易：{{ feedbackCounts.easy }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div v-else>
    <p>正在加载数据...</p>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useQuestionStore } from '@/store/question_num';
import { ElMessage } from 'element-plus';
import { MdPreview } from 'md-editor-v3'; // markdown显示
import 'md-editor-v3/lib/style.css';

const router = useRouter();
const route = useRoute();

const courseId = route.params.id; //课程id
// 处理 学习新试题or复习试题
onMounted(() => {
  if (questionStore.questionNum === 0) {// 如果页面刷新，pinia状态页刷新了，就获取不到qustionNum了，就不能正常请求数据，我们返回
    // 处理没有设置 questionNum 的情况，例如返回或显示错误信息
    ElMessage.error("刷新异常，已返回");
    router.push({ name: 'Exercises' });
  } else {
    const mode = route.query.mode; // 使用 query.mode 获取模式 
    // console.log(mode);
    if (mode === 'new') {
      fetchQuizData();
    } else if (mode === 'review') {
      fetchReviewQuestions();
    }
  }
});

const isDataLoaded = ref(false); // 新增数据加载状态
const questionStore = useQuestionStore(); //pinia
const questionNum = questionStore.questionNum;  // 获取 题组数

const questions = ref([]); // 题目数据
const currentQuestion = ref(0); // 当前第几道题目
const showAnswer = ref(false); // 显示答案框
const responseOptions = [ // 响应质量
  { label: '完全不懂', value: 0, type: 'danger' },
  { label: '难懂', value: 1, type: 'warning' },
  { label: '不太懂', value: 2, type: 'custom' },
  { label: '懂了，但忘了', value: 3, type: 'info' },
  { label: '思考后能懂', value: 4, type: 'primary' },
  { label: '完全理解', value: 5, type: 'success' }
];
const updates = ref([]); // 存放响应质量数据
const isReStudy = ref(false); // 是否重复学习
const feedbackCounts = ref({ // 反馈试题数
  hard: 0,
  stable: 0,
  easy: 0
});

// 反馈处理
const addFeedback = (qualityScore) => {
  if (!isReStudy.value) {
    if (qualityScore < 3) {
      feedbackCounts.value.hard++;
    } else if (qualityScore == 3) {  // 有坑：一直用三等号，一直出错：qualityScore根本就不是number类型
      feedbackCounts.value.stable++;
    } else if (qualityScore >= 4) {
      feedbackCounts.value.easy++;
    }
  } else {
    if (qualityScore < 3) {
      // 不处理
    } else if (qualityScore == 3) {
      feedbackCounts.value.stable++;
      if (feedbackCounts.value.hard > 0) feedbackCounts.value.hard--;
    } else if (qualityScore >= 4) {
      feedbackCounts.value.easy++;
      if (feedbackCounts.value.hard > 0) feedbackCounts.value.hard--;
    }
  }
};
// 重置反馈
const resetFeedback = () => {
  feedbackCounts.value.hard = 0;
  feedbackCounts.value.stable = 0;
  feedbackCounts.value.easy = 0;
  isReStudy.value = false;
}
onMounted(resetFeedback);
// 获取新题目数据
const fetchQuizData = async () => {
  try {
    const token = sessionStorage.getItem('access');
    const response = await axios.get(`http://127.0.0.1:8081/api/learn/courses/${courseId}/question-learn?question_num=${questionNum}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    questions.value = response.data;
    // console.log(response.data);
    if (response.data.message === "暂无要学习试题！") {
      ElMessage.success(response.data.message);
      backToExercises();
    } else {
      isDataLoaded.value = true; // 数据加载完成
    }
  } catch (error) {
    console.error('错误:', error);
  }
}
// 获取复习试题数据
const fetchReviewQuestions = async () => {
  try {
    const token = sessionStorage.getItem('access');
    const response = await axios.get(`http://127.0.0.1:8081/api/learn/courses/${courseId}/question-review?question_num=${questionNum}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    questions.value = response.data;
    // console.log(response.data);
    if (response.data.message === "今天暂时无需要复习的试题！") {
      ElMessage.success(response.data.message);
      backToExercises();
    } else {
      isDataLoaded.value = true; // 数据加载完成
    }
  } catch (error) {
    console.error('错误:', error);
  }
}
// 显示答案
const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value;
};

// 返回刷题情况页面
const backToExercises = () => {
  router.push({ name: 'Exercises' });
};

// 选择响应质量
const submitResponse = (value) => {
  nextQuestion(value);
};

// 下一题
const nextQuestion = (values) => {
  updates.value.push({
    question_id: questions.value[currentQuestion.value].id,
    quality_score: values
  });
  addFeedback(values); // 反馈
  if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++;
    showAnswer.value = false;
  } else {
    processUpdates(); // 处理试题响应
  }
};
// 更新学习记录
const processUpdates = async () => {
  try {
    const token = sessionStorage.getItem('access');
    await axios.post(`http://127.0.0.1:8081/api/learn/courses/learning-records/`, {
      updates: updates.value
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    filterForReStudy();
  } catch (error) {
    console.error('更新失败', error);
  }
};

// 获取重新需要学习的试题
const filterForReStudy = () => {
  const questionsForReStudy = questions.value.filter(question =>
    updates.value.some(update => update.question_id === question.id && update.quality_score < 3)
  );
  if (questionsForReStudy.length > 0) {
    isReStudy.value = true; // 重复试题
    questions.value = questionsForReStudy;
    currentQuestion.value = 0;
    showAnswer.value = false;
    updates.value = [];
  } else {
    ElMessage.success("该组试题全部完成！");
    resetFeedback();
    backToExercises();
  }
};

</script>


<style scoped>
.quiz-container {
  margin: 20px;
}

.box-card,
.answer-card,
.explanation-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.response-buttons {
  display: flex;
  justify-content: space-around;
}

.el-button {
  margin: 10px 0;
}
/* 按钮主题 */
.el-button--custom {
  color: #ffffff;
  /* 设置文字颜色 */
  background-color: #6549b0;
  /* 设置按钮的背景颜色 */
  border-color: #6549b0;
  /* 设置边框颜色 */
}
.el-button--custom:hover,
.el-button--custom:focus {
  background-color: #7d5abe;
  border-color: #7d5abe;
}
.dialog-title {
  font-size: 1.5em;
  /* 标题字体大小 */
  color: #f39c12;
  /* 标题颜色 */
}
.dialog-summary{
  font-size: 1.2em;
  /* 标题字体大小 */
  color: #75eb71;
}
.dialog-subtitle {
  font-size: 1.2em;
  /* 副标题字体大小 */
  color: #6fe0ed;
  /* 副标题颜色 */
}
</style>

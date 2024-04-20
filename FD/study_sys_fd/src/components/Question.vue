<!-- 试题库 -->
<template>
  <div style="display: flex;">
    <!-- 新建试题 -->
    <create-question-form :courseId="courseId" :categories="categories" :objectives="objectives" />
  </div>
  <!-- 试题列表 -->
  <el-table :data="questions" style="width: 100%" stripe @row-click="toggleDetail">
    <el-table-column prop="content_markdown" label="题目">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="row.content_text" placement="top">
          <span>{{ truncateContent(row.content_text) }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="question_type" label="题型">
    </el-table-column>
    <el-table-column label="知识点">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="categoriesToString(row.categories)" placement="top">
          <span>{{ truncateContent(categoriesToString(row.categories)) }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="课程目标">
      <template #default="{ row }">
        <el-tooltip class="item" effect="dark" :content="objectivesToString(row.support_objectives)" placement="top">
          <span>{{ truncateContent(objectivesToString(row.support_objectives)) }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template #default="{ row }">
        <el-button type="primary" >编辑</el-button>
        <el-button type="danger" @click.stop="deleteQuestion(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 试题详情区域 -->
  <el-dialog v-model="dialogVisible" title="试题详情" width="60%">
    <div v-if="detailRow">
      <h3>题型：{{ detailRow.question_type }}</h3>
      <h2>题目：</h2>
      <md-preview v-model="detailRow.content_markdown" />
      <h2>答案：</h2>
      <md-preview v-model="detailRow.answer_markdown" />
      <h2>解析：</h2>
      <md-preview v-model="detailRow.explanation_markdown" />
      <!-- 其他信息，如答案、解析等 -->
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import CreateQuestionForm from './CreateQuestionForm.vue';
import { marked }from 'marked';
import { ElMessage, ElMessageBox } from 'element-plus';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const questions = ref([]);
// 课程id,接受父组件传过来的参数
const props = defineProps({
  courseId: Number
});

const categories = ref([]); // 存放知识点树状结构
const objectives = ref([]); // 存放支撑目标数据

// 获取知识点数据和支撑目标数据
async function fetchMetadata() {
  const token = sessionStorage.getItem('access');
  try {
    const [categoryResponse, objectiveResponse] = await Promise.all([
      axios.get(`http://127.0.0.1:8081/api/teach_admin/courses/${props.courseId}/category/`, {
        headers: {
          'Authorization': `Bearer ${token}` // 携带 token
        }
      }),
      axios.get(`http://127.0.0.1:8081/api/teach_admin/question/${props.courseId}/support-objectives/`, {
        headers: {
          'Authorization': `Bearer ${token}` // 携带 token
        }
      })
    ]);
    categories.value = categoryResponse.data;
    objectives.value = objectiveResponse.data;
  } catch (error) {
    console.error('错误:', error);
  }
}

// 将 Markdown 转换为纯文本
const markdownToPlainText = (markdown) => {
  const rawHtml = marked(markdown); // 将 Markdown 转换为 HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = rawHtml; // 将 HTML 放入一个临时 div 元素
  return tempDiv.textContent || tempDiv.innerText || ""; // 提取并返回纯文本
}
// 获取试题列表
const fetchQuestions = async () => {
  const token = sessionStorage.getItem('access');
  try {
    const response = await axios.get(`http://127.0.0.1:8081/api/teach_admin/courses/${props.courseId}/questions`, {
      headers: {
        'Authorization': `Bearer ${token}` // 携带 token
      }
    });
    questions.value = response.data.map(question => ({
      ...question,
      content_text: markdownToPlainText(question.content_markdown) // 使用转换函数
    }));
  } catch (error) {
    console.error('错误:', error);
  }
};

onMounted(fetchQuestions); // 获取试题
onMounted(fetchMetadata); // 获取知识点、支撑目标

// 题干只显示部分
const truncateContent = (text) => {
  return text.length > 15 ? text.substring(0, 15) + '...' : text;
};
// 知识点之间拼接逗号
const categoriesToString = (categories) => {
  return categories.map(cat => cat.name).join(', ');
};
// 支撑目标之间拼接逗号
const objectivesToString = (objectives) => {
  return objectives.map(obj => obj.name).join(', ');
};

// 试题详细触发
const detailRow = ref(null); // 详细数据
const dialogVisible  = ref(false);
const toggleDetail = (row) => {
  detailRow.value = row;
  dialogVisible.value = true;
};

// 删除试题
const deleteQuestion = async (row) => {
  ElMessageBox.confirm(
    '确定删除这个问题吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const token = sessionStorage.getItem('access'); 
      const url = `http://127.0.0.1:8081/api/teach_admin/question/${row.id}/delete`;
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // 如果成功，从列表中移除这个试题
      questions.value = questions.value.filter(question => question.id !== row.id);
      ElMessage.success('试题删除成功');
    } catch (error) {
      console.error('删除试题失败:', error);
      ElMessage.error('试题删除失败');
      fetchQuestions(); // 重新获取试题
    }
  }).catch(() => {
    ElMessage.info('删除操作已取消');
  });
}

</script>

<style scoped>
.item {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>

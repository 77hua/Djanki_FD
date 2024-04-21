<!-- 试题库 -->
<template>
  <div>
    <!-- 新建试题 -->
    <div style="display: flex;">
      <create-question-form :courseId="courseId" :categories="categories" :objectives="objectives"
        @questionCreated="handleQuestionCreated" /> <!-- @question-created监听子组件 -->
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
          <el-button type="primary" @click.stop="editQuestion(row)" >编辑</el-button>
          <el-button type="danger" @click.stop="deleteQuestion(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 试题详情区域 -->
    <el-dialog v-model="dialogVisible" title="试题详情" width="80%">
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
    <!-- 编辑试题区域 -->
    <el-dialog v-model="editDialogVisible" title="编辑试题" width="80%">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="题目类型">
          <el-select v-model="editForm.question_type" placeholder="请选择题目类型">
            <el-option v-for="type in questionTypes" :key="type.id" :label="type.name" :value="type.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程知识点">
          <el-tree-select v-model="editForm.categories" :data="categories" :props="title" placeholder="选择知识点" multiple
            node-key="id" show-checkbox>
          </el-tree-select>
          <el-tooltip content="请勿只选择知识分类而不选择知识点" placement="right">
            <el-icon style="color:#edb863; font-size: 24px;">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="课程的支撑目标">
          <el-select v-model="editForm.support_objectives" multiple placeholder="选择支撑目标">
            <el-option v-for="objective in objectives" :key="objective.id" :label="objective.name"
              :value="objective.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目简介">
          <el-input type="textarea" v-model="editForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="题干">
          <md-editor v-model="editForm.content_markdown" @onUploadImg="handleUploadImage" />
        </el-form-item>
        <el-form-item label="答案">
          <md-editor v-model="editForm.answer_markdown" @onUploadImg="handleUploadImage" />
        </el-form-item>
        <el-form-item label="答案解析">
          <md-editor v-model="editForm.explanation_markdown" @onUploadImg="handleUploadImage" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">提交</el-button> <!-- 提交修改 -->
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted,watchEffect,onUnmounted  } from 'vue';
import axios from 'axios';
import CreateQuestionForm from './CreateQuestionForm.vue';
import { marked } from 'marked';
import { ElMessage, ElMessageBox } from 'element-plus';
import { MdPreview, MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { QuestionFilled } from '@element-plus/icons-vue';


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

// 监听子组件是否创建试题
const handleQuestionCreated = () => {
  fetchQuestions();
  // 处理事件，例如刷新试题列表
};

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
const dialogVisible = ref(false);
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

// 编辑
const editDialogVisible = ref(false); // 控制编辑对话框
const editForm = ref({}); // 编辑表单
// 树形控件属性
const title = {
  label: 'name',
  children: 'children',
  value: 'id'
};
// 题型
const questionTypes = ref([
  { id: 1, name: '单选题' }, { id: 2, name: '多选题' },
  { id: 3, name: '填空题' }, { id: 4, name: '判断题' },
  { id: 5, name: '程序填空题' }, { id: 6, name: '编程题' },
  { id: 7, name: '简答题' }, { id: 8, name: '论述题' }
]);
// 点击编辑按钮，绑定试题数据并显示编辑对话框
const editQuestion = (question) => {
  editForm.value = {
    ...question,
    categories: question.categories.map(category => category.id), // 提取 ID
    support_objectives:question.support_objectives.map(support_objectives => support_objectives.id)
  };
  editDialogVisible.value = true; // 显示编辑对话框
};

// 使用 watchEffect 观察 editDialogVisible，当其变为 false 时清空表单
watchEffect(() => {
  if (!editDialogVisible.value) {
    editForm.value = {}; // 清空表单
  }
});

// 提交修改
const submitEdit = async () => {
  try {
    const token = sessionStorage.getItem('access');
    // 替换Markdown中的本地图片为URL
    editForm.value.content_markdown = await replaceLocalImagesWithUrls(editForm.value.content_markdown);
    editForm.value.answer_markdown = await replaceLocalImagesWithUrls(editForm.value.answer_markdown);
    editForm.value.answer_json = await replaceLocalImagesWithUrls(editForm.value.answer_json);
    editForm.value.answer_json = JSON.stringify(editForm.value.answer_markdown)
    editForm.value.explanation_markdown = await replaceLocalImagesWithUrls(editForm.value.explanation_markdown);
    // 修改type为id而不是name
    // 确保 `question_type` 是 ID
    editForm.value.question_type = questionTypes.value.find(
      (type) => type.name === editForm.value.question_type
    )?.id;
    if (editForm.value.explanation_markdown === "") { // 传一个空内容给解析
      editForm.value.explanation_markdown = "暂无解析"
    }
    await axios.put(
      `http://127.0.0.1:8081/api/teach_admin/question/${editForm.value.id}/detail`,
      editForm.value,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    editDialogVisible.value = false; // 关闭编辑对话框
    ElMessage.success('试题更新成功');
    fetchQuestions(); // 重新获取试题
  } catch (error) {
    ElMessage.error('试题更新失败');
    console.error('Error updating question:', error);
  }
};

const urlsToRevoke = ref([]); // 定义一个响应式数组来跟踪Blob URLs
// 上传图片在编辑器显示
function handleUploadImage(files, callback) {
  // 添加到编辑器浏览
  if (files.length > 0) {
    const file = files[0];  // 取第一个文件，或者你可以处理多个文件
    const url = URL.createObjectURL(file);  // 创建Blob URL
    urlsToRevoke.value.push(url); // 将新的Blob URL添加到跟踪数组
    // 构建图片URL对象，必要时可以包括 alt 和 title
    const imageObject = { url: url, alt: file.name, title: '' };
    // 使用回调函数将Blob URL传回编辑器
    callback([imageObject]);
  } else {
    console.error('文件上传失败！');
  }
}
// 清理 blob url
onUnmounted(() => {
  urlsToRevoke.value.forEach(url => URL.revokeObjectURL(url));
});
// 上传图片到服务器
async function uploadImageAndGetUrl(file) {
  const formData = new FormData();
  formData.append("image", file);
  const token = sessionStorage.getItem('access');
  try {
    const response = await axios.post('http://127.0.0.1:8081/api/teach_admin/upload_image/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    console.log("图片上传成功");
    return response.data.url;  // 假设服务器响应中包含了图片的URL
  } catch (error) {
    console.error("上传图片失败:", error);
    throw new Error("上传图片失败");
  }
}
// 替换markdown中的urls
async function replaceLocalImagesWithUrls(markdownText) {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const matches = [...markdownText.matchAll(imageRegex)];

  for (const match of matches) {
    const localUrl = match[1];
    if (localUrl.startsWith('blob:')) {
      const file = await fetch(localUrl).then(r => r.blob()); // 从Blob URL获取文件对象
      const url = await uploadImageAndGetUrl(file);
      markdownText = markdownText.replace(localUrl, 'http://127.0.0.1:8081/' + url); // 本地连接
    }
  }
  return markdownText;
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

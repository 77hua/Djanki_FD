<template>
  <div>
    <el-button type="primary" @click="showDialog = true" style="margin-right: 12px;">新建试题</el-button>
    <el-dialog v-model="showDialog" title="新建试题" width="60%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="题目类型">
          <el-select v-model="form.question_type" placeholder="请选择题目类型">
            <el-option v-for="type in questionTypes" :key="type.id" :label="type.name" :value="type.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程知识点">
          <el-tree-select v-model="form.categories" :data="categories" :props="title" placeholder="选择知识点" multiple
            node-key="id" show-checkbox>
          </el-tree-select>
          <el-tooltip content="请勿只选择知识分类而不选择知识点" placement="right">
            <el-icon style="color:#edb863; font-size: 24px;">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="课程的支撑目标">
          <el-select v-model="form.support_objectives" multiple placeholder="选择支撑目标">
            <el-option v-for="objective in objectives" :key="objective.id" :label="objective.name"
              :value="objective.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目简介">
          <el-input type="textarea" v-model="form.summary"></el-input>
        </el-form-item>
        <el-form-item label="题干">
          <md-editor v-model="form.content_markdown" @onUploadImg="handleUploadImage" />
        </el-form-item>
        <el-form-item label="答案">
          <md-editor v-model="form.answer_markdown" @onUploadImg="handleUploadImage" />
        </el-form-item>
        <el-form-item label="答案解析">
          <md-editor v-model="form.explanation_markdown" @onUploadImg="handleUploadImage" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, defineEmits } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

// 课程id，知识点、支撑目标
const props = defineProps({
  courseId: Number,
  categories: Array,
  objectives: Array
});

// 直接使用 props.categories 和 props.objectives，但要用计算属性，不然有异步问题
const categories = computed(() => props.categories);
const objectives = computed(() => props.objectives);
// 表单显示
const showDialog = ref(false);
// 树形控件属性
const title = {
  label: 'name',
  children: 'children',
  value: 'id'
};
// 表单
const form = ref({
  question_type: null,
  categories: [],
  support_objectives: [],
  summary: '',
  content_markdown: '',
  answer_markdown: '',
  answer_json: '',
  explanation_markdown: ''
});

// 题型
const questionTypes = ref([
  { id: 1, name: '单选题' }, { id: 2, name: '多选题' },
  { id: 3, name: '填空题' }, { id: 4, name: '判断题' },
  { id: 5, name: '程序填空题' }, { id: 6, name: '编程题' },
  { id: 7, name: '简答题' }, { id: 8, name: '论述题' }
]);

// 声明组件可以发出的事件
const emit = defineEmits(['questionCreated']);  // 声明事件
// 定义初始状态的表单
const initialForm = {
  question_type: null,
  categories: [],
  support_objectives: [],
  summary: '',
  content_markdown: '',
  answer_markdown: '',
  answer_json: '',
  explanation_markdown: ''
};
// 提交表单
const submitForm = async () => {
  try {
    const token = sessionStorage.getItem('access');
    // 替换Markdown中的本地图片为URL
    form.value.content_markdown = await replaceLocalImagesWithUrls(form.value.content_markdown);
    form.value.answer_markdown = await replaceLocalImagesWithUrls(form.value.answer_markdown);
    form.value.answer_json = await replaceLocalImagesWithUrls(form.value.answer_json);
    form.value.answer_json = JSON.stringify(form.value.answer_markdown)
    form.value.explanation_markdown = await replaceLocalImagesWithUrls(form.value.explanation_markdown);
    if (form.value.explanation_markdown === "") { // 传一个空内容给解析
      form.value.explanation_markdown = "暂无解析"
    }
    await axios.post(`http://127.0.0.1:8081/api/teach_admin/courses/${props.courseId}/questions/`, form.value, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    showDialog.value = false;
    // 发出事件通知父组件刷新列表
    emit('questionCreated');
    ElMessage.success('试题创建成功');
    // 重置表单内容
    form.value = { ...initialForm };
  } catch (error) {
    console.error('Error creating question:', error);
    ElMessage.error('试题创建失败');
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
<style scoped></style>

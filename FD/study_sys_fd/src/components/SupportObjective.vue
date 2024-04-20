<template>
  <div>
    <el-button type="primary" @click="showDialog = true">新建支撑目标</el-button>
    <!-- 支撑目标列表 -->
    <el-table :data="supportObjectives" style="width: 100%" stripe>
      <el-table-column prop="name" label="名称">
        <template #default="{ row }">
          <el-tooltip class="item" effect="dark" :content="row.name" placement="top">
            <span>{{ row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="目标描述">
        <template #default="{ row }">
          <el-tooltip class="item" effect="dark" :content="row.description" placement="top">
            <span>{{ row.description }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="danger" @click="deleteSupportObjective(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 支撑目标对话 -->
    <el-dialog title="新建支撑目标" v-model="showDialog" width="500px">
      <el-form :model="form">
        <el-form-item label="支撑目标名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitSupportObjective">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage,ElMessageBox } from 'element-plus'

const props = defineProps({
  courseId: Number
});

const supportObjectives = ref([]);

// 封装获取 Token 的函数
const getToken = () => sessionStorage.getItem('access');

// 获取支撑目标数据
onMounted(async () => {
  await fetchMetadata();
});
async function fetchMetadata() {
  const token = getToken();
  try {
    const response = await axios.get(`http://127.0.0.1:8081/api/teach_admin/question/${props.courseId}/support-objectives/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    supportObjectives.value = response.data;
  } catch (error) {
    console.error('错误:', error);
    ElMessage.error('加载支撑目标失败');
  }
}

const showDialog = ref(false);
const form = ref({ name: '', description: '' });

// 上传支撑目标api
const submitSupportObjective = async () => {
  const token = getToken();
  try {
    const response = await axios.post(`http://127.0.0.1:8081/api/teach_admin/question/${props.courseId}/support-objectives/`, form.value, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 201) {
      showDialog.value = false;
      form.value = { name: '', description: '' };
      ElMessage.success('添加成功');
      await fetchMetadata();
    }
  } catch (error) {
    ElMessage.error('新建失败: ' + (error.response?.data?.message || '未知错误'));
  }
};

// 删除支撑目标的方法
const deleteSupportObjective = async (row) => {
  // 显示确认对话框
  ElMessageBox.confirm(
    '确定要删除这个支撑目标吗？此操作不可撤销。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const token = sessionStorage.getItem('access');
    try {
      const response = await axios.delete(`http://127.0.0.1:8081/api/teach_admin/question/${props.courseId}/support-objectives/${row.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 || response.status === 204) {
        ElMessage.success('支撑目标删除成功');
        await fetchMetadata();
      }
    } catch (error) {
      console.error('删除支撑目标失败:', error);
      ElMessage.error('删除支撑目标失败: ' + (error.response?.data?.message || '未知错误'));
    }
  }).catch(() => {
    // 取消操作时的逻辑
    ElMessage.info('取消删除操作');
  });
};
</script>

<style scoped></style>
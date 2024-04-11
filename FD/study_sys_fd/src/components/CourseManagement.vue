<!-- 课程管理 -->
<template>
  <div id="courseManagement">
    <!-- 添加课程按钮 -->
    <el-button type="primary" @click="showCreateCourseDialog = true">添加课程</el-button>

    <!-- 课程列表 -->
    <el-table :data="courses" class="table_style"  @row-click="handleRowClick" stripe>
      <el-table-column prop="id" label="课程id"></el-table-column>
      <el-table-column prop="name" label="课程名称"></el-table-column>
      <el-table-column prop="description" label="课程简介"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="warning" @click.stop="showUpdateDialog(scope.row)">修改</el-button> <!-- 添加的修改按钮 -->
          <el-button type="danger" @click.stop="deleteCourse(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加课程对话框 -->
    <el-dialog v-model="showCreateCourseDialog" title="添加课程" :before-close="handleClose">
      <el-form ref="createCourseForm" :model="form" label-width="120px">
        <el-form-item label="课程名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="createCourse">确认添加</el-button>
      </template>
    </el-dialog>
    <!-- 修改课程对话框 -->
    <el-dialog v-model="showUpdateCourseDialog" title="修改课程" :before-close="handleUpdateClose">
      <el-form :model="updateForm">
        <el-form-item label="课程名称">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input v-model="updateForm.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUpdateCourseDialog = false">取消</el-button>
        <el-button type="primary" @click="updateCourse">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// 课程列表数据
const courses = ref([]);
const showCreateCourseDialog = ref(false);
const form = ref({ name: '', description: '' });
const showUpdateCourseDialog = ref(false);
const updateForm = ref({ id: '', name: '', description: '' });

// 获取课程列表
const fetchCourses = async () => {
  try {
    // 从 sessionStorage 中获取 token
    const token = sessionStorage.getItem('access');

    const response = await axios.get('http://127.0.0.1:8081/api/teach_admin/courses/', {
      headers: {
        'Content-Type': 'application/json',
        // 使用 Bearer 方案携带 token
        'Authorization': `Bearer ${token}`
      }
    });

    // Axios 自动处理 JSON 数据，所以无需手动解析
    courses.value = response.data; // 使用后端返回的课程数组
  } catch (error) {
    console.error("Error fetching courses:", error);

  }
};
onMounted(fetchCourses);  // 写在函数定义后面

// 创建课程的方法
const createCourse = async () => {
  try {
    const token = sessionStorage.getItem('access');
    await axios.post('http://127.0.0.1:8081/api/teach_admin/courses/', form.value, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    // 创建成功后关闭对话框并重置表单
    showCreateCourseDialog.value = false;
    form.value = { name: '', description: '' };
    // 重新获取课程列表
    await fetchCourses();
  } catch (error) {
    console.error("Error creating course:", error);
  }
};

// 对话框关闭前的处理逻辑
const handleClose = () => {
  form.value = { name: '', description: '' }; // 重置表单数据
  showCreateCourseDialog.value = false
};
// 删除课程
const deleteCourse = async (course) => {
  try {
    // 从 sessionStorage 中获取 token
    const token = sessionStorage.getItem('access');
    // 构造请求的完整URL，包括课程的ID
    const url = `http://127.0.0.1:8081/api/teach_admin/courses/${course.id}/`;

    await axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${token}` // 携带 token
      }
    });

    // 请求成功后的操作，例如提示用户删除成功
    // console.log('Course deleted successfully:', course.name);

    // 删除成功后，可以重新加载课程列表来更新视图
    fetchCourses();
  } catch (error) {
    // 处理错误，例如提示用户删除失败
    console.error('Error deleting course:', error);
  }
};

// 修改课程
const showUpdateDialog = (course) => {
  // 初始化表单数据
  updateForm.value = { ...course };
  showUpdateCourseDialog.value = true;
};
// 更新课程
const updateCourse = async () => {
  try {
    const token = sessionStorage.getItem('access');
    await axios.patch(`http://127.0.0.1:8081/api/teach_admin/courses/${updateForm.value.id}/`, updateForm.value, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // console.log('Course updated successfully');
    showUpdateCourseDialog.value = false;
    fetchCourses(); // 重新加载课程列表
  } catch (error) {
    console.error('Error updating course:', error);
  }
};

// 对话框关闭前重置表单
const handleUpdateClose = () => {
  updateForm.value = { id: '', name: '', description: '' };
};

// 进入课程详细
const handleRowClick = (row) => {
  router.push({ name: 'CourseDetail', params: { id: row.id } });
};
</script>

<style scoped>
.el-table__row:nth-child(even) {
  background-color: #452d2d;
}
.table_style{
  width: 100%; 
  margin-top: 20px; 
  cursor: pointer;
}
</style>

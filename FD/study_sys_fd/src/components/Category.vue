<!-- 知识点 -->
<template>
  <div id="category-box">
    <header class="header-container">
      <div class="title">课程知识点：</div>
      <el-button class="button" type="primary" @click="showCreateDialog = true">
        + 新建
      </el-button>
    </header>
    <!-- 树形控件展示知识点 -->
    <el-tree :data="categories" :props="defaultProps" node-key="id" highlight-current default-expand-all draggable
      :allow-drag="allowDrag" :allow-drop="allowDrop" :render-content="renderContent" @node-drag-end="onDragEnd"
      class="tree">
    </el-tree>
    <!-- 新建知识点/分类对话框 -->
    <el-dialog title="新建知识点/分类" v-model="showCreateDialog" :before-close="handleCloseCreateDialog">
      <el-form :model="createForm">
        <el-form-item label="名称">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="createForm.is_knowledge_point">
            <el-radio :value="false">知识分类</el-radio>
            <el-radio :value="true">知识点</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="createCategory">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElTree, ElMessageBox, ElMessage } from 'element-plus';
import axios from 'axios';
import { defineProps } from 'vue';


// 从CourseManagement传过来的课程id
const props = defineProps({
  courseId: Number
});

// 知识点数据
const categories = ref([]);
const showCreateDialog = ref(false);
// 创建知识点、知识类
const createForm = ref({
  name: '',
  is_knowledge_point: false
});
// 树形控件属性配置
const defaultProps = {
  children: 'children',
  label: 'name'
};
// 从后端获取知识点数据
const fetchCategories = async (courseId) => {
  try {
    // 从 sessionStorage 中获取 access 令牌
    const token = sessionStorage.getItem('access');

    const response = await axios.get(`http://127.0.0.1:8081/api/teach_admin/courses/${courseId}/category/`, {
      headers: {
        // 在请求头中设置 Authorization 字段，携带令牌
        'Authorization': `Bearer ${token}`
      }
    });

    categories.value = response.data; // 假设直接返回的就是知识点数据数组
  } catch (error) {
    console.error("未能获取知识点，原因:", error);
  }
};
// 虚拟DOM节点
const renderContent = (h, { node, data }) => {
  const icon = data.is_knowledge_point ? '🔖' : '📚'; // 根据是否是知识点显示不同图标

  return h('div', { style: 'display: flex; justify-content: space-between; align-items: center; width: 100%;font-size:18px' }, [
    h('span', [
      h('span', `${icon} `),
      h('span', `${data.order} - `), // 显示序号
      h('span', node.label), // 显示节点名称
    ]),
    h('span', [
      // 当 is_knowledge_point 为 false 时显示添加按钮
      !data.is_knowledge_point && h('el-button', {
        style: "color: #409eff; margin-right: 20px;",
        onClick: (e) => {
          e.stopPropagation();
          addCategory(data, node);
        }
      }, '添加'),
      h('span', {
        style: "color: #e7a767;margin-right:20px",
        onClick: (e) => {
          e.stopPropagation(); // 防止触发 node-click 事件
          editCategory(data, node);
        }
      }, '编辑'),
      h('span', {
        style: "color: #f57da3;",
        onClick: (e) => {
          e.stopPropagation(); // 防止触发 node-click 事件
          deleteCategory(data, node);
        }
      }, '删除')
    ])
  ]);
};
// 关闭新建对话框
const handleCloseCreateDialog = () => {
  createForm.value = { name: '', is_knowledge_point: false }; // 重置表单
  showCreateDialog.value = false
};

// 打开新建对话框
const addCategory = async (data, node) => {
  // 设置当前节点的ID作为即将创建的子项的parent_id
  createForm.value.parent_id = data.id; // 假设 `data.id` 是当前节点的ID

  // 显示创建对话框
  showCreateDialog.value = true;
};

// 添加知识点、知识分类
// 递归地查找具有特定ID的项
function findItemById(items, id) {
  for (let item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
const createCategory = async () => {
  try {
    const token = sessionStorage.getItem('access');

    // 基本的 order 计算，默认为顶层
    let newOrder = categories.value.filter(category => !category.parent).length + 1;

    // 如果存在 parent_id，查找父项
    if (createForm.value.parent_id) {
      const parentItem = findItemById(categories.value, createForm.value.parent_id);

      // 如果父项存在，并且我们在第二层或更深层，不允许添加知识分类
      if (parentItem && parentItem.parent && !createForm.value.is_knowledge_point) {
        throw new Error("在第二层只能添加知识点，不能添加知识分类");
      }

      // 计算新的 order
      if (parentItem && parentItem.children) {
        newOrder = parentItem.children.length + 1;
      }
    }

    const requestBody = {
      ...createForm.value,
      order: newOrder,
    };

    await axios.post(`http://127.0.0.1:8081/api/teach_admin/courses/${props.courseId}/category/`, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 关闭对话框并重置表单
    handleCloseCreateDialog();
    // 重新加载知识点数据
    await fetchCategories(props.courseId);
  } catch (error) {
    console.error("创建知识点/分类失败，原因:", error);
    ElMessageBox.alert(error.message || '发生错误', '错误', {
      confirmButtonText: '确定',
      type: 'error',
    });
  }
};

// 编辑知识点的方法
const editCategory = async (data) => {
  ElMessageBox.prompt('请输入新的名称', '编辑知识点', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: data.name, // 默认值为当前分类名
    inputValidator: (value) => {
      if (!value) {
        return '知识点不能为空';
      }
      return true;
    },
  }).then(async ({ value: newName }) => {
    try {
      const token = sessionStorage.getItem('access');
      const url = `http://127.0.0.1:8081/api/teach_admin/courses/${props.courseId}/category/${data.id}/`;
      await axios.put(url, { name: newName }, {
        headers: {
          // 替换成实际的认证方式
          'Authorization': `Bearer ${token}`,
        },
      });
      ElMessage({
        message: '更新成功',
        type: 'success',
      });
      fetchCategories(props.courseId)
    } catch (error) {
      ElMessage({
        message: '更新失败: ' + error.message,
        type: 'error',
      });
    }
  }).catch((err) => {
    // 处理取消操作或者prompt验证未通过的情况

  });
};
// 删除知识点
const deleteCategory = async (data) => {
  ElMessageBox.confirm('确定要删除这个分类吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 用户确认删除操作
    const token = sessionStorage.getItem('access');
    try {
      await axios.delete(`http://127.0.0.1:8081/api/teach_admin/courses/${props.courseId}/category/${data.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // 删除成功后的用户反馈
      ElMessage.success('删除成功');
      fetchCategories(props.courseId);
    } catch (error) {
      // 处理删除时发生的错误
      console.error('删除失败:', error);
      ElMessage.error('删除失败');
    }
  }).catch(() => {
    // 用户取消删除操作
    ElMessage.info('删除操作已取消');
  });
};

onMounted(() => fetchCategories(props.courseId));

// 拖拽类型
const allowDrag = (node) => {
  // 允许拖拽所有类型的节点
  return true;
};

// 拖拽
const allowDrop = (draggingNode, dropNode, type) => {
  // 允许任意拖拽，除了将知识分类拖拽到知识点里面
  if (!draggingNode.data.is_knowledge_point && dropNode.data.is_knowledge_point) {
    // 如果拖拽对象是分类，并且目标节点是知识点，则不允许拖拽
    return false;
  }
  // 禁止将知识分类添加到二级知识分类内部
  if (!draggingNode.data.is_knowledge_point && type === 'inner') {
    // 检查 dropNode 是否已经是二级分类
    if (dropNode.level === 2) {
      return false;
    }
    // 检查被拖拽的顶级分类是否包含二级分类
    if (draggingNode.data.children) {
      let hasSecondLevel = draggingNode.data.children.some(child => !child.is_knowledge_point);
      if (hasSecondLevel) {
        // 如果被拖拽的分类已经有二级子分类，禁止将其拖拽成其他分类的子分类
        return false;
      }
    }
  }
  // 不能将知识点添加到知识点
  if(draggingNode.data.is_knowledge_point && dropNode.data.is_knowledge_point ){
    return false;
  }
  if (dropNode.level === 2 && (type !== 'inner') && dropNode.data.is_knowledge_point === false) {
    return false;
  }
  // 其他情况均允许拖拽
  return true;
};
// 拖拽结束
const onDragEnd = (draggingNode, dropNode, dropType, ev) => {  
  // console.log(dropType);
  // 调用API更新后端数据
  if(dropType !== 'none'){ // 有拖拽再调用
    updateCategoryPosition(draggingNode, dropNode, dropType);
  }
};

// 调用拖拽知识点API
const updateCategoryPosition = async (draggingNode, dropNode, dropType) => {
  const token = sessionStorage.getItem('access');
  const url = `http://127.0.0.1:8081/api/teach_admin/courses/${props.courseId}/tree-update/`;
  const data = {
    draggedId: draggingNode.data.id,
    dropId: dropNode.data.id,
    type: dropType
  };
  try {
    await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    ElMessage.success('位置更新成功');
    fetchCategories(props.courseId); // 重新获取数据以更新视图
  } catch (error) {
    console.error('位置更新失败:', error);
    ElMessage.error('位置更新失败');
  }
};
</script>
<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
}

.title {
  margin-bottom: 10px;
  font-size: 20px;
  text-shadow: #f3f3f3 1px 1px 0, #b2b2b2 1px 2px 0;
  color: #123046;
}

.button {
  font-size: 18px;
}

.tree {
  padding: 10px;
}
</style>
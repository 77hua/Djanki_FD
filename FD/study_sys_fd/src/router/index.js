import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import("../views/Register.vue"),
    meta: { transitionName: 'slide' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { transitionName: 'slide' }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/course-detail/:id', // 使用动态路由匹配课程ID
    name: 'CourseDetail',
    props: true, // 允许路由组件接收路由参数作为props
    component: () => import('../views/CourseDetail.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

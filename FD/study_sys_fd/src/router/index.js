import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import("../views/Register.vue")
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // 前台：首页
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [ // 子组件 
      {
        path:'',
        name:"HomeSelect",
        component:() => import('@/components/HomeSelect.vue')
      },
      {
        path: 'study',
        name:'Study',
        component: () => import('../views/Study.vue')
      },
      {
        path:'exercises/:id',
        name:'Exercises',
        props: true,
        component: () => import('../views/Exercises.vue'),
      },
      {
        path:'quiz_page/:id',
        name:'QuizPage',
        props: true,
        component: () => import('../views/QuizPage.vue')
      },
      {
        path:'statistics',
        name:'Statistics',
        component: () => import('../views/Statistics.vue')
      }
    ]
  },
  // 后台：首页
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },
  // 后台：课程管理
  {
    path: '/course-detail/:id', // 使用动态路由匹配课程ID
    name: 'CourseDetail',
    props: true, // 允许路由组件接收路由参数作为props
    component: () => import('../views/CourseDetail.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  base: process.env.BASE_URL,
  routes
})

export default router

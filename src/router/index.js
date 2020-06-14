import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile')
  },
  {
    path: '/my-courses',
    name: 'MyCourses',
    component: () => import(/* webpackChunkName: "my courses" */ '../views/professor/MyCourses')
  },
  {
    path: '/selected-course/:id_c',
    name: 'Assignments',
    component: () => import(/* webpackChunkName: "assignments" */ '../views/professor/Assignments')
  },
  {
    path: '/all-courses/',
    name: 'AllCourses',
    component: () => import(/* webpackChunkName: "all courses" */ '../views/student/AllCourses')
  },
  {
    path: '/courses-member/',
    name: 'CoursesMem',
    component: () => import(/* webpackChunkName: "courses I'm a member of" */ '../views/student/CoursesMem')
  },
  {
    path: '/course-view/:id_c',
    name: 'CourseView',
    component: () => import(/* webpackChunkName: "Course view" */ '../views/student/CourseView')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

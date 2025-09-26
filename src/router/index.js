import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/',          component: () => import('@/views/Home.vue') },
  { path: '/info',      component: () => import('@/views/Info.vue') }, // 你的下一页
  // 404 兜底
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
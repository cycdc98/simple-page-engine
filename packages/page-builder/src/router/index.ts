import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/MainView.vue')
    },
    {
      path: '/display',
      name: 'display',
      component: () => import('@/views/DisplayView.vue')
    }
  ]
})

export default router

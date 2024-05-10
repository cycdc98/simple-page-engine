import { createRouter, createWebHashHistory } from 'vue-router'
import DisplayView from '@/views/DisplayView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'display',
      component: DisplayView
    }
  ]
})

export default router

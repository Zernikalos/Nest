import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'studio',
      component: () => import('@/views/StudioLoader.vue')
    }
  ]
})

export default router

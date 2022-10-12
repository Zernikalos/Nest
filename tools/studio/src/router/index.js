import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/exporter',
      name: 'exporter',
      component: () => import('@/views/StudioLoader.vue')
    }
  ]
})

export default router

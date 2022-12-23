import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/exporter',
      name: 'exporter',
      component: () => import('@studio/views/Exporter.vue')
    },
    {
      path: '/studio',
      name: 'studio',
      component: () => import('@studio/views/Studio.vue')
    }
  ]
})

export default router

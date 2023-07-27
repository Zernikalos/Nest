import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/exporter',
      name: 'exporter',
      component: () => import('@studio/pages/Exporter.vue')
    },
    {
      path: '/studio',
      name: 'studio',
      component: () => import('@studio/pages/Studio.vue')
    },
    {
      path: '/',
      redirect: '/studio'
    }
  ]
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/exporter',
      name: 'exporter',
      component: () => import('@nestui/pages/Exporter.vue')
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('@nestui/pages/Editor.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@nestui/pages/SettingsPage.vue')
    },
    {
      path: '/',
      redirect: '/editor'
    }
  ]
})

export default router

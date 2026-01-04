import { createRouter, createWebHistory } from 'vue-router'
import MapView from '@/views/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'map',
      component: MapView
    },
    {
      path: '/stats',
      name: 'stats',
      // Route pour futures statistiques
      component: () => import('@/views/StatsView.vue')
    },
    {
      path: '/upload',
      name: 'upload',
      // Route pour futur upload
      component: () => import('@/views/UploadView.vue')
    }
  ]
})

export default router

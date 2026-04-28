/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/block/:id',
      name: 'block-rooms',
      component: () => import('@/pages/rooms.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/room/:id',
      name: 'room-details',
      component: () => import('@/pages/room-details.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.initialize()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

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
      path: '/register',
      name: 'register',
      component: () => import('@/pages/register.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/pages/forgot-password.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/pages/reset-password.vue'),
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
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/pages/admin-dashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.token) {
    authStore.initialize()
  }

  const publicPages = ['login', 'register', 'forgot-password', 'reset-password']
  const authRequired = !publicPages.includes(to.name as string)
  const loggedIn = authStore.isAuthenticated

  if (authRequired && !loggedIn) {
    next('/login')
  } else if (loggedIn && publicPages.includes(to.name as string)) {
    next('/')
  } else {
    next()
  }
})


export default router

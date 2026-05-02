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
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('@/pages/admin/users.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/rooms',
      name: 'admin-rooms',
      component: () => import('@/pages/admin/rooms.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('@/pages/admin/bookings.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('@/pages/admin/settings.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/settings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: () => import('@/pages/my-bookings.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  if (!authStore.token) {
    authStore.initialize()
  }

  const publicPages = ['login', 'register', 'forgot-password', 'reset-password']
  const authRequired = !publicPages.includes(to.name as string)
  const loggedIn = authStore.isAuthenticated

  if (authRequired && !loggedIn) {
    return '/login'
  }
  
  if (loggedIn && publicPages.includes(to.name as string)) {
    return '/'
  }
  
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return '/'
  }
  
  if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
    return '/'
  }
})



export default router

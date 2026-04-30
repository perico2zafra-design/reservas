<template>
  <v-app class="app-shell">
    <!-- Desktop Sidebar -->
    <AppSidebar
      v-if="!$vuetify.display.mobile && authStore.isAuthenticated"
      v-model:drawer="drawer"
      :is-admin="authStore.isAdmin"
      @logout="handleLogout"
    />

    <!-- Shared Header -->
    <AppHeader
      v-if="authStore.isAuthenticated"
      :user-name="authStore.user?.name"
      :user-role="authStore.user?.role"
      :avatar-url="authStore.user?.avatar_url"
      :initials="userInitials"
      @toggle-drawer="drawer = !drawer"
      @logout="handleLogout"
    />

    <!-- Mobile Navigation -->
    <AppBottomNav
      v-if="$vuetify.display.mobile && authStore.isAuthenticated"
      :is-admin="authStore.isAdmin"
    />

    <!-- Main Content Area -->
    <v-main class="main-content">
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importación de sub-componentes de Layout
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppBottomNav from '@/components/layout/AppBottomNav.vue'

const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(true)

const userInitials = computed(() => {
  if (!authStore.user?.name) return 'U'
  const parts = authStore.user.name.split(' ')
  return parts.map(p => p[0]).slice(0,2).join('').toUpperCase()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  authStore.initialize()
})
</script>

<style>
/* Estilos globales simplificados en App.vue */
.app-shell {
  background: #f8fafc !important;
}
.main-content {
  min-height: 100vh;
}
</style>

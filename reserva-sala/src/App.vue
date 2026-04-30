<template>
  <v-app class="app-shell">
    <!-- Desktop Sidebar: Premium Glass -->
    <v-navigation-drawer
      v-if="!$vuetify.display.mobile && authStore.isAuthenticated"
      v-model="drawer"
      app
      floating
      width="300"
      class="sidebar-glass pa-6"
    >
      <div class="d-flex align-center mb-10 px-2 pt-4">
        <div class="logo-box-main me-3">
          <v-icon icon="mdi-office-building" color="white" size="20" />
        </div>
        <span class="app-logo-text">CAMPUS</span>
      </div>

      <div class="text-overline font-weight-black opacity-30 px-4 mb-4">MENÚ</div>
      <v-list nav class="pa-0">
        <v-list-item prepend-icon="mdi-home-variant-outline" title="Inicio" to="/" rounded="20" class="mb-2 py-4 nav-item-premium" active-class="nav-active" />
        <v-list-item prepend-icon="mdi-calendar-clock-outline" title="Mis Reservas" to="/my-bookings" rounded="20" class="mb-2 py-4 nav-item-premium" active-class="nav-active" />
      </v-list>

      <div v-if="authStore.isAdmin" class="mt-10">
        <div class="text-overline font-weight-black opacity-30 px-4 mb-4">GESTIÓN ADM.</div>
        <v-list nav class="pa-0">
          <v-list-item prepend-icon="mdi-account-group-outline" title="Vecinos" to="/admin/users" rounded="20" class="mb-2 py-4 nav-item-premium" active-class="nav-active" />
          <v-list-item prepend-icon="mdi-store-cog-outline" title="Instalaciones" to="/admin/rooms" rounded="20" class="mb-2 py-4 nav-item-premium" active-class="nav-active" />
          <v-list-item prepend-icon="mdi-shield-check-outline" title="Control Fianzas" to="/admin/bookings" rounded="20" class="mb-2 py-4 nav-item-premium" active-class="nav-active" />
        </v-list>
      </div>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn block color="error" variant="tonal" rounded="xl" prepend-icon="mdi-logout" class="font-weight-black" @click="handleLogout">
            Cerrar Sesión
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar: Minimalist Glass -->
    <v-app-bar flat class="app-bar-glass px-6" height="80">
      <v-app-bar-nav-icon v-if="!$vuetify.display.mobile" @click="drawer = !drawer" class="opacity-40" />
      <v-spacer />
      
      <div class="d-flex align-center">
        <v-btn icon="mdi-bell-outline" variant="text" size="small" class="me-4 opacity-40" />
        
        <v-menu location="bottom end" transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-flex align-center cursor-pointer profile-trigger">
              <div class="text-right me-4 d-none d-sm-block">
                <div class="text-subtitle-2 font-weight-black text-slate-900">{{ authStore.user?.name }}</div>
                <div class="text-caption opacity-50">{{ authStore.user?.role }}</div>
              </div>
              <v-avatar v-if="authStore.user?.avatar_url" size="44" class="elevation-4 border-2 border-white">
                <v-img :src="authStore.user.avatar_url" cover />
              </v-avatar>
              <v-avatar v-else size="44" class="elevation-4 premium-avatar border-2 border-white">
                <span>{{ userInitials }}</span>
              </v-avatar>
            </div>
          </template>
          <v-list rounded="24" class="mt-4 pa-2 shadow-2xl glass-panel" width="240">
            <v-list-item prepend-icon="mdi-account-circle-outline" title="Mi Perfil" to="/settings" rounded="xl" />
            <v-list-item prepend-icon="mdi-shield-outline" title="Privacidad" rounded="xl" />
            <v-divider class="my-2 opacity-5" />
            <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesión" color="error" rounded="xl" @click="handleLogout" />
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Mobile Navigation -->
    <v-bottom-navigation
      v-if="$vuetify.display.mobile && authStore.isAuthenticated"
      grow
      class="mobile-nav-glass"
      height="80"
    >
      <v-btn to="/" value="home">
        <v-icon>mdi-home-variant-outline</v-icon>
        <span>Inicio</span>
      </v-btn>
      <v-btn to="/my-bookings" value="bookings">
        <v-icon>mdi-calendar-clock-outline</v-icon>
        <span>Reservas</span>
      </v-btn>
      <v-btn v-if="authStore.isAdmin" to="/admin/users" value="admin">
        <v-icon>mdi-shield-account-outline</v-icon>
        <span>Admin</span>
      </v-btn>
    </v-bottom-navigation>

    <!-- Content Area -->
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
.app-shell {
  background: #f8fafc !important;
}

.sidebar-glass {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.app-bar-glass {
  background: rgba(248, 250, 252, 0.7) !important;
  backdrop-filter: blur(10px);
}

.logo-box-main {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.app-logo-text {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-item-premium {
  color: #64748b !important;
  transition: all 0.3s ease !important;
}

.nav-active {
  background: white !important;
  color: #6366f1 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
}

.premium-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.premium-avatar span {
  color: white !important;
  font-weight: 800 !important;
  font-size: 1rem;
}

.mobile-nav-glass {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.profile-trigger {
  padding: 4px 4px 4px 12px;
  border-radius: 30px;
  transition: all 0.2s ease;
}

.profile-trigger:hover {
  background: rgba(0,0,0,0.02);
}
</style>

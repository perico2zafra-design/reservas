<template>
  <v-app>
    <!-- Premium App Bar (Mobile & Desktop) -->
    <v-app-bar flat class="glass-app-bar px-4" height="70">
      <div class="d-flex align-center cursor-pointer" @click="$router.push('/')">
        <div class="logo-box me-3">
          <v-icon icon="mdi-home-modern" color="white" size="20" />
        </div>
        <span class="text-h6 font-weight-black letter-spacing-tight text-slate-900">CAMPUS</span>
      </div>
      
      <v-spacer />
      
      <v-btn icon="mdi-bell-outline" variant="text" size="small" class="me-3 opacity-60" />
      <v-menu location="bottom end" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="avatar-wrapper cursor-pointer">
            <v-avatar v-if="authStore.user?.avatar_url" size="40" class="elevation-2 border-2 border-primary">
              <v-img :src="authStore.user.avatar_url" cover />
            </v-avatar>
            <v-avatar v-else size="40" class="elevation-2 premium-gradient-avatar border-2 border-white">
              <span class="text-caption font-weight-black text-white">{{ userInitials }}</span>
            </v-avatar>
          </div>
        </template>
        <v-list rounded="xl" class="mt-3 pa-2 shadow-2xl glass-list" width="220">
          <v-list-item prepend-icon="mdi-account-circle-outline" title="Mi Perfil" to="/settings" rounded="lg" />
          <v-divider class="my-2 opacity-5" />
          <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesión" color="error" rounded="lg" @click="handleLogout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Desktop Navigation Drawer -->
    <v-navigation-drawer
      v-if="!$vuetify.display.mobile && authStore.isAuthenticated"
      v-model="drawer"
      app
      class="border-0 bg-slate-50"
      width="280"
    >
      <div class="pa-8 d-flex align-center">
        <span class="text-h6 font-weight-black text-gradient">Residencial Campus</span>
      </div>

      <v-list nav class="px-4">
        <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" to="/" rounded="xl" class="mb-2" />
        <v-list-item prepend-icon="mdi-calendar-month" title="Reservas" to="/my-bookings" rounded="xl" />
      </v-list>

      <template v-if="authStore.isAdmin" v-slot:prepend>
        <div class="text-overline px-8 mt-6 mb-2 opacity-50">ADMIN</div>
        <v-list nav class="px-4">
          <v-list-item prepend-icon="mdi-account-group" title="Vecinos" to="/admin/users" rounded="xl" />
          <v-list-item prepend-icon="mdi-office-building-cog" title="Salas" to="/admin/rooms" rounded="xl" />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- Mobile Bottom Navigation (Ultra Premium) -->
    <v-bottom-navigation
      v-if="$vuetify.display.mobile && authStore.isAuthenticated"
      grow
      color="primary"
      elevation="10"
      class="premium-bottom-nav"
    >
      <v-btn to="/" value="home">
        <v-icon>mdi-home-variant</v-icon>
        <span>Inicio</span>
      </v-btn>

      <v-btn to="/my-bookings" value="bookings">
        <v-icon>mdi-calendar-clock</v-icon>
        <span>Reservas</span>
      </v-btn>

      <v-btn v-if="authStore.isAdmin" to="/admin/users" value="admin">
        <v-icon>mdi-shield-account</v-icon>
        <span>Admin</span>
      </v-btn>

      <v-btn to="/settings" value="profile">
        <v-icon>mdi-account-circle</v-icon>
        <span>Tú</span>
      </v-btn>
    </v-bottom-navigation>

    <v-main class="bg-slate-50 pb-16 pb-sm-0">
      <v-container fluid class="pa-0">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>

</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const router = useRouter()
  const drawer = ref(true)


  const userInitials = computed(() => {
    if (!authStore.user?.name) return 'U'
    const parts = authStore.user.name.split(' ')
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0][0].toUpperCase()
  })

  const menuItems = computed(() => {
    const items = [
      { title: 'Bloques', icon: 'mdi-view-dashboard-outline', to: '/' },
    ]
    if (authStore.isAdmin) {
      items.push({ title: 'Dashboard', icon: 'mdi-chart-box-outline', to: '/admin' })
      items.push({ title: 'Usuarios', icon: 'mdi-account-group-outline', to: '/admin/users' })
      items.push({ title: 'Salas', icon: 'mdi-office-building-cog', to: '/admin/rooms' })
      items.push({ title: 'Reservas', icon: 'mdi-calendar-check', to: '/admin/bookings' })
    }
    if (authStore.isSuperAdmin) {
      items.push({ title: 'Configuración Base', icon: 'mdi-tune-vertical', to: '/admin/settings' })
    }
    items.push({ title: 'Mi Perfil', icon: 'mdi-account-outline', to: '/settings' })
    return items
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
.cursor-pointer {
  cursor: pointer;
}
</style>

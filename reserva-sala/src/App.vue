<template>
  <v-app>
    <!-- Show navigation only if authenticated and not on login page -->
    <template v-if="authStore.isAuthenticated && $route.name !== 'login'">
      <v-navigation-drawer
        v-model="drawer"
        app
        class="glass-card border-0"
        width="280"
        elevation="0"
      >
        <div class="pa-8 d-flex align-center">
          <div class="premium-icon-box me-3">
            <v-icon color="white" icon="mdi-office-building-marker" size="24" />
          </div>
          <span class="text-h6 font-weight-black text-gradient">Reserva Sala</span>
        </div>

        <v-list nav class="px-4">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            rounded="xl"
            class="mb-3 nav-item"
            active-class="premium-nav-active"
          />
        </v-list>

        <template v-slot:append>
          <div class="pa-6">
            <v-btn
              block
              variant="tonal"
              color="error"
              prepend-icon="mdi-logout"
              rounded="xl"
              class="text-none font-weight-bold"
              @click="handleLogout"
            >
              Cerrar Sesión
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar flat border-b class="glass-app-bar" elevation="0">
        <v-app-bar-nav-icon @click="drawer = !drawer" class="ms-2" />
        <v-spacer />
        
        <div class="d-flex align-center me-6">
          <v-btn icon="mdi-bell-outline" variant="text" class="me-2" />
          <div class="text-right me-4 d-none d-sm-block">
            <div class="text-subtitle-2 font-weight-bold">{{ authStore.user?.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ authStore.user?.role }}</div>
          </div>
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-avatar color="primary" size="40" class="cursor-pointer elevation-2" v-bind="props">
                <span class="text-subtitle-2 text-white">{{ authStore.user?.name.charAt(0) }}</span>
              </v-avatar>
            </template>
            <v-list rounded="xl" class="mt-2 glass-card border-0 shadow-lg">
              <v-list-item prepend-icon="mdi-account-outline" title="Mi Perfil" />
              <v-list-item prepend-icon="mdi-cog-outline" title="Ajustes" />
              <v-divider class="my-2" />
              <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesión" color="error" @click="handleLogout" />
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
    </template>

    <v-main :class="{'bg-premium-background': authStore.isAuthenticated}">
      <v-container :fluid="authStore.isAuthenticated" class="pa-0 fill-height d-block">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <div :class="{'pa-4 pa-md-10': authStore.isAuthenticated && $route.name !== 'login'}">
              <component :is="Component" />
            </div>
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

<template>
  <v-navigation-drawer
    v-model="internalDrawer"
    app
    floating
    width="300"
    class="sidebar-glass pa-6"
  >
    <!-- Logo Section -->
    <div class="d-flex align-center mb-10 px-2 pt-4 cursor-pointer" @click="$router.push('/')">
      <div class="logo-box-main me-3">
        <v-icon icon="mdi-office-building" color="white" size="20" />
      </div>
      <span class="app-logo-text">CAMPUS</span>
    </div>

    <!-- User Menu -->
    <div class="text-overline font-weight-black opacity-30 px-4 mb-4">MENÚ</div>
    <v-list nav class="pa-0">
      <v-list-item 
        v-for="item in menuItems" 
        :key="item.to"
        :prepend-icon="item.icon" 
        :title="item.title" 
        :to="item.to" 
        rounded="20" 
        class="mb-2 py-4 nav-item-premium" 
        active-class="nav-active" 
      />
    </v-list>

    <!-- Admin Section -->
    <div v-if="isAdmin" class="mt-10">
      <div class="text-overline font-weight-black opacity-30 px-4 mb-4">GESTIÓN ADM.</div>
      <v-list nav class="pa-0">
        <v-list-item 
          v-for="item in adminItems" 
          :key="item.to"
          :prepend-icon="item.icon" 
          :title="item.title" 
          :to="item.to" 
          rounded="20" 
          class="mb-2 py-4 nav-item-premium" 
          active-class="nav-active" 
        />
      </v-list>
    </div>

    <template v-slot:append>
      <div class="pa-4">
        <v-btn block color="error" variant="tonal" rounded="xl" prepend-icon="mdi-logout" class="font-weight-black" @click="$emit('logout')">
          Cerrar Sesión
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  drawer: boolean
  isAdmin: boolean
}>()

const emit = defineEmits(['update:drawer', 'logout'])

const internalDrawer = ref(props.drawer)
watch(() => props.drawer, (val) => internalDrawer.value = val)
watch(internalDrawer, (val) => emit('update:drawer', val))

const menuItems = [
  { title: 'Inicio', icon: 'mdi-home-variant-outline', to: '/' },
  { title: 'Mis Reservas', icon: 'mdi-calendar-clock-outline', to: '/my-bookings' }
]

const adminItems = [
  { title: 'Vecinos', icon: 'mdi-account-group-outline', to: '/admin/users' },
  { title: 'Instalaciones', icon: 'mdi-store-cog-outline', to: '/admin/rooms' },
  { title: 'Control Fianzas', icon: 'mdi-shield-check-outline', to: '/admin/bookings' },
  { title: 'Ajustes Portal', icon: 'mdi-cog-box', to: '/admin/settings' }
]
</script>

<style scoped>
.sidebar-glass {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.logo-box-main {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  width: 40px; height: 40px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}
.app-logo-text {
  font-size: 1.5rem; font-weight: 900; letter-spacing: -1.5px;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.nav-item-premium { color: #64748b !important; transition: all 0.3s ease !important; }
.nav-active {
  background: white !important;
  color: #6366f1 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
}
</style>

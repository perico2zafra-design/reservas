<template>
  <v-navigation-drawer
    v-model="internalDrawer"
    app
    floating
    width="280"
    class="sidebar-premium pa-4"
  >
    <div class="mesh-container">
      <div class="mesh-glow"></div>
    </div>
    <!-- Logo Section -->
    <div class="d-flex align-center mb-6 px-2 pt-2 cursor-pointer" @click="$router.push('/')">
      <div class="brand-logo-container me-3">
        <v-icon icon="mdi-shield-crown-outline" color="amber-darken-1" size="24" />
      </div>
      <div class="d-flex flex-column">
        <span class="brand-text-top">RESIDENCIAL</span>
        <span class="brand-text-bottom">CAMPUS</span>
      </div>
    </div>

    <!-- User Menu -->
    <div class="nav-section-title">MENÚ</div>
    <v-list nav class="pa-0">
      <v-list-item 
        v-for="item in menuItems" 
        :key="item.to"
        :to="item.to" 
        rounded="16" 
        class="mb-1 py-2 nav-item-premium" 
        active-class="nav-active" 
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" :color="item.color" class="me-4" />
        </template>
        <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Admin Section -->
    <div v-if="isAdmin" class="mt-6">
      <div class="nav-section-title">GESTIÓN ADM.</div>
      <v-list nav class="pa-0">
        <v-list-item 
          v-for="item in adminItems" 
          :key="item.to"
          :to="item.to" 
          rounded="16" 
          class="mb-2 py-3 nav-item-premium" 
          active-class="nav-active" 
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" :color="item.color" class="me-4" />
          </template>
          <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <template v-slot:append>
      <div class="pa-6">
        <v-btn block color="error" variant="flat" rounded="xl" prepend-icon="mdi-logout" class="font-weight-bold logout-btn-premium" height="50" @click="$emit('logout')">
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
  { title: 'Inicio', icon: 'mdi-home-variant-outline', to: '/', color: 'primary' },
  { title: 'Mis Reservas', icon: 'mdi-calendar-clock-outline', to: '/my-bookings', color: 'amber-darken-2' }
]

const adminItems = [
  { title: 'Vecinos', icon: 'mdi-account-group-outline', to: '/admin/users', color: 'indigo' },
  { title: 'Instalaciones', icon: 'mdi-store-cog-outline', to: '/admin/rooms', color: 'pink-darken-1' },
  { title: 'Control Fianzas', icon: 'mdi-shield-check-outline', to: '/admin/bookings', color: 'cyan-darken-2' },
  { title: 'Ajustes Portal', icon: 'mdi-cog-box', to: '/admin/settings', color: 'deep-purple' }
]
</script>

<style scoped>
.sidebar-premium {
  background: #0f172a !important; /* Dark Slate Blue */
  border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.mesh-container {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.1;
}

.mesh-glow {
  position: absolute;
  top: -20%; left: -20%;
  width: 140%; height: 140%;
  background: radial-gradient(circle at center, #6366f1 0%, transparent 70%);
  filter: blur(80px);
}

.brand-logo-container {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.brand-text-top {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1;
}

.brand-text-bottom {
  font-size: 1.4rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: #ffffff;
  font-family: 'Playfair Display', serif;
  line-height: 1.2;
}

.nav-section-title {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  padding: 0 16px;
  margin-bottom: 12px;
}

.nav-item-premium { 
  color: rgba(255, 255, 255, 0.6) !important; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  margin-bottom: 8px !important;
  font-weight: 600 !important;
}

.nav-item-premium:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
  transform: translateX(4px);
}

.nav-active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%) !important;
  color: white !important;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4), 
              inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.nav-active :deep(.v-icon) {
  color: white !important;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

.logout-btn-premium {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
  border: 1px solid rgba(239, 68, 68, 0.2) !important;
  transition: all 0.3s ease;
}

.logout-btn-premium:hover {
  background: #ef4444 !important;
  color: white !important;
  box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4) !important;
}
</style>

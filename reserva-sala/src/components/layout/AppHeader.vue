<template>
  <v-app-bar flat class="app-bar-glass px-6" height="80">
    <v-app-bar-nav-icon v-if="!$vuetify.display.mobile" @click="$emit('toggle-drawer')" class="opacity-40" />
    
    <v-spacer />
    
    <div class="d-flex align-center">
      <v-btn icon="mdi-bell-outline" variant="text" size="small" class="me-4 opacity-40" />
      
      <v-menu location="bottom end" transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-flex align-center cursor-pointer profile-trigger">
            <div class="text-right me-4 d-none d-sm-block">
              <div class="text-subtitle-2 font-weight-black text-slate-900">{{ userName }}</div>
              <div class="text-caption opacity-50">{{ userRole }}</div>
            </div>
            <v-avatar v-if="avatarUrl" size="44" class="elevation-4 border-2 border-white">
              <v-img :src="avatarUrl" cover />
            </v-avatar>
            <v-avatar v-else size="44" class="elevation-4 premium-avatar border-2 border-white">
              <span>{{ initials }}</span>
            </v-avatar>
          </div>
        </template>
        <v-list rounded="24" class="mt-4 pa-2 shadow-2xl glass-panel" width="240">
          <v-list-item prepend-icon="mdi-account-circle-outline" title="Mi Perfil" to="/settings" rounded="xl" />
          <v-divider class="my-2 opacity-5" />
          <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesión" color="error" rounded="xl" @click="$emit('logout')" />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
defineProps<{
  userName?: string
  userRole?: string
  avatarUrl?: string
  initials: string
}>()

defineEmits(['toggle-drawer', 'logout'])
</script>

<style scoped>
.app-bar-glass {
  background: rgba(248, 250, 252, 0.7) !important;
  backdrop-filter: blur(10px);
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

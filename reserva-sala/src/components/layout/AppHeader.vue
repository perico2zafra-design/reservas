<template>
  <v-app-bar flat class="header-premium px-6" height="70">
    <v-app-bar-nav-icon v-if="!$vuetify.display.mobile" @click="$emit('toggle-drawer')" class="icon-btn-refined" />
    
    <!-- Mobile Brand Identity -->
    <div v-if="$vuetify.display.mobile" class="d-flex align-center">
      <div class="mobile-brand-mark me-3 d-flex align-center justify-center">
        <v-icon icon="mdi-shield-crown-outline" color="amber-darken-1" size="18" />
      </div>
      <div class="d-flex flex-column">
        <span class="mobile-brand-top">RESIDENCIAL</span>
        <span class="mobile-brand-bottom">CAMPUS</span>
      </div>
    </div>

    <v-spacer />
    
    <div class="d-flex align-center ga-3">
      <v-btn icon="mdi-bell-outline" variant="text" size="small" class="icon-btn-refined" />
      
      <v-menu location="bottom end" transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-flex align-center cursor-pointer profile-trigger ms-2">
            <div class="text-right me-3 d-none d-sm-block">
              <div class="text-subtitle-2 font-weight-black text-white-op leading-tight">{{ userName }}</div>
              <div class="text-caption font-weight-bold text-amber-op text-uppercase letter-spacing-lg">{{ userRole }}</div>
            </div>
            <v-avatar v-if="avatarUrl" :size="$vuetify.display.mobile ? 34 : 38" class="elevation-4 border-2 border-white">
              <v-img :src="avatarUrl" cover />
            </v-avatar>
            <v-avatar v-else :size="$vuetify.display.mobile ? 34 : 38" class="elevation-4 premium-avatar border-2 border-white">
              <span>{{ initials }}</span>
            </v-avatar>
          </div>
        </template>
        <v-list rounded="24" class="mt-4 pa-2 glass-panel" width="240">
          <v-list-item prepend-icon="mdi-account-circle-outline" title="Mi Perfil" to="/settings" rounded="xl" class="py-3 font-weight-bold" />
          <v-divider class="my-2 opacity-5" />
          <v-list-item 
            prepend-icon="mdi-logout" 
            title="Cerrar Sesión" 
            rounded="xl" 
            class="py-3 font-weight-bold logout-menu-item" 
            @click="$emit('logout')" 
          />
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
.header-premium {
  background: #0f172a !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
}

.icon-btn-refined {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.5) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-btn-refined:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fbbf24 !important;
  border-color: rgba(251, 191, 36, 0.3) !important;
  transform: translateY(-1px);
}

.profile-trigger {
  padding: 3px 3px 3px 12px;
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-trigger:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 215, 0, 0.25) !important;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.1);
}

.premium-avatar {
  background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%) !important;
  color: #0f172a !important;
  font-weight: 900;
  border: 2px solid rgba(255, 255, 255, 0.1) !important;
}

.mobile-brand-mark {
  width: 32px; height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 8px;
}

.mobile-brand-top {
  font-size: 0.45rem;
  font-weight: 800;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1;
}

.mobile-brand-bottom {
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #ffffff;
  font-family: 'Playfair Display', serif;
  line-height: 1.1;
}

.text-white-op {
  color: rgba(255, 255, 255, 0.95) !important;
  font-size: 0.8rem !important;
}

.text-amber-op {
  color: #fbbf24 !important;
  font-size: 0.6rem !important;
  font-weight: 700 !important;
  letter-spacing: 2px !important;
  opacity: 0.8;
}

.logout-menu-item {
  color: rgba(255, 255, 255, 0.6) !important;
  transition: all 0.3s ease;
}

.logout-menu-item:hover {
  background: rgba(251, 191, 36, 0.08) !important;
  color: #fbbf24 !important;
}

@media (max-width: 600px) {
  .header-premium {
    height: 60px !important;
    padding: 0 12px !important;
  }
  
  :deep(.v-toolbar__content) {
    height: 60px !important;
    padding: 0 12px !important;
  }

  .profile-trigger {
    padding: 2px !important;
    background: transparent !important;
    border: none !important;
  }
}
</style>

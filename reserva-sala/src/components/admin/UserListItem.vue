<script setup lang="ts">
import InitialAvatar from '@/components/common/InitialAvatar.vue'

defineProps<{
  user: any
}>()

defineEmits(['update-status', 'open-block', 'confirm-delete'])
</script>

<template>
  <v-card 
    rounded="xl" 
    class="mb-4 pa-5 border-0 premium-neighbor-card elevation-1"
  >
    <div class="d-flex align-center">
      <div class="avatar-wrapper me-4">
        <InitialAvatar :name="user.first_name" :url="user.avatar_url" size="56" />
        <div v-if="user.status === 'APPROVED'" class="status-indicator-online"></div>
      </div>
      
      <div class="flex-grow-1">
        <div class="d-flex align-center flex-wrap ga-2 mb-1">
          <span class="neighbor-name text-slate-900">{{ user.first_name }} {{ user.last_name }}</span>
          <v-chip v-if="user.role === 'ADMIN'" size="x-small" class="role-chip-admin">ADMIN</v-chip>
        </div>
        <div class="d-flex align-center text-slate-500">
          <v-icon icon="mdi-map-marker-outline" size="14" class="me-1" />
          <span class="location-text">Portal {{ user.portal }}, {{ user.floor }}º{{ user.letter }}</span>
        </div>
      </div>
      
      <!-- Premium Actions Menu -->
      <v-menu location="bottom end" transition="scale-transition" offset="10">
        <template v-slot:activator="{ props }">
          <v-btn 
            icon="mdi-dots-horizontal" 
            variant="tonal" 
            color="slate-300" 
            size="small"
            v-bind="props"
            class="action-btn-refined"
          />
        </template>
        <v-list class="dropdown-premium pa-2" width="200">
          <v-list-item 
            v-if="user.status === 'PENDING'" 
            prepend-icon="mdi-check-decagram-outline" 
            title="Admitir" 
            class="menu-item-premium"
            @click="$emit('update-status', user.id, 'APPROVED')" 
          />
          <v-list-item 
            v-if="user.status === 'APPROVED'" 
            prepend-icon="mdi-block-helper" 
            title="Bloquear" 
            class="menu-item-premium"
            @click="$emit('open-block', user)" 
          />
          <v-list-item 
            v-if="user.status === 'BLOCKED'" 
            prepend-icon="mdi-account-check-outline" 
            title="Desbloquear" 
            class="menu-item-premium"
            @click="$emit('update-status', user.id, 'APPROVED')" 
          />
          <v-divider class="my-2 border-white-op" />
          <v-list-item 
            prepend-icon="mdi-delete-outline" 
            title="Eliminar" 
            class="menu-item-premium logout-item" 
            @click="$emit('confirm-delete', user)" 
          />
        </v-list>
      </v-menu>
    </div>

    <!-- Block Info Banner -->
    <v-expand-transition>
      <div v-if="user.status === 'BLOCKED' && user.blocked_until" class="mt-4 block-banner pa-3 rounded-lg d-flex align-center">
        <v-icon icon="mdi-alert-circle-outline" size="18" class="me-2" />
        <div class="d-flex flex-column">
          <span class="font-weight-black text-uppercase text-tiny letter-spacing-lg">Sanción Activa</span>
          <span class="text-caption">Hasta el {{ new Date(user.blocked_until).toLocaleDateString() }}</span>
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.premium-neighbor-card {
  background: white;
  border: 1px solid #f1f5f9 !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.premium-neighbor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05) !important;
  border-color: #e2e8f0 !important;
}

.avatar-wrapper {
  position: relative;
}

.status-indicator-online {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.neighbor-name {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.5px;
}

.location-text {
  font-size: 0.85rem;
  font-weight: 500;
}

.role-chip-admin {
  background: #0f172a !important;
  color: #fbbf24 !important;
  font-weight: 900 !important;
  border-radius: 4px !important;
}

.action-btn-refined {
  background: #f8fafc !important;
  color: #64748b !important;
}

.block-banner {
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #ef4444;
}

.letter-spacing-lg {
  letter-spacing: 1px;
}

.text-tiny {
  font-size: 0.6rem;
}

/* Custom Dropdown Override for Card Menu */
.dropdown-premium {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  border-radius: 12px !important;
}

.menu-item-premium {
  color: rgba(255, 255, 255, 0.7) !important;
  border-radius: 8px !important;
  margin-bottom: 2px;
  transition: all 0.2s ease;
}

.menu-item-premium:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #fbbf24 !important;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.08) !important;
  color: #ef4444 !important;
}

.border-white-op {
  border-color: rgba(255, 255, 255, 0.05) !important;
}
</style>

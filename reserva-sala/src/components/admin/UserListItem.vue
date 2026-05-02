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
    class="mb-6 border-0 luxury-clean-card elevation-1 d-flex flex-column h-100"
  >
    <!-- Subtle Gold Top Accents -->
    <div class="luxury-accent-line"></div>

    <div class="pa-6 d-flex flex-column flex-grow-1">
      <div class="d-flex align-center mb-6 identity-section">
        <div class="avatar-luxury me-5">
          <InitialAvatar :name="user.first_name" :url="user.avatar_url" size="68" />
          <div v-if="user.status === 'APPROVED'" class="status-indicator-gold"></div>
        </div>
        
        <div class="flex-grow-1">
          <div class="d-flex align-center flex-wrap ga-2">
            <span class="luxury-name">{{ user.first_name }} {{ user.last_name }}</span>
            <span v-if="user.role === 'ADMIN'" class="admin-luxury-tag">ADMIN</span>
          </div>
          <div class="d-flex align-center mt-1">
            <span class="luxury-meta-label">PORTAL {{ user.portal }}</span>
            <span class="mx-3 luxury-meta-dot"></span>
            <span class="luxury-meta-label">{{ user.floor }}º{{ user.letter }}</span>
          </div>
        </div>
      </div>

      <v-spacer />

      <!-- VISIBLE ACTIONS - CLEAN LUXURY -->
      <div class="luxury-actions-wrapper mt-2">
        <template v-if="user.status === 'PENDING'">
          <v-btn 
            block 
            flat 
            height="48"
            class="btn-luxury-primary mb-3"
            @click="$emit('update-status', user.id, 'APPROVED')"
          >
            <v-icon icon="mdi-check-circle-outline" class="me-2" size="20" />
            ADMITIR VECINO
          </v-btn>
        </template>
        
        <template v-if="user.status === 'APPROVED'">
          <v-btn 
            block 
            variant="outlined" 
            height="48"
            class="btn-luxury-outlined mb-3"
            @click="$emit('open-block', user)"
          >
            <v-icon icon="mdi-shield-alert-outline" class="me-2" size="20" />
            SANCIONAR RESIDENTE
          </v-btn>
        </template>

        <template v-if="user.status === 'BLOCKED'">
          <v-btn 
            block 
            flat 
            height="48"
            class="btn-luxury-primary mb-3"
            @click="$emit('update-status', user.id, 'APPROVED')"
          >
            <v-icon icon="mdi-refresh" class="me-2" size="20" />
            REHABILITAR ACCESO
          </v-btn>
        </template>

        <v-btn 
          block 
          variant="text" 
          height="40"
          class="btn-luxury-danger"
          @click="$emit('confirm-delete', user)"
        >
          <v-icon icon="mdi-trash-can-outline" class="me-2" size="18" />
          ELIMINAR CUENTA
        </v-btn>
      </div>
    </div>

    <!-- Sanción Info - Refined -->
    <v-expand-transition>
      <div v-if="user.status === 'BLOCKED' && user.blocked_until" class="luxury-blocked-banner pa-3 d-flex align-center justify-center">
        <v-icon icon="mdi-alert-decagram-outline" size="16" class="me-2 gold-text" />
        <span class="luxury-banner-text">BAJO RESTRICCIÓN HASTA EL <span class="font-weight-black">{{ new Date(user.blocked_until).toLocaleDateString() }}</span></span>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.luxury-clean-card {
  background: #ffffff;
  border: 1px solid #f1f5f9 !important;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  position: relative;
  min-height: 240px;
}

.identity-section {
  min-height: 60px;
}

.luxury-accent-line {
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, transparent 0%, #d4af37 50%, transparent 100%);
  opacity: 0.3;
}

.luxury-clean-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.12) !important;
  border-color: #d4af37 !important;
}

.luxury-clean-card:hover .luxury-accent-line {
  opacity: 1;
}

.avatar-luxury {
  position: relative;
  padding: 4px;
  background: #f8fafc;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
}

.status-indicator-gold {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 14px;
  height: 14px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
}

.luxury-name {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.admin-luxury-tag {
  font-size: 0.6rem;
  font-weight: 900;
  background: #0f172a;
  color: #fbbf24;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.luxury-meta-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: #64748b;
  letter-spacing: 0.5px;
}

.luxury-meta-dot {
  width: 4px;
  height: 4px;
  background: #cbd5e1;
  border-radius: 50%;
}

/* LUXURY BUTTONS */
.btn-luxury-primary {
  background: #0f172a !important;
  color: #ffffff !important;
  font-weight: 800 !important;
  letter-spacing: 1.5px !important;
  font-size: 0.85rem !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.btn-luxury-primary:hover {
  background: #1e293b !important;
  color: #fbbf24 !important;
  transform: scale(1.02);
}

.btn-luxury-outlined {
  border: 2px solid #0f172a !important;
  color: #0f172a !important;
  font-weight: 800 !important;
  letter-spacing: 1px !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.btn-luxury-outlined:hover {
  background: #f1f5f9 !important;
  border-color: #d4af37 !important;
  color: #d4af37 !important;
}

.btn-luxury-danger {
  color: #94a3b8 !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.5px !important;
}

.btn-luxury-danger:hover {
  color: #ef4444 !important;
  background: #fef2f2 !important;
}

/* BANNER */
.luxury-blocked-banner {
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.luxury-banner-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 1px;
}

.gold-text {
  color: #d4af37 !important;
}
</style>

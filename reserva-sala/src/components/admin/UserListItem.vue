<template>
  <v-card 
    rounded="24" 
    class="mb-4 pa-4 border-0 elevation-xl premium-user-card"
  >
    <div class="d-flex align-center">
      <InitialAvatar :name="user.first_name" :url="user.avatar_url" size="48" class="me-4" />
      <div class="flex-grow-1">
        <div class="d-flex align-center">
          <span class="font-weight-black text-slate-900 me-2">{{ user.first_name }} {{ user.last_name }}</span>
          <v-chip v-if="user.role === 'ADMIN'" size="x-small" color="primary" variant="flat">ADMIN</v-chip>
        </div>
        <div class="text-caption text-slate-500">Portal {{ user.portal }}, {{ user.floor }}º{{ user.letter }}</div>
      </div>
      
      <!-- Acciones Contextuales -->
      <v-menu location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" color="slate-400" v-bind="props" />
        </template>
        <v-list rounded="xl" class="elevation-xl pa-2">
          <v-list-item v-if="user.status === 'PENDING'" prepend-icon="mdi-check-decagram" title="Admitir" color="success" @click="$emit('update-status', user.id, 'APPROVED')" />
          <v-list-item v-if="user.status === 'APPROVED'" prepend-icon="mdi-block-helper" title="Bloquear" color="warning" @click="$emit('open-block', user)" />
          <v-list-item v-if="user.status === 'BLOCKED'" prepend-icon="mdi-account-check" title="Desbloquear" color="success" @click="$emit('update-status', user.id, 'APPROVED')" />
          <v-divider class="my-2 opacity-10" />
          <v-list-item prepend-icon="mdi-delete-outline" title="Eliminar" color="error" @click="$emit('confirm-delete', user)" />
        </v-list>
      </v-menu>
    </div>

    <!-- Info de Bloqueo -->
    <div v-if="user.status === 'BLOCKED' && user.blocked_until" class="mt-3 pa-2 bg-amber-lighten-5 rounded-lg text-caption text-amber-darken-4 d-flex align-center">
      <v-icon icon="mdi-clock-outline" size="14" class="me-2" />
      Bloqueado hasta: {{ new Date(user.blocked_until).toLocaleDateString() }}
    </div>
  </v-card>
</template>

<script setup lang="ts">
import InitialAvatar from '@/components/common/InitialAvatar.vue'

defineProps<{
  user: any
}>()

defineEmits(['update-status', 'open-block', 'confirm-delete'])
</script>

<style scoped>
.premium-user-card { transition: transform 0.2s ease; }
.premium-user-card:active { transform: scale(0.98); }
</style>

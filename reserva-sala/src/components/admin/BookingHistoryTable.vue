<template>
  <v-card rounded="xl" class="glass-card border-0 elevation-4 overflow-hidden">
    <v-toolbar flat color="transparent" class="px-4">
      <v-toolbar-title class="font-weight-black">Actividad Reciente</v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar reserva..."
        variant="solo-filled"
        density="compact"
        rounded="lg"
        flat
        hide-details
        class="max-width-300"
      />
    </v-toolbar>
    
    <v-table class="bg-transparent">
      <thead>
        <tr>
          <th class="text-overline font-weight-black">Usuario</th>
          <th class="text-overline font-weight-black">Sala / Bloque</th>
          <th class="text-overline font-weight-black">Fecha y Hora</th>
          <th class="text-overline font-weight-black">Duración</th>
          <th class="text-overline font-weight-black">Estado</th>
          <th class="text-overline font-weight-black">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in filteredBookings" :key="booking.id" class="hover-row">
          <td>
            <div class="d-flex align-center py-3">
              <v-avatar size="32" color="primary-lighten-4" class="me-3">
                <span class="text-caption font-weight-bold text-primary">{{ booking.userId.charAt(0) }}</span>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-bold">{{ booking.userId }}</div>
                <div class="text-caption text-medium-emphasis">ID: #{{ booking.id }}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="text-body-2 font-weight-bold">{{ booking.Room?.name }}</div>
            <div class="text-caption text-primary">Bloque: {{ booking.Room?.blockId }}</div>
          </td>
          <td>
            <div class="text-body-2">{{ formatDate(booking.startTime) }}</div>
          </td>
          <td>
            <v-chip size="small" variant="outlined" color="primary" class="font-weight-bold">
              {{ calculateDuration(booking.startTime, booking.endTime) }}h
            </v-chip>
          </td>
          <td>
            <v-chip size="x-small" :color="getStatusColor(booking)" class="font-weight-black">
              {{ getStatusText(booking) }}
            </v-chip>
          </td>
          <td>
            <v-btn icon="mdi-dots-vertical" variant="text" size="small" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  bookings: any[]
}>()

const search = ref('')

const filteredBookings = computed(() => {
  if (!search.value) return props.bookings
  return props.bookings.filter(b => 
    b.Room?.name.toLowerCase().includes(search.value.toLowerCase()) ||
    b.userId.toLowerCase().includes(search.value.toLowerCase())
  )
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const calculateDuration = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return (diff / (1000 * 60 * 60)).toFixed(1)
}

const getStatusColor = (booking: any) => {
  const end = new Date(booking.endTime)
  return end < new Date() ? 'success' : 'primary'
}

const getStatusText = (booking: any) => {
  const end = new Date(booking.endTime)
  return end < new Date() ? 'COMPLETADO' : 'PRÓXIMO'
}
</script>

<style scoped>
.hover-row:hover {
  background: rgba(var(--v-theme-primary), 0.02);
}
.max-width-300 {
  max-width: 300px;
}
</style>

<template>
  <div class="premium-page">
    <div class="mb-10">
      <h1 class="text-h3 font-weight-black mb-2 text-gradient">Panel de Control</h1>
      <p class="text-subtitle-1 text-medium-emphasis font-weight-medium">Gestión administrativa, analíticas y miembros.</p>
    </div>

    <v-tabs
      v-model="activeTab"
      bg-color="transparent"
      color="primary"
      grow
      class="mb-8 premium-tabs"
    >
      <v-tab value="stats" class="text-none font-weight-bold">
        <v-icon start icon="mdi-chart-box-outline" /> Estadísticas
      </v-tab>
      <v-tab value="history" class="text-none font-weight-bold">
        <v-icon start icon="mdi-history" /> Histórico
      </v-tab>
      <v-tab value="members" class="text-none font-weight-bold">
        <v-icon start icon="mdi-account-group-outline" /> Miembros
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Statistics Tab -->
      <v-window-item value="stats">
        <v-row>
          <v-col v-for="user in stats" :key="user.email" cols="12" md="4">
            <v-card rounded="xl" class="glass-card pa-6 hover-lift border-0 elevation-2">
              <div class="d-flex align-center mb-6">
                <v-avatar color="primary" size="56" class="me-4 elevation-4">
                  <span class="text-h5 text-white font-weight-bold">{{ user.name.charAt(0) }}</span>
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-black">{{ user.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ user.email }}</div>
                </div>
              </div>
              
              <v-divider class="mb-6" />
              
              <v-row no-gutters>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis mb-1">Horas Totales</div>
                  <div class="text-h4 font-weight-black text-primary">{{ user.totalHours.toFixed(1) }}h</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis mb-1">Reservas</div>
                  <div class="text-h4 font-weight-black text-secondary">{{ user.totalBookings }}</div>
                </v-col>
              </v-row>
              
              <v-progress-linear
                :model-value="(user.totalHours / 100) * 100"
                color="primary"
                height="8"
                rounded
                class="mt-6"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- History Tab -->
      <v-window-item value="history">
        <v-card rounded="xl" class="glass-card border-0 elevation-2">
          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left font-weight-black">Usuario</th>
                <th class="text-left font-weight-black">Sala</th>
                <th class="text-left font-weight-black">Fecha</th>
                <th class="text-left font-weight-black">Duración</th>
                <th class="text-left font-weight-black">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in history" :key="booking.id">
                <td>
                  <div class="font-weight-bold">{{ booking.userId }}</div>
                </td>
                <td>
                  <v-chip size="small" variant="tonal" color="primary" class="font-weight-bold">
                    {{ booking.Room?.name }}
                  </v-chip>
                </td>
                <td>{{ formatDate(booking.startTime) }}</td>
                <td>{{ calculateDuration(booking.startTime, booking.endTime) }}h</td>
                <td>
                  <v-chip size="x-small" color="success" class="font-weight-black">COMPLETADO</v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

      <!-- Members Tab -->
      <v-window-item value="members">
        <v-card rounded="xl" class="glass-card pa-8 border-0 elevation-2">
          <div class="text-center pa-10">
            <v-icon icon="mdi-account-search-outline" size="64" color="medium-emphasis" class="mb-4" />
            <h3 class="text-h5 font-weight-bold mb-2">Buscador Global de Miembros</h3>
            <p class="text-medium-emphasis mb-6">Próximamente: Gestiona todos los usuarios de la plataforma desde aquí.</p>
            <v-btn color="primary" rounded="xl" size="large" class="text-none font-weight-black" prepend-icon="mdi-plus">
              Invitar Nuevo Usuario
            </v-btn>
          </div>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const activeTab = ref('stats')
const stats = ref<any[]>([])
const history = ref<any[]>([])
const loading = ref(false)

const fetchStats = async () => {
  try {
    const res = await api.get('/bookings/stats')
    stats.value = res.data
  } catch (err) {
    console.error('Error fetching stats:', err)
  }
}

const fetchHistory = async () => {
  try {
    const res = await api.get('/bookings/history')
    history.value = res.data
  } catch (err) {
    console.error('Error fetching history:', err)
  }
}

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

onMounted(() => {
  fetchStats()
  fetchHistory()
})
</script>

<style scoped>
.premium-tabs :deep(.v-tab--selected) {
  background: rgba(var(--v-theme-primary), 0.05);
}

.premium-tabs :deep(.v-tabs-slider) {
  height: 4px;
  border-radius: 4px 4px 0 0;
}
</style>

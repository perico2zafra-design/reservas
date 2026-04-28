<template>
  <div class="premium-page">
    <!-- Header Section -->
    <div class="d-flex align-center mb-10">
      <div>
        <h1 class="text-h3 font-weight-black mb-2 text-gradient">Panel de Control</h1>
        <p class="text-subtitle-1 text-medium-emphasis font-weight-medium">Analíticas avanzadas y gestión de recursos.</p>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-download"
        variant="elevated"
        rounded="xl"
        class="text-none font-weight-black elevation-4"
      >
        Exportar Reporte
      </v-btn>
    </div>

    <!-- Summary KPI Section -->
    <v-row class="mb-8">
      <v-col cols="12" md="8">
        <OccupancyHeatmap />
      </v-col>
      <v-col cols="12" md="4">
        <!-- Slack/Activity Feed Mock -->
        <v-card rounded="xl" class="glass-card pa-6 border-0 elevation-4 fill-height">
          <div class="d-flex align-center mb-6">
            <v-avatar color="primary" size="32" class="me-3">
              <v-icon icon="mdi-slack" color="white" size="20" />
            </v-avatar>
            <h3 class="text-h6 font-weight-black">Actividad Reciente</h3>
          </div>
          
          <v-list class="bg-transparent pa-0">
            <v-list-item v-for="i in 4" :key="i" class="px-0 mb-4 activity-item">
              <template v-slot:prepend>
                <v-avatar size="36" :image="'https://i.pravatar.cc/150?u=' + i" />
              </template>
              <v-list-item-title class="text-body-2">
                <span class="font-weight-bold">Usuario #{{ i }}</span> reservó 
                <span class="text-primary font-weight-bold">Sala Matrix</span>
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">Hace {{ i * 5 }} minutos · #general</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          
          <v-btn block variant="tonal" color="primary" rounded="lg" size="small" class="mt-4">
            Ver en Slack
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <StatCard 
          label="Total Horas" 
          :value="totalHours" 
          icon="mdi-clock-outline" 
          color="primary"
          trendIcon="mdi-trending-up"
          trendColor="success"
          trendText="+12%"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard 
          label="Reservas Activas" 
          :value="activeBookingsCount" 
          icon="mdi-calendar-check" 
          color="secondary"
          trendIcon="mdi-trending-up"
          trendColor="success"
          trendText="+5%"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard 
          label="Salas Utilizadas" 
          value="85%" 
          icon="mdi-office-building" 
          color="success"
          trendIcon="mdi-trending-down"
          trendColor="error"
          trendText="-2%"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <StatCard 
          label="Nuevos Usuarios" 
          value="24" 
          icon="mdi-account-plus" 
          color="info"
          trendIcon="mdi-trending-up"
          trendColor="success"
          trendText="+18%"
        />
      </v-col>
    </v-row>

    <!-- Main Content Tabs -->
    <v-tabs
      v-model="activeTab"
      bg-color="transparent"
      color="primary"
      grow
      class="mb-8 premium-tabs"
    >
      <v-tab value="stats" class="text-none font-weight-bold">
        <v-icon start icon="mdi-chart-box-outline" /> Ranking Usuarios
      </v-tab>
      <v-tab value="history" class="text-none font-weight-bold">
        <v-icon start icon="mdi-history" /> Histórico Completo
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
        <BookingHistoryTable :bookings="history" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import StatCard from '@/components/admin/StatCard.vue'
import BookingHistoryTable from '@/components/admin/BookingHistoryTable.vue'
import OccupancyHeatmap from '@/components/admin/OccupancyHeatmap.vue'

const activeTab = ref('stats')
const stats = ref<any[]>([])
const history = ref<any[]>([])
const loading = ref(false)

const totalHours = computed(() => {
  return stats.value.reduce((acc, curr) => acc + curr.totalHours, 0).toFixed(0)
})

const activeBookingsCount = computed(() => {
  return history.value.filter(b => new Date(b.endTime) > new Date()).length
})

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

<template>
  <div class="admin-hub-elite">
    <div class="elite-top-accent"></div>

    <v-container class="pt-6 pb-12 px-4 px-md-10 main-content-limit">
      <!-- Header Section -->
      <v-row no-gutters align="center" class="mb-10">
        <v-col cols="12" class="d-flex mb-4">
          <div class="elite-gold-marker me-4 align-self-stretch"></div>
          <div>
            <h1 class="page-title-elite text-slate-900 text-playfair mb-1 mt-0">Panel de Control</h1>
            <p class="text-caption text-slate-500 font-weight-bold text-uppercase letter-spacing-lg">Administración Elite Residential</p>
          </div>
        </v-col>
      </v-row>

      <!-- Stats Overview (Premium) -->
      <v-row class="mb-8">
        <v-col v-for="(stat, i) in stats" :key="i" cols="6" md="3">
          <StatCard v-bind="stat" />
        </v-col>
      </v-row>

      <!-- Grid of Power: Administrative Hub -->
      <h2 class="section-title-elite mb-6">Gestión del Complejo</h2>
      <v-row>
        <v-col v-for="action in adminActions" :key="action.to" cols="12" sm="6">
          <ActionCard v-bind="action" />
        </v-col>
      </v-row>

      <!-- Recent Activity Section -->
      <v-row class="mt-8" v-if="!$vuetify.display.xs">
        <v-col cols="12">
          <v-card rounded="xl" class="activity-card-elite pa-6">
            <div class="d-flex align-center mb-6">
              <h3 class="text-h6 font-weight-black text-slate-800">Actividad Reciente</h3>
              <v-spacer />
              <v-btn variant="text" color="amber-darken-2" class="text-none font-weight-bold" to="/admin/bookings">Ver historial</v-btn>
            </div>
            
            <div v-for="booking in latestBookings" :key="booking.id" class="activity-item-elite py-3 d-flex align-center">
              <v-avatar size="40" class="me-4 bg-slate-100">
                <span class="text-slate-700 font-weight-bold">{{ booking.user?.first_name?.charAt(0) }}</span>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-body-2 font-weight-bold text-slate-800">
                  {{ booking.user?.first_name }} {{ booking.user?.last_name }}
                </div>
                <div class="text-caption text-slate-500">Reserva en {{ booking.room?.name }}</div>
              </div>
              <div class="text-end">
                <div class="text-caption font-weight-bold text-slate-400">{{ new Date(booking.booking_date).toLocaleDateString() }}</div>
                <v-chip size="x-small" :color="getStatusColor(booking.deposit_status)" variant="flat" class="font-weight-black mt-1">
                  {{ booking.deposit_status }}
                </v-chip>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { userService } from '@/services/user.service'
import { useBookingStore } from '@/stores/booking'
import type { User } from '@/types'
import StatCard from '@/components/dashboard/StatCard.vue'
import ActionCard from '@/components/dashboard/ActionCard.vue'

const bookingStore = useBookingStore()
const users = ref<User[]>([])
const loading = ref(false)

const totalNeighbors = computed(() => users.value.filter(u => u.status === 'APPROVED').length)
const pendingAdmissions = computed(() => users.value.filter(u => u.status === 'PENDING').length)
const monthlyBookings = computed(() => bookingStore.bookings.length)
const activeDeposits = computed(() => bookingStore.bookings.filter(b => b.deposit_status === 'PAID').length)

const stats = computed(() => [
  { label: 'VECINOS', value: totalNeighbors.value, subtitle: '+2 hoy', icon: 'mdi-account-plus', trendColor: 'text-success' },
  { label: 'PENDIENTES', value: pendingAdmissions.value, subtitle: 'Solicitudes', icon: 'mdi-clock-outline', trendColor: 'text-amber' },
  { label: 'RESERVAS', value: monthlyBookings.value, subtitle: 'Este mes', icon: 'mdi-calendar-check', trendColor: 'text-info' },
  { label: 'FIANZAS', value: activeDeposits.value, subtitle: 'Activas', icon: 'mdi-shield-check', trendColor: 'text-success' }
])

const adminActions = [
  { title: 'Gestión de Vecinos', desc: 'Admitir, sancionar o eliminar residentes', icon: 'mdi-account-group-outline', to: '/admin/users', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
  { title: 'Instalaciones', desc: 'Configurar salas, fianza y horarios', icon: 'mdi-office-building-outline', to: '/admin/rooms', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' },
  { title: 'Control de Reservas', desc: 'Historial completo y gestión de fianzas', icon: 'mdi-calendar-multiselect', to: '/admin/bookings', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)' },
  { title: 'Ajustes de Acta', desc: 'Normativa y configuración global', icon: 'mdi-cog-outline', to: '/admin/settings', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' }
]

const latestBookings = computed(() => bookingStore.bookings.slice(0, 4))

const fetchData = async () => {
  loading.value = true
  try {
    const [userData] = await Promise.all([
      userService.getAll(),
      bookingStore.fetchBookings(),
      bookingStore.fetchRooms()
    ])
    users.value = userData
  } catch (err) {
    console.error('Error fetching admin data:', err)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID': return 'success'
    case 'REFUNDED': return 'info'
    case 'CAPTURED': return 'error'
    default: return 'warning'
  }
}

onMounted(fetchData)
</script>

<style scoped>
.admin-hub-elite {
  min-height: 100vh;
  background-color: #f8fafc;
}

.elite-top-accent {
  height: 4px;
  background: linear-gradient(to right, #d4af37, #fbbf24);
}

.elite-gold-marker {
  width: 5px;
  background: #d4af37;
  border-radius: 10px;
}

.page-title-elite {
  font-size: 2.75rem;
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -2px;
  color: #0f172a;
}

.section-title-elite {
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  color: #0f172a;
  font-size: 1.5rem;
}

.activity-card-elite {
  background: white;
  border: 1px solid #e2e8f0;
}

.activity-item-elite {
  border-bottom: 1px solid #f1f5f9;
}

.activity-item-elite:last-child {
  border-bottom: 0;
}

@media (max-width: 600px) {
  .page-title-elite {
    font-size: 2rem;
  }
}
</style>


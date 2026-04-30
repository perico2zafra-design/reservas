<template>
  <div class="admin-dashboard">
    <div class="d-flex align-center mb-8">
      <div>
        <h1 class="text-h3 font-weight-black text-gradient">Gestión de la Comunidad</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Panel administrativo del Residencial Campus.</p>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-printer"
        variant="tonal"
        rounded="xl"
        class="font-weight-black"
      >
        Imprimir Listado Hoy
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-10">
      <v-col cols="12" sm="6" md="3">
        <v-card rounded="xl" class="pa-6 border-0 elevation-2">
          <div class="d-flex align-center mb-2">
            <v-avatar color="blue-lighten-5" class="me-3">
              <v-icon icon="mdi-account-group" color="blue" />
            </v-avatar>
            <span class="text-caption font-weight-bold opacity-60">VECINOS</span>
          </div>
          <div class="text-h4 font-weight-black">{{ totalNeighbors }}</div>
          <div class="text-caption text-success font-weight-bold mt-1">+2 esta semana</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card rounded="xl" class="pa-6 border-0 elevation-2">
          <div class="d-flex align-center mb-2">
            <v-avatar color="amber-lighten-5" class="me-3">
              <v-icon icon="mdi-clock-alert" color="amber-darken-3" />
            </v-avatar>
            <span class="text-caption font-weight-bold opacity-60">PENDIENTES</span>
          </div>
          <div class="text-h4 font-weight-black">{{ pendingAdmissions }}</div>
          <div class="text-caption text-amber-darken-3 font-weight-bold mt-1">Solicitudes acceso</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card rounded="xl" class="pa-6 border-0 elevation-2">
          <div class="d-flex align-center mb-2">
            <v-avatar color="green-lighten-5" class="me-3">
              <v-icon icon="mdi-calendar-check" color="green" />
            </v-avatar>
            <span class="text-caption font-weight-bold opacity-60">RESERVAS MES</span>
          </div>
          <div class="text-h4 font-weight-black">{{ monthlyBookings }}</div>
          <div class="text-caption text-medium-emphasis mt-1">Acumulado Abril</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card rounded="xl" class="pa-6 border-0 elevation-2">
          <div class="d-flex align-center mb-2">
            <v-avatar color="red-lighten-5" class="me-3">
              <v-icon icon="mdi-cash-multiple" color="red" />
            </v-avatar>
            <span class="text-caption font-weight-bold opacity-60">FIANZAS RETENIDAS</span>
          </div>
          <div class="text-h4 font-weight-black">{{ activeDeposits }}</div>
          <div class="text-caption text-error font-weight-bold mt-1">Pendientes de revisar</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Activity Section -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" class="pa-6 border-0 elevation-4">
          <div class="d-flex align-center mb-6">
            <h2 class="text-h5 font-weight-black">Últimas Reservas</h2>
            <v-spacer />
            <v-btn variant="text" color="primary" to="/admin/bookings">Ver todas</v-btn>
          </div>
          
          <v-list class="bg-transparent pa-0">
            <v-list-item
              v-for="booking in latestBookings"
              :key="booking.id"
              class="px-0 py-4 border-b"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" size="40" class="me-4">
                  <span class="text-white">{{ booking.user?.first_name?.charAt(0) }}</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ booking.user?.first_name }} {{ booking.user?.last_name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ booking.rooms?.name }} | {{ new Date(booking.booking_date).toLocaleDateString() }}
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-chip size="small" :color="getStatusColor(booking.deposit_status)" class="font-weight-black">
                  {{ booking.deposit_status }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Quick Actions & Community Info -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="pa-6 border-0 elevation-4 mb-6 bg-indigo-darken-4 text-white">
          <h3 class="text-h6 font-weight-black mb-4">Normas Básicas</h3>
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-numeric-1-circle" color="primary-light" class="me-3" />
            <span class="text-body-2 opacity-90">Máximo 2 reservas/propietario al mes.</span>
          </div>
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-numeric-2-circle" color="primary-light" class="me-3" />
            <span class="text-body-2 opacity-90">Fianza obligatoria por cada reserva.</span>
          </div>
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-numeric-3-circle" color="primary-light" class="me-3" />
            <span class="text-body-2 opacity-90">Horario límite 23:59h.</span>
          </div>
          <v-btn block color="white" variant="tonal" rounded="xl" class="mt-4" to="/admin/settings">
            Configurar Acta
          </v-btn>
        </v-card>

        <v-card rounded="xl" class="pa-6 border-0 elevation-2">
          <h3 class="text-subtitle-1 font-weight-black mb-4">Accesos Directos</h3>
          <v-btn block variant="tonal" color="primary" rounded="xl" class="mb-3" to="/admin/users">Admitir Vecinos</v-btn>
          <v-btn block variant="tonal" color="secondary" rounded="xl" class="mb-3" to="/admin/rooms">Ajustar Salarios/Horarios</v-btn>
          <v-btn block variant="tonal" color="success" rounded="xl" to="/admin/bookings">Revisar Daños/Fianzas</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()
const users = ref<any[]>([])
const loading = ref(false)

const totalNeighbors = computed(() => users.value.filter(u => u.status === 'APPROVED').length)
const pendingAdmissions = computed(() => users.value.filter(u => u.status === 'PENDING').length)
const monthlyBookings = computed(() => bookingStore.bookings.length)
const activeDeposits = computed(() => bookingStore.bookings.filter(b => b.deposit_status === 'PAID').length)

const latestBookings = computed(() => bookingStore.bookings.slice(0, 5))

const fetchData = async () => {
  loading.value = true
  try {
    const [usersRes] = await Promise.all([
      api.get('/users'),
      bookingStore.fetchBookings(),
      bookingStore.fetchRooms()
    ])
    users.value = usersRes.data
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
.text-gradient {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.text-primary-light {
  color: #4fc3f7;
}
</style>

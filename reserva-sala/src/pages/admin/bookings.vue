<template>
  <div class="premium-page">
    <div class="d-flex align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-black text-gradient mb-1">Gestión de Reservas</h1>
        <p class="text-subtitle-2 text-medium-emphasis">Supervisa las reservas y gestiona las fianzas de los vecinos.</p>
      </div>
    </div>

    <v-card rounded="xl" class="glass-card border-0 elevation-4 overflow-hidden">
      <v-data-table
        :headers="headers"
        :items="bookings"
        :loading="loading"
        class="bg-transparent"
        hover
      >
        <template v-slot:item.user="{ item }">
          <div class="font-weight-bold">{{ item.user?.first_name }} {{ item.user?.last_name }}</div>
          <div class="text-caption text-medium-emphasis">{{ item.user?.email }}</div>
        </template>

        <template v-slot:item.room="{ item }">
          <div class="font-weight-bold">{{ item.rooms?.name }}</div>
        </template>

        <template v-slot:item.time="{ item }">
          <div>{{ new Date(item.booking_date).toLocaleDateString() }}</div>
          <div class="text-caption">{{ item.start_time.substring(0, 5) }} - {{ item.end_time.substring(0, 5) }}</div>
        </template>

        <template v-slot:item.deposit_status="{ item }">
          <v-chip
            :color="getDepositColor(item.deposit_status)"
            size="small"
            class="font-weight-bold"
            rounded="lg"
            variant="flat"
          >
            {{ item.deposit_status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2" v-if="item.deposit_status === 'PAID'">
            <v-btn
              color="success"
              variant="tonal"
              size="small"
              rounded="lg"
              prepend-icon="mdi-cash-refund"
              class="text-none font-weight-bold"
              @click="handleDeposit(item.id, 'REFUND')"
            >
              Devolver Fianza
            </v-btn>
            <v-btn
              color="error"
              variant="tonal"
              size="small"
              rounded="lg"
              prepend-icon="mdi-cash-remove"
              class="text-none font-weight-bold"
              @click="handleDeposit(item.id, 'CAPTURE')"
            >
              Cobrar Daños
            </v-btn>
          </div>
          <div v-else class="text-caption text-medium-emphasis">
            Gestionada el {{ new Date(item.updated_at || item.created_at).toLocaleDateString() }}
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { bookingService } from '@/services/booking.service'

const bookings = ref<any[]>([])
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Vecino', key: 'user' },
  { title: 'Sala', key: 'room' },
  { title: 'Fecha y Hora', key: 'time' },
  { title: 'Estado Fianza', key: 'deposit_status' },
  { title: 'Acciones de Fianza', key: 'actions', sortable: false },
]

const fetchBookings = async () => {
  loading.value = true
  try {
    const res = await api.get('/bookings')
    bookings.value = res.data
  } catch (err) {
    console.error('Error fetching bookings:', err)
  } finally {
    loading.value = false
  }
}

const getDepositColor = (status: string) => {
  switch (status) {
    case 'PAID': return 'primary'
    case 'REFUNDED': return 'success'
    case 'CAPTURED': return 'error'
    default: return 'grey'
  }
}

const handleDeposit = async (bookingId: number, action: 'REFUND' | 'CAPTURE') => {
  if (!confirm(`¿Estás seguro de que quieres ${action === 'REFUND' ? 'devolver la fianza' : 'cobrar la fianza por daños'}?`)) return
  
  try {
    await bookingService.manageDeposit(bookingId, action)
    snackbarText.value = action === 'REFUND' ? 'Fianza devuelta con éxito' : 'Fianza cobrada por daños'
    snackbarColor.value = action === 'REFUND' ? 'success' : 'error'
    snackbar.value = true
    fetchBookings()
  } catch (err) {
    console.error('Error managing deposit:', err)
  }
}

onMounted(() => {
  fetchBookings()
})
</script>

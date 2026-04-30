<template>
  <div class="my-bookings-page">
    <div class="d-flex align-center mb-8">
      <v-btn
        variant="tonal"
        icon="mdi-arrow-left"
        class="me-4 elevation-1"
        color="primary"
        @click="$router.push('/')"
      />
      <div>
        <h1 class="text-h4 font-weight-black text-gradient">Mis Reservas</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gestiona tus reservas actuales y revisa el histórico de fianzas.</p>
      </div>
    </div>

    <v-row v-if="bookings.length > 0">
      <v-col cols="12">
        <v-card rounded="xl" class="glass-card border-0 elevation-4 overflow-hidden">
          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th class="text-overline font-weight-black">Sala</th>
                <th class="text-overline font-weight-black">Fecha</th>
                <th class="text-overline font-weight-black">Horario</th>
                <th class="text-overline font-weight-black">Fianza</th>
                <th class="text-overline font-weight-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in bookings" :key="booking.id">
                <td>
                  <div class="d-flex align-center py-4">
                    <v-avatar rounded="lg" class="me-3" size="48">
                      <v-img :src="booking.rooms?.image" cover />
                    </v-avatar>
                    <div class="font-weight-bold">{{ booking.rooms?.name }}</div>
                  </div>
                </td>
                <td class="text-body-2">{{ new Date(booking.booking_date).toLocaleDateString() }}</td>
                <td class="text-body-2 font-weight-medium">
                  {{ booking.start_time.substring(0, 5) }} - {{ booking.end_time.substring(0, 5) }}
                </td>
                <td>
                  <v-chip
                    :color="getStatusColor(booking.deposit_status)"
                    size="small"
                    variant="flat"
                    class="font-weight-black"
                  >
                    {{ getStatusLabel(booking.deposit_status) }} ({{ booking.deposit_amount }}€)
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-btn
                    v-if="canCancel(booking)"
                    variant="tonal"
                    color="error"
                    size="small"
                    rounded="lg"
                    @click="cancelBooking(booking.id)"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    v-else
                    variant="text"
                    color="primary"
                    size="small"
                    prepend-icon="mdi-file-document-outline"
                  >
                    Ver Recibo
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <v-card v-else variant="flat" color="grey-lighten-4" rounded="xl" class="pa-16 text-center">
      <v-icon icon="mdi-calendar-search" size="80" color="grey-lighten-1" class="mb-6" />
      <h2 class="text-h5 font-weight-bold text-medium-emphasis mb-2">Aún no has hecho ninguna reserva</h2>
      <p class="text-body-1 text-medium-emphasis mb-8">Explora las salas de la comunidad y reserva tu primera fecha.</p>
      <v-btn color="primary" rounded="xl" size="large" prepend-icon="mdi-plus" to="/">
        Reservar ahora
      </v-btn>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackColor">
      {{ snackText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'

const authStore = useAuthStore()
const bookingStore = useBookingStore()

const bookings = computed(() => 
  bookingStore.bookings.filter(b => b.user_id === authStore.user?.id)
)

const snackbar = ref(false)
const snackText = ref('')
const snackColor = ref('success')

const fetchMyBookings = async () => {
  await bookingStore.fetchBookings()
  await bookingStore.fetchRooms()
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID': return 'success'
    case 'REFUNDED': return 'info'
    case 'CAPTURED': return 'error'
    default: return 'warning'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PAID': return 'Retenida'
    case 'REFUNDED': return 'Devuelta'
    case 'CAPTURED': return 'Ejecutada'
    default: return 'Pendiente'
  }
}

const canCancel = (booking: any) => {
  const bookingDate = new Date(booking.booking_date)
  return bookingDate > new Date() && booking.deposit_status === 'PAID'
}

const cancelBooking = async (id: number) => {
  if (!confirm('¿Seguro que quieres cancelar esta reserva? Se gestionará el reembolso de la fianza automáticamente.')) return
  
  try {
    await bookingStore.cancelBooking(id)
    snackText.value = 'Reserva cancelada correctamente'
    snackColor.value = 'success'
    snackbar.value = true
  } catch (err) {
    snackText.value = 'Error al cancelar la reserva'
    snackColor.value = 'error'
    snackbar.value = true
  }
}

onMounted(fetchMyBookings)
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

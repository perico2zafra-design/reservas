<template>
  <div class="room-details-pro">
    <div class="d-flex align-center mb-8">
      <v-btn
        variant="tonal"
        icon="mdi-arrow-left"
        class="me-4 elevation-1"
        color="primary"
        @click="$router.back()"
      />
      <div>
        <h1 class="text-h4 font-weight-black text-gradient">Detalle de Sala</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Selecciona tu horario y confirma tu reserva.</p>
      </div>
    </div>

    <v-row v-if="currentRoom">
      <!-- Left Column: Booking & History -->
      <v-col cols="12" lg="8">
        <!-- Main Booking Timeline Card -->
        <v-card rounded="xl" class="glass-card pa-8 mb-8 border-0 elevation-4">
          <div class="d-flex align-center mb-8">
            <h2 class="text-h5 font-weight-black">Panel de Disponibilidad</h2>
            <v-spacer />
            <v-chip color="primary" variant="tonal" prepend-icon="mdi-calendar">
              {{ new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) }}
            </v-chip>
          </div>

          <BookingTimeline 
            :booked-slots="formattedBookings"
            :opening-time="currentRoom.openTime || '08:00'"
            :closing-time="currentRoom.closeTime || '20:00'"
            v-model:selection="selectedRange"
          />

          <div class="mt-10 d-flex justify-center flex-column align-center">
            <div v-if="selectedRange.start" class="mb-4 text-center">
              <v-chip color="secondary" variant="flat" size="large" class="font-weight-black">
                {{ selectedRange.start }} - {{ selectedRange.end }}
              </v-chip>
              <div class="text-caption mt-2 text-medium-emphasis">
                Se requiere una fianza reembolsable de <strong>50,00 €</strong>
              </div>
            </div>
            
            <v-btn
              color="primary"
              size="x-large"
              rounded="xl"
              class="text-none font-weight-black px-12 premium-gradient-btn"
              :disabled="!selectedRange.start || !selectedRange.end"
              :loading="paymentLoading"
              @click="initiateBooking"
            >
              Confirmar y Pagar Fianza
            </v-btn>
          </div>
        </v-card>

        <!-- Booking History List -->
        <v-card rounded="xl" class="glass-card pa-8 border-0 elevation-2">
          <h2 class="text-h5 font-weight-black mb-6">Actividad de la Sala</h2>
          <v-list class="bg-transparent pa-0">
            <v-list-item
              v-for="booking in roomBookings"
              :key="booking.id"
              class="px-0 mb-4 border-b pb-4"
            >
              <template v-slot:prepend>
                <v-avatar color="primary-lighten-4" class="me-4">
                  <span class="text-primary font-weight-bold">{{ booking.user?.first_name?.charAt(0) || 'U' }}</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ booking.user?.first_name }} {{ booking.user?.last_name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ booking.start_time.substring(0, 5) }} - {{ booking.end_time.substring(0, 5) }}
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-chip size="x-small" :color="booking.status === 'CONFIRMED' ? 'success' : 'warning'" class="font-weight-black">
                  {{ booking.status }}
                </v-chip>
              </template>
            </v-list-item>
            <div v-if="roomBookings.length === 0" class="text-center pa-8 text-medium-emphasis">
              No hay reservas para hoy. ¡Sé el primero!
            </div>
          </v-list>
        </v-card>
      </v-col>

      <!-- Right Column: Room Info & Amenities -->
      <v-col cols="12" lg="4">
        <v-card rounded="xl" class="premium-info-card overflow-hidden border-0 elevation-4 sticky-top">
          <v-img :src="currentRoom.image" height="250" cover />
          <div class="pa-8">
            <h3 class="text-overline font-weight-black mb-4">Normas de Uso (Acta 15/04/26)</h3>
            <v-list density="compact" class="bg-transparent mb-6">
              <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">Aforo máximo: 50 personas</v-list-item>
              <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">Horario: 09:00 a 23:59</v-list-item>
              <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">Max. 2 reservas al mes</v-list-item>
              <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">Prohibido fumar/vapear</v-list-item>
              <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">Fianza de {{ currentRoom.deposit_amount }}€ obligatoria</v-list-item>
            </v-list>
            
            <v-card color="amber-lighten-5" flat rounded="xl" class="pa-4 border-dashed border-amber mb-6">
              <div class="d-flex align-center text-amber-darken-4">
                <v-icon icon="mdi-cash-lock" class="me-3" />
                <div class="text-caption font-weight-bold">
                  La fianza de {{ currentRoom.deposit_amount }}€ será devuelta una vez comprobado el correcto estado del espacio.
                </div>
              </div>
            </v-card>

            <v-checkbox
              v-model="acceptedRules"
              label="He leído y acepto las normas de uso del Salón Social"
              color="primary"
              density="compact"
              hide-details
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment Modal -->
    <v-dialog v-model="paymentModal" max-width="500" persistent>
      <v-card rounded="xl" class="pa-6">
        <div class="d-flex align-center mb-6">
          <h2 class="text-h5 font-weight-bold">Pago de Fianza</h2>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="paymentModal = false" />
        </div>
        
        <div class="mb-6 pa-4 bg-blue-lighten-5 rounded-lg text-body-2">
          <strong>Reserva para:</strong> {{ currentRoom.name }}<br>
          <strong>Fecha:</strong> {{ new Date().toLocaleDateString() }}<br>
          <strong>Tramo:</strong> {{ selectedRange.start }} - {{ selectedRange.end }}
        </div>
        
        <CheckoutForm 
          v-if="clientSecret" 
          :client-secret="clientSecret"
          @success="handlePaymentSuccess"
          @error="handlePaymentError"
        />
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showSuccess" color="success" timeout="5000">
      Reserva confirmada. La fianza ha sido retenida correctamente.
    </v-snackbar>

    <v-snackbar v-model="showError" color="error" timeout="5000">
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import { bookingService } from '@/services/booking.service'
import BookingTimeline from '@/components/booking/BookingTimeline.vue'
import CheckoutForm from '@/components/CheckoutForm.vue'

const route = useRoute()
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const roomId = route.params.id as string

const paymentLoading = ref(false)
const paymentModal = ref(false)
const clientSecret = ref('')
const selectedRange = ref({ start: null, end: null })
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const acceptedRules = ref(false)

const roomBookings = computed(() => 
  bookingStore.bookings.filter(b => b.room_id === parseInt(roomId))
)

const currentRoom = computed(() => 
  bookingStore.rooms.find(r => r.id === parseInt(roomId))
)

const formattedBookings = computed(() => {
  return roomBookings.value.map(b => ({
    start: b.start_time.substring(0, 5),
    end: b.end_time.substring(0, 5)
  }))
})

const initiateBooking = async () => {
  if (!acceptedRules.value) {
    errorMessage.value = 'Debes aceptar las normas de uso para continuar'
    showError.value = true
    return
  }
  
  paymentLoading.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    const res = await bookingService.createPaymentIntent({
      roomId: parseInt(roomId),
      bookingDate: today,
      startTime: selectedRange.value.start,
      endTime: selectedRange.value.end
    })
    clientSecret.value = res.clientSecret
    paymentModal.value = true
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Error al iniciar el pago'
    showError.value = true
  } finally {
    paymentLoading.value = false
  }
}

const handlePaymentSuccess = async (paymentIntentId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    await bookingService.confirmBookingWithPayment({
      roomId: parseInt(roomId),
      bookingDate: today,
      startTime: selectedRange.value.start,
      endTime: selectedRange.value.end,
      paymentIntentId
    })
    
    paymentModal.value = false
    showSuccess.value = true
    selectedRange.value = { start: null, end: null }
    bookingStore.fetchBookings()
  } catch (err) {
    console.error('Error confirming booking:', err)
  }
}

const handlePaymentError = (msg: string) => {
  console.error('Payment Error:', msg)
}

onMounted(() => {
  bookingStore.fetchBookings()
  bookingStore.fetchRooms()
})
</script>

<style scoped>
.border-amber {
  border-color: rgba(var(--v-theme-warning), 0.3) !important;
}
.border-dashed {
  border-style: dashed !important;
}
</style>

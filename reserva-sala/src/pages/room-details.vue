<template>
  <div class="room-booking-page pb-16">
    <!-- Hero Image & Back Button -->
    <div class="room-hero position-relative">
      <v-img :src="room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'" height="300" cover class="bg-slate-200">
        <div class="room-hero-overlay d-flex flex-column justify-end pa-6">
          <v-btn icon="mdi-arrow-left" color="white" variant="flat" class="position-absolute top-0 left-0 ma-4 elevation-4" @click="$router.push('/')" />
          <h1 class="text-h3 font-weight-black text-white mb-2">{{ room?.name }}</h1>
          <div class="d-flex ga-4">
            <v-chip color="white" variant="flat" size="small" class="text-primary font-weight-black">
              {{ room?.deposit_amount }}€ FIANZA
            </v-chip>
            <v-chip color="rgba(255,255,255,0.2)" variant="flat" size="small" class="text-white border-1">
              Aforo: {{ room?.capacity }} pers.
            </v-chip>
          </div>
        </div>
      </v-img>
    </div>

    <v-container class="mt-n6 position-relative z-10">
      <v-row>
        <v-col cols="12" md="8">
          <!-- Step 1: Fecha -->
          <v-card rounded="32" class="pa-6 border-0 elevation-xl mb-6">
            <div class="d-flex align-center mb-4">
              <v-avatar color="primary-lighten-4" size="40" class="me-3">
                <v-icon icon="mdi-calendar" color="primary" />
              </v-avatar>
              <h2 class="text-h6 font-weight-black">1. ¿Cuándo lo necesitas?</h2>
            </div>
            
            <v-date-picker
              v-model="selectedDate"
              color="primary"
              elevation="0"
              class="w-100 rounded-xl"
              :min="minDate"
              hide-header
            />
          </v-card>

          <!-- Step 2: Horario -->
          <v-card rounded="32" class="pa-6 border-0 elevation-xl mb-6">
            <div class="d-flex align-center mb-6">
              <v-avatar color="primary-lighten-4" size="40" class="me-3">
                <v-icon icon="mdi-clock-outline" color="primary" />
              </v-avatar>
              <h2 class="text-h6 font-weight-black">2. ¿En qué horario?</h2>
            </div>

            <div class="time-bubbles-grid">
              <button 
                v-for="slot in timeSlots" 
                :key="slot.value"
                :class="['time-bubble', { active: selectedSlot === slot.value }]"
                @click="selectedSlot = slot.value"
              >
                <div class="font-weight-black mb-1">{{ slot.label }}</div>
                <div class="text-caption opacity-60">{{ slot.range }}</div>
              </button>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <!-- Booking Summary Sticky -->
          <v-card rounded="32" class="pa-6 border-0 elevation-24 sticky-top bg-slate-900 text-white">
            <h3 class="text-h6 font-weight-black mb-6">Resumen</h3>
            
            <div class="d-flex justify-space-between mb-4">
              <span class="opacity-60">Instalación</span>
              <span class="font-weight-bold">{{ room?.name }}</span>
            </div>
            <div class="d-flex justify-space-between mb-4">
              <span class="opacity-60">Fecha</span>
              <span class="font-weight-bold">{{ selectedDate?.toLocaleDateString() }}</span>
            </div>
            <div class="d-flex justify-space-between mb-6">
              <span class="opacity-60">Horario</span>
              <span class="font-weight-bold">{{ getTimeLabel(selectedSlot) }}</span>
            </div>

            <v-divider class="mb-6 opacity-10" />

            <div class="d-flex justify-space-between align-center mb-8">
              <div>
                <div class="text-h4 font-weight-black">{{ room?.deposit_amount }}€</div>
                <div class="text-caption opacity-60">Fianza Reembolsable</div>
              </div>
              <v-icon icon="mdi-shield-check" color="green-accent-2" size="40" />
            </div>

            <v-btn
              block
              size="x-large"
              color="primary"
              rounded="xl"
              class="font-weight-black premium-btn-pulse"
              :disabled="!isReadyToBook"
              @click="startPayment"
            >
              Confirmar y Pagar
            </v-btn>
            
            <p class="text-center text-caption opacity-40 mt-4 px-4">
              El cargo es una fianza que se devolverá íntegra tras el evento.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Stripe Checkout Overlay -->
    <v-dialog v-model="showPayment" persistent max-width="500">
      <v-card rounded="32" class="pa-8">
        <h2 class="text-h5 font-weight-black mb-2 text-center">Fianza de Reserva</h2>
        <p class="text-body-2 text-slate-500 mb-8 text-center px-4">
          Introduce los datos de tu tarjeta para completar la reserva de {{ room?.name }}.
        </p>
        
        <div id="card-element" class="stripe-card-box mb-8"></div>
        <div v-if="paymentError" class="text-error text-caption mb-4">{{ paymentError }}</div>

        <v-btn
          block
          size="x-large"
          color="primary"
          rounded="xl"
          class="font-weight-black"
          :loading="processingPayment"
          @click="confirmPayment"
        >
          Pagar {{ room?.deposit_amount }}€
        </v-btn>
        
        <v-btn block variant="text" color="slate-400" class="mt-4" @click="showPayment = false">
          Cancelar
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const room = computed(() => bookingStore.rooms.find(r => r.id === route.params.id))
const selectedDate = ref(new Date())
const selectedSlot = ref(null)
const minDate = new Date().toISOString().split('T')[0]

const showPayment = ref(false)
const processingPayment = ref(false)
const paymentError = ref(null)

const timeSlots = [
  { label: 'Mañana', range: '09:00 - 14:00', value: 'MORNING' },
  { label: 'Tarde', range: '15:00 - 21:00', value: 'AFTERNOON' },
  { label: 'Día Completo', range: '09:00 - 21:00', value: 'FULL_DAY' }
]

const getTimeLabel = (val: string) => timeSlots.find(s => s.value === val)?.label || 'No seleccionado'
const isReadyToBook = computed(() => selectedDate.value && selectedSlot.value)

const startPayment = () => {
  showPayment.value = true
  // Aquí inicializaríamos Stripe Elements
}

const confirmPayment = async () => {
  processingPayment.value = true
  try {
    // Simulación de flujo de pago y reserva
    const res = await api.post('/bookings/confirm', {
      roomId: room.value.id,
      bookingDate: selectedDate.value.toISOString().split('T')[0],
      startTime: selectedSlot.value === 'MORNING' ? '09:00' : '15:00',
      endTime: selectedSlot.value === 'MORNING' ? '14:00' : '21:00',
      paymentIntentId: 'pi_mock_123'
    })
    router.push('/my-bookings')
  } catch (err) {
    paymentError.value = "Error al procesar el pago"
  } finally {
    processingPayment.value = false
  }
}

onMounted(() => {
  if (bookingStore.rooms.length === 0) bookingStore.fetchRooms()
})
</script>

<style scoped>
.room-hero {
  height: 300px;
}
.room-hero-overlay {
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
}

.time-bubbles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.time-bubble {
  padding: 20px 10px;
  border-radius: 20px;
  background: #f1f5f9;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  text-align: center;
}

.time-bubble:hover {
  background: #e2e8f0;
}

.time-bubble.active {
  background: #6366f1;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.sticky-top {
  position: sticky;
  top: 100px;
}

.stripe-card-box {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.premium-btn-pulse {
  animation: pulse-primary 2s infinite;
}

@keyframes pulse-primary {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { transform: scale(1.02); box-shadow: 0 0 0 15px rgba(99, 102, 241, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

.border-1 { border: 1px solid rgba(255,255,255,0.2); }
</style>

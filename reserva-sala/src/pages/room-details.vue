<template>
  <div class="room-details-page">
    <!-- Hero Section con Cover Premium -->
    <div class="room-hero">
      <v-img 
        :src="room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'" 
        height="400" 
        cover 
        class="room-hero-img"
      >
        <div class="room-hero-overlay d-flex flex-column justify-end pa-6 pa-md-12">
          <v-btn 
            icon="mdi-arrow-left" 
            color="white" 
            variant="flat" 
            class="back-btn elevation-8" 
            @click="$router.push('/')" 
          />
        </div>
      </v-img>
    </div>

    <v-container class="room-content pb-16">
      <v-row justify="center">
        <v-col cols="12" lg="10">
          
          <!-- Floating Info Card -->
          <v-card rounded="32" class="room-header-card pa-8 mb-8 elevation-24 border-0 mt-n16">
            <v-row align="center">
              <v-col cols="12" md="8">
                <div class="d-flex align-center mb-2 ga-2">
                  <v-chip color="primary" variant="flat" size="small" class="font-weight-black">
                    INSTALACIÓN
                  </v-chip>
                  <v-chip v-if="room?.is_active" color="success-lighten-4" class="text-success font-weight-black" size="small">
                    DISPONIBLE
                  </v-chip>
                </div>
                <h1 class="text-h2 font-weight-black text-slate-900 mb-4">{{ room?.name }}</h1>
                <p class="text-body-1 text-slate-500 leading-relaxed">{{ room?.description }}</p>
              </v-col>
              <v-col cols="12" md="4" class="text-md-right">
                <div class="price-badge pa-6 rounded-32 bg-slate-50 border-1 border-slate-100">
                  <div class="text-overline text-slate-400">FIANZA REEMBOLSABLE</div>
                  <div class="text-h3 font-weight-black text-primary">{{ room?.deposit_amount }}€</div>
                  <div class="text-caption text-slate-400 mt-1">Aforo: {{ room?.capacity }} personas</div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <v-row>
            <!-- Selector de Reserva -->
            <v-col cols="12" md="7">
              <v-card rounded="32" class="pa-8 border-0 elevation-xl mb-6">
                <div class="d-flex align-center mb-6">
                  <v-avatar color="primary-lighten-5" size="48" class="me-4">
                    <v-icon icon="mdi-calendar-edit" color="primary" />
                  </v-avatar>
                  <h2 class="text-h5 font-weight-black">Configura tu reserva</h2>
                </div>
                
                <v-date-picker
                  v-model="selectedDate"
                  color="primary"
                  elevation="0"
                  class="w-100 rounded-24 border-1 border-slate-50"
                  :min="minDate"
                  hide-header
                />

                <div class="mt-8">
                  <div class="text-subtitle-1 font-weight-black mb-4">Selecciona el horario</div>
                  <div class="time-bubbles-grid">
                    <button 
                      v-for="slot in timeSlots" 
                      :key="slot.value"
                      :class="['time-bubble-pro', { active: selectedSlot === slot.value }]"
                      @click="selectedSlot = slot.value"
                    >
                      <v-icon :icon="slot.icon" class="mb-2" size="24" />
                      <div class="font-weight-black">{{ slot.label }}</div>
                      <div class="text-caption opacity-60">{{ slot.range }}</div>
                    </button>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Resumen y Pago -->
            <v-col cols="12" md="5">
              <v-card rounded="32" class="pa-8 border-0 elevation-24 bg-slate-900 text-white sticky-top">
                <h3 class="text-h5 font-weight-black mb-8">Confirmación</h3>
                
                <div class="booking-summary-item mb-4">
                  <div class="text-caption opacity-40">FECHA SELECCIONADA</div>
                  <div class="text-h6 font-weight-bold">{{ formatDate(selectedDate) }}</div>
                </div>

                <div class="booking-summary-item mb-8">
                  <div class="text-caption opacity-40">TRAMO HORARIO</div>
                  <div class="text-h6 font-weight-bold">{{ getTimeLabel(selectedSlot) }}</div>
                </div>

                <v-divider class="mb-8 opacity-10" />

                <div class="d-flex justify-space-between align-center mb-10">
                  <div>
                    <div class="text-caption opacity-40">TOTAL A DEPOSITAR</div>
                    <div class="text-h3 font-weight-black">{{ room?.deposit_amount }}€</div>
                  </div>
                  <v-icon icon="mdi-shield-lock" color="green-accent-2" size="48" />
                </div>

                <v-btn
                  block
                  size="x-large"
                  color="primary"
                  rounded="xl"
                  class="font-weight-black premium-pulse-btn"
                  :disabled="!isReadyToBook"
                  @click="startPayment"
                >
                  Confirmar Reserva
                </v-btn>
                
                <p class="text-center text-caption opacity-30 mt-6 px-4">
                  Pago seguro procesado por Stripe. Fianza protegida por Residencial Campus.
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Stripe Checkout -->
    <v-dialog v-model="showPayment" max-width="500" persistent>
      <v-card rounded="32" class="pa-8">
        <h2 class="text-h5 font-weight-black mb-6 text-center">Fianza de Reserva</h2>
        <div id="card-element" class="stripe-container mb-8"></div>
        <v-btn block size="x-large" color="primary" rounded="xl" class="font-weight-black" :loading="processing" @click="confirmPayment">
          Pagar {{ room?.deposit_amount }}€
        </v-btn>
        <v-btn block variant="text" color="slate-400" class="mt-4" @click="showPayment = false">Cancelar</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import { formatDate } from '@/utils/formatters'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const room = computed(() => bookingStore.rooms.find(r => r.id === Number(route.params.id)))
const selectedDate = ref(new Date())
const selectedSlot = ref(null)
const minDate = new Date().toISOString().split('T')[0]
const showPayment = ref(false)
const processing = ref(false)

const timeSlots = [
  { label: 'Mañana', range: '09:00 - 14:00', value: 'MORNING', icon: 'mdi-weather-sunny' },
  { label: 'Tarde', range: '15:00 - 21:00', value: 'AFTERNOON', icon: 'mdi-weather-sunset' },
  { label: 'Día Completo', range: '09:00 - 21:00', value: 'FULL_DAY', icon: 'mdi-white-balance-sunny' }
]

const getTimeLabel = (val: string | null) => timeSlots.find(s => s.value === val)?.label || 'Pendiente'
const isReadyToBook = computed(() => selectedDate.value && selectedSlot.value)

const startPayment = () => { showPayment.value = true }

const confirmPayment = async () => {
  processing.value = true
  try {
    await api.post('/bookings/confirm', {
      roomId: room.value?.id,
      bookingDate: selectedDate.value.toISOString().split('T')[0],
      startTime: selectedSlot.value === 'MORNING' ? '09:00' : '15:00',
      endTime: selectedSlot.value === 'MORNING' ? '14:00' : '21:00',
      paymentIntentId: 'pi_mock_' + Date.now()
    })
    router.push('/my-bookings')
  } catch (err) {
    console.error(err)
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  if (bookingStore.rooms.length === 0) bookingStore.fetchRooms()
})
</script>

<style scoped>
.room-details-page { background: #f8fafc; min-height: 100vh; }
.room-hero { height: 400px; position: relative; }
.room-hero-overlay { height: 100%; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); }
.back-btn { position: absolute; top: 30px; left: 30px; z-index: 10; }
.room-content { position: relative; z-index: 5; }
.room-header-card { background: rgba(255,255,255,0.9) !important; backdrop-filter: blur(10px); }

.time-bubbles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }
.time-bubble-pro {
  padding: 24px 16px; border-radius: 24px; background: #f1f5f9; border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-align: center; color: #64748b;
}
.time-bubble-pro:hover { background: #e2e8f0; transform: translateY(-3px); }
.time-bubble-pro.active {
  background: #6366f1; color: white; border-color: #818cf8;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
}

.sticky-top { position: sticky; top: 100px; }
.stripe-container { padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; }

.premium-pulse-btn { animation: pulse-primary 2s infinite; }
@keyframes pulse-primary {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

.leading-relaxed { line-height: 1.6 !important; }
.border-1 { border: 1px solid rgba(0,0,0,0.05) !important; }
</style>

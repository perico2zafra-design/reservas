<template>
  <div class="room-details-page-elite">
    <!-- Hero Section con Efecto Premium -->
    <div class="elite-hero-wrapper">
      <v-img 
        :src="room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'" 
        height="500" 
        cover 
        class="elite-hero-img"
      >
        <div class="elite-hero-overlay">
          <v-container class="h-100 d-flex flex-column justify-start pt-10">
            <v-btn 
              icon="mdi-arrow-left" 
              color="white" 
              variant="tonal" 
              class="back-btn-elite" 
              @click="$router.push('/')" 
            />
          </v-container>
        </div>
      </v-img>
    </div>

    <v-container class="elite-content-container pb-16">
      <v-row justify="center">
        <v-col cols="12" lg="11" xl="10">
          
          <!-- Floating Header Card (Ultra Premium) -->
          <v-card class="elite-header-card pa-8 pa-md-12 mb-10 overflow-hidden mt-n16">
            <div class="card-accent-line"></div>
            <v-row align="center">
              <v-col cols="12" md="7">
                <div class="d-flex align-center mb-4 ga-3">
                  <v-chip color="#d4af37" variant="flat" size="small" class="text-white font-weight-black letter-spacing-lg">
                    INSTALACIÓN EXCLUSIVA
                  </v-chip>
                  <v-chip v-if="room?.is_active" color="rgba(16, 185, 129, 0.1)" class="text-success font-weight-black border-success-op" size="small">
                    <v-icon icon="mdi-check-circle" start size="14" /> DISPONIBLE
                  </v-chip>
                </div>
                <h1 class="text-display-elite text-playfair mb-6">{{ room?.name }}</h1>
                <p class="text-body-elite mb-0">{{ room?.description }}</p>
              </v-col>
              <v-col cols="12" md="5" class="d-flex justify-md-end pt-6 pt-md-0">
                <div class="elite-price-box pa-8 text-center">
                  <div class="text-overline-elite mb-2">FIANZA DE GARANTÍA</div>
                  <div class="d-flex align-center justify-center">
                    <span class="currency-elite">€</span>
                    <span class="amount-elite">{{ room?.deposit_amount }}</span>
                  </div>
                  <v-divider class="my-4 opacity-10" />
                  <div class="d-flex align-center justify-center ga-4">
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-account-group-outline" size="18" class="me-2 text-slate-400" />
                      <span class="text-caption-elite">Máx. {{ room?.capacity }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-shield-check-outline" size="18" class="me-2 text-slate-400" />
                      <span class="text-caption-elite">Protegido</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <v-row class="ga-y-8">
            <!-- Selector de Reserva (Columna Izquierda) -->
            <v-col cols="12" lg="7">
              <v-card class="elite-step-card pa-8 mb-8">
                <div class="step-number">01</div>
                <div class="d-flex align-center mb-8">
                  <div class="step-icon-wrapper me-5">
                    <v-icon icon="mdi-calendar-month-outline" color="primary" size="28" />
                  </div>
                  <div>
                    <h2 class="text-h5 font-weight-black text-slate-900">Agenda tu Estancia</h2>
                    <p class="text-caption text-slate-400 mb-0">Selecciona el día de tu evento</p>
                  </div>
                </div>
                
                <div class="elite-calendar-wrapper">
                  <v-date-picker
                    v-model="selectedDate"
                    color="#0f172a"
                    elevation="0"
                    class="w-100 elite-picker"
                    :min="minDate"
                    :allowed-dates="allowedDates"
                    hide-header
                  />
                </div>

                <div class="mt-12">
                  <div class="d-flex align-center mb-8">
                    <div class="step-icon-wrapper me-5">
                      <v-icon icon="mdi-clock-outline" color="primary" size="28" />
                    </div>
                    <div>
                      <h2 class="text-h5 font-weight-black text-slate-900">Horario Disponible</h2>
                      <p class="text-caption text-slate-400 mb-0">Elige el tramo que mejor se adapte (09:00 - 23:59)</p>
                    </div>
                  </div>
                  
                  <div class="elite-time-grid">
                    <div 
                      v-for="slot in timeSlots" 
                      :key="slot.value"
                      :class="['elite-time-card', { active: selectedSlot === slot.value }]"
                      @click="selectedSlot = slot.value"
                    >
                      <div class="time-card-content">
                        <v-icon :icon="slot.icon" class="mb-4 slot-icon" size="32" />
                        <div class="slot-name">{{ slot.label }}</div>
                        <div class="slot-range">{{ slot.range }}</div>
                      </div>
                      <div class="active-indicator">
                        <v-icon icon="mdi-check" size="14" color="white" />
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>

              <!-- Sección de Normas Acta 15/04/2026 -->
              <v-card class="elite-step-card pa-8 border-amber-light">
                <div class="d-flex align-center mb-6">
                  <v-icon icon="mdi-gavel" color="amber-darken-3" class="me-4" />
                  <h3 class="text-h6 font-weight-black text-slate-900">Normativa Vigente (Acta 15/04/2026)</h3>
                </div>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item v-for="(rule, idx) in meetingRules" :key="idx" class="px-0">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-circle-small" color="amber" />
                    </template>
                    <v-list-item-title class="text-body-2 text-slate-600 text-wrap leading-relaxed">
                      {{ rule }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <div class="mt-6 pa-4 bg-error-lighten-5 rounded-lg border-error-op">
                  <div class="d-flex align-center mb-2">
                    <v-icon icon="mdi-alert-octagon" color="error" size="20" class="me-2" />
                    <span class="text-caption font-weight-bold text-error">PROHIBICIÓN CRÍTICA</span>
                  </div>
                  <p class="text-caption text-error-darken-2 mb-0 font-weight-bold">
                    Queda terminantemente prohibido el acceso al GIMNASIO durante el uso del salón social. El incumplimiento conlleva sanción muy grave.
                  </p>
                </div>
              </v-card>
            </v-col>

            <!-- Resumen y Pago (Columna Derecha) -->
            <v-col cols="12" lg="5">
              <div class="sticky-top-elite">
                <v-card class="elite-checkout-card overflow-hidden">
                  <div class="checkout-header pa-8 bg-slate-900 text-white">
                    <div class="d-flex justify-space-between align-center mb-8">
                      <h3 class="text-h5 font-weight-black text-playfair">Tu Reserva</h3>
                      <v-icon icon="mdi-gold" color="amber" size="32" />
                    </div>
                    
                    <div class="d-flex flex-column ga-6">
                      <div class="summary-row">
                        <span class="summary-label">INSTALACIÓN</span>
                        <span class="summary-value text-amber">{{ room?.name }}</span>
                      </div>
                      <div class="summary-row">
                        <span class="summary-label">FECHA</span>
                        <span class="summary-value">{{ formatDate(selectedDate) }}</span>
                      </div>
                      <div class="summary-row">
                        <span class="summary-label">TRAMO</span>
                        <span class="summary-value">{{ getTimeLabel(selectedSlot) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="checkout-footer pa-8 bg-white">
                    <div class="d-flex justify-space-between align-end mb-10">
                      <div>
                        <div class="text-caption font-weight-black text-slate-400 letter-spacing-lg mb-1">TOTAL FIANZA</div>
                        <div class="d-flex align-center">
                          <span class="text-h3 font-weight-black text-slate-900 me-1">{{ room?.deposit_amount }}</span>
                          <span class="text-h5 font-weight-bold text-slate-400">€</span>
                        </div>
                      </div>
                      <div class="text-right">
                        <v-icon icon="mdi-shield-check" color="success" size="24" class="mb-1" />
                        <div class="text-caption font-weight-bold text-success">Garantía Elite</div>
                      </div>
                    </div>

                    <v-btn
                      block
                      height="72"
                      color="#0f172a"
                      rounded="xl"
                      class="elite-action-btn"
                      :disabled="!isReadyToBook"
                      @click="startPayment"
                    >
                      <span class="btn-text">CONFIRMAR RESERVA</span>
                      <v-icon icon="mdi-arrow-right" class="ms-4 btn-icon" />
                    </v-btn>
                    
                    <div class="secure-badges mt-8 d-flex justify-center ga-6 opacity-40">
                      <v-icon icon="mdi-stripe" size="40" />
                      <v-icon icon="mdi-lock-outline" size="20" />
                      <v-icon icon="mdi-credit-card-outline" size="20" />
                    </div>
                  </div>
                </v-card>

                <!-- Aviso Legal Premium -->
                <div class="elite-notice-card mt-6 pa-6">
                  <div class="d-flex flex-column ga-3">
                    <div class="d-flex">
                      <v-icon icon="mdi-camera-outline" color="amber-darken-2" class="me-3" />
                      <p class="text-caption text-slate-500 mb-0">
                        <strong>Recomendación Acta:</strong> Realice fotografías del estado de la sala al finalizar para garantizar su fianza.
                      </p>
                    </div>
                    <v-divider class="opacity-10" />
                    <div class="d-flex">
                      <v-icon icon="mdi-information-outline" color="blue" class="me-3" />
                      <p class="text-caption text-slate-500 mb-0 leading-relaxed">
                        Fianza reembolsable en 48h tras inspección. Límite: 2 reservas/mes por propietario.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Payment Modal (Refined) -->
    <v-dialog v-model="showPayment" max-width="500" transition="dialog-bottom-transition">
      <v-card class="elite-modal-card pa-8 pa-md-10 overflow-hidden">
        <div class="modal-glow"></div>
        <div class="text-center mb-10">
          <div class="modal-icon-ring mb-4">
            <v-icon icon="mdi-credit-card-lock-outline" color="#0f172a" size="32" />
          </div>
          <h2 class="text-h4 font-weight-black text-playfair mb-2">Pasarela de Pago</h2>
          <p class="text-body-2 text-slate-500">Introduce los detalles de tu tarjeta premium</p>
        </div>

        <div class="elite-stripe-box mb-8">
          <div id="card-element"></div>
        </div>

        <v-btn 
          block 
          height="64" 
          color="#0f172a" 
          rounded="xl" 
          class="font-weight-black text-white" 
          :loading="processing" 
          @click="confirmPayment"
        >
          AUTORIZAR {{ room?.deposit_amount }}€
        </v-btn>
        <v-btn 
          block 
          variant="text" 
          color="slate-400" 
          class="mt-4 font-weight-bold" 
          @click="showPayment = false"
        >
          Cancelar Transacción
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import { siteService } from '@/services/site.service'
import { formatDate } from '@/utils/formatters'
import api from '@/services/api'
import type { SiteSettings } from '@/types'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const room = computed(() => bookingStore.rooms.find(r => r.id === Number(route.params.id)))
const siteSettings = ref<Partial<SiteSettings>>({})
const selectedDate = ref(new Date())
const selectedSlot = ref(null)
const minDate = new Date().toISOString().split('T')[0]
const showPayment = ref(false)
const processing = ref(false)

const timeSlots = computed(() => {
  const start = siteSettings.value?.start_hour || '09:00'
  const end = siteSettings.value?.end_hour || '23:59'
  
  return [
    { label: 'Mañana', range: `${start} - 14:00`, value: 'MORNING', icon: 'mdi-weather-sunny' },
    { label: 'Tarde', range: `15:00 - ${end}`, value: 'AFTERNOON', icon: 'mdi-weather-sunset' },
    { label: 'Día Completo', range: `${start} - ${end}`, value: 'FULL_DAY', icon: 'mdi-white-balance-sunny' }
  ]
})

const meetingRules = computed(() => [
  `Máximo ${siteSettings.value?.max_bookings_per_month || 2} reservas al mes natural por propietario.`,
  "El titular es responsable del comportamiento de los invitados.",
  "Obligatorio recoger basura y depositarla en contenedores externos.",
  "Prohibido fumar, vapear y actividades con ruidos excesivos.",
  "Prohibido colocar globos o carteles pegados en las paredes.",
  "Apagar luces y climatización al finalizar.",
  "La fianza se devuelve tras comprobar el estado de limpieza y orden."
])

// Días cerrados según Acta: 24, 25, 31 Dic y 1, 5, 6 Ene
const closedDates = [
  '12-24', '12-25', '12-31', 
  '01-01', '01-05', '01-06'
]

const allowedDates = (val: unknown) => {
  const dateStr = val as string
  const monthDay = dateStr.substring(5) // MM-DD
  return !closedDates.includes(monthDay)
}

const getTimeLabel = (val: string | null) => timeSlots.value.find(s => s.value === val)?.label || 'Pendiente'
const isReadyToBook = computed(() => selectedDate.value && selectedSlot.value)

const startPayment = () => { showPayment.value = true }

const confirmPayment = async () => {
  processing.value = true
  try {
    const slot = timeSlots.value.find(s => s.value === selectedSlot.value)
    const [start, end] = slot?.range.split(' - ') || ['09:00', '23:59']
    
    await api.post('/bookings/confirm', {
      roomId: room.value?.id,
      bookingDate: selectedDate.value.toISOString().split('T')[0],
      startTime: start,
      endTime: end,
      paymentIntentId: 'pi_mock_' + Date.now()
    })
    router.push('/my-bookings')
  } catch (err) {
    console.error(err)
  } finally {
    processing.value = false
  }
}

onMounted(async () => {
  if (bookingStore.rooms.length === 0) bookingStore.fetchRooms()
  try {
    siteSettings.value = await siteService.getSettings()
  } catch (err) {
    console.error('Error fetching settings:', err)
  }
})

// Cleanup to avoid parentNode errors if Stripe elements were present
onBeforeUnmount(() => {
  const cardElement = document.getElementById('card-element')
  if (cardElement) {
    cardElement.innerHTML = ''
  }
})
</script>


<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<style scoped>
.room-details-page-elite {
  background-color: #f8fafc;
  min-height: 100vh;
}

/* HERO SECTION */
.elite-hero-wrapper {
  position: relative;
  overflow: hidden;
}

.elite-hero-img {
  transition: transform 0.8s cubic-bezier(0.2, 0, 0.2, 1);
}

.elite-hero-overlay {
  height: 100%;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(248, 250, 252, 1) 100%);
}

.back-btn-elite {
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease;
}

.back-btn-elite:hover {
  background: white !important;
  color: #0f172a !important;
  transform: translateX(-5px);
}

/* CONTENT CONTAINER */
.elite-content-container {
  position: relative;
  z-index: 10;
}

/* HEADER CARD */
.elite-header-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  border-radius: 40px !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 40px 100px -20px rgba(15, 23, 42, 0.1) !important;
  position: relative;
}

.card-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #d4af37, #fbbf24, #d4af37);
}

.text-display-elite {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -2px;
  color: #0f172a;
}

.text-playfair {
  font-family: 'Playfair Display', serif;
}

.text-body-elite {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #64748b;
  max-width: 600px;
}

.elite-price-box {
  background: #0f172a;
  border-radius: 32px;
  color: white;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.3);
}

.text-overline-elite {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.4);
}

.currency-elite {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fbbf24;
  margin-right: 4px;
  margin-top: -10px;
}

.amount-elite {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
}

.text-caption-elite {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

/* STEP CARDS */
.elite-step-card {
  border-radius: 40px !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  position: relative;
}

.border-amber-light {
  border: 1px solid rgba(212, 175, 55, 0.2) !important;
}

.step-number {
  position: absolute;
  top: 30px;
  right: 40px;
  font-size: 4rem;
  font-weight: 900;
  color: #f1f5f9;
  z-index: 0;
  line-height: 1;
}

.step-icon-wrapper {
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.elite-calendar-wrapper {
  background: #f8fafc;
  padding: 20px;
  border-radius: 32px;
  border: 1px solid #f1f5f9;
}

.elite-picker :deep(.v-picker-title) { display: none; }
.elite-picker :deep(.v-date-picker-month__days) { padding: 10px; }
.elite-picker :deep(.v-btn--active) { background: #0f172a !important; color: white !important; }

/* TIME GRID */
.elite-time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.elite-time-card {
  padding: 30px 20px;
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.2, 0, 0, 1);
  position: relative;
  text-align: center;
}

.elite-time-card:hover {
  border-color: #fbbf24;
  transform: translateY(-5px);
  background: #fffdf5;
}

.elite-time-card.active {
  background: #0f172a;
  border-color: #0f172a;
  color: white;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.slot-icon {
  color: #fbbf24;
  transition: transform 0.4s ease;
}

.elite-time-card:hover .slot-icon {
  transform: scale(1.2) rotate(10deg);
}

.slot-name {
  font-weight: 900;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.slot-range {
  font-size: 0.75rem;
  opacity: 0.6;
  font-weight: 700;
}

.active-indicator {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 24px;
  height: 24px;
  background: #fbbf24;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease;
}

.elite-time-card.active .active-indicator {
  opacity: 1;
  transform: scale(1);
}

/* CHECKOUT CARD */
.elite-checkout-card {
  border-radius: 40px !important;
  box-shadow: 0 40px 80px -15px rgba(15, 23, 42, 0.2) !important;
  border: 0 !important;
}

.sticky-top-elite {
  position: sticky;
  top: 100px;
}

.summary-row {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 0.6rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 800;
}

.elite-action-btn {
  font-weight: 900 !important;
  letter-spacing: 1.5px !important;
  transition: all 0.4s cubic-bezier(0.2, 0, 0, 1) !important;
}

.elite-action-btn:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.4) !important;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.elite-action-btn:hover .btn-icon {
  transform: translateX(5px);
}

/* NOTICE CARD */
.elite-notice-card {
  background: rgba(251, 191, 36, 0.05);
  border: 1px dashed rgba(212, 175, 55, 0.3);
  border-radius: 24px;
}

/* MODAL & STRIPE */
.elite-modal-card {
  border-radius: 40px !important;
  position: relative;
}

.modal-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(to right, #d4af37, #fbbf24);
}

.modal-icon-ring {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.elite-stripe-box {
  background: #f8fafc;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
}

/* UTILS */
.letter-spacing-lg { letter-spacing: 1.5px !important; }
.border-success-op { border: 1px solid rgba(16, 185, 129, 0.2) !important; }
.border-error-op { border: 1px solid rgba(239, 68, 68, 0.2) !important; }
.leading-relaxed { line-height: 1.6 !important; }

@media (max-width: 960px) {
  .text-display-elite { font-size: 3rem; }
  .elite-price-box { max-width: 100%; }
}
</style>



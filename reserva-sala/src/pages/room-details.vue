<template>
  <div class="room-details-page-elite">
    <!-- Desktop Hero Section -->
    <div class="elite-hero-wrapper d-none d-md-block">
      <v-img
        :src="room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'"
        height="300"
        cover
        class="elite-hero-img"
      >
        <div class="elite-hero-overlay">
          <v-container class="h-100 d-flex flex-column justify-center pt-4">
            <div class="elite-hero-content animate-fade-up">
              <div class="d-flex align-center ga-4 flex-wrap">
                <!-- Botón Volver con posición fija y limpia -->
                <v-btn
                  icon="mdi-arrow-left"
                  color="white"
                  variant="tonal"
                  class="back-btn-elite-compact"
                  size="40"
                  @click="$router.push('/')"
                />
                
                <!-- Bloque de Título y Chips alineados -->
                <div class="d-flex align-center ga-3 flex-wrap">
                  <h1 class="text-display-elite text-playfair text-white mb-0 lh-1">
                    {{ room?.name }}
                  </h1>
                  
                  <div class="d-flex align-center ga-2 mt-1">
                    <v-chip color="#fbbf24" variant="flat" size="x-small" class="text-slate-900 font-weight-black">EXCLUSIVA</v-chip>
                    <v-chip v-if="room?.is_active" color="#ecfdf5" class="text-emerald-700 font-weight-black border-emerald" size="x-small">
                      <v-icon icon="mdi-check-circle" start size="10" color="#059669" />DISPONIBLE
                    </v-chip>
                  </div>
                </div>
              </div>

              <p class="text-h6 text-white opacity-70 font-weight-medium max-w-600 mt-4 d-none d-md-block">
                {{ room?.description }}
              </p>
            </div>

          </v-container>
        </div>
      </v-img>
    </div>

    <!-- Mobile Mini-Hero (Equilibrio Premium) -->
    <div class="d-md-none mobile-mini-hero">
      <v-img
        :src="room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'"
        height="140"
        cover
        class="mini-hero-img"
      >
        <div class="mini-hero-overlay d-flex align-center px-4">
          <v-btn icon="mdi-arrow-left" variant="tonal" color="white" size="small" class="me-4" @click="$router.push('/')" />
          <h2 class="text-h6 font-weight-black text-white text-truncate">{{ room?.name }}</h2>
        </div>
      </v-img>
    </div>



    <v-container v-if="room" class="elite-content-container pb-16">
      <v-row justify="center">
        <v-col cols="12" lg="11" xl="10">
          <!-- Desktop: Premium Header Card Compact -->
          <v-card class="d-none d-md-block elite-header-card py-4 px-8 mb-10 overflow-hidden mt-n12">
            <div class="card-accent-line"></div>
            <v-row align="center">
              <v-col cols="12" md="8">
                <div class="d-flex align-center ga-8">
                  <!-- Capacidad -->
                  <div class="info-group-elite">
                    <div class="d-flex align-center ga-3">
                      <div class="icon-circle-elite-sm">
                        <v-icon icon="mdi-account-group" color="slate-600" size="18" />
                      </div>
                      <div>
                        <span class="text-overline-elite-xs d-block">CAPACIDAD</span>
                        <span class="text-subtitle-1 font-weight-black text-slate-900 leading-none">{{ room?.capacity }} PERSONAS</span>
                      </div>
                    </div>
                  </div>

                  <v-divider vertical class="mx-2 opacity-10" style="height: 30px; align-self: center;" />

                  <!-- Estado -->
                  <div class="info-group-elite">
                    <div class="d-flex align-center ga-3">
                      <div class="icon-circle-elite-sm success">
                        <v-icon icon="mdi-shield-check" color="success" size="18" />
                      </div>
                      <div>
                        <span class="text-overline-elite-xs d-block">ESTADO</span>
                        <span class="text-subtitle-1 font-weight-black text-success leading-none">VERIFICADO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="4" class="d-flex justify-md-end">
                <div class="elite-price-badge-compact px-6 py-2">
                  <span class="text-overline-elite-xs text-white opacity-60 d-block">FIANZA</span>
                  <div class="d-flex align-center ga-2">
                    <span class="price-symbol-elite-sm">€</span>
                    <span class="price-amount-elite-sm">{{ room?.deposit_amount }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>


          <!-- MOBILE PREMIUM INFO BAR (NO CARD) -->

          <div class="d-md-none mobile-info-bar-elite mb-8 mt-n8">
            <div class="d-flex align-center justify-space-between px-6 py-4 bg-white rounded-xl shadow-sm border">
               <div class="d-flex align-center ga-4">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-account-group" size="18" class="me-1 text-slate-400" />
                    <span class="text-caption font-weight-black text-slate-700">{{ room?.capacity }}</span>
                  </div>
                  <v-divider vertical class="mx-0" style="height: 12px; align-self: center;" />
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-check-decagram" size="18" class="me-1 text-success" />
                    <span class="text-caption font-weight-black text-success">LISTO</span>
                  </div>
               </div>
               <div class="mobile-price-tag-elite py-1 px-4 rounded-pill">
                  <span class="text-caption font-weight-black text-white">€{{ room?.deposit_amount }}</span>
               </div>
            </div>
          </div>

          <!-- PASO A PASO INCREMENTAL BOUTIQUE -->
          <div class="elite-stepper-header mb-8 mb-md-12">
            <div class="stepper-track">
              <div
                v-for="n in 3"
                :key="n"
                class="stepper-node"
                :class="{
                  'node-active': currentStep >= n,
                  'node-completed': currentStep > n,
                }"
              >
                <div class="node-circle">
                  <v-icon v-if="currentStep > n" icon="mdi-check" size="14" color="white" />
                  <span v-else>{{ n }}</span>
                </div>
                <div class="node-label">{{ ['Reservar', 'Horario', 'Resumen'][n-1] }}</div>
              </div>
              <div class="stepper-line"></div>
              <div class="stepper-line-active" :style="{ width: ((currentStep - 1) / 2) * 100 + '%' }"></div>
            </div>
          </div>

          <v-row justify="center">
            <v-col cols="12" lg="9" xl="8" class="pa-0 pa-md-4">
              <v-window v-model="currentStep" class="elite-window-container overflow-visible">
                
                <!-- PASO 1: RESERVAR (CALENDARIO) -->
                <v-window-item :value="1">
                   <BookingStepCalendar 
                     v-model="selectedDate"
                     :bookings="roomBookings"
                     :closed-dates="closedDates"
                     :min-date="minDate"
                     :max-date="maxDate"
                     @update:model-value="currentStep = 2"
                   />
                </v-window-item>

                <!-- PASO 2: HORARIO -->
                <v-window-item :value="2">
                   <BookingStepTime 
                     v-model="selectedSlot"
                     :time-slots="timeSlots"
                     @back="currentStep = 1"
                     @update:model-value="currentStep = 3"
                   />
                </v-window-item>

                <!-- PASO 3: RESUMEN -->
                <v-window-item :value="3">
                   <BookingStepSummary 
                     :room-name="room?.name || ''"
                     :formatted-date="formatDate(selectedDate)"
                     :time-label="getTimeLabel(selectedSlot)"
                     :deposit-amount="room?.deposit_amount || 0"
                     @confirm="startPayment"
                     @back="currentStep = 2"
                   />
                </v-window-item>

              </v-window>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Payment Modal (Refined) -->
    <v-dialog
      v-if="room"
      v-model="showPayment"
      max-width="500"
      transition="dialog-bottom-transition"
      :key="`payment-dialog-${room.id}`"
    >
      <v-card class="elite-modal-card pa-8 pa-md-10 overflow-hidden">
        <div class="modal-glow"></div>
        <div class="text-center mb-10">
          <div class="modal-icon-ring mb-4">
            <v-icon
              icon="mdi-credit-card-lock-outline"
              color="#0f172a"
              size="32"
            />
          </div>
          <h2 class="text-h4 font-weight-black text-playfair mb-2">
            Pasarela de Pago
          </h2>
          <p class="text-body-2 text-slate-500">
            Introduce los detalles de tu tarjeta premium
          </p>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingStore } from "@/stores/booking";
import BookingStepCalendar from '@/components/booking/BookingStepCalendar.vue';
import BookingStepTime from '@/components/booking/BookingStepTime.vue';
import BookingStepSummary from '@/components/booking/BookingStepSummary.vue';
import { siteService } from "@/services/site.service";
import { formatDate } from "@/utils/formatters";
import api from "@/services/api";
import type { SiteSettings } from "@/types";

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const room = computed(() =>
  bookingStore.rooms.find((r) => r.id === Number(route.params.id)),
);
const roomBookings = ref<any[]>([]);
const siteSettings = ref<Partial<SiteSettings>>({});
const selectedDate = ref<Date | null>(null);
const selectedSlot = ref(null);
const currentStep = ref(1);
const today = new Date();

const minDate = today.toISOString().split("T")[0];
const maxDate = computed(() => {
  const horizon = Number(siteSettings.value?.booking_horizon_months || 1);
  const target = new Date();
  const currentDay = target.getDate();

  console.log("Calculando horizonte:", horizon, "meses");

  // Añadir los meses forzando número
  target.setMonth(target.getMonth() + horizon);

  if (target.getDate() !== currentDay) {
    target.setDate(0);
  }

  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, "0");
  const d = String(target.getDate()).padStart(2, "0");
  const result = `${y}-${m}-${d}`;
  console.log("Fecha máxima permitida:", result);
  return result;
});

const showPayment = ref(false);
const processing = ref(false);
const userBookingsCount = ref(0);

const timeSlots = computed(() => {
  const start = siteSettings.value?.start_hour || "09:00";
  const end = siteSettings.value?.end_hour || "23:59";

  const baseSlots = [
    {
      label: "Mañana",
      range: `${start} - 15:00`,
      value: "MORNING",
      icon: "mdi-weather-sunny",
    },
    {
      label: "Tarde",
      range: `15:00 - ${end}`,
      value: "AFTERNOON",
      icon: "mdi-weather-sunset",
    },
    {
      label: "Día Completo",
      range: `${start} - ${end}`,
      value: "FULL_DAY",
      icon: "mdi-white-balance-sunny",
    },
  ];

  if (!selectedDate.value) return [];

  const dateStr = new Date(selectedDate.value).toISOString().split("T")[0];
  const dayBookings = roomBookings.value.filter(
    (b) => b.booking_date === dateStr,
  );

  return baseSlots.filter((slot) => {
    if (slot.value === "MORNING") {
      return !dayBookings.some((b) => b.start_time < "12:00");
    }
    if (slot.value === "AFTERNOON") {
      return !dayBookings.some((b) => b.start_time >= "15:00");
    }
    if (slot.value === "FULL_DAY") {
      return dayBookings.length === 0;
    }
    return true;
  });
});

const meetingRules = computed(() => [
  `Máximo ${siteSettings.value?.max_bookings_per_month || 2} reservas al mes natural por propietario.`,
  "El titular es responsable del comportamiento de los invitados.",
  "Obligatorio recoger basura y depositarla en contenedores externos.",
  "Prohibido fumar, vapear y actividades con ruidos excesivos.",
  "Prohibido colocar globos o carteles pegados en las paredes.",
  "Apagar luces y climatización al finalizar.",
  "La fianza se devuelve tras comprobar el estado de limpieza y orden.",
]);

const enrichedRules = computed(() => {
  const icons = [
    "mdi-calendar-check",
    "mdi-account-star",
    "mdi-trash-can-outline",
    "mdi-volume-variant-off",
    "mdi-image-off-outline",
    "mdi-lightbulb-outline",
    "mdi-broom",
  ];
  return meetingRules.value.map((rule, i) => ({
    text: rule,
    icon: icons[i] || "mdi-information-outline",
  }));
});

// Días cerrados según Acta: 24, 25, 31 Dic y 1, 5, 6 Ene
const closedDates = ["12-24", "12-25", "12-31", "01-01", "01-05", "01-06"];

const getTimeLabel = (val: string | null) =>
  timeSlots.value.find((s) => s.value === val)?.label || "Pendiente";
const isReadyToBook = computed(() => selectedDate.value && selectedSlot.value);

const startPayment = () => {
  showPayment.value = true;
};

watch(selectedDate, () => {
  fetchRoomBookings();
});

const fetchRoomBookings = async () => {
  if (!room.value) return;
  try {
    const [bookingsRes, userBookingsRes] = await Promise.all([
      api.get(`/bookings?roomId=${room.value.id}`),
      api.get("/bookings/my-bookings"),
    ]);

    roomBookings.value = bookingsRes.data;

    // Contar reservas del usuario en el mes seleccionado (o el actual si no hay selección)
    const referenceDate = selectedDate.value
      ? new Date(selectedDate.value)
      : new Date();
    const currentMonth = referenceDate.getMonth();
    const currentYear = referenceDate.getFullYear();

    userBookingsCount.value = userBookingsRes.data.filter((b: any) => {
      const d = new Date(b.booking_date);
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear &&
        b.status !== "CANCELLED"
      );
    }).length;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

const confirmPayment = async () => {
  processing.value = true;
  try {
    const slot = timeSlots.value.find((s) => s.value === selectedSlot.value);
    const [start, end] = slot?.range.split(" - ") || ["09:00", "23:59"];

    await api.post("/bookings/confirm", {
      roomId: room.value?.id,
      bookingDate: selectedDate.value.toISOString().split("T")[0],
      startTime: start,
      endTime: end,
      paymentIntentId: "pi_mock_" + Date.now(),
    });
    router.push("/my-bookings");
  } catch (err) {
    console.error(err);
  } finally {
    processing.value = false;
  }
};

onMounted(async () => {
  if (bookingStore.rooms.length === 0) await bookingStore.fetchRooms();
  await fetchRoomBookings();
  try {
    siteSettings.value = await siteService.getSettings();
  } catch (err) {
    console.error("Error fetching settings:", err);
  }
});

// Cleanup to avoid parentNode errors if Stripe elements were present
onBeforeUnmount(() => {
  const cardElement = document.getElementById("card-element");
  if (cardElement) {
    cardElement.innerHTML = "";
  }
});
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
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
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.3) 0%,
    rgba(15, 23, 42, 0.5) 60%,
    rgba(15, 23, 42, 0.8) 100%
  );
}

.elite-hero-content {
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.animate-fade-up {
  animation: fadeUp 1s cubic-bezier(0.2, 0, 0, 1) forwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.max-w-600 {
  max-width: 600px;
}

.back-btn-elite {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease;
}

.back-btn-elite:hover {
  background: white !important;
  color: #0f172a !important;
  transform: translateX(-5px);
}

/* ACTION CARD */
.elite-header-card {
  background: white !important;
  border-radius: 40px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 40px 100px -20px rgba(15, 23, 42, 0.1) !important;
  position: relative;
  z-index: 20;
}

.info-item-elite {
  display: flex;
  flex-direction: column;
}

.elite-price-box-mini {
  background: #0f172a;
  border-radius: 28px;
  color: white;
  min-width: 220px;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.2);
}

.amount-elite-mini {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
}

.amount-elite-mini-mobile {
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1;
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
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: white !important; /* Forzamos blanco para el Hero */
}

.text-playfair {
  font-family: "Playfair Display", serif;
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
.elite-step-card,
.elite-rules-card {
  border-radius: 40px !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  position: relative;
}

.elite-rules-card {
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05) !important;
}

.rules-accent-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #d4af37, transparent);
  opacity: 0.3;
}

.rules-icon-header {
  width: 56px;
  height: 56px;
  background: #0f172a;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
}

.rule-premium-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.rule-premium-item:hover {
  background: #f8fafc;
  transform: translateX(5px);
}

.rule-icon-box {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

/* SECURITY ALERT */
.elite-security-alert {
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  border: 1px solid rgba(220, 38, 38, 0.15);
  border-radius: 32px;
  position: relative;
  overflow: hidden;
}

.elite-security-alert::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 6px;
  background: #dc2626;
}

.alert-pulse-icon {
  width: 48px !important;
  height: 48px !important;
  background: #dc2626;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Evita que se estire */
  box-shadow: 0 8px 16px rgba(220, 38, 38, 0.2);
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
  }
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

.elite-picker :deep(.v-picker-title) {
  display: none;
}
.elite-picker :deep(.v-date-picker-month__days) {
  padding: 10px;
}
.elite-picker :deep(.v-btn--active) {
  background: #0f172a !important;
  color: white !important;
}

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
  background: white;
}

.checkout-header {
  background: #0f172a;
  color: white;
  position: relative;
}

.checkout-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

.sticky-top-elite {
  position: sticky;
  top: 100px;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 0.65rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.summary-value {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.2;
}

.summary-value-placeholder {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  font-style: italic;
}

.elite-action-btn {
  font-weight: 900 !important;
  letter-spacing: 1.5px !important;
  transition: all 0.4s cubic-bezier(0.2, 0, 0, 1) !important;
}

.shadow-elite-btn {
  box-shadow: 0 15px 35px -10px rgba(15, 23, 42, 0.4) !important;
}

.elite-action-btn:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.5) !important;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.elite-action-btn:hover .btn-icon {
  transform: translateX(5px);
}

/* CALENDAR BOUTIQUE REDESIGN */
.calendar-day-elite {
  width: 44px !important;
  height: 44px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 14px !important;
  margin: 4px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  cursor: pointer !important;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.calendar-day-elite:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  z-index: 5;
}

.day-number-elite {
  font-weight: 900 !important;
  font-size: 1.1rem !important;
  color: #000000 !important; /* Negro absoluto para visibilidad */
  line-height: 1 !important;
  z-index: 2 !important;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-top: 5px;
  background: transparent;
}

/* ESTADOS SEMÁFORO ELITE */
.status-free {
  background-color: #f0fdf4 !important; /* Esmeralda suave */
  border: 1px solid rgba(34, 197, 94, 0.15) !important;
}
.status-free .status-dot {
  background-color: #22c55e;
}

.status-busy {
  background-color: #fef2f2 !important; /* Rosa suave */
  border: 1px solid rgba(239, 68, 68, 0.15) !important;
}
.status-busy .status-dot {
  background-color: #ef4444;
}

.status-partial {
  background-color: #fffbeb !important; /* Ámbar suave */
  border: 1px solid rgba(245, 158, 11, 0.15) !important;
}
.status-partial .status-dot {
  background-color: #f59e0b;
}

.status-disabled {
  background-color: #f8fafc !important;
  opacity: 0.3 !important;
  pointer-events: none !important;
}
.status-disabled .day-number-elite {
  color: #94a3b8 !important;
}

/* Selección Activa */
.calendar-day-elite[aria-selected="true"] {
  background: #0f172a !important;
  border: 2px solid #d4af37 !important;
  transform: scale(1.1);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2) !important;
}
.calendar-day-elite[aria-selected="true"] .day-number-elite {
  color: white !important;
}
.calendar-day-elite[aria-selected="true"] .status-dot {
  background: #d4af37 !important;
}

/* GUARANTEE PANEL */
.elite-guarantee-panel {
  position: relative;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.03);
}

.guarantee-glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.concierge-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.amber-glow {
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.15);
}

.blue-glow {
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.15);
}

.guarantee-divider {
  border-color: rgba(15, 23, 42, 0.05) !important;
}

/* UTILS */

.text-emerald-700 {
  color: #047857 !important;
}
.border-emerald {
  border: 1px solid rgba(16, 185, 129, 0.3) !important;
}

.letter-spacing-lg {
  letter-spacing: 1.5px !important;
}
.border-success-op {
  border: 1px solid rgba(16, 185, 129, 0.2) !important;
}
.border-error-op {
  border: 1px solid rgba(239, 68, 68, 0.2) !important;
}
.leading-relaxed {
  line-height: 1.6 !important;
}

@media (max-width: 960px) {
  .text-display-elite {
    font-size: 3rem;
  }
  .elite-price-box {
    max-width: 100%;
  }
}
.quota-warning-panel {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.1);
}

.quota-warning-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #d97706;
}
.elite-quota-alert {
  background: rgba(255, 251, 235, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(180, 83, 9, 0.05);
}

.alert-icon-wrapper {
  background: #fef3c7;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 2px 4px rgba(180, 83, 9, 0.1);
}

.elite-quota-alert::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #d97706, #fbbf24);
}
.elite-usage-panel {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid rgba(217, 119, 6, 0.2);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(180, 83, 9, 0.05);
}

.usage-title {
  font-size: 0.65rem;
  font-weight: 900;
  color: #92400e;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.usage-stat {
  font-size: 0.85rem;
  font-weight: 900;
  color: #1e293b;
  font-family: "Inter", sans-serif;
}

.usage-hint {
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
  opacity: 0.8;
}

.usage-bar {
  background: rgba(217, 119, 6, 0.1) !important;
}

.uppercase-track {
  letter-spacing: 1px;
  text-transform: uppercase;
}
.mobile-mini-hero {
  position: relative;
  overflow: hidden;
}

.mini-hero-overlay {
  height: 100%;
  background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4));
}

.mobile-info-bar-elite {
  position: relative;
  z-index: 10;
  margin-top: -30px; /* Overlap effect */
}


.mobile-price-tag-elite {
  background: #0f172a;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}

/* STEPPER INCREMENTAL PREMIUM */
.elite-stepper-header {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  padding: 0 24px;
}


.stepper-track {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.stepper-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
}

.elite-hero-img {
  height: 300px !important;
}

.hero-image {
  height: 300px;
  position: relative;
  z-index: 3;
}

@media (max-width: 600px) {
  .hero-image {
    height: 250px !important;
  }
}

.node-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
  color: #94a3b8;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 5;
}

.node-label {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
}

.node-active .node-label {
  color: #0f172a;
}


.node-completed .node-circle {
  background: #0f172a;
  border-color: #0f172a;
  color: white;
}

.stepper-line {
  position: absolute;
  top: 16px;
  left: 48px;
  right: 48px;
  height: 1px;
  background: #f1f5f9;
  z-index: 1;
}

.stepper-line-active {
  position: absolute;
  top: 16px;
  left: 48px;
  height: 1px;
  background: #0f172a;
  z-index: 1;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}


.elite-window-container {
  min-height: 500px;
}

@media (max-width: 600px) {
  .elite-stepper-header {
    margin-bottom: 24px !important;
  }
  .node-label {
    font-size: 0.55rem !important;
    letter-spacing: 0.5px !important;
  }
  .node-circle {
    width: 32px !important;
    height: 32px !important;
    font-size: 0.8rem !important;
  }
  .stepper-line, .stepper-line-active {
    top: 16px !important;
  }
  .elite-step-card {
    padding: 16px 0 !important;
    box-shadow: none !important;
    background: transparent !important;
  }
  .elite-window-container {
    min-height: 400px;
  }
  .v-container, .v-col, .elite-content-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
  }
}



.summary-row-premium {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-row-premium .label {
  color: #64748b;
  font-size: 0.9rem;
}

.summary-row-premium .value {
  font-weight: 900;
  color: #0f172a;
}

.summary-row-premium.total .value {
  font-size: 1.5rem;
}

.gold-text {
  color: #b45309;
}
.dot-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.bg-success {
  background-color: #10b981 !important;
}

.bg-error {
  background-color: #ef4444 !important;
}

.bg-warning {
  background-color: #f59e0b !important;
}

.bg-grey-lighten-1 {
  background-color: #bdbdbd !important;
}
/* MAQUETACIÓN MÓVIL APP-STYLE (CARD-LESS) */
.mobile-time-strip {
  background: white;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

.mobile-time-strip.active {
  border-color: #0f172a;
  background: #f8fafc;
  transform: translateX(8px);
}

.mobile-summary-app-card {
  background: #0f172a;
  color: white;
  border-radius: 32px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.summary-item-mobile {
  display: flex;
  align-items: center;
}

.summary-icon-box {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-final-action {
  position: relative;
  z-index: 10;
}

.mobile-calendar-container {
  background: white;
  border-radius: 32px;
  padding: 0 !important; /* Eliminado el padding lateral */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

/* Ajustes de tipografía móvil */
/* ESTILOS DE PRECISIÓN PARA ALINEACIÓN HERO */
.back-btn-elite-compact {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.text-display-elite {
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1 !important;
  font-weight: 900;
  margin: 0 !important;
  display: flex;
  align-items: center;
}

.lh-1 {
  line-height: 1 !important;
}

.icon-circle-elite {

  width: 44px;
  height: 44px;
  background: #f8fafc;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f1f5f9;
}

.icon-circle-elite.success {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.elite-price-badge {
  background: #0f172a;
  border-radius: 24px;
  color: white;
  text-align: center;
  min-width: 200px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
}

.price-symbol-elite {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fbbf24;
}

.price-amount-elite {
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
}

.icon-circle-elite-sm {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f1f5f9;
}

.icon-circle-elite-sm.success {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.elite-price-badge-compact {
  background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
  border-radius: 16px;
  color: white;
  text-align: center;
  min-width: 130px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}

/* Efecto de brillo sutil en el borde */
.elite-price-badge-compact::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.price-symbol-elite-sm {
  font-size: 0.9rem;
  font-weight: 800;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
  margin-right: 2px;
}

.price-amount-elite-sm {
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1px;
  color: #ffffff;
}

.text-overline-elite-xs {
  font-size: 0.55rem;
  letter-spacing: 2px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  margin-bottom: 2px;
}
</style>





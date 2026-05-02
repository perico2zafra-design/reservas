<template>
  <div class="room-details-page-elite">
    <!-- Hero Section con Efecto Premium -->
    <div class="elite-hero-wrapper">
      <v-img
        :src="
          room?.image ||
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
        "
        height="480"
        cover
        class="elite-hero-img"
      >
        <div class="elite-hero-overlay">
          <v-container class="h-100 d-flex flex-column justify-end pb-16">
            <v-btn
              icon="mdi-arrow-left"
              color="white"
              variant="tonal"
              class="back-btn-elite mb-6"
              @click="$router.push('/')"
            />

            <div class="elite-hero-content animate-fade-up">
              <div class="d-flex align-center mb-4 ga-3">
                <v-chip
                  color="#fbbf24"
                  variant="flat"
                  size="small"
                  class="text-slate-900 font-weight-black letter-spacing-lg"
                >
                  INSTALACIÓN EXCLUSIVA
                </v-chip>
                <v-chip
                  v-if="room?.is_active"
                  color="#ecfdf5"
                  class="text-emerald-700 font-weight-black border-emerald"
                  size="small"
                >
                  <v-icon
                    icon="mdi-check-circle"
                    start
                    size="14"
                    color="#059669"
                  />
                  DISPONIBLE
                </v-chip>
              </div>

              <h1 class="text-display-elite text-playfair text-white mb-4">
                {{ room?.name }}
              </h1>
              <p
                class="text-h6 text-white opacity-80 font-weight-medium max-w-600 leading-relaxed"
              >
                {{ room?.description }}
              </p>
            </div>
          </v-container>
        </div>
      </v-img>
    </div>

    <v-container v-if="room" class="elite-content-container pb-16">
      <v-row justify="center">
        <v-col cols="12" lg="11" xl="10">
          <!-- Floating Action Card (Ultra Premium) -->
          <v-card
            class="elite-header-card pa-8 pa-md-10 mb-10 overflow-hidden mt-n16"
          >
            <div class="card-accent-line"></div>
            <v-row align="center" justify="space-between">
              <v-col cols="12" md="6">
                <div class="d-flex align-center ga-6">
                  <div class="info-item-elite">
                    <span class="text-overline text-slate-400">CAPACIDAD</span>
                    <div class="d-flex align-center mt-1">
                      <v-icon
                        icon="mdi-account-group-outline"
                        color="slate-700"
                        class="me-2"
                      />
                      <span class="text-h6 font-weight-black text-slate-800"
                        >{{ room?.capacity }} Pers.</span
                      >
                    </div>
                  </div>
                  <v-divider vertical class="mx-2" />
                  <div class="info-item-elite">
                    <span class="text-overline text-slate-400">ESTADO</span>
                    <div class="d-flex align-center mt-1">
                      <v-icon
                        icon="mdi-shield-check-outline"
                        color="success"
                        class="me-2"
                      />
                      <span class="text-h6 font-weight-black text-success"
                        >Verificado</span
                      >
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="5"
                class="d-flex justify-md-end pt-6 pt-md-0"
              >
                <div class="elite-price-box-mini pa-6 text-center">
                  <div class="text-overline-elite mb-1">FIANZA DE GARANTÍA</div>
                  <div class="d-flex align-center justify-center">
                    <span class="currency-elite">€</span>
                    <span class="amount-elite-mini">{{
                      room?.deposit_amount
                    }}</span>
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
                    <v-icon
                      icon="mdi-calendar-month-outline"
                      color="primary"
                      size="28"
                    />
                  </div>
                  <div>
                    <h2 class="text-h5 font-weight-black text-slate-900">
                      Agenda tu Estancia
                    </h2>
                    <p class="text-caption text-slate-400 mb-0">
                      Selecciona el día de tu evento
                    </p>
                  </div>
                </div>

                <div class="elite-calendar-wrapper">
                  <BoutiqueCalendar
                    v-model="selectedDate"
                    :bookings="roomBookings"
                    :closed-dates="closedDates"
                    :min-date="minDate"
                    :max-date="maxDate"
                  />
                </div>

                <!-- Notificación de Cupo Agotado -->
                <v-expand-transition>
                  <div
                    v-if="
                      userBookingsCount >=
                      (siteSettings?.max_bookings_per_month || 2)
                    "
                    class="quota-warning-panel mt-6"
                  >
                    <div class="d-flex align-start ga-4">
                      <v-icon
                        icon="mdi-information-outline"
                        color="#b45309"
                        size="24"
                        class="mt-1"
                      />
                      <div>
                        <h4
                          class="text-subtitle-1 font-weight-black text-amber-900 mb-1"
                        >
                          Cupo de Reservas Alcanzado
                        </h4>
                        <p class="text-body-2 text-amber-800 mb-0 opacity-80">
                          Estimado residente, le informamos que ha completado el
                          límite máximo de
                          <strong
                            >{{
                              siteSettings?.max_bookings_per_month || 2
                            }}
                            reservas mensuales</strong
                          >
                          establecido por la normativa vigente.
                        </p>
                        <div class="mt-4 d-flex ga-4">
                          <v-btn
                            variant="text"
                            size="small"
                            class="text-amber-900 font-weight-bold px-0"
                            to="/my-bookings"
                          >
                            Gestionar mis reservas
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-expand-transition>

                <!-- Leyenda del Calendario -->
                <div class="d-flex justify-center ga-6 mt-4 opacity-70">
                  <div class="d-flex align-center ga-2">
                    <div class="dot-indicator bg-success"></div>
                    <span class="text-caption font-weight-bold">Libre</span>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <div class="dot-indicator bg-warning"></div>
                    <span class="text-caption font-weight-bold">Parcial</span>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <div class="dot-indicator bg-error"></div>
                    <span class="text-caption font-weight-bold">Lleno</span>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <div class="dot-indicator bg-grey-lighten-1"></div>
                    <span class="text-caption font-weight-bold">Inhábil</span>
                  </div>
                </div>

                <div class="mt-12">
                  <div class="d-flex align-center mb-8">
                    <div class="step-icon-wrapper me-5">
                      <v-icon
                        icon="mdi-clock-outline"
                        color="primary"
                        size="28"
                      />
                    </div>
                    <div>
                      <h2 class="text-h5 font-weight-black text-slate-900">
                        Horario Disponible
                      </h2>
                      <p class="text-caption text-slate-400 mb-0">
                        Elige el tramo que mejor se adapte (09:00 - 23:59)
                      </p>
                    </div>
                  </div>

                  <div class="elite-time-grid">
                    <div
                      v-for="slot in timeSlots"
                      :key="slot.value"
                      :class="[
                        'elite-time-card',
                        { active: selectedSlot === slot.value },
                      ]"
                      @click="selectedSlot = slot.value"
                    >
                      <div class="time-card-content">
                        <v-icon
                          :icon="slot.icon"
                          class="mb-4 slot-icon"
                          size="32"
                        />
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

              <!-- Sección de Normativa Vigente (Boutique Style) -->
              <v-card
                class="elite-rules-card pa-8 pa-md-10 overflow-hidden mt-8"
              >
                <div class="rules-accent-glow"></div>

                <div class="d-flex align-center mb-10">
                  <div class="rules-icon-header me-5">
                    <v-icon icon="mdi-gavel" color="#d4af37" size="28" />
                  </div>
                  <div>
                    <h3
                      class="text-h5 font-weight-black text-slate-900 text-playfair mb-1"
                    >
                      Normativa Vigente
                    </h3>
                    <div class="d-flex align-center ga-2">
                      <v-chip
                        size="x-small"
                        color="slate-900"
                        variant="flat"
                        class="text-white px-3"
                        >ACTA 15/04/2026</v-chip
                      >
                      <span
                        class="text-caption text-slate-400 font-weight-bold letter-spacing-sm"
                        >CUMPLIMIENTO OBLIGATORIO</span
                      >
                    </div>
                  </div>
                </div>

                <v-row class="ga-y-6">
                  <v-col
                    v-for="(rule, idx) in enrichedRules"
                    :key="idx"
                    cols="12"
                    md="6"
                  >
                    <div class="rule-premium-item">
                      <div class="rule-icon-box me-4">
                        <v-icon :icon="rule.icon" size="20" color="#d4af37" />
                      </div>
                      <div class="rule-text">
                        <span
                          class="text-body-2 font-weight-medium text-slate-600"
                          >{{ rule.text }}</span
                        >
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Aviso Crítico (Security Grade) -->
                <div class="mt-12 elite-security-alert pa-6">
                  <div class="d-flex align-start ga-5">
                    <div class="alert-pulse-icon">
                      <v-icon icon="mdi-shield-alert" color="white" size="24" />
                    </div>
                    <div>
                      <h4
                        class="text-subtitle-1 font-weight-black text-error-darken-4 mb-1"
                      >
                        RESTRICCIÓN DE ACCESO CRÍTICA
                      </h4>
                      <p
                        class="text-body-2 text-error-darken-2 mb-0 leading-relaxed font-weight-medium"
                      >
                        Queda terminantemente prohibido el acceso al
                        <strong>GIMNASIO</strong> durante el uso del salón
                        social. Este incumplimiento se tipifica como
                        <strong>falta muy grave</strong> con sanción inmediata
                        según acta.
                      </p>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Resumen y Pago (Columna Derecha) -->
            <v-col cols="12" lg="5">
              <div class="sticky-top-elite">
                <v-card class="elite-checkout-card overflow-hidden">
                  <!-- Cabecera de Recibo Premium -->
                  <div class="checkout-header pa-8">
                    <div class="d-flex justify-space-between align-center mb-8">
                      <div class="checkout-title-group">
                        <h3
                          class="text-h5 font-weight-black text-playfair text-white mb-1"
                        >
                          Tu Reserva
                        </h3>
                        <div class="d-flex align-center">
                          <v-icon
                            icon="mdi-circle"
                            color="amber"
                            size="8"
                            class="me-2"
                          />
                          <span
                            class="text-overline text-amber-lighten-2 font-weight-black"
                            style="font-size: 0.6rem; letter-spacing: 2px"
                            >RESUMEN ELITE</span
                          >
                        </div>
                      </div>
                      <v-icon icon="mdi-gold" color="amber" size="36" />
                    </div>

                    <div class="d-flex flex-column ga-6">
                      <!-- Instalación -->
                      <div class="summary-item">
                        <span class="summary-label">INSTALACIÓN</span>
                        <div class="summary-value-wrapper">
                          <span class="summary-value text-amber-accent-2">{{
                            room?.name
                          }}</span>
                        </div>
                      </div>

                      <!-- Fecha con Placeholder -->
                      <div class="summary-item">
                        <span class="summary-label">FECHA SELECCIONADA</span>
                        <div class="summary-value-wrapper">
                          <span
                            v-if="selectedDate"
                            class="summary-value text-white"
                            >{{ formatDate(selectedDate) }}</span
                          >
                          <span v-else class="summary-value-placeholder"
                            >Pendiente de selección...</span
                          >
                        </div>
                      </div>

                      <!-- Horario con Placeholder -->
                      <div class="summary-item">
                        <span class="summary-label">TRAMO HORARIO</span>
                        <div class="summary-value-wrapper">
                          <span
                            v-if="selectedSlot"
                            class="summary-value text-white"
                            >{{ getTimeLabel(selectedSlot) }}</span
                          >
                          <span v-else class="summary-value-placeholder"
                            >Esperando horario...</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="checkout-footer pa-8 bg-white">
                    <div class="d-flex justify-space-between align-end mb-10">
                      <div>
                        <div
                          class="text-caption font-weight-black text-slate-400 letter-spacing-lg mb-1"
                        >
                          TOTAL FIANZA
                        </div>
                        <div class="d-flex align-center">
                          <span
                            class="text-h3 font-weight-black text-slate-900 me-1"
                            >{{ room?.deposit_amount }}</span
                          >
                          <span class="text-h5 font-weight-bold text-slate-400"
                            >€</span
                          >
                        </div>
                      </div>
                      <div class="text-right">
                        <v-icon
                          icon="mdi-shield-check"
                          color="success"
                          size="28"
                          class="mb-1"
                        />
                        <div class="text-caption font-weight-bold text-success">
                          Garantía Elite
                        </div>
                      </div>
                    </div>

                    <v-btn
                      block
                      height="72"
                      color="#0f172a"
                      rounded="xl"
                      class="elite-action-btn shadow-elite-btn"
                      :disabled="!isReadyToBook"
                      @click="startPayment"
                    >
                      <span class="btn-text" v-if="isReadyToBook"
                        >CONFIRMAR RESERVA</span
                      >
                      <span class="btn-text text-grey-darken-1" v-else
                        >COMPLETA LOS DATOS</span
                      >
                      <v-icon icon="mdi-arrow-right" class="ms-4 btn-icon" />
                    </v-btn>

                    <div
                      class="secure-badges mt-8 d-flex justify-center ga-6 opacity-30"
                    >
                      <v-icon icon="mdi-stripe" size="40" />
                      <v-icon icon="mdi-shield-lock-outline" size="20" />
                      <v-icon icon="mdi-credit-card-outline" size="20" />
                    </div>
                  </div>
                </v-card>

                <!-- Panel de Compromiso Elite (Boutique Style) -->
                <div class="elite-guarantee-panel mt-8 pa-8">
                  <div class="guarantee-glass-overlay"></div>

                  <div class="d-flex flex-column ga-8 position-relative">
                    <!-- Protocolo de Salida -->
                    <div class="d-flex align-start ga-5">
                      <div class="concierge-icon-wrapper amber-glow">
                        <v-icon
                          icon="mdi-camera-enhance-outline"
                          color="#d4af37"
                          size="20"
                        />
                      </div>
                      <div>
                        <h4
                          class="text-caption font-weight-black text-slate-900 letter-spacing-lg mb-1"
                        >
                          PROTOCOLO DIGITAL
                        </h4>
                        <p
                          class="text-caption text-slate-500 mb-0 leading-relaxed"
                        >
                          Recomendamos
                          <strong>fotografiar la estancia</strong> al finalizar.
                          Este sencillo paso garantiza la integridad de su
                          fianza.
                        </p>
                      </div>
                    </div>

                    <v-divider class="guarantee-divider" />

                    <!-- Garantía de Reembolso -->
                    <div class="d-flex align-start ga-5">
                      <div class="concierge-icon-wrapper blue-glow">
                        <v-icon
                          icon="mdi-shield-refresh-outline"
                          color="#2563eb"
                          size="20"
                        />
                      </div>
                      <div>
                        <h4
                          class="text-caption font-weight-black text-slate-900 letter-spacing-lg mb-1"
                        >
                          GARANTÍA DE REEMBOLSO
                        </h4>
                        <p
                          class="text-caption text-slate-500 mb-0 leading-relaxed"
                        >
                          Inspección profesional y
                          <strong>devolución automática</strong> en su cuenta en
                          un máximo de 48h hábiles.
                        </p>
                      </div>
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
import BoutiqueCalendar from "@/components/booking/BoutiqueCalendar.vue";
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
const selectedDate = ref(new Date());
const selectedSlot = ref(null);
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

    // Contar reservas del usuario en el mes seleccionado
    const currentMonth = new Date(selectedDate.value).getMonth();
    const currentYear = new Date(selectedDate.value).getFullYear();

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
</style>

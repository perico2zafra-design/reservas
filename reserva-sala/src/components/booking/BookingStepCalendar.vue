<template>
  <div class="booking-step-calendar">
    <!-- Desktop: Con Tarjeta -->
    <v-card class="d-none d-md-block elite-step-card pa-12 mb-8">
      <div class="text-center mb-10">
        <h2 class="text-h4 font-weight-black text-slate-900 mb-2">Reservar Sala</h2>
        <p class="text-body-1 text-slate-400">Elige el día de tu evento en el calendario exclusivo.</p>
      </div>
      <div class="elite-calendar-wrapper mb-6">
        <BoutiqueCalendar 
          :model-value="modelValue" 
          :bookings="bookings" 
          :user-bookings="userBookings"
          :max-limit="maxLimit"
          :closed-dates="closedDates" 
          :min-date="minDate" 
          :max-date="maxDate" 
          @update:model-value="$emit('update:modelValue', $event)" 
          @view-change="currentView = $event"
        />
      </div>

      <!-- Warning de Límite -->
      <v-alert
        v-if="isLimitReached"
        type="warning"
        variant="tonal"
        icon="mdi-alert-circle-outline"
        rounded="xl"
        class="mb-6 border-amber-light"
      >
        <template v-slot:title>
          <span class="text-subtitle-2 font-weight-black">Límite Mensual Alcanzado</span>
        </template>
        Has alcanzado el máximo de {{ maxLimit }} reservas para este mes. Selecciona otro mes o cancela una reserva previa.
      </v-alert>
      <div class="d-flex justify-center ga-8 pt-4 border-t opacity-70">
        <div class="d-flex align-center ga-2"><div class="dot-indicator bg-success"></div><span class="text-caption font-weight-bold">Libre</span></div>
        <div class="d-flex align-center ga-2"><div class="dot-indicator bg-warning"></div><span class="text-caption font-weight-bold">Parcial</span></div>
        <div class="d-flex align-center ga-2"><div class="dot-indicator bg-error"></div><span class="text-caption font-weight-bold">Lleno</span></div>
        <div class="d-flex align-center ga-2"><div class="dot-indicator bg-limit"></div><span class="text-caption font-weight-bold">Tu cupo agotado</span></div>
      </div>
    </v-card>

    <div class="d-md-none pa-4">
      <div class="mobile-calendar-container mb-6">
        <BoutiqueCalendar 
          :model-value="modelValue" 
          :bookings="bookings" 
          :user-bookings="userBookings"
          :max-limit="maxLimit"
          :closed-dates="closedDates" 
          :min-date="minDate" 
          :max-date="maxDate" 
          @update:model-value="$emit('update:modelValue', $event)" 
          @view-change="currentView = $event"
        />
      </div>

      <!-- Warning de Límite Mobile -->
      <v-alert
        v-if="isLimitReached"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-6 rounded-xl text-caption"
      >
        Límite de {{ maxLimit }} reservas alcanzado este mes.
      </v-alert>

      <div class="d-flex justify-center ga-4 opacity-70 pb-10 flex-wrap">
        <div class="d-flex align-center ga-1"><div class="dot-indicator bg-success"></div><span class="text-caption">Libre</span></div>
        <div class="d-flex align-center ga-1"><div class="dot-indicator bg-warning"></div><span class="text-caption">Parcial</span></div>
        <div class="d-flex align-center ga-1"><div class="dot-indicator bg-error"></div><span class="text-caption">Lleno</span></div>
        <div class="d-flex align-center ga-1"><div class="dot-indicator bg-limit"></div><span class="text-caption">Cupo agotado</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BoutiqueCalendar from './BoutiqueCalendar.vue';

const props = defineProps<{
  modelValue: Date | null;
  bookings: any[];
  userBookings: any[];
  maxLimit: number;
  closedDates: string[];
  minDate: string;
  maxDate: string;
}>();

const emit = defineEmits(['update:modelValue']);

const currentView = ref({ month: new Date().getMonth(), year: new Date().getFullYear() });

const isLimitReached = computed(() => {
  // Usar el mes que se está visualizando
  const m = currentView.value.month;
  const y = currentView.value.year;

  const count = props.userBookings.filter(b => {
    const bd = new Date(b.booking_date);
    return bd.getMonth() === m && bd.getFullYear() === y && b.status !== 'CANCELLED';
  }).length;

  return count >= props.maxLimit;
});
</script>

<style scoped>
.elite-step-card {
  border-radius: 40px !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
}

.elite-calendar-wrapper {
  background: #f8fafc;
  padding: 20px;
  border-radius: 32px;
  border: 1px solid #f1f5f9;
}

.mobile-calendar-container {
  background: white;
  border-radius: 32px;
  padding: 0 !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.dot-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.bg-success { background-color: #10b981 !important; }
.bg-warning { background-color: #f59e0b !important; }
.bg-error { background-color: #ef4444 !important; }
.bg-limit { background-color: #f97316 !important; }
</style>

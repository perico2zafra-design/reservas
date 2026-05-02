<template>
  <div class="booking-step-summary">
    <!-- Desktop -->
    <v-card class="d-none d-md-block elite-step-card pa-12">
      <h2 class="text-h4 font-weight-black text-slate-900 mb-10">Resumen de Reserva</h2>
      <div class="elite-summary-box pa-8 mb-10">
        <div class="summary-row-premium"><span>Instalación</span><span class="value font-weight-black">{{ roomName }}</span></div>
        <div class="summary-row-premium"><span>Fecha</span><span class="value font-weight-black">{{ formattedDate }}</span></div>
        <div class="summary-row-premium"><span>Horario</span><span class="value font-weight-black">{{ timeLabel }}</span></div>
        <v-divider class="my-6 opacity-10" />
        <div class="summary-row-premium total"><span>Fianza</span><span class="value gold-text">{{ depositAmount }}€</span></div>
      </div>
      <v-btn block height="72" color="#0f172a" class="text-white font-weight-black" @click="$emit('confirm')">PAGAR {{ depositAmount }}€</v-btn>
    </v-card>

    <!-- Mobile -->
    <div class="d-md-none pa-4 pt-0">
      <div class="mobile-summary-app-card pa-6 mb-10">
        <div class="summary-item-mobile mb-6">
          <v-icon icon="mdi-map-marker-radius" class="me-4" />
          <div><div class="text-overline">SALA</div><div class="font-weight-black">{{ roomName }}</div></div>
        </div>
        <div class="summary-item-mobile mb-6">
          <v-icon icon="mdi-calendar-check" class="me-4" />
          <div><div class="text-overline">CUÁNDO</div><div class="font-weight-black">{{ formattedDate }}</div><div class="text-caption">{{ timeLabel }}</div></div>
        </div>
        <div class="summary-item-mobile">
          <v-icon icon="mdi-credit-card-outline" class="me-4" />
          <div><div class="text-overline">FIANZA</div><div class="font-weight-black text-h5">{{ depositAmount }}€</div></div>
        </div>
      </div>
      
      <!-- Botón de Acción Fijo/Destacado -->
      <div class="mobile-final-action">
        <v-btn block height="72" color="#0f172a" rounded="xl" class="text-white font-weight-black" @click="$emit('confirm')">PAGAR Y RESERVAR</v-btn>
        <v-btn block variant="text" color="#94a3b8" class="mt-2" @click="$emit('back')">MODIFICAR</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  roomName: string;
  formattedDate: string;
  timeLabel: string;
  depositAmount: number;
}>();

defineEmits(['confirm', 'back']);
</script>

<style scoped>
.elite-step-card {
  border-radius: 40px !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
}

.elite-summary-box {
  background: #f8fafc;
  border-radius: 32px;
  border: 1px solid #f1f5f9;
}

.summary-row-premium {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-row-premium span:first-child {
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

.gold-text { color: #b45309; }

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

.text-overline {
  font-size: 0.65rem !important;
  letter-spacing: 1.5px !important;
  opacity: 0.6;
}
</style>

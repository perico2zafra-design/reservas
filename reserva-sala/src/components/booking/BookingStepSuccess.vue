<template>
  <div class="booking-step-success">
    <v-card class="elite-success-card pa-12 text-center overflow-hidden">
      <div class="success-glow"></div>

      <div class="success-icon-wrapper mb-8">
        <v-icon
          icon="mdi-check-decagram"
          color="#10b981"
          size="80"
          class="animate-bounce-subtle"
        />
      </div>

      <h2 class="text-h3 font-weight-black text-slate-900 mb-4 text-playfair">
        ¡Reserva Confirmada!
      </h2>
      <p class="text-h6 text-slate-500 mb-6 max-w-500 mx-auto leading-relaxed">
        Tu espacio en <strong>{{ roomName }}</strong> ha sido reservado con
        éxito.
      </p>
      <div class="pa-4 rounded-xl bg-success-light mb-8 max-w-500 mx-auto">
        <p class="text-subtitle-2 text-success font-weight-black mb-0">
          <v-icon icon="mdi-shield-check" class="me-2" />
          TARJETA VINCULADA COMO GARANTÍA - SIN CARGO INMEDIATO
        </p>
      </div>

      <div class="success-summary-mini pa-8 mb-10">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-overline opacity-60">FECHA</span>
          <span class="font-weight-black">{{ formattedDate }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span class="text-overline opacity-60">HORARIO</span>
          <span class="font-weight-black">{{ timeLabel }}</span>
        </div>
      </div>

      <v-btn
        height="64"
        color="#0f172a"
        rounded="xl"
        class="px-12 text-white font-weight-black"
        @click="$router.push('/my-bookings')"
      >
        GESTIONAR MIS RESERVAS
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  roomName: string;
  formattedDate: string;
  timeLabel: string;
}>();
</script>

<style scoped>
.elite-success-card {
  border-radius: 40px !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  position: relative;
}

.success-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(16, 185, 129, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.success-icon-wrapper {
  position: relative;
  z-index: 2;
}

.success-summary-mini {
  background: #f8fafc;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  max-width: 400px;
  margin: 0 auto;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite;
}

@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 600px) {
  .elite-success-card {
    padding: 40px 24px !important;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>

<template>
  <div class="booking-step-payment">
    <!-- CONTENEDOR UNIVERSAL PREMIUM -->
    <v-card class="elite-step-card pa-6 pa-md-12 mb-8">
      <div class="text-center mb-10">
        <div class="payment-icon-ring mb-4 d-none d-md-inline-flex">
          <v-icon icon="mdi-shield-lock" color="#0f172a" size="32" />
        </div>
        <div class="mobile-payment-icon mb-4 d-md-none">
          <v-icon icon="mdi-shield-check" color="#0f172a" size="20" />
        </div>
        <h2 class="text-h5 text-md-h4 font-weight-black text-slate-900 mb-2">Garantía de Reserva</h2>
        <p class="text-caption text-md-body-1 text-slate-500 mb-4">Vincula tu tarjeta de forma segura. No se realizará ningún cargo ahora.</p>
        
        <div class="d-inline-flex align-center ga-2 pa-2 px-4 rounded-pill bg-success-light mb-2">
          <v-icon icon="mdi-shield-check" color="success" size="16" />
          <span class="text-caption font-weight-black text-success">VALIDACIÓN SIN CARGO (0,00€)</span>
        </div>
      </div>

      <div class="elite-stripe-container mb-10">
        <div class="stripe-field-wrapper mb-6">
          <label class="field-label-premium mb-2 d-block">NÚMERO DE TARJETA</label>
          <div id="card-number-element" class="stripe-field-box"></div>
        </div>
        <div class="d-flex flex-column flex-sm-row ga-6">
          <div class="stripe-field-wrapper flex-grow-1">
            <label class="field-label-premium mb-2 d-block">VENCIMIENTO</label>
            <div id="card-expiry-element" class="stripe-field-box"></div>
          </div>
          <div class="stripe-field-wrapper flex-grow-1">
            <label class="field-label-premium mb-2 d-block">CVC / CVV</label>
            <div id="card-cvc-element" class="stripe-field-box"></div>
          </div>
        </div>
        <div class="mt-6 d-flex align-center ga-2 opacity-40 justify-center">
          <v-icon icon="mdi-lock" size="12" />
          <span style="font-size: 11px;" class="font-weight-black uppercase">Transacción cifrada SSL</span>
        </div>
      </div>

      <div class="action-area max-w-400 mx-auto">
        <v-btn 
          block 
          height="64" 
          color="#0f172a" 
          rounded="xl"
          class="text-white font-weight-black premium-btn-shadow" 
          :loading="loading"
          :disabled="disabled"
          @click="$emit('confirm')"
        >
          CONFIRMAR REGISTRO SEGURO
        </v-btn>

        <v-btn 
          v-if="isLocal"
          block 
          variant="tonal"
          color="success"
          height="48"
          rounded="xl"
          class="mt-6 font-weight-black"
          @click="$emit('simulate')"
        >
          <v-icon icon="mdi-flask-outline" class="me-2" size="18" />
          SIMULAR ÉXITO (MODO TEST)
        </v-btn>

        <v-btn block variant="text" color="slate-400" class="mt-4 text-caption" @click="$emit('back')">
          VOLVER AL PASO ANTERIOR
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineProps<{
  depositAmount: number;
  loading: boolean;
  disabled: boolean;
}>();

const emit = defineEmits(['confirm', 'back', 'simulate']);

const isLocal = computed(() => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
});
</script>


<style scoped>
.elite-step-card {
  border-radius: 40px !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
}

.payment-icon-ring {
  width: 64px;
  height: 64px;
  background: #f8fafc;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f1f5f9;
}

.elite-stripe-container {
  padding: 0;
}

.stripe-field-box {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stripe-field-box:focus-within {
  border-color: #0f172a;
  background: white;
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05);
}

.field-label-premium {
  font-size: 10px;
  font-weight: 900;
  color: #64748b;
  letter-spacing: 1px;
}

.max-w-400 {
  max-width: 400px;
}

.card-glass-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #0f172a, #334155);
}

.mobile-payment-icon {
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f1f5f9;
}

.premium-btn-shadow {
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.2) !important;
}

.stripe-element-container {
  min-height: 24px;
  border-bottom: 1px solid #f1f5f9;
}

#step-card-element, #mobile-card-element {
  width: 100%;
  padding: 8px 0;
}
</style>

<template>
  <div class="booking-step-payment">
    <!-- Desktop -->
    <v-card class="d-none d-md-block elite-step-card pa-12">
      <div class="text-center mb-10">
        <div class="payment-icon-ring mb-4">
          <v-icon icon="mdi-shield-lock" color="#0f172a" size="32" />
        </div>
        <h2 class="text-h4 font-weight-black text-slate-900 mb-2">Pago Seguro</h2>
        <p class="text-body-1 text-slate-500">Introduce los datos de tu tarjeta para autorizar la fianza de {{ depositAmount }}€</p>
      </div>

      <div class="elite-stripe-container mb-10">
        <div id="step-card-element"></div>
      </div>

      <v-btn 
        block 
        height="72" 
        color="#0f172a" 
        class="text-white font-weight-black" 
        :loading="loading"
        @click="$emit('confirm')"
      >
        AUTORIZAR {{ depositAmount }}€
      </v-btn>
      <v-btn block variant="text" color="slate-400" class="mt-4" @click="$emit('back')">VOLVER AL RESUMEN</v-btn>
    </v-card>

    <!-- Mobile -->
    <div class="d-md-none pa-4 pt-0">
      <div class="text-center mb-8">
        <h2 class="text-h5 font-weight-black text-slate-900">Método de Pago</h2>
        <p class="text-caption text-slate-500">Transacción cifrada de extremo a extremo</p>
      </div>

      <div class="mobile-payment-card pa-6 mb-8">
        <div id="mobile-card-element"></div>
      </div>

      <div class="mobile-final-action">
        <v-btn 
          block 
          height="72" 
          color="#0f172a" 
          rounded="xl" 
          class="text-white font-weight-black" 
          :loading="loading"
          @click="$emit('confirm')"
        >
          CONFIRMAR PAGO
        </v-btn>
        <v-btn block variant="text" color="#94a3b8" class="mt-2" @click="$emit('back')">ATRÁS</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  depositAmount: number;
  loading: boolean;
}>();

defineEmits(['confirm', 'back']);
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
  padding: 24px;
  background: #f8fafc;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
}

.mobile-payment-card {
  background: white;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
}

#step-card-element, #mobile-card-element {
  width: 100%;
  padding: 12px 0;
}
</style>

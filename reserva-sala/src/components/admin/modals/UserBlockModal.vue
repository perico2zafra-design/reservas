<template>
  <v-dialog v-model="internalModel" max-width="440" transition="dialog-bottom-transition">
    <v-card rounded="xl" class="elite-dark-modal overflow-hidden">
      <div class="elite-modal-glow bg-amber"></div>
      <div class="pa-8">
        <div class="text-center mb-8">
          <div class="icon-ring bg-amber-op mb-4">
            <v-icon icon="mdi-shield-alert" color="amber" size="32" />
          </div>
          <h3 class="modal-title-white">Aplicar Sanción</h3>
          <p class="modal-subtitle-silver mt-2">Se restringirá el acceso a las instalaciones</p>
        </div>
        
        <v-select
          v-model="blockDuration"
          :items="blockOptions"
          label="Periodo de restricción"
          variant="solo"
          rounded="lg"
          bg-color="rgba(255,255,255,0.05)"
          class="mb-8 select-dark-elite"
          hide-details
        />

        <div class="d-flex flex-column ga-3">
          <v-btn 
            color="#fbbf24" 
            height="54" 
            rounded="lg" 
            block 
            class="btn-elite-gold" 
            :loading="loading"
            @click="confirm"
          >
            CONFIRMAR SANCIÓN
          </v-btn>
          <v-btn 
            variant="text" 
            color="grey-lighten-1" 
            height="44" 
            rounded="lg" 
            block 
            class="btn-elite-cancel" 
            @click="internalModel = false"
          >
            Cancelar y volver
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const internalModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const blockDuration = ref(7);

const blockOptions = [
  { title: 'Infracción Leve (1 Mes)', value: 30 },
  { title: 'Infracción Grave (3 Meses)', value: 90 },
  { title: 'Infracción Grave (6 Meses)', value: 180 },
  { title: 'Muy Grave (1 Año)', value: 365 },
  { title: 'Sanción Indefinida', value: 3650 }
];


const confirm = () => {
  emit('confirm', blockDuration.value);
};
</script>

<style scoped>
.elite-dark-modal {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7) !important;
}

.elite-modal-glow {
  height: 2px;
  width: 100%;
}

.icon-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.bg-amber-op { background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.2); }

.modal-title-white {
  font-family: 'Playfair Display', serif;
  font-size: 1.85rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.modal-subtitle-silver {
  font-size: 0.95rem;
  color: #94a3b8;
  font-weight: 500;
}

.btn-elite-gold {
  font-weight: 900 !important;
  letter-spacing: 1.5px !important;
  color: #0f172a !important;
  text-transform: uppercase !important;
  box-shadow: 0 10px 20px rgba(251, 191, 36, 0.3) !important;
}

.btn-elite-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(251, 191, 36, 0.4) !important;
}

.btn-elite-cancel {
  font-weight: 800 !important;
  letter-spacing: 0.5px !important;
  text-transform: none !important;
  color: rgba(255,255,255,0.5) !important;
}

.select-dark-elite :deep(.v-field) {
  border-radius: 12px !important;
  color: white !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
}

.select-dark-elite :deep(.v-field__input) {
  color: white !important;
}
</style>

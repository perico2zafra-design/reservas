<template>
  <v-dialog v-model="internalModel" max-width="440" transition="dialog-bottom-transition">
    <v-card rounded="xl" class="elite-dark-modal overflow-hidden">
      <div class="elite-modal-glow bg-error"></div>
      <div class="pa-8">
        <div class="text-center mb-8">
          <div class="icon-ring bg-error-op mb-4">
            <v-icon icon="mdi-alert-octagon" color="error" size="32" />
          </div>
          <h3 class="modal-title-white">Eliminar Vecino</h3>
          <p class="modal-subtitle-silver mt-2">Esta acción eliminará todos los datos de forma permanente.</p>
        </div>

        <div class="d-flex flex-column ga-3">
          <v-btn 
            color="#ef4444" 
            height="54" 
            rounded="lg" 
            block 
            class="btn-elite-danger-v2" 
            :loading="loading"
            @click="emit('confirm')"
          >
            ELIMINAR DEFINITIVAMENTE
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
            Volver atrás
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const internalModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
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

.bg-error-op { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); }

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

.btn-elite-danger-v2 {
  font-weight: 900 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  color: white !important;
}

.btn-elite-cancel {
  font-weight: 800 !important;
  letter-spacing: 0.5px !important;
  text-transform: none !important;
  color: rgba(255,255,255,0.5) !important;
}
</style>

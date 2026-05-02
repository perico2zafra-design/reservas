<template>
  <v-dialog v-model="internalValue" max-width="440" transition="dialog-bottom-transition">
    <v-card rounded="xl" class="elite-cancel-modal overflow-hidden">
      <!-- Glow Effect -->
      <div class="cancel-modal-glow"></div>
      
      <div class="pa-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="cancel-icon-ring mb-4">
            <v-icon icon="mdi-calendar-remove" color="#ef4444" size="32" />
          </div>
          <h3 class="modal-title-elite text-playfair">¿Cancelar Reserva?</h3>
          <p class="modal-subtitle-elite mt-2">
            Esta acción liberará tu espacio en <strong>{{ roomName }}</strong> para otros vecinos. No se puede deshacer.
          </p>
        </div>

        <!-- Details Summary -->
        <div class="cancel-details-box pa-6 mb-8">
          <div class="d-flex justify-space-between mb-2">
            <span class="text-label-premium font-weight-black">FECHA</span>
            <span class="text-value-premium">{{ date }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <span class="text-label-premium font-weight-black">HORARIO</span>
            <span class="text-value-premium">{{ time }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex flex-column ga-3">
          <v-btn
            color="#ef4444"
            height="54"
            rounded="lg"
            block
            class="btn-confirm-cancel font-weight-black"
            @click="$emit('confirm')"
            :loading="loading"
          >
            SÍ, CANCELAR RESERVA
          </v-btn>
          
          <v-btn
            variant="text"
            color="slate-400"
            height="44"
            rounded="lg"
            block
            class="btn-abort-cancel font-weight-black"
            @click="internalValue = false"
            :disabled="loading"
          >
            Mantener reserva
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
  roomName: string;
  date: string;
  time: string;
  loading: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<style scoped>
.elite-cancel-modal {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.cancel-modal-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, transparent, #ef4444, #f87171, #ef4444, transparent);
}

.cancel-icon-ring {
  width: 72px;
  height: 72px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.1);
}

.modal-title-elite {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}

.modal-subtitle-elite {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 320px;
  margin: 0 auto;
}

.cancel-details-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.text-label-premium {
  color: #64748b;
  font-size: 0.7rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.text-value-premium {
  color: #f1f5f9 !important;
  font-size: 0.95rem;
  font-weight: 700;
}

.btn-confirm-cancel {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  font-size: 0.85rem !important;
  font-weight: 900 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3) !important;
  transition: all 0.3s ease;
}

.btn-confirm-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(239, 68, 68, 0.4) !important;
}

.btn-abort-cancel {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  font-size: 0.85rem !important;
  font-weight: 700 !important;
  color: #94a3b8 !important;
  text-transform: none !important;
  transition: all 0.3s ease;
}

.btn-abort-cancel:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

@media (max-width: 600px) {
  .modal-title-elite {
    font-size: 1.5rem !important;
  }
  .modal-subtitle-elite {
    font-size: 0.85rem !important;
  }
  .pa-8 {
    padding: 24px !important;
  }
  .cancel-icon-ring {
    width: 60px !important;
    height: 60px !important;
    border-radius: 16px !important;
  }
  .cancel-details-box {
    padding: 16px !important;
  }
  .text-value-premium {
    font-size: 0.85rem !important;
  }
}
</style>

<template>
  <v-dialog v-model="internalValue" max-width="400" transition="dialog-bottom-transition">
    <v-card rounded="xl" class="logout-modal-elite overflow-hidden">
      <!-- Glow effect top -->
      <div class="logout-glow"></div>
      
      <div class="pa-10 text-center">
        <div class="logout-icon-ring mb-6">
          <v-icon icon="mdi-logout-variant" color="#ef4444" size="32" />
        </div>

        <h2 class="text-playfair text-h4 mb-3 text-white">¿Cerrar Sesión?</h2>
        <p class="text-body-2 text-slate-400 mb-8 px-4">
          Estamos deseando volver a verte pronto en el residencial. Tus reservas y gestiones se guardarán de forma segura.
        </p>

        <div class="d-flex flex-column ga-3">
          <v-btn 
            color="#ef4444" 
            height="56" 
            rounded="xl" 
            block 
            class="font-weight-black text-white elite-logout-btn"
            @click="$emit('confirm')"
          >
            SÍ, CERRAR SESIÓN
          </v-btn>
          
          <v-btn 
            variant="text" 
            height="48" 
            rounded="xl" 
            block 
            class="font-weight-bold text-slate-500"
            @click="internalValue = false"
          >
            CANCELAR
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
.logout-modal-elite {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.logout-glow {
  height: 4px;
  background: linear-gradient(to right, transparent, #ef4444, transparent);
  opacity: 0.5;
}

.logout-icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.elite-logout-btn {
  letter-spacing: 1.5px;
  box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.3) !important;
  transition: all 0.3s ease;
}

.elite-logout-btn:hover {
  transform: translateY(-2px);
  background-color: #dc2626 !important;
  box-shadow: 0 15px 30px -5px rgba(239, 68, 68, 0.4) !important;
}
</style>

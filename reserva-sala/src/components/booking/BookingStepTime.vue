<template>
  <div class="booking-step-time">
    <!-- Desktop -->
    <v-card class="d-none d-md-block elite-step-card pa-12">
      <div class="d-flex align-center justify-space-between mb-12">
        <h2 class="text-h4 font-weight-black text-slate-900">Elige el Horario</h2>
        <v-btn variant="text" color="slate-400" @click="$emit('back')">VOLVER</v-btn>
      </div>
      <div class="elite-time-grid mb-10">
        <div 
          v-for="slot in timeSlots" 
          :key="slot.value" 
          :class="['elite-time-card', { active: modelValue === slot.value }]" 
          @click="$emit('update:modelValue', slot.value)"
        >
          <v-icon :icon="slot.icon" size="32" class="mb-4" />
          <div class="slot-name font-weight-black">{{ slot.label }}</div>
        </div>
      </div>
    </v-card>

    <!-- Mobile -->
    <div class="d-md-none pa-4">
      <div class="mobile-time-selection">
        <div 
          v-for="slot in timeSlots" 
          :key="slot.value" 
          class="mobile-time-strip pa-5 mb-4" 
          :class="{ active: modelValue === slot.value }" 
          @click="$emit('update:modelValue', slot.value)"
        >
          <div class="d-flex align-center">
            <v-icon :icon="slot.icon" class="me-4" size="24" />
            <div class="flex-grow-1">
              <div class="text-subtitle-1 font-weight-black">{{ slot.label }}</div>
              <div class="text-caption opacity-60">{{ slot.range }}</div>
            </div>
            <v-icon icon="mdi-chevron-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | null;
  timeSlots: any[];
}>();

defineEmits(['update:modelValue', 'back']);
</script>

<style scoped>
.elite-step-card {
  border-radius: 40px !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
}

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
  text-align: center;
}

.elite-time-card.active {
  background: #0f172a;
  border-color: #0f172a;
  color: white;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.mobile-time-strip {
  background: white;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.mobile-time-strip.active {
  border-color: #0f172a;
  background: #f8fafc;
  transform: translateX(8px);
}
</style>

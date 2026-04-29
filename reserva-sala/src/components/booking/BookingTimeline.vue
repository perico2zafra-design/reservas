<template>
  <div class="booking-timeline-container">
    <div class="d-flex align-center mb-4">
      <v-icon icon="mdi-clock-check-outline" color="primary" class="me-2" />
      <span class="text-h6 font-weight-black">Selecciona tu horario</span>
      <v-spacer />
      <div class="d-flex gap-4">
        <div class="d-flex align-center text-caption">
          <div class="status-dot bg-success me-1" /> Libre
        </div>
        <div class="d-flex align-center text-caption">
          <div class="status-dot bg-grey me-1" /> Ocupado
        </div>
        <div class="d-flex align-center text-caption">
          <div class="status-dot bg-primary me-1" /> Tu selección
        </div>
      </div>
    </div>

    <div class="timeline-scroll-wrapper">
      <div class="timeline-grid">
        <div 
          v-for="slot in timeSlots" 
          :key="slot.time" 
          class="time-slot-column"
          :class="{ 
            'is-booked': slot.booked, 
            'is-selected': isSelected(slot.time),
            'is-disabled': !slot.available 
          }"
          @click="toggleSlot(slot)"
        >
          <div class="slot-bar" />
          <div class="slot-label">{{ slot.time }}</div>
        </div>
      </div>
    </div>

    <v-expand-transition>
      <div v-if="selection.start" class="mt-6 pa-4 selection-summary rounded-xl d-flex align-center shadow-sm">
        <v-icon icon="mdi-calendar-range" color="primary" class="me-3" />
        <div>
          <div class="text-caption text-medium-emphasis font-weight-bold">Horario seleccionado:</div>
          <div class="text-h6 font-weight-black text-primary">
            {{ selection.start }} <v-icon icon="mdi-arrow-right" size="16" /> {{ selection.end || '...' }}
          </div>
        </div>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="clearSelection" />
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  bookedSlots: { start: string, end: string }[]
  openingTime: string
  closingTime: string
}>()

const emit = defineEmits(['update:selection'])

const selection = ref<{ start: string | null, end: string | null }>({ start: null, end: null })

const timeSlots = computed(() => {
  const slots = []
  const startHour = parseInt(props.openingTime.split(':')[0])
  const endHour = parseInt(props.closingTime.split(':')[0])

  for (let h = startHour; h < endHour; h++) {
    for (let m of ['00', '30']) {
      const time = `${h.toString().padStart(2, '0')}:${m}`
      const isBooked = props.bookedSlots.some(b => {
        return time >= b.start && time < b.end
      })
      slots.push({
        time,
        booked: isBooked,
        available: true // Aquí podrías añadir lógica de "fuera de horario"
      })
    }
  }
  return slots
})

const isSelected = (time: string) => {
  if (!selection.value.start) return false
  if (!selection.value.end) return time === selection.value.start
  return time >= selection.value.start && time < selection.value.end
}

const toggleSlot = (slot: any) => {
  if (slot.booked) return

  if (!selection.value.start || (selection.value.start && selection.value.end)) {
    selection.value.start = slot.time
    selection.value.end = null
  } else {
    if (slot.time <= selection.value.start) {
      selection.value.start = slot.time
      selection.value.end = null
    } else {
      selection.value.end = slot.time
      // Emitir el rango completo
      emit('update:selection', { ...selection.value })
    }
  }
}

const clearSelection = () => {
  selection.value = { start: null, end: null }
  emit('update:selection', selection.value)
}
</script>

<style scoped>
.booking-timeline-container {
  user-select: none;
}

.timeline-scroll-wrapper {
  overflow-x: auto;
  padding: 20px 0;
  scrollbar-width: thin;
}

.timeline-grid {
  display: flex;
  gap: 8px;
  min-width: max-content;
}

.time-slot-column {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slot-bar {
  width: 100%;
  height: 60px;
  background: rgba(var(--v-theme-success), 0.1);
  border-radius: 12px;
  border: 2px solid transparent;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.time-slot-column:hover .slot-bar {
  background: rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.3);
  transform: translateY(-4px);
}

.is-booked {
  cursor: not-allowed;
  opacity: 0.5;
}
.is-booked .slot-bar {
  background: #eee !important;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0,0,0,0.05) 5px,
    rgba(0,0,0,0.05) 10px
  ) !important;
}

.is-selected .slot-bar {
  background: rgba(var(--v-theme-primary), 1) !important;
  box-shadow: 0 8px 15px rgba(var(--v-theme-primary), 0.4);
}

.is-selected .slot-label {
  color: rgb(var(--v-theme-primary));
  font-weight: 800;
}

.slot-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.selection-summary {
  background: rgba(var(--v-theme-primary), 0.05);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.gap-4 { gap: 16px; }
</style>

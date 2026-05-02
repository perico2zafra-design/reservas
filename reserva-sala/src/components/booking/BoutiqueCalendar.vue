<template>
  <div class="boutique-calendar-container">
    <v-locale-provider locale="es">
      <v-date-picker
        v-model="internalDate"
        color="#0f172a"
        elevation="0"
        class="w-100 boutique-picker"
        :min="minDate"
        hide-header
        first-day-of-week="1"
      >
        <template v-slot:day="{ props, day }">
          <div 
            v-bind="props"
            :class="['calendar-cell', day?.date ? getDayStatus(day.date) : '']"
          >
            <span class="day-number">{{ day?.day }}</span>
            <div v-if="day?.date" class="status-dot"></div>
          </div>
        </template>
      </v-date-picker>
    </v-locale-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: Date,
  bookings: any[],
  closedDates: string[],
  minDate: string
}>()

const emit = defineEmits(['update:modelValue'])

const internalDate = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  internalDate.value = newVal
})

watch(internalDate, (newVal) => {
  emit('update:modelValue', newVal)
})

const getDayStatus = (date: any) => {
  if (!date) return ''
  
  // 1. Inhábiles
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const monthDay = `${month}-${day}`
  if (props.closedDates.includes(monthDay)) return 'status-disabled'

  // 2. Ocupación
  const dateStr = date.toISOString().split('T')[0]
  const dayBookings = props.bookings.filter(b => b.booking_date === dateStr)
  
  if (dayBookings.length === 0) return 'status-free'
  
  const hasFullDay = dayBookings.some(b => b.start_time <= '10:00' && b.end_time >= '22:00')
  const hasMorning = dayBookings.some(b => b.start_time <= '10:00' && b.end_time <= '15:00')
  const hasAfternoon = dayBookings.some(b => b.start_time >= '15:00' && b.end_time >= '22:00')

  if (hasFullDay || (hasMorning && hasAfternoon)) return 'status-busy'
  if (hasMorning || hasAfternoon) return 'status-partial'
  
  return 'status-free'
}
</script>

<style scoped>
.boutique-calendar-container {
  background: white;
  border-radius: 24px;
  padding: 8px;
}

:deep(.v-date-picker-month__days) {
  gap: 8px !important;
}

.calendar-cell {
  width: 44px !important;
  height: 44px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 12px !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
  position: relative !important;
}

.day-number {
  font-weight: 800 !important;
  font-size: 1.1rem !important;
  color: #1a202c !important; /* Gris muy oscuro casi negro */
  line-height: 1 !important;
  display: block !important;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-top: 4px;
}

/* Colores de estado */
.status-free { background-color: #f0fdf4 !important; border: 1px solid #dcfce7 !important; }
.status-free .status-dot { background-color: #22c55e; }

.status-busy { background-color: #fef2f2 !important; border: 1px solid #fee2e2 !important; }
.status-busy .status-dot { background-color: #ef4444; }

.status-partial { background-color: #fffbeb !important; border: 1px solid #fef3c7 !important; }
.status-partial .status-dot { background-color: #f59e0b; }

.status-disabled { background-color: #f1f5f9 !important; opacity: 0.4; }
.status-disabled .day-number { color: #94a3b8 !important; }

/* Selección */
.calendar-cell[aria-selected="true"] {
  background-color: #0f172a !important;
  transform: scale(1.05);
}
.calendar-cell[aria-selected="true"] .day-number {
  color: white !important;
}
</style>

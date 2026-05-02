<template>
  <div class="boutique-calendar-wrapper">
    <v-date-picker
      v-model="internalDate"
      color="#0f172a"
      elevation="0"
      class="w-100 boutique-picker"
      :min="minDate"
      :max="maxDate"
      hide-header
      locale="es"
      first-day-of-week="1"
      :allowed-dates="isAllowedDate"
    >


      <template v-slot:day="slot">
        <div 
          v-bind="slot.props"
          :class="[
            'calendar-cell', 
            slot.item?.date ? getDayStatus(slot.item.date) : '',
            { 'is-selected': slot.item?.isSelected }
          ]"
        >
          <span class="day-number">
            {{ slot.item?.date ? new Date(slot.item.date).getDate() : '' }}
          </span>
          <div v-if="slot.item?.date" class="status-dot"></div>
        </div>
      </template>

    </v-date-picker>

  </div>
</template>


<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: Date | null;
  bookings: any[];
  closedDates: string[];
  minDate: string;
  maxDate?: string;
}>();



const emit = defineEmits(["update:modelValue"]);

const internalDate = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) internalDate.value = newVal;
  },
);

watch(internalDate, (newVal) => {
  emit("update:modelValue", newVal);
});

const isAllowedDate = (date: any) => {
  if (!date) return false
  
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // No permitir días pasados
  if (d < today) return false

  // Límite de 1 mes (horizonte de reserva)
  if (props.maxDate) {
    const max = new Date(props.maxDate)
    max.setHours(23, 59, 59, 999)
    if (d > max) return false
  }
  
  const month = String(d.getMonth() + 1).padStart(2, '0')

  const day = String(d.getDate()).padStart(2, '0')
  const monthDay = `${month}-${day}`
  
  // No permitir inhábiles
  if (props.closedDates.includes(monthDay)) return false

  const dateStr = d.toISOString().split('T')[0]
  const dayBookings = props.bookings.filter(b => b.booking_date === dateStr)
  
  // No permitir si está lleno
  const hasFullDay = dayBookings.some(b => b.start_time <= '10:00' && b.end_time >= '22:00')
  const hasMorning = dayBookings.some(b => b.start_time <= '10:00' && b.end_time <= '15:00')
  const hasAfternoon = dayBookings.some(b => b.start_time >= '15:00' && b.end_time >= '22:00')

  if (hasFullDay || (hasMorning && hasAfternoon)) return false
  
  return true
}

const getDayStatus = (date: any) => {
  if (!date) return ''
  
  try {
    const d = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Estado para días pasados o fuera del límite
    if (d < today) return 'status-disabled'
    
    if (props.maxDate) {
      const max = new Date(props.maxDate)
      max.setHours(23, 59, 59, 999)
      if (d > max) return 'status-disabled'
    }

    const month = String(d.getMonth() + 1).padStart(2, '0')

    const day = String(d.getDate()).padStart(2, '0')
    const monthDay = `${month}-${day}`
    
    if (props.closedDates.includes(monthDay)) return 'status-disabled'

    const dateStr = d.toISOString().split('T')[0]
    const dayBookings = props.bookings.filter(b => b.booking_date === dateStr)
    
    // Log para depuración de estados
    if (dayBookings.length > 0) {
      console.log(`Día ${dateStr} tiene ${dayBookings.length} reservas`);
    }
    
    if (dayBookings.length === 0) return 'status-free'
    
    const hasFullDay = dayBookings.some(b => b.start_time <= '10:00' && b.end_time >= '22:00')
    const hasMorning = dayBookings.some(b => b.start_time <= '10:00' && b.end_time <= '15:00')
    const hasAfternoon = dayBookings.some(b => b.start_time >= '15:00' && b.end_time >= '22:00')

    if (hasFullDay || (hasMorning && hasAfternoon)) return 'status-busy'
    if (hasMorning || hasAfternoon) return 'status-partial'
    
    return 'status-free'
  } catch (e) {
    return 'status-free'
  }
}
</script>

<style scoped>
.boutique-calendar-wrapper {
  background: white;
  border-radius: 24px;
  padding: 16px;
  border: 1px solid #f1f5f9;
}

@media (max-width: 600px) {
  .boutique-calendar-wrapper {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
  }
}


/* Espaciado de la cuadrícula de Vuetify */
:deep(.v-date-picker-month__days) {
  gap: 12px 6px !important; /* Separación vertical y horizontal */
}

.calendar-cell {
  width: 44px !important;
  height: 44px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 12px !important;
  cursor: pointer !important;
  background-color: #f8fafc !important;
  position: relative !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
}

.calendar-cell:hover {
  background-color: #f1f5f9 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}


.day-number {
  font-size: 1rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  z-index: 10;
}

/* Colores de estado Boutique */
.status-free { background-color: #ecfdf5 !important; border: 1px solid #d1fae5 !important; }
.status-free .status-dot { background-color: #10b981; }

.status-busy { 
  background-color: #fef2f2 !important; 
  border: 1px solid #fee2e2 !important;
  pointer-events: none !important;
  cursor: not-allowed !important;
}
.status-busy .status-dot { background-color: #ef4444; }


.status-partial { background-color: #fffbeb !important; border: 1px solid #fef3c7 !important; }
.status-partial .status-dot { background-color: #f59e0b; }

.status-disabled { 
  background-color: #f8fafc !important; 
  opacity: 0.3 !important;
  pointer-events: none !important;
  cursor: not-allowed !important;
}
.status-disabled .day-number { color: #94a3b8 !important; }


/* Selección activa premium dinámica */
.calendar-cell.is-selected {
  transform: scale(1.1) !important;
  border: 2px solid #d4af37 !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  z-index: 20;
}

/* Selección según estado */
.calendar-cell.status-free.is-selected {
  background-color: #065f46 !important; /* Esmeralda oscuro */
}
.calendar-cell.status-busy.is-selected {
  background-color: #991b1b !important; /* Rojo oscuro */
}
.calendar-cell.status-partial.is-selected {
  background-color: #92400e !important; /* Ámbar oscuro */
}

.calendar-cell.is-selected .day-number {
  color: white !important;
}
.calendar-cell.is-selected .status-dot {
  background-color: #d4af37 !important;
}
/* REDISEÑO ULTRA-PREMIUM Y COMPACTO */
.elite-calendar-container {
  width: 100%;
  max-width: 100%;
  padding: 0;
  background: rgba(255, 255, 255, 0.8);

  backdrop-filter: blur(10px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  margin: 0 auto;
}

:deep(.v-date-picker) {
  width: 100% !important;
  min-width: 0 !important;
  background: transparent !important;
}

:deep(.v-date-picker-controls) {
  padding: 4px 8px !important;
  gap: 4px !important;
}

:deep(.v-date-picker-controls__month), 
:deep(.v-date-picker-controls__year) {
  padding: 0 4px !important;
}

:deep(.v-date-picker-month__days) {
  row-gap: 16px !important; /* Aumentado a 16px por petición */
  column-gap: 1px !important;
  justify-content: space-between !important;
}



:deep(.v-date-picker-month__weekday) {
  font-size: 9px !important;
  color: #94a3b8 !important;
  font-weight: 900 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* AJUSTES DE TAMAÑO SEGÚN PANTALLA */
@media (max-width: 600px) {
  :deep(.v-date-picker-month__day) {
    --v-date-picker-month-day-size: 35px !important;
    width: 35px !important;
    height: 35px !important;
  }
  .calendar-cell {
    width: 35px !important;
    height: 35px !important;
  }
  :deep(.v-date-picker-month__days) {
    row-gap: 10px !important;
  }
}



@media (max-width: 380px) {
  :deep(.v-date-picker-month__day) {
    --v-date-picker-month-day-size: 28px !important;
    width: 32px !important;
    height: 32px !important;
  }
  
  .elite-calendar-container {
    padding: 4px;
  }
}

@media (max-width: 340px) {
  :deep(.v-date-picker-month__day) {
    --v-date-picker-month-day-size: 26px !important;
    width: 28px !important;
  }
}
</style>






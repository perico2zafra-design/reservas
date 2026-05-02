<template>
  <div class="boutique-calendar-wrapper">
    <v-date-picker
      v-model="internalDate"
      color="#0f172a"
      elevation="0"
      class="w-100 boutique-picker"
      :min="minDate"
      hide-header
    >
      <template v-slot:day="{ day, props }">

          <div
            v-bind="props"
            :class="['calendar-cell', day?.date ? getDayStatus(day.date) : '']"
          >
            <span class="force-visible-number">
              {{ day?.date ? new Date(day.date).getDate() : "" }}
            </span>
          </div>
        </template>
      </v-date-picker>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: Date;
  bookings: any[];
  closedDates: string[];
  minDate: string;
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

const getDayStatus = (date: any) => {
  if (!date) return "";

  try {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const monthDay = `${month}-${day}`;
    if (props.closedDates.includes(monthDay)) return "status-disabled";

    const dateStr = d.toISOString().split("T")[0];
    const dayBookings = props.bookings.filter(
      (b) => b.booking_date === dateStr,
    );

    if (dayBookings.length === 0) return "status-free";

    const hasFullDay = dayBookings.some(
      (b) => b.start_time <= "10:00" && b.end_time >= "22:00",
    );
    const hasMorning = dayBookings.some(
      (b) => b.start_time <= "10:00" && b.end_time <= "15:00",
    );
    const hasAfternoon = dayBookings.some(
      (b) => b.start_time >= "15:00" && b.end_time >= "22:00",
    );

    if (hasFullDay || (hasMorning && hasAfternoon)) return "status-busy";
    if (hasMorning || hasAfternoon) return "status-partial";

    return "status-free";
  } catch (e) {
    return "status-free";
  }
};
</script>

<style scoped>
.boutique-calendar-wrapper {
  background: white;
  border-radius: 24px;
  padding: 8px;
  border: 1px solid #f1f5f9;
}

.calendar-cell {
  width: 44px !important;
  height: 44px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 12px !important;
  margin: 2px !important;
  cursor: pointer !important;
  background-color: #f8fafc !important;
  position: relative !important;
  overflow: visible !important;
}

.force-visible-number {
  color: #ff0000 !important; /* ROJO BRILLANTE PARA CONFIRMAR */
  font-weight: 900 !important;
  font-size: 1.2rem !important;
  line-height: 1 !important;
  display: block !important;
  z-index: 999 !important;
}

/* Colores de estado */
.status-free {
  background-color: #ecfdf5 !important;
  border: 1px solid #d1fae5 !important;
}
.status-busy {
  background-color: #fef2f2 !important;
  border: 1px solid #fee2e2 !important;
}
.status-partial {
  background-color: #fffbeb !important;
  border: 1px solid #fef3c7 !important;
}
.status-disabled {
  background-color: #f1f5f9 !important;
  opacity: 0.3 !important;
}

/* Selección */
.calendar-cell[aria-selected="true"] {
  background-color: #0f172a !important;
  border: 2px solid #d4af37 !important;
}
.calendar-cell[aria-selected="true"] .force-visible-number {
  color: white !important;
}
</style>

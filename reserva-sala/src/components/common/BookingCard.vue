<template>
  <v-card rounded="32" class="mb-6 pa-6 border-0 elevation-xl booking-card">
    <v-row align="center">
      <!-- Icono/Imagen de la Sala -->
      <v-col cols="12" sm="3" class="d-flex justify-center justify-sm-start">
        <v-avatar size="80" rounded="24" class="elevation-4">
          <v-img :src="booking.room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200'" cover />
        </v-avatar>
      </v-col>

      <!-- Info Principal -->
      <v-col cols="12" sm="6">
        <div class="d-flex align-center mb-1">
          <h3 class="text-h6 font-weight-black text-slate-900 me-2">{{ booking.room?.name }}</h3>
          <v-chip :color="getStatusColor(booking.status)" size="x-small" variant="flat" class="font-weight-black">
            {{ booking.status }}
          </v-chip>
        </div>
        
        <div class="d-flex align-center text-body-2 text-slate-500 mb-2">
          <v-icon icon="mdi-calendar" size="16" class="me-2" />
          {{ formatDate(booking.booking_date) }}
          <v-icon icon="mdi-clock-outline" size="16" class="ms-4 me-2" />
          {{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}
        </div>

        <div v-if="isAdmin && booking.user" class="d-flex align-center mt-2">
          <InitialAvatar :name="booking.user.name" size="24" class="me-2" />
          <span class="text-caption font-weight-bold text-slate-700">{{ booking.user.name }}</span>
        </div>
      </v-col>

      <!-- Info de Pago / Fianza -->
      <v-col cols="12" sm="3" class="text-right">
        <div class="text-h5 font-weight-black text-slate-900 mb-1">{{ formatCurrency(booking.deposit_amount) }}</div>
        <v-chip :color="getStatusColor(booking.deposit_status)" size="x-small" variant="tonal" class="font-weight-bold mb-4">
          FIANZA {{ booking.deposit_status }}
        </v-chip>
        
        <div class="d-flex ga-2 justify-end">
          <slot name="actions"></slot>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { formatDate, formatCurrency, formatTime, getStatusColor } from '@/utils/formatters'
import InitialAvatar from '@/components/common/InitialAvatar.vue'
import type { Booking } from '@/types'

defineProps<{
  booking: Booking
  isAdmin?: boolean
}>()
</script>

<style scoped>
.booking-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 6px solid transparent !important;
}
.booking-card:hover {
  transform: translateX(5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05) !important;
}
</style>

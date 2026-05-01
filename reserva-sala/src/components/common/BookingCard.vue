<template>
  <v-card 
    rounded="24" 
    class="mb-6 pa-5 border-0 elevation-xl booking-card-elite"
  >
    <div class="card-glass-bg"></div>
    <v-row align="center" class="position-relative z-10">
      <!-- Icono/Imagen de la Sala -->
      <v-col cols="12" sm="3" class="d-flex justify-center justify-sm-start">
        <div class="image-container-elite">
          <v-img 
            :src="booking.room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200'" 
            cover 
            class="rounded-xl elite-image"
          />
          <div class="image-overlay"></div>
        </div>
      </v-col>

      <!-- Info Principal -->
      <v-col cols="12" sm="5">
        <div class="d-flex align-center mb-2 flex-wrap ga-2">
          <h3 class="text-h6 font-weight-black text-slate-900 leading-tight">{{ booking.room?.name }}</h3>
          <div :class="['status-badge-elite', booking.status.toLowerCase()]">
            <span class="status-dot"></span>
            {{ booking.status }}
          </div>
        </div>
        
        <div class="d-flex flex-column ga-1">
          <div class="d-flex align-center text-body-2 text-slate-500">
            <v-icon icon="mdi-calendar-range" size="18" color="primary" class="me-2" />
            <span class="font-weight-medium">{{ formatDate(booking.booking_date) }}</span>
          </div>
          <div class="d-flex align-center text-body-2 text-slate-500">
            <v-icon icon="mdi-clock-outline" size="18" color="primary" class="me-2" />
            <span class="font-weight-medium">{{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}</span>
          </div>
        </div>

        <div v-if="isAdmin && booking.user" class="d-flex align-center mt-3 pt-3 border-top-light">
          <InitialAvatar :name="booking.user.name" size="28" class="me-2 elevation-2" />
          <div class="d-flex flex-column">
            <span class="text-caption text-slate-400 font-weight-bold leading-tight">SOLICITANTE</span>
            <span class="text-subtitle-2 font-weight-black text-slate-700 leading-tight">{{ booking.user.name }}</span>
          </div>
        </div>
      </v-col>

      <!-- Info de Pago / Fianza -->
      <v-col cols="12" sm="4" class="text-sm-right d-flex flex-column align-sm-end">
        <div class="price-tag-elite mb-1">
          <span class="currency">€</span>
          <span class="amount">{{ booking.deposit_amount }}</span>
        </div>
        
        <v-chip 
          :color="getStatusColor(booking.deposit_status)" 
          size="x-small" 
          variant="tonal" 
          class="font-weight-black mb-4 elite-fianza-chip"
        >
          FIANZA {{ booking.deposit_status }}
        </v-chip>
        
        <div class="d-flex ga-2 justify-sm-end w-100 mt-auto">
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
.booking-card-elite {
  position: relative;
  overflow: hidden;
  background: white !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
}

.card-glass-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
  z-index: 1;
}

.booking-card-elite:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
}

.image-container-elite {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.elite-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.booking-card-elite:hover .elite-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%);
}

.status-badge-elite {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}

.confirmed { background: #ecfdf5; color: #059669; }
.confirmed .status-dot { background: #10b981; }

.pending { background: #fffbeb; color: #d97706; }
.pending .status-dot { background: #f59e0b; }

.cancelled { background: #fef2f2; color: #dc2626; }
.cancelled .status-dot { background: #ef4444; }

.price-tag-elite {
  color: #0f172a;
  display: flex;
  align-items: baseline;
}

.price-tag-elite .currency {
  font-size: 1rem;
  font-weight: 700;
  margin-right: 2px;
}

.price-tag-elite .amount {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -1px;
}

.elite-fianza-chip {
  font-size: 0.6rem !important;
  letter-spacing: 1px;
}

.border-top-light {
  border-top: 1px solid rgba(0,0,0,0.05);
}

.leading-tight {
  line-height: 1.2 !important;
}

@media (max-width: 600px) {
  .image-container-elite {
    padding-top: 56.25%; /* 16:9 on mobile */
    margin-bottom: 16px;
  }
}
</style>

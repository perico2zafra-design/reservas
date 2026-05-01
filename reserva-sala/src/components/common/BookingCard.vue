<template>
  <v-card 
    flat 
    class="mb-4 booking-card-elite"
  >
    <v-container fluid class="pa-0">
      <v-row no-gutters align="center">
        <!-- Imagen: Con marco premium -->
        <v-col cols="12" md="2" class="pa-3">
          <div class="image-wrapper-elite">
            <v-img 
              :src="booking.room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400'" 
              cover 
              class="rounded-lg main-image-elite"
            />
          </div>
        </v-col>

        <!-- Información: Tipografía refinada -->
        <v-col cols="12" md="6" class="pa-4 ps-md-6 d-flex flex-column justify-center">
          <div class="d-flex align-center mb-2 flex-wrap ga-3">
            <h3 class="room-title-elite text-playfair">{{ booking.room?.name || 'SALA SOCIAL' }}</h3>
            <div :class="['status-chip-elite', booking.status?.toLowerCase()]">
              <span class="dot"></span>
              {{ booking.status }}
            </div>
          </div>
          
          <div class="d-flex flex-row flex-wrap ga-5 mt-2">
            <div class="d-flex align-center info-item-elite">
              <v-icon icon="mdi-calendar-gold" color="amber-darken-3" size="20" class="me-2" />
              <span>{{ formatDate(booking.booking_date) }}</span>
            </div>
            <div class="d-flex align-center info-item-elite">
              <v-icon icon="mdi-clock-outline" color="amber-darken-3" size="20" class="me-2" />
              <span>{{ formatTime(booking.start_time) }} — {{ formatTime(booking.end_time) }}</span>
            </div>
          </div>
        </v-col>

        <!-- Pago y Acciones: Estilo Boutique -->
        <v-col cols="12" md="4" class="pa-4 bg-elite-accent d-flex flex-row align-center justify-space-between border-left-elite">
          <div class="d-flex flex-column">
            <span class="label-mini-elite">DEPOSITO FIANZA</span>
            <div class="price-box-elite">
              <span class="currency">€</span>
              <span class="amount text-playfair">{{ booking.deposit_amount }}</span>
            </div>
            <div class="status-pill-elite">{{ booking.deposit_status }}</div>
          </div>
          
          <div class="actions-wrapper-elite">
            <slot name="actions"></slot>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { formatDate, formatTime } from '@/utils/formatters'
import type { Booking } from '@/types'

defineProps<{
  booking: Booking
  isAdmin?: boolean
}>()
</script>

<style scoped>
.booking-card-elite {
  background: linear-gradient(to right, #ffffff, #fafafa) !important;
  border: 1px solid #e2e8f0 !important;
  border-left: 4px solid #d97706 !important; /* El hilo de oro */
  border-radius: 16px !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.booking-card-elite:hover {
  transform: translateY(-4px) scale(1.005);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #d97706 !important;
}

.image-wrapper-elite {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.main-image-elite {
  height: 100px;
  transition: transform 0.6s ease;
}

.booking-card-elite:hover .main-image-elite {
  transform: scale(1.1);
}

.room-title-elite {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.status-chip-elite {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: white;
  border: 1px solid #e2e8f0;
}

.status-chip-elite .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
}

.confirmed { color: #15803d; border-color: #bbf7d0; }
.confirmed .dot { background: #22c55e; }

.pending { color: #b45309; border-color: #fef08a; }
.pending .dot { background: #f59e0b; }

.cancelled { color: #b91c1c; border-color: #fecaca; }
.cancelled .dot { background: #ef4444; }

.info-item-elite {
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
}

.bg-elite-accent {
  background-color: #f8fafc;
}

.border-left-elite {
  border-left: 1px solid #f1f5f9;
}

.label-mini-elite {
  font-size: 0.6rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 1px;
}

.price-box-elite {
  display: flex;
  align-items: baseline;
  margin: 2px 0;
}

.price-box-elite .currency {
  font-size: 1rem;
  font-weight: 700;
  color: #d97706;
  margin-right: 4px;
}

.price-box-elite .amount {
  font-size: 2.25rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
}

.status-pill-elite {
  font-size: 0.7rem;
  font-weight: 800;
  color: #1e293b;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.actions-wrapper-elite :deep(.v-btn) {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 900 !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
}

/* Responsive */
@media (max-width: 959px) {
  .main-image-elite { height: 160px; }
  .border-left-elite { border-left: none; border-top: 1px solid #f1f5f9; }
  .bg-elite-accent { background-color: #fff; border-top: 1px solid #f1f5f9; }
}
</style>

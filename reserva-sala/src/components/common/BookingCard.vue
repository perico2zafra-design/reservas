<template>
  <v-card flat class="mb-6 booking-card-elite-v2 overflow-hidden">
    <div class="elite-card-accent"></div>
    
    <!-- Mobile/Desktop Unified Layout -->
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <!-- Section 1: Image & Basic Info (Side-by-Side on Desktop, Stacked or compact on mobile) -->
        <v-col cols="12" md="8" class="d-flex flex-column flex-sm-row">
          <div class="image-container-premium">
            <v-img 
              :src="booking.room?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400'" 
              cover 
              class="h-100"
            />
          </div>
          
          <div class="pa-4 pa-md-6 flex-grow-1">
            <div class="d-flex align-center justify-space-between mb-3">
              <h3 class="text-playfair room-name-v2">{{ booking.room?.name || 'SALA SOCIAL' }}</h3>
              <div :class="['status-badge-v2', booking.status?.toLowerCase()]">
                {{ translateStatus(booking.status) }}
              </div>
            </div>

            <div class="info-grid-v2">
              <div class="info-item-v2">
                <v-icon icon="mdi-calendar-outline" size="16" class="me-2" />
                <span>{{ formatDate(booking.booking_date) }}</span>
              </div>
              <div class="info-item-v2">
                <v-icon icon="mdi-clock-outline" size="16" class="me-2" />
                <span>{{ formatTime(booking.start_time) }} — {{ formatTime(booking.end_time) }}</span>
              </div>
            </div>

            <!-- CÓDIGO DE ACCESO (SMART LOCK) - DISEÑO PREMIUM -->
            <div v-if="booking.access_code && booking.status === 'CONFIRMED'" class="digital-key-wrapper mt-4">
              <div class="key-card-elite">
                <div class="d-flex align-center">
                  <div class="key-icon-box">
                    <v-icon icon="mdi-key-variant" color="#fbbf24" size="20" />
                  </div>
                  <div class="ms-3">
                    <div class="key-label">LLAVE DIGITAL</div>
                    <div class="key-code">{{ booking.access_code }}</div>
                  </div>
                </div>
                <v-icon icon="mdi-nfc" class="nfc-icon" size="24" />
              </div>
            </div>
          </div>
        </v-col>

        <!-- Section 2: Financials & Actions (Right side on desktop, bottom bar style on mobile) -->
        <v-col cols="12" md="4" class="financial-section-v2 pa-4 pa-md-6 d-flex flex-row flex-md-column align-center align-md-start justify-space-between">
          <div class="d-flex flex-column">
            <span class="label-tiny">FIANZA RETENIDA</span>
            <div class="price-display-v2">
              <span class="currency">€</span>
              <span class="amount text-playfair">{{ booking.deposit_amount }}</span>
              <v-chip size="x-small" density="compact" class="ms-2 font-weight-black status-chip-v2" :color="booking.deposit_status === 'REFUNDED' ? 'success' : ''">
                {{ translateDepositStatus(booking.deposit_status) }}
              </v-chip>
            </div>
          </div>

          <div class="actions-container-v2 mt-md-4">
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

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    'CONFIRMED': 'Confirmada',
    'PENDING': 'Pendiente',
    'CANCELLED': 'Cancelada'
  }
  return map[status] || status
}

const translateDepositStatus = (status: string) => {
  const map: Record<string, string> = {
    'PAID': 'Garantizada',
    'REFUNDED': 'Devuelta',
    'CAPTURED': 'Cobrada',
    'VOIDED': 'Anulada'
  }
  return map[status] || status
}

defineProps<{
  booking: Booking
  isAdmin?: boolean
}>()
</script>

<style scoped>
.booking-card-elite-v2 {
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 20px !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02) !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
}

.booking-card-elite-v2:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08) !important;
  border-color: #fbbf24 !important;
}

.elite-card-accent {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: #fbbf24;
}

.image-container-premium {
  width: 200px;
  min-height: 120px;
  background: #f1f5f9;
}

.room-name-v2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}

.status-badge-v2 {
  font-size: 0.6rem;
  font-weight: 900;
  padding: 2px 10px;
  border-radius: 100px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.status-badge-v2.confirmed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge-v2.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.status-badge-v2.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.info-grid-v2 {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item-v2 {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.financial-section-v2 {
  background: #f8fafc;
  border-left: 1px solid #f1f5f9;
}

.label-tiny {
  font-size: 0.55rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 1px;
}

.price-display-v2 {
  display: flex;
  align-items: baseline;
}

.price-display-v2 .currency {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fbbf24;
  margin-right: 2px;
}

.price-display-v2 .amount {
  font-size: 1.5rem;
  font-weight: 900;
  color: #0f172a;
}

.status-chip-v2 {
  background: #e2e8f0;
  color: #475569;
}

@media (max-width: 600px) {
  .image-container-premium {
    width: 100%;
    height: 100px;
  }
  .financial-section-v2 {
    border-left: none;
    border-top: 1px solid #f1f5f9;
  }
  .room-name-v2 {
    font-size: 1.1rem;
  }
  .price-display-v2 .amount {
    font-size: 1.25rem;
  }
}

.digital-key-wrapper {
  max-width: 280px;
}

.key-card-elite {
  background: #0f172a;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 14px;
  padding: 12px 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.key-card-elite::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.05));
}

.key-icon-box {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.key-label {
  font-size: 0.55rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 2px;
  margin-bottom: 2px;
}

.key-code {
  font-size: 1.2rem;
  font-weight: 900;
  color: #fbbf24;
  letter-spacing: 4px;
  font-family: 'Outfit', sans-serif;
  line-height: 1;
}

.nfc-icon {
  color: rgba(255, 255, 255, 0.1);
}
</style>

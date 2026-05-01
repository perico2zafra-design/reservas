<template>
  <div class="admin-bookings-page-elite">
    <div class="elite-top-accent"></div>

    <v-container class="pt-6 pb-12 px-4 px-md-10 main-content-limit">
      <!-- Header Section -->
      <v-row no-gutters align="center" class="mb-10">
        <v-col cols="12" md="7" class="d-flex mb-4 mb-md-0">
          <div class="elite-gold-marker me-4 align-self-stretch"></div>
          <div>
            <h1 class="page-title-elite text-slate-900 text-playfair mb-1 mt-0">Control de Fianzas</h1>
            <p class="text-caption text-slate-500 font-weight-bold text-uppercase letter-spacing-lg">Gestión de reembolsos y cargos de Stripe</p>
          </div>
        </v-col>

        <v-spacer class="d-none d-md-block"></v-spacer>

        <v-col cols="12" md="auto">
          <div class="admin-mode-pill">
            <v-icon icon="mdi-shield-check" color="amber" class="me-2" />
            ADMIN MODE
          </div>
        </v-col>
      </v-row>

      <!-- Filtros Rápidos (Estilo Premium) -->
      <div class="tabs-container-premium mb-10 pa-1">
        <v-tabs
          v-model="filterTab"
          color="white"
          grow
          hide-slider
          class="tabs-elite-full"
        >
          <v-tab value="PAID" class="tab-item-elite text-none">
            <v-icon start icon="mdi-wallet-outline" size="18" />
            Pendientes
          </v-tab>
          <v-tab value="REFUNDED" class="tab-item-elite text-none">
            <v-icon start icon="mdi-cash-refund" size="18" />
            Devueltas
          </v-tab>
          <v-tab value="CAPTURED" class="tab-item-elite text-none">
            <v-icon start icon="mdi-cash-check" size="18" />
            Cobradas
          </v-tab>
        </v-tabs>
      </div>

      <!-- Lista de Reservas Admin -->
      <div v-if="filteredBookings.length > 0">
        <v-fade-transition group>
          <BookingCard 
            v-for="booking in filteredBookings" 
            :key="booking.id"
            :booking="booking"
            isAdmin
          >
            <template #actions>
              <div v-if="booking.deposit_status === 'PAID'" class="d-flex flex-column flex-md-row ga-3">
                <v-btn 
                  color="#10b981" 
                  variant="flat"
                  rounded="lg" 
                  height="44"
                  class="btn-elite-action success px-6"
                  @click="manageDeposit(booking.id, 'REFUND')"
                >
                  DEVOLVER FIANZA
                </v-btn>
                <v-btn 
                  color="#ef4444" 
                  variant="tonal"
                  rounded="lg" 
                  height="44"
                  class="btn-elite-action danger px-6"
                  @click="manageDeposit(booking.id, 'CAPTURE')"
                >
                  COBRAR DAÑOS
                </v-btn>
              </div>
            </template>
          </BookingCard>
        </v-fade-transition>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-premium py-16 px-6">
        <v-icon icon="mdi-cash-lock-open" size="64" color="slate-200" class="mb-4" />
        <h2 class="text-h6 font-weight-black text-slate-400">No hay transacciones en este estado</h2>
      </div>
    </v-container>

    <v-snackbar v-model="snackbar" :color="snackColor" rounded="pill" class="elite-snackbar">
      <div class="d-flex align-center">
        <v-icon :icon="snackColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" class="me-3" />
        <span class="font-weight-bold">{{ snackText }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBookingStore } from '@/stores/booking'
import api from '@/services/api'
import BookingCard from '@/components/common/BookingCard.vue'

const bookingStore = useBookingStore()
const filterTab = ref('PAID')
const snackbar = ref(false)
const snackText = ref('')
const snackColor = ref('success')

const filteredBookings = computed(() => {
  return bookingStore.bookings.filter(b => b.deposit_status === filterTab.value)
})

const manageDeposit = async (id: number, action: 'REFUND' | 'CAPTURE') => {
  const confirmMsg = action === 'REFUND' 
    ? '¿Confirmas la devolución de la fianza al vecino?' 
    : '¿Confirmas el cobro de la fianza por daños? Esta acción es irreversible.'
  
  if (confirm(confirmMsg)) {
    try {
      await api.post(`/bookings/${id}/deposit`, { action })
      snackText.value = action === 'REFUND' ? 'Fianza devuelta correctamente' : 'Fianza cobrada por daños'
      snackColor.value = action === 'REFUND' ? 'success' : 'warning'
      snackbar.value = true
      bookingStore.fetchBookings()
    } catch (err) {
      snackText.value = 'Error al gestionar la fianza'
      snackColor.value = 'error'
      snackbar.value = true
    }
  }
}

onMounted(() => {
  bookingStore.fetchBookings()
})
</script>

<style scoped>
.admin-bookings-page-elite {
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-content-limit {
  max-width: 1400px;
}

.elite-top-accent {
  height: 4px;
  background: linear-gradient(to right, #d4af37, #fbbf24);
}

.elite-gold-marker {
  width: 5px;
  background: #d4af37;
  border-radius: 10px;
}

.page-title-elite {
  font-size: 2.75rem;
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -2px;
  color: #0f172a;
}

.admin-mode-pill {
  background: #0f172a;
  color: white;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 1px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* TABS PREMIUM (Shared from users.vue) */
.tabs-container-premium {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.tabs-elite-full :deep(.v-tab) {
  flex: 1;
  height: 52px !important;
  font-size: 0.85rem !important;
  font-weight: 800 !important;
  color: #64748b !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px !important;
}

.tabs-elite-full :deep(.v-tab--selected) {
  background: #0f172a !important;
  color: #fbbf24 !important;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3) !important;
}

.tabs-elite-full :deep(.v-tab__slider) {
  display: none !important;
}

/* ACTION BUTTONS */
.btn-elite-action {
  font-weight: 900 !important;
  letter-spacing: 1px !important;
  font-size: 0.75rem !important;
  transition: all 0.3s ease !important;
}

.btn-elite-action.success:hover {
  background: #059669 !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2) !important;
}

.btn-elite-action.danger:hover {
  background: #dc2626 !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2) !important;
}

.empty-state-premium {
  background: white;
  border: 1px dashed #e2e8f0;
  border-radius: 24px;
  text-align: center;
}

.elite-snackbar :deep(.v-snackbar__content) {
  background: #0f172a !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

@media (max-width: 600px) {
  .page-title-elite {
    font-size: 1.75rem;
  }
}
</style>

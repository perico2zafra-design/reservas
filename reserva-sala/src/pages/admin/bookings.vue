<template>
  <div class="admin-bookings-page-elite">
    <div class="elite-top-accent"></div>

    <v-container class="pt-6 pb-12 px-4 px-md-10 main-content-limit">
      <!-- Header Section -->
      <v-row no-gutters align="center" class="mb-10">
        <v-col cols="12" md="7" class="d-flex mb-4 mb-md-0">
          <div class="elite-gold-marker me-4 align-self-stretch"></div>
          <div>
            <h1 class="page-title-elite text-slate-900 text-playfair mb-1 mt-0">
              Control de Fianzas
            </h1>
            <p
              class="text-caption text-slate-500 font-weight-bold text-uppercase letter-spacing-lg"
            >
              Gestión de reembolsos y cargos de Stripe
            </p>
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
            <v-icon start icon="mdi-wallet-outline" size="18" class="tab-icon" />
            <span class="tab-label">Pendientes</span>
          </v-tab>
          <v-tab value="REFUNDED" class="tab-item-elite text-none">
            <v-icon start icon="mdi-cash-refund" size="18" class="tab-icon" />
            <span class="tab-label">Devueltas</span>
          </v-tab>
          <v-tab value="CAPTURED" class="tab-item-elite text-none">
            <v-icon start icon="mdi-cash-check" size="18" class="tab-icon" />
            <span class="tab-label">Cobradas</span>
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
              <div v-if="booking.deposit_status === 'PAID'" class="d-flex ga-2">
                <v-btn
                  color="#10b981"
                  variant="flat"
                  rounded="lg"
                  height="36"
                  class="btn-elite-compact success px-4"
                  @click="openActionModal(booking, 'REFUND')"
                >
                  DEVOLVER
                </v-btn>
                <v-btn
                  color="#ef4444"
                  variant="tonal"
                  rounded="lg"
                  height="36"
                  class="btn-elite-compact danger px-4"
                  @click="openActionModal(booking, 'CAPTURE')"
                >
                  COBRAR
                </v-btn>
              </div>
            </template>
          </BookingCard>
        </v-fade-transition>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-premium py-16 px-6">
        <v-icon
          icon="mdi-cash-lock-open"
          size="64"
          color="slate-200"
          class="mb-4"
        />
        <h2 class="text-h6 font-weight-black text-slate-400">
          No hay transacciones en este estado
        </h2>
      </div>
    </v-container>

    <!-- MODAL PREMIUM DE CONFIRMACIÓN (REEMBOLSO) -->
    <v-dialog
      v-model="refundDialog"
      max-width="440"
      transition="dialog-bottom-transition"
    >
      <v-card rounded="xl" class="elite-dark-modal overflow-hidden">
        <div class="elite-modal-glow bg-success"></div>
        <div class="pa-8">
          <div class="text-center mb-8">
            <div class="icon-ring-v2 bg-success-op mb-4">
              <v-icon icon="mdi-cash-refund" color="#10b981" size="32" />
            </div>
            <h3 class="modal-title-white-v2">Devolver Fianza</h3>
            <p class="modal-subtitle-silver-v2 mt-2">
              ¿Confirmas la devolución de
              <strong>{{ selectedBooking?.deposit_amount }}€</strong> a
              {{ selectedBooking?.user?.first_name }}?
            </p>
          </div>

          <div class="d-flex flex-column ga-3">
            <v-btn
              color="#10b981"
              height="54"
              rounded="lg"
              block
              class="btn-elite-confirm-v2"
              @click="executeAction('REFUND')"
              :loading="processing"
            >
              CONFIRMAR DEVOLUCIÓN
            </v-btn>
            <v-btn
              variant="text"
              color="grey-lighten-1"
              height="44"
              rounded="lg"
              block
              class="btn-elite-cancel-v2"
              @click="refundDialog = false"
            >
              Volver atrás
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- MODAL PREMIUM DE CONFIRMACIÓN (COBRO POR DAÑOS) -->
    <v-dialog
      v-model="captureDialog"
      max-width="440"
      transition="dialog-bottom-transition"
    >
      <v-card rounded="xl" class="elite-dark-modal overflow-hidden">
        <div class="elite-modal-glow bg-error"></div>
        <div class="pa-8">
          <div class="text-center mb-8">
            <div class="icon-ring-v2 bg-error-op mb-4">
              <v-icon icon="mdi-alert-octagon" color="#ef4444" size="32" />
            </div>
            <h3 class="modal-title-white-v2">Ejecutar Cobro</h3>
            <p class="modal-subtitle-silver-v2 mt-2">
              Esta acción cargará definitivamente
              <strong>{{ selectedBooking?.deposit_amount }}€</strong> por daños.
              No se puede revertir.
            </p>
          </div>

          <div class="d-flex flex-column ga-3">
            <v-btn
              color="#ef4444"
              height="54"
              rounded="lg"
              block
              class="btn-elite-confirm-v2"
              @click="executeAction('CAPTURE')"
              :loading="processing"
            >
              EJECUTAR CARGO
            </v-btn>
            <v-btn
              variant="text"
              color="grey-lighten-1"
              height="44"
              rounded="lg"
              block
              class="btn-elite-cancel-v2"
              @click="captureDialog = false"
            >
              Cancelar
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useBookingStore } from "@/stores/booking";
import api from "@/services/api";
import BookingCard from "@/components/common/BookingCard.vue";
import type { Booking } from "@/types";

import { useAppStore } from "@/stores/app";

const bookingStore = useBookingStore();
const appStore = useAppStore();
const filterTab = ref("PAID");

const refundDialog = ref(false);
const captureDialog = ref(false);
const processing = ref(false);
const selectedBooking = ref<Booking | null>(null);

const filteredBookings = computed(() => {
  return bookingStore.bookings.filter(
    (b) => b.deposit_status === filterTab.value,
  );
});

const openActionModal = (booking: Booking, action: "REFUND" | "CAPTURE") => {
  selectedBooking.value = booking;
  if (action === "REFUND") refundDialog.value = true;
  else captureDialog.value = true;
};

const executeAction = async (action: "REFUND" | "CAPTURE") => {
  if (!selectedBooking.value) return;

  processing.value = true;
  try {
    await api.post(`/bookings/${selectedBooking.value.id}/deposit`, { action });

    // Close modals
    refundDialog.value = false;
    captureDialog.value = false;

    // Refresh list
    bookingStore.fetchBookings();

    // Global Notification
    appStore.showSnackbar(
      action === "REFUND"
        ? "Fianza devuelta correctamente"
        : "Fianza cobrada por daños",
      action === "REFUND" ? "success" : "warning",
    );
  } catch (err) {
    appStore.showSnackbar("Error al gestionar la fianza", "error");
  } finally {
    processing.value = false;
    selectedBooking.value = null;
  }
};

onMounted(() => {
  bookingStore.fetchBookings();
});
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

/* TABS PREMIUM */
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

@media (max-width: 600px) {
  .tabs-elite-full :deep(.v-tab) {
    min-width: 0 !important;
    padding: 0 8px !important;
    font-size: 0.65rem !important;
    letter-spacing: 0.5px !important;
  }
  .tab-icon {
    margin-right: 4px !important;
    font-size: 16px !important;
  }
}

/* MODALS PREMIUM ELITE */
.elite-dark-modal {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.elite-modal-glow {
  height: 2px;
  width: 100%;
}

.icon-ring-v2 {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.bg-success-op {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.bg-error-op {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.modal-title-white-v2 {
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.modal-subtitle-silver-v2 {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.5;
}

.btn-elite-confirm-v2 {
  font-weight: 900 !important;
  letter-spacing: 1.5px !important;
  color: white !important;
  text-transform: uppercase !important;
}

.btn-elite-cancel-v2 {
  font-weight: 800 !important;
  color: rgba(255, 255, 255, 0.4) !important;
  text-transform: none !important;
}

/* COMPACT ACTION BUTTONS */
.btn-elite-compact {
  font-weight: 900 !important;
  letter-spacing: 0.5px !important;
  font-size: 0.65rem !important;
  text-transform: uppercase !important;
}

.btn-elite-compact.success:hover {
  background: #059669 !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
}

.btn-elite-compact.danger:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1) !important;
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
}

@media (max-width: 600px) {
  .page-title-elite {
    font-size: 1.75rem;
  }
}
</style>

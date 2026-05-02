<template>
  <div class="bookings-page-elite">
    <div class="elite-top-accent"></div>

    <v-container class="pt-4 pt-md-6 pb-12 px-4 px-md-10 main-content-limit">
      <!-- Header Section: Minimal & Compact -->
      <v-row no-gutters align="center" class="mb-6">
        <v-col cols="auto" class="d-flex">
          <div class="elite-gold-marker-small me-3 align-self-stretch"></div>
          <h1
            class="page-title-compact-elite text-slate-900 text-playfair mb-0 mt-0 d-flex align-center"
          >
            Mis <span class="text-indigo-darken-4 ms-2">Reservas</span>
          </h1>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="auto">
          <v-btn
            to="/"
            color="indigo-darken-4"
            prepend-icon="mdi-plus"
            size="default"
            rounded="lg"
            class="font-weight-black btn-elite-small"
            height="40"
          >
            NUEVA RESERVA
          </v-btn>
        </v-col>
      </v-row>

      <!-- Filters: 100% Width & 50/50 Split -->
      <v-row class="mb-8">
        <v-col cols="12">
          <div class="tabs-container-full pa-1">
            <v-tabs
              v-model="activeTab"
              color="white"
              grow
              hide-slider
              class="tabs-elite-pro-full"
            >
              <v-tab
                value="upcoming"
                class="tab-half text-none font-weight-black"
              >
                <v-icon start icon="mdi-calendar-check" size="18" />
                PRÓXIMAS ({{ upcomingBookings.length }})
              </v-tab>
              <v-tab value="past" class="tab-half text-none font-weight-black">
                <v-icon start icon="mdi-history" size="18" />
                HISTORIAL
              </v-tab>
            </v-tabs>
          </div>
        </v-col>
      </v-row>

      <!-- Content Area -->
      <v-window v-model="activeTab" class="bg-transparent overflow-visible-elite">
        <v-window-item value="upcoming" class="overflow-visible-elite">
          <div v-if="bookingStore.isLoading" class="d-flex justify-center py-12">
            <v-progress-circular
              indeterminate
              color="#1e1b4b"
              size="48"
              width="3"
            />
          </div>

          <div
            v-else-if="upcomingBookings.length === 0"
            class="empty-state-compact py-12 px-6"
          >
            <v-icon
              icon="mdi-calendar-blank"
              size="48"
              color="indigo-lighten-4"
              class="mb-4"
            />
            <h2 class="text-h6 font-weight-black text-slate-900">
              Sin reservas activas
            </h2>
            <v-btn
              to="/"
              variant="text"
              color="primary"
              class="mt-2 font-weight-black"
              >Explorar Salas</v-btn
            >
          </div>

          <div class="bookings-grid-elite">
            <BookingCard
              v-for="booking in upcomingBookings"
              :key="booking.id"
              :booking="booking"
            >
              <template #actions>
                <v-btn
                  v-if="
                    booking.status === 'CONFIRMED' ||
                    booking.status === 'PENDING'
                  "
                  color="red-darken-4"
                  size="small"
                  rounded="lg"
                  variant="tonal"
                  prepend-icon="mdi-close"
                  class="font-weight-black btn-cancel-compact"
                  @click="openCancelModal(booking)"
                  :disabled="!canCancel(booking)"
                >
                  {{ canCancel(booking) ? 'Cancelar' : 'Plazo Expirado' }}
                </v-btn>
              </template>
            </BookingCard>
          </div>
        </v-window-item>

        <v-window-item value="past">
          <div v-if="pastBookings.length === 0" class="text-center py-12">
            <h3 class="text-subtitle-1 text-slate-400 font-weight-bold">
              Historial vacío
            </h3>
          </div>

          <div class="bookings-grid-elite">
            <BookingCard
              v-for="booking in pastBookings"
              :key="booking.id"
              :booking="booking"
              class="past-booking-compact"
            />
          </div>
        </v-window-item>
      </v-window>
    </v-container>

    <!-- MODAL PREMIUM DE CANCELACIÓN -->
    <CancelBookingModal
      v-model="cancelDialog"
      :room-name="selectedBooking?.room?.name || 'Sala'"
      :date="selectedBooking ? formatDate(selectedBooking.booking_date) : ''"
      :time="selectedBooking ? `${selectedBooking.start_time} - ${selectedBooking.end_time}` : ''"
      :loading="cancelling"
      @confirm="handleConfirmCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useBookingStore } from "@/stores/booking";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";
import api from "@/services/api";
import BookingCard from "@/components/common/BookingCard.vue";
import CancelBookingModal from "@/components/booking/CancelBookingModal.vue";

const bookingStore = useBookingStore();
const authStore = useAuthStore();
const appStore = useAppStore();
const activeTab = ref("upcoming");

// Logic for Premium Cancel Modal
const cancelDialog = ref(false);
const cancelling = ref(false);
const selectedBooking = ref<any>(null);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const userBookings = computed(() => {
  return bookingStore.bookings
    .filter((b) => b.user_id === authStore.user?.id)
    .sort(
      (a, b) =>
        new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime(),
    );
});

const canCancel = (booking: any) => {
  const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`).getTime();
  const now = new Date().getTime();
  const diffInHours = (bookingDateTime - now) / (1000 * 60 * 60);
  return diffInHours >= 24;
};

const upcomingBookings = computed(() => {
  const today = new Date().setHours(0, 0, 0, 0);
  return userBookings.value.filter((b) => {
    const bookingDate = new Date(b.booking_date).getTime();
    return bookingDate >= today && b.status !== "CANCELLED";
  });
});

const pastBookings = computed(() => {
  const today = new Date().setHours(0, 0, 0, 0);
  return userBookings.value.filter((b) => {
    const bookingDate = new Date(b.booking_date).getTime();
    return bookingDate < today || b.status === "CANCELLED";
  });
});

const openCancelModal = (booking: any) => {
  selectedBooking.value = booking;
  cancelDialog.value = true;
};

const handleConfirmCancel = async () => {
  if (!selectedBooking.value) return;
  
  try {
    cancelling.value = true;
    await bookingStore.cancelBooking(selectedBooking.value.id);
    cancelDialog.value = false;
    appStore.showSuccess("Reserva cancelada correctamente");
  } catch (error) {
    appStore.showError("Error al cancelar la reserva");
  } finally {
    cancelling.value = false;
    selectedBooking.value = null;
  }
};

onMounted(async () => {
  try {
    appStore.setLoading(true);
    await bookingStore.fetchBookings();
  } catch (error) {
    appStore.showError("Error al cargar las reservas");
  } finally {
    appStore.setLoading(false);
  }
});
</script>

<style scoped>
.bookings-page-elite {
  min-height: 100vh;
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.03) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(30, 27, 75, 0.02) 0px, transparent 50%);
}

.overflow-visible-elite {
  overflow: visible !important;
}

.bookings-grid-elite {
  padding: 12px 4px; /* Espacio para el hover */
}

.elite-top-accent {
  height: 4px;
  background: linear-gradient(to right, #d97706, #fbbf24);
}

.elite-gold-marker-small {
  width: 5px;
  background: #d97706;
  border-radius: 2px;
}

.page-title-compact-elite {
  font-size: 2.25rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -1px;
}

.btn-elite-small {
  font-size: 0.75rem !important;
  letter-spacing: 0.5px !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

.tabs-container-full {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.tabs-elite-pro-full :deep(.v-tab) {
  flex: 1;
  height: 44px !important;
  font-size: 0.8rem !important;
  color: #64748b !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tabs-elite-pro-full :deep(.v-tab--selected) {
  background: #1e1b4b !important;
  color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(30, 27, 75, 0.3);
}

.empty-state-compact {
  background: white;
  border: 1px dashed #e2e8f0;
  border-radius: 16px;
  text-align: center;
}

.past-booking-compact {
  opacity: 0.6;
}

.main-content-limit {
  max-width: 1000px;
}

.btn-cancel-compact {
  font-size: 0.7rem !important;
  height: 32px !important;
}

@media (max-width: 600px) {
  .page-title-compact-elite {
    font-size: 1.25rem;
  }
}
</style>

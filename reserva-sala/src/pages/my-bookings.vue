<template>
  <div class="bookings-page dashboard-container">
    <div class="panel-mesh-glow"></div>
    
    <v-container class="pt-6 pb-12 px-4 px-md-8 position-relative z-10">
      <!-- Header Section -->
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-10">
        <div>
          <div class="d-flex align-center mb-3">
            <div class="section-accent me-4"></div>
            <h1 class="text-h3 font-weight-black text-slate-900 section-title text-playfair">Mis Reservas</h1>
          </div>
          <p class="text-slate-500 text-h6 font-weight-light ml-4 opacity-80">
            Gestiona tus espacios y consulta tu historial de eventos
          </p>
        </div>
        
        <v-btn
          to="/"
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          rounded="xl"
          class="font-weight-black elevation-12 mt-4 mt-md-0 btn-elite-action"
        >
          Nueva Reserva
        </v-btn>
      </div>

      <!-- Filters & Stats -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card rounded="24" class="glass-tabs-card pa-1 border-0">
            <v-tabs
              v-model="activeTab"
              color="primary"
              align-tabs="start"
              hide-slider
              class="elite-tabs"
            >
              <v-tab value="upcoming" class="rounded-xl px-6 text-none font-weight-bold">
                <v-icon start icon="mdi-calendar-clock" class="me-2" />
                Próximas
                <v-badge
                  v-if="upcomingBookings.length > 0"
                  color="primary"
                  :content="upcomingBookings.length"
                  inline
                  class="ms-2"
                />
              </v-tab>
              <v-tab value="past" class="rounded-xl px-6 text-none font-weight-bold">
                <v-icon start icon="mdi-history" class="me-2" />
                Historial
              </v-tab>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>

      <!-- Content Area -->
      <v-window v-model="activeTab" class="bg-transparent mt-4">
        <!-- Upcoming Tab -->
        <v-window-item value="upcoming">
          <div v-if="upcomingBookings.length === 0" class="empty-state-elite text-center py-12">
            <div class="illustration-container mb-8">
              <v-img
                src="/empty_bookings_illustration.png"
                max-width="400"
                class="mx-auto floating-anim"
                alt="No bookings"
              />
            </div>
            <h2 class="text-h5 font-weight-black text-slate-800 mb-2">No tienes reservas activas</h2>
            <p class="text-slate-500 mb-8 max-width-text mx-auto">
              Parece que aún no has reservado ningún espacio. ¡Anímate a disfrutar de las instalaciones del Residencial Campus!
            </p>
            <v-btn
              to="/"
              variant="outlined"
              color="primary"
              rounded="xl"
              class="font-weight-black px-8"
              size="large"
            >
              Explorar Salas
            </v-btn>
          </div>

          <v-fade-transition group>
            <BookingCard 
              v-for="booking in upcomingBookings" 
              :key="booking.id"
              :booking="booking"
              class="booking-card-elite mb-6"
            >
              <template #actions>
                <v-btn 
                  v-if="booking.status === 'CONFIRMED' || booking.status === 'PENDING'"
                  variant="tonal" 
                  color="error" 
                  size="small" 
                  rounded="xl"
                  prepend-icon="mdi-cancel"
                  class="font-weight-black px-4"
                  @click="cancelBooking(booking.id)"
                >
                  Cancelar
                </v-btn>
              </template>
            </BookingCard>
          </v-fade-transition>
        </v-window-item>

        <!-- Past Tab -->
        <v-window-item value="past">
          <div v-if="pastBookings.length === 0" class="text-center py-16 opacity-60">
            <v-icon icon="mdi-history" size="64" color="slate-300" class="mb-4" />
            <h3 class="text-h6 text-slate-400">No hay reservas anteriores</h3>
          </div>

          <v-fade-transition group>
            <BookingCard 
              v-for="booking in pastBookings" 
              :key="booking.id"
              :booking="booking"
              class="booking-card-elite past-booking opacity-80 mb-6"
            />
          </v-fade-transition>
        </v-window-item>
      </v-window>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { useAuthStore } from '@/stores/auth'
import BookingCard from '@/components/common/BookingCard.vue'

const bookingStore = useBookingStore()
const authStore = useAuthStore()
const activeTab = ref('upcoming')

const userBookings = computed(() => {
  return bookingStore.bookings
    .filter(b => b.user_id === authStore.user?.id)
    .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())
})

const upcomingBookings = computed(() => {
  const today = new Date().setHours(0,0,0,0)
  return userBookings.value.filter(b => {
    const bookingDate = new Date(b.booking_date).getTime()
    return bookingDate >= today && b.status !== 'CANCELLED'
  })
})

const pastBookings = computed(() => {
  const today = new Date().setHours(0,0,0,0)
  return userBookings.value.filter(b => {
    const bookingDate = new Date(b.booking_date).getTime()
    return bookingDate < today || b.status === 'CANCELLED'
  })
})

const cancelBooking = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
    await bookingStore.cancelBooking(id)
  }
}

onMounted(() => {
  bookingStore.fetchBookings()
})
</script>

<style scoped>
.bookings-page {
  position: relative;
  min-height: 100vh;
}

.panel-mesh-glow {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 60%;
  height: 50%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.08) 0%,
    transparent 70%
  );
  filter: blur(100px);
  z-index: 0;
}

.section-accent {
  width: 4px;
  height: 32px;
  background: linear-gradient(to bottom, #6366f1, #4338ca);
  border-radius: 4px;
}

.section-title {
  letter-spacing: -1px;
}

.glass-tabs-card {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
}

.elite-tabs :deep(.v-tab) {
  transition: all 0.3s ease;
  color: #64748b !important;
}

.elite-tabs :deep(.v-tab--selected) {
  background: #6366f1 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.empty-state-elite {
  max-width: 600px;
  margin: 0 auto;
}

.max-width-text {
  max-width: 400px;
}

.illustration-container {
  perspective: 1000px;
}

.floating-anim {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.btn-elite-action {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-elite-action:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4) !important;
}

.booking-card-elite {
  transition: all 0.3s ease;
}

.past-booking {
  filter: grayscale(0.5);
}

.dashboard-container {
  background: #f8fafc;
}

@media (max-width: 600px) {
  .section-title {
    font-size: 1.75rem !important;
  }
}
</style>


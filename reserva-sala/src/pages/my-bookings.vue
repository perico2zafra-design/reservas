<template>
  <v-container class="py-10">
    <div class="d-flex align-center mb-10 px-4">
      <div>
        <h1 class="text-h4 font-weight-black text-slate-900">Mis Reservas</h1>
        <p class="text-slate-500">Historial y próximas reservas del salón</p>
      </div>
      <v-spacer />
      <v-btn
        to="/"
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        rounded="xl"
        class="font-weight-black elevation-8"
      >
        Nueva Reserva
      </v-btn>
    </div>

    <!-- Empty State -->
    <div v-if="userBookings.length === 0" class="text-center py-16">
      <v-avatar color="slate-100" size="120" class="mb-6">
        <v-icon icon="mdi-calendar-blank-outline" color="slate-300" size="64" />
      </v-avatar>
      <h2 class="text-h5 font-weight-black text-slate-400">No tienes reservas activas</h2>
      <p class="text-slate-400 mb-8">¡Anímate a reservar el salón social para tu próximo evento!</p>
    </div>

    <!-- Lista de Reservas -->
    <v-fade-transition group>
      <BookingCard 
        v-for="booking in userBookings" 
        :key="booking.id"
        :booking="booking"
      >
        <template #actions>
          <v-btn 
            v-if="booking.status === 'CONFIRMED'"
            variant="text" 
            color="error" 
            size="small" 
            rounded="xl"
            prepend-icon="mdi-cancel"
            class="font-weight-black"
            @click="cancelBooking(booking.id)"
          >
            Cancelar
          </v-btn>
        </template>
      </BookingCard>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { useAuthStore } from '@/stores/auth'
import BookingCard from '@/components/common/BookingCard.vue'

const bookingStore = useBookingStore()
const authStore = useAuthStore()

const userBookings = computed(() => {
  return bookingStore.bookings.filter(b => b.user_id === authStore.user?.id)
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

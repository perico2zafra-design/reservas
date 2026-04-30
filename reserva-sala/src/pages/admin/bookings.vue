<template>
  <v-container class="py-10">
    <div class="d-flex align-center mb-10 px-4">
      <div>
        <h1 class="text-h4 font-weight-black text-slate-900">Control de Fianzas</h1>
        <p class="text-slate-500">Gestión de reembolsos y cargos de Stripe</p>
      </div>
      <v-spacer />
      <v-chip color="slate-900" class="text-white font-weight-black" size="large">
        <v-icon icon="mdi-shield-check" class="me-2" />
        ADMIN MODE
      </v-chip>
    </div>

    <!-- Filtros Rápidos -->
    <v-tabs v-model="filterTab" class="mb-8" color="primary">
      <v-tab value="PAID">Pendientes de Devolver</v-tab>
      <v-tab value="REFUNDED">Devueltas</v-tab>
      <v-tab value="CAPTURED">Ejecutadas (Cobro)</v-tab>
    </v-tabs>

    <!-- Lista de Reservas Admin -->
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
              color="success" 
              variant="flat"
              rounded="xl" 
              size="small"
              class="font-weight-black"
              @click="manageDeposit(booking.id, 'REFUND')"
            >
              Devolver Fianza
            </v-btn>
            <v-btn 
              color="error" 
              variant="tonal"
              rounded="xl" 
              size="small"
              class="font-weight-black"
              @click="manageDeposit(booking.id, 'CAPTURE')"
            >
              Cobrar Daños
            </v-btn>
          </div>
        </template>
      </BookingCard>
    </v-fade-transition>

    <v-snackbar v-model="snackbar" :color="snackColor" rounded="pill">
      {{ snackText }}
    </v-snackbar>
  </v-container>
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

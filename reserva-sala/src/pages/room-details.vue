<template>
  <div class="room-details-pro">
    <div class="d-flex align-center mb-8">
      <v-btn
        variant="tonal"
        icon="mdi-arrow-left"
        class="me-4 elevation-1"
        color="primary"
        @click="$router.back()"
      />
      <div>
        <h1 class="text-h4 font-weight-black text-gradient">Detalle de Sala</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Selecciona tu horario y confirma tu reserva.</p>
      </div>
    </div>

    <v-row v-if="currentRoom">
      <!-- Left Column: Booking & History -->
      <v-col cols="12" lg="8">
        <!-- Main Booking Timeline Card -->
        <v-card rounded="xl" class="glass-card pa-8 mb-8 border-0 elevation-4">
          <div class="d-flex align-center mb-8">
            <h2 class="text-h5 font-weight-black">Panel de Disponibilidad</h2>
            <v-spacer />
            <v-chip color="primary" variant="tonal" prepend-icon="mdi-calendar">
              {{ new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) }}
            </v-chip>
          </div>

          <BookingTimeline 
            :booked-slots="formattedBookings"
            :opening-time="currentRoom.openTime || '08:00'"
            :closing-time="currentRoom.closeTime || '20:00'"
            v-model:selection="selectedRange"
          />

          <div class="mt-10 d-flex justify-center">
            <v-btn
              color="primary"
              size="x-large"
              rounded="xl"
              class="text-none font-weight-black px-12 premium-gradient-btn"
              :disabled="!selectedRange.start || !selectedRange.end"
              :loading="saving"
              @click="confirmBooking"
            >
              Confirmar Reserva
            </v-btn>
          </div>
        </v-card>

        <!-- Booking History List -->
        <v-card rounded="xl" class="glass-card pa-8 border-0 elevation-2">
          <h2 class="text-h5 font-weight-black mb-6">Actividad de la Sala</h2>
          <v-list class="bg-transparent pa-0">
            <v-list-item
              v-for="booking in roomBookings"
              :key="booking.id"
              class="px-0 mb-4 border-b pb-4"
            >
              <template v-slot:prepend>
                <v-avatar color="primary-lighten-4" class="me-4">
                  <span class="text-primary font-weight-bold">{{ booking.userId?.charAt(0) || 'U' }}</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">{{ booking.userId }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-chip size="x-small" color="success" class="font-weight-black">CONFIRMADA</v-chip>
              </template>
            </v-list-item>
            <div v-if="roomBookings.length === 0" class="text-center pa-8 text-medium-emphasis">
              No hay reservas para hoy. ¡Sé el primero!
            </div>
          </v-list>
        </v-card>
      </v-col>

      <!-- Right Column: Room Info & Amenities -->
      <v-col cols="12" lg="4">
        <v-card rounded="xl" class="premium-info-card overflow-hidden border-0 elevation-4 sticky-top">
          <v-img :src="currentRoom.image" height="250" cover />
          <div class="pa-8">
            <h2 class="text-h4 font-weight-black mb-2">{{ currentRoom.name }}</h2>
            <div class="d-flex align-center mb-6 text-primary font-weight-bold">
              <v-icon icon="mdi-account-group" class="me-2" />
              <span>Hasta {{ currentRoom.capacity }} personas</span>
            </div>
            
            <p class="text-body-1 text-medium-emphasis mb-8 line-height-1-6">
              {{ currentRoom.description || 'Este espacio está diseñado para fomentar la productividad y la colaboración creativa.' }}
            </p>

            <v-divider class="mb-8" />
            
            <h3 class="text-overline font-weight-black mb-4">Equipamiento Incluido</h3>
            <RoomAmenities :amenities="currentRoom.amenities || ['wifi', 'ac', 'coffee']" class="mb-8" />
            
            <v-card color="primary-lighten-5" flat rounded="xl" class="pa-4 border-dashed">
              <div class="d-flex align-center text-primary">
                <v-icon icon="mdi-shield-check" class="me-3" />
                <div class="text-caption font-weight-bold">Acceso mediante código QR generado tras la reserva.</div>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import BookingTimeline from '@/components/booking/BookingTimeline.vue'
import RoomAmenities from '@/components/common/RoomAmenities.vue'

const route = useRoute()
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const roomId = route.params.id as string

const saving = ref(false)
const selectedRange = ref({ start: null, end: null })

const roomBookings = computed(() => 
  bookingStore.bookings.filter(b => b.roomId === parseInt(roomId))
)

const currentRoom = computed(() => 
  bookingStore.rooms.find(r => r.id === parseInt(roomId))
)

const formattedBookings = computed(() => {
  return roomBookings.value.map(b => ({
    start: b.startTime.split('T')[1].substring(0, 5),
    end: b.endTime.split('T')[1].substring(0, 5)
  }))
})

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const confirmBooking = async () => {
  if (!selectedRange.value.start || !selectedRange.value.end) return
  
  saving.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    await bookingStore.createBooking({
      roomId: parseInt(roomId),
      userId: authStore.user?.email || 'anon',
      startTime: `${today}T${selectedRange.value.start}:00Z`,
      endTime: `${today}T${selectedRange.value.end}:00Z`
    })
    selectedRange.value = { start: null, end: null }
    await bookingStore.fetchBookings()
  } catch (err) {
    console.error('Error creating booking:', err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  bookingStore.fetchBookings()
  bookingStore.fetchRooms()
})
</script>

<style scoped>
.room-details-pro {
  margin-top: -20px;
}
.line-height-1-6 {
  line-height: 1.6;
}
.border-dashed {
  border: 1px dashed rgba(var(--v-theme-primary), 0.3) !important;
}
.sticky-top {
  position: sticky;
  top: 100px;
}
.premium-info-card {
  background: white !important;
}
</style>

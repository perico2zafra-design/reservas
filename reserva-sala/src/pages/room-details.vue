<template>
  <div>
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4 text-none"
      @click="$router.back()"
    >
      Volver a Salas
    </v-btn>

    <v-row>
      <v-col cols="12" lg="8">
        <!-- Calendar Section -->
        <v-card rounded="xl" class="elevation-1 border-0 pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <h2 class="text-h5 font-weight-bold">Disponibilidad</h2>
            <v-spacer />
            <v-btn-toggle v-model="viewMode" mandatory rounded="lg" color="primary" density="comfortable">
              <v-btn value="list" icon="mdi-view-list" />
              <v-btn value="calendar" icon="mdi-calendar" />
            </v-btn-toggle>
          </div>

          <!-- Mock Calendar View -->
          <div v-if="viewMode === 'calendar'" class="calendar-placeholder rounded-lg bg-grey-lighten-4 d-flex align-center justify-center">
            <div class="text-center">
              <v-icon icon="mdi-calendar-clock" size="64" color="grey-lighten-1" class="mb-2" />
              <p class="text-medium-emphasis">Vista de Calendario Interactivo</p>
              <v-date-picker color="primary" />
            </div>
          </div>

          <!-- List View -->
          <v-list v-else>
            <div v-for="day in ['Hoy', 'Mañana', '25 Abr']" :key="day">
              <div class="text-overline mb-2">{{ day }}</div>
              <v-list-item
                v-for="time in ['09:00 - 10:00', '11:00 - 12:00', '15:00 - 16:00']"
                :key="time"
                class="border rounded-lg mb-2"
                :class="{'bg-success-lighten-5 border-success': !isBooked(day, time)}"
              >
                <template v-slot:title>{{ time }}</template>
                <template v-slot:append>
                  <v-btn
                    v-if="!isBooked(day, time)"
                    color="success"
                    size="small"
                    rounded="pill"
                    class="text-none"
                    @click="bookNow(day, time)"
                  >
                    Reservar
                  </v-btn>
                  <v-chip v-else color="error" size="small">Ocupado</v-chip>
                </template>
              </v-list-item>
            </div>
          </v-list>
        </v-card>

        <!-- Booking History -->
        <v-card rounded="xl" class="elevation-1 border-0 pa-6">
          <h2 class="text-h5 font-weight-bold mb-6">Historial de Reservas</h2>
          <v-table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in roomBookings" :key="booking.id">
                <td>
                  <div class="d-flex align-center">
                    <v-avatar color="primary" size="24" class="me-2 text-caption">
                      {{ booking.userName.charAt(0) }}
                    </v-avatar>
                    {{ booking.userName }}
                  </div>
                </td>
                <td>{{ new Date(booking.startTime).toLocaleDateString() }}</td>
                <td>
                  {{ new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} - 
                  {{ new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </td>
                <td>
                  <v-chip size="x-small" color="success">
                    CONFIRMADA
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <!-- Room Info -->
        <v-card v-if="currentRoom" rounded="xl" color="primary" class="elevation-4 pa-6 text-white">
          <h2 class="text-h5 font-weight-bold mb-4">{{ currentRoom.name }}</h2>
          <p class="text-body-2 mb-4">{{ currentRoom.description || 'Sin descripción disponible.' }}</p>
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-account-group" class="me-2" />
            <span>Capacidad: {{ currentRoom.capacity }} personas</span>
          </div>
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-clock-outline" class="me-2" />
            <span>Horario: {{ currentRoom.openTime }} - {{ currentRoom.closeTime }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon icon="mdi-wifi" class="me-2" />
            <span>WiFi de Alta Velocidad</span>
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
import { mockUsers } from '@/services/mockData'
import type { Booking } from '@/types/api'

const route = useRoute()
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const roomId = parseInt(route.params.id as string)

const viewMode = ref('list')
const loading = computed(() => bookingStore.isLoading)
const roomBookings = computed(() => 
  bookingStore.bookings.filter(b => b.roomId === roomId)
)

const fetchBookings = async () => {
  await bookingStore.fetchBookings()
  if (bookingStore.rooms.length === 0) {
    await bookingStore.fetchRooms()
  }
}

const currentRoom = computed(() => 
  bookingStore.rooms.find(r => r.id === roomId)
)

const isBooked = (day: string, time: string) => {
  // Simple check for demo purposes
  return roomBookings.value.some(b => {
    const bTime = `${b.startTime.split('T')[1].substring(0, 5)} - ${b.endTime.split('T')[1].substring(0, 5)}`
    return bTime === time
  })
}

const bookNow = async (day: string, time: string) => {
  const [start, end] = time.split(' - ')
  
  // Create a proper ISO date for today/tomorrow/etc.
  const date = new Date()
  if (day === 'Mañana') date.setDate(date.getDate() + 1)
  
  const dateStr = date.toISOString().split('T')[0]
  
  await bookingStore.createBooking({
    roomId,
    userName: authStore.user?.name || 'Invitado',
    startTime: `${dateStr}T${start}:00Z`,
    endTime: `${dateStr}T${end}:00Z`
  })
}

onMounted(fetchBookings)
</script>

<style scoped>
.calendar-placeholder {
  min-height: 400px;
}
.bg-success-lighten-5 {
  background-color: #f0fff4;
}
</style>

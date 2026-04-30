<template>
  <div class="community-app">
    <!-- Overlay de Pendiente de Aprobación (Estilo App Nativa) -->
    <v-overlay v-model="isPending" persistent class="align-center justify-center text-center px-6" scrim="#0f172a" opacity="0.98">
      <div class="pa-8">
        <v-avatar size="120" color="primary" class="mb-8 elevation-xl shadow-blue">
          <v-icon icon="mdi-shield-lock" size="60" color="white" />
        </v-avatar>
        <h2 class="text-h4 font-weight-black text-white mb-2">Verificando...</h2>
        <p class="text-body-1 text-slate-400 mb-10">
          Hola {{ authStore.user?.name.split(' ')[0] }}, estamos confirmando tu vivienda en el Residencial Campus.
        </p>
        <v-btn block color="white" rounded="xl" size="x-large" class="text-primary font-weight-black" @click="authStore.logout(); $router.push('/login')">
          Cerrar Sesión
        </v-btn>
      </div>
    </v-overlay>

    <!-- App Header (Hero) -->
    <div class="app-hero pt-8 pb-12 px-6">
      <div class="d-flex align-center mb-6">
        <div>
          <div class="text-overline text-blue-200 font-weight-black mb-1">MI URBANIZACIÓN</div>
          <h1 class="text-h4 font-weight-black text-white">Residencial Campus</h1>
        </div>
        <v-spacer />
        <v-avatar size="48" class="elevation-4 border-2 border-blue-400">
          <v-img :src="'https://i.pravatar.cc/150?u=' + authStore.user?.id" />
        </v-avatar>
      </div>

      <!-- Quick Info Cards (Horizontal Scroll on Mobile) -->
      <div class="d-flex ga-4 overflow-x-auto no-scrollbar pb-2">
        <v-card rounded="xl" class="glass-card-light pa-4 min-width-160 flex-shrink-0" elevation="0">
          <div class="text-caption text-blue-100 opacity-70">Tu Vivienda</div>
          <div class="text-h6 font-weight-black text-white">P:{{ authStore.user?.portal }} · {{ authStore.user?.letter }}</div>
        </v-card>
        <v-card rounded="xl" class="glass-card-light pa-4 min-width-160 flex-shrink-0" elevation="0">
          <div class="text-caption text-blue-100 opacity-70">Estado</div>
          <div class="d-flex align-center">
            <v-icon icon="mdi-check-decagram" color="green-accent-2" size="18" class="me-1" />
            <span class="text-subtitle-1 font-weight-black text-white">Verificado</span>
          </div>
        </v-card>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="app-content px-6 pb-12">
      <!-- Próxima Reserva Card -->
      <section class="mb-10 mt-n6">
        <h2 class="text-subtitle-2 font-weight-black text-slate-500 mb-4 px-1">TU PRÓXIMA CITA</h2>
        <v-card v-if="nextBooking" rounded="xl" class="premium-card pa-6 border-0 elevation-xl" @click="$router.push('/my-bookings')">
          <div class="d-flex align-center">
            <v-avatar size="56" rounded="lg" class="me-4 elevation-2">
              <v-img :src="getRoom(nextBooking.room_id)?.image" cover />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-black text-slate-900">{{ getRoom(nextBooking.room_id)?.name }}</div>
              <div class="text-body-2 text-primary font-weight-bold">
                {{ formatBookingDate(nextBooking.booking_date) }} · {{ nextBooking.start_time.substring(0,5) }}
              </div>
            </div>
            <v-spacer />
            <v-icon icon="mdi-chevron-right" color="slate-300" />
          </div>
        </v-card>
        <v-card v-else rounded="xl" class="border-2 border-dashed border-slate-200 pa-8 text-center bg-transparent" elevation="0">
          <div class="text-slate-400 font-weight-bold mb-1">Sin reservas activas</div>
          <div class="text-caption text-slate-400">Reserva una sala para empezar</div>
        </v-card>
      </section>

      <!-- Instalaciones Grid -->
      <section>
        <div class="d-flex align-center mb-4 px-1">
          <h2 class="text-subtitle-2 font-weight-black text-slate-500">INSTALACIONES</h2>
          <v-spacer />
          <v-btn variant="text" color="primary" size="small" class="font-weight-black">Ver Todo</v-btn>
        </div>
        
        <v-row>
          <v-col v-for="room in rooms" :key="room.id" cols="12" sm="6">
            <v-card rounded="24" class="room-app-card elevation-xl overflow-hidden border-0" @click="$router.push('/room/' + room.id)">
              <v-img :src="room.image" height="240" cover class="align-end">
                <div class="pa-6 room-card-gradient text-white">
                  <div class="d-flex align-center mb-1">
                    <h3 class="text-h5 font-weight-black">{{ room.name }}</h3>
                    <v-spacer />
                    <v-chip size="x-small" color="white" variant="flat" class="text-primary font-weight-black">
                      {{ room.deposit_amount }}€
                    </v-chip>
                  </div>
                  <div class="text-caption opacity-80 d-flex align-center">
                    <v-icon icon="mdi-account-group" size="14" class="me-1" />
                    Aforo máx: {{ room.capacity }}
                  </div>
                </div>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Comunicados App Style -->
      <section class="mt-10">
        <h2 class="text-subtitle-2 font-weight-black text-slate-500 mb-4 px-1">AVISOS COMUNITARIOS</h2>
        <v-card rounded="xl" class="bg-indigo-lighten-5 border-0 elevation-0 pa-5">
          <div class="d-flex align-start">
            <v-avatar color="indigo-lighten-4" size="36" class="me-4 mt-1">
              <v-icon icon="mdi-bullhorn" color="indigo" size="20" />
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-black text-indigo-darken-4 mb-1">Recordatorio de Limpieza</div>
              <p class="text-caption text-indigo-darken-2 opacity-80 leading-tight">
                Recuerda que para la devolución íntegra de la fianza, el Salón Social debe quedar en el mismo estado de limpieza que se encontró.
              </p>
            </div>
          </div>
        </v-card>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'

const authStore = useAuthStore()
const bookingStore = useBookingStore()

const rooms = computed(() => bookingStore.rooms)
const isPending = computed(() => authStore.user?.status === 'PENDING')

const nextBooking = computed(() => {
  const future = bookingStore.bookings
    .filter(b => b.user_id === authStore.user?.id && new Date(b.booking_date) >= new Date())
    .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
  return future[0] || null
})

const getRoom = (id: number) => rooms.value.find(r => r.id === id)

const formatBookingDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

onMounted(async () => {
  await Promise.all([
    bookingStore.fetchRooms(),
    bookingStore.fetchBookings()
  ])
})
</script>

<script lang="ts">
export default {
  name: 'CommunityHome'
}
</script>

<style scoped>
.app-hero {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 0 0 40px 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.glass-card-light {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.room-app-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.room-app-card:active {
  transform: scale(0.96);
}

.room-card-gradient {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  width: 100%;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.min-width-160 {
  min-width: 160px;
}

.shadow-blue {
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.4) !important;
}

.border-2 {
  border-width: 2px !important;
  border-style: solid !important;
}

.border-blue-400 { border-color: #60a5fa !important; }
.border-slate-200 { border-color: #e2e8f0 !important; }

.leading-tight { line-height: 1.25 !important; }

.v-avatar.border-2 {
  padding: 2px;
}
</style>

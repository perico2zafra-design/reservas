<template>
  <div class="community-dashboard">
    <!-- Overlay de Pendiente de Aprobación -->
    <v-overlay
      v-model="isPending"
      persistent
      class="align-center justify-center text-center px-4"
      scrim="#1a237e"
      opacity="0.95"
    >
      <v-card rounded="xl" class="pa-10 elevation-0 bg-transparent text-white" max-width="500">
        <v-icon icon="mdi-account-clock-outline" size="100" class="mb-6 animate-pulse" color="primary-light" />
        <h2 class="text-h3 font-weight-black mb-4">Acceso Pendiente</h2>
        <p class="text-h6 opacity-80 mb-10">
          Hola <strong>{{ authStore.user?.name }}</strong>. Tu solicitud de acceso al Residencial Campus está siendo revisada por el administrador.
        </p>
        <v-divider class="mb-8 opacity-20" />
        <p class="text-body-1 italic opacity-60 mb-8">
          Podrás realizar reservas una vez validada tu vivienda.
        </p>
        <v-btn
          variant="tonal"
          color="white"
          rounded="xl"
          prepend-icon="mdi-logout"
          @click="authStore.logout(); $router.push('/login')"
        >
          Cerrar Sesión
        </v-btn>
      </v-card>
    </v-overlay>

    <!-- Header / Hero Section -->
    <div class="dashboard-header mb-12">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center mb-4">
              <v-chip color="primary-light" variant="flat" size="small" class="font-weight-black me-3">
                COMUNIDAD ACTIVA
              </v-chip>
              <span class="text-white opacity-70 text-body-2 font-weight-bold">Badajoz, Extremadura</span>
            </div>
            <h1 class="text-h2 font-weight-black mb-4 text-white">
              Bienvenido al <br><span class="text-primary-light">Residencial Campus</span>
            </h1>
            <p class="text-h6 text-white opacity-80 mb-8 font-weight-medium">
              Plaza Pepe Reyes 7-14. Gestiona tus reservas y disfruta de las instalaciones comunes.
            </p>
          </v-col>
          
          <v-col cols="12" md="4" class="d-none d-md-block">
            <v-card class="glass-dark pa-6 text-white" rounded="xl">
              <div class="d-flex align-center mb-4">
                <v-avatar color="primary-light" size="48" class="me-4 shadow-lg">
                  <v-icon icon="mdi-account" color="primary" />
                </v-avatar>
                <div>
                  <div class="text-caption opacity-70">Tu Vivienda</div>
                  <div class="text-subtitle-1 font-weight-bold">Portal {{ authStore.user?.portal || '7' }}, {{ authStore.user?.letter || 'B' }}</div>
                </div>
              </div>
              <v-divider class="mb-4 opacity-20" />
              <div class="d-flex justify-space-between align-center">
                <span class="text-caption opacity-70">Estado:</span>
                <v-chip size="x-small" color="success" variant="flat" class="font-weight-black">VERIFICADO</v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container>
      <v-row>
        <!-- Left Column: Reservations & News -->
        <v-col cols="12" md="8">
          <section class="mb-12">
            <div class="d-flex align-center mb-6">
              <v-icon icon="mdi-calendar-clock" color="primary" class="me-3" />
              <h2 class="text-h4 font-weight-black text-gradient">Tus Próximas Reservas</h2>
            </div>
            
            <v-row v-if="myBookings.length > 0">
              <v-col v-for="booking in myBookings" :key="booking.id" cols="12">
                <v-card rounded="xl" class="pa-6 border-0 elevation-2 booking-card">
                  <div class="d-flex align-center">
                    <v-avatar size="60" rounded="lg" class="me-4">
                      <v-img :src="getRoom(booking.room_id)?.image" cover />
                    </v-avatar>
                    <div>
                      <div class="text-h6 font-weight-bold">{{ getRoom(booking.room_id)?.name }}</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ new Date(booking.booking_date).toLocaleDateString() }} | {{ booking.start_time.substring(0,5) }} - {{ booking.end_time.substring(0,5) }}
                      </div>
                    </div>
                    <v-spacer />
                    <v-chip :color="getStatusColor(booking.deposit_status)" variant="tonal" size="small" class="font-weight-black">
                      FIANZA: {{ booking.deposit_status }}
                    </v-chip>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            
            <v-card v-else variant="flat" color="grey-lighten-4" rounded="xl" class="pa-10 text-center">
              <v-icon icon="mdi-calendar-blank" size="64" color="grey-lighten-1" class="mb-4" />
              <div class="text-h6 font-weight-bold text-medium-emphasis">No tienes reservas activas</div>
              <p class="text-body-2 text-medium-emphasis">Elige una sala a la derecha para empezar.</p>
            </v-card>
          </section>

          <section>
            <div class="d-flex align-center mb-6">
              <v-icon icon="mdi-bullhorn-outline" color="primary" class="me-3" />
              <h2 class="text-h4 font-weight-black text-gradient">Comunicados</h2>
            </div>
            <v-card rounded="xl" class="pa-6 bg-blue-lighten-5 border-0 elevation-0">
              <div class="d-flex align-start">
                <v-icon icon="mdi-information-outline" color="blue" class="me-4 mt-1" />
                <div>
                  <div class="text-subtitle-1 font-weight-bold mb-1">Nueva Normativa de Uso (Abril 2026)</div>
                  <p class="text-body-2 opacity-80">
                    Se recuerda a todos los vecinos que el aforo máximo del Salón Social es de 50 personas y el horario límite son las 23:59. Es obligatorio dejar el espacio limpio para evitar la retención de la fianza.
                  </p>
                </div>
              </div>
            </v-card>
          </section>
        </v-col>

        <!-- Right Column: Room Selector -->
        <v-col cols="12" md="4">
          <div class="sticky-top">
            <div class="d-flex align-center mb-6">
              <v-icon icon="mdi-office-building-cog" color="primary" class="me-3" />
              <h2 class="text-h5 font-weight-black">Instalaciones</h2>
            </div>
            
            <v-card 
              v-for="room in rooms" 
              :key="room.id"
              rounded="xl" 
              class="mb-6 overflow-hidden elevation-3 room-selector-card"
              @click="$router.push('/room/' + room.id)"
            >
              <v-img :src="room.image" height="150" cover class="align-end">
                <div class="pa-4 glass-dark text-white">
                  <div class="text-subtitle-1 font-weight-black">{{ room.name }}</div>
                  <div class="text-caption opacity-80 d-flex align-center">
                    <v-icon icon="mdi-account-group" size="14" class="me-1" />
                    Aforo: {{ room.capacity }}
                    <v-spacer />
                    <span class="font-weight-black">Fianza: {{ room.deposit_amount }}€</span>
                  </div>
                </div>
              </v-img>
            </v-card>

            <v-card color="primary" rounded="xl" class="pa-6 text-white mt-8 shadow-lg elevation-4">
              <h3 class="text-h6 font-weight-black mb-2">¿Necesitas ayuda?</h3>
              <p class="text-caption opacity-80 mb-4">
                Si tienes problemas con una reserva o daños en las instalaciones, contacta con administración.
              </p>
              <v-btn block color="white" variant="flat" rounded="xl" class="text-primary font-weight-black">
                Contactar Admin
              </v-btn>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'

const authStore = useAuthStore()
const bookingStore = useBookingStore()

const loading = computed(() => bookingStore.isLoading)
const rooms = computed(() => bookingStore.rooms)
const myBookings = computed(() => 
  bookingStore.bookings.filter(b => b.user_id === authStore.user?.id)
)

const isPending = computed(() => authStore.user?.status === 'PENDING')

const fetchDashboardData = async () => {
  await Promise.all([
    bookingStore.fetchRooms(),
    bookingStore.fetchBookings()
  ])
}

const getRoom = (roomId: number) => rooms.value.find(r => r.id === roomId)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID': return 'success'
    case 'REFUNDED': return 'blue'
    case 'CAPTURED': return 'error'
    default: return 'amber'
  }
}

onMounted(fetchDashboardData)
</script>

<style scoped>
.community-dashboard {
  margin-top: -40px;
}

.dashboard-header {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  padding: 100px 0 80px 0;
  border-radius: 0 0 60px 60px;
  position: relative;
  overflow: hidden;
}

.dashboard-header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
  opacity: 0.1;
}

.glass-dark {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.text-primary-light {
  color: #4fc3f7;
}

.text-gradient {
  background: linear-gradient(45deg, #1a237e, #0d47a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.booking-card {
  transition: transform 0.3s ease;
}

.booking-card:hover {
  transform: translateX(10px);
}

.room-selector-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.room-selector-card:hover {
  transform: scale(1.03);
}

.sticky-top {
  position: sticky;
  top: 100px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

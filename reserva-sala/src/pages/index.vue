<template>
  <div class="community-pro-app">
    <!-- Hero Section: Floating Mesh Card -->
    <v-container class="pt-10 pb-16">
      <v-card rounded="32" class="hero-mesh-card pa-8 pa-md-12 elevation-24 border-0 overflow-hidden position-relative">
        <!-- Abstract Glows -->
        <div class="glow-1"></div>
        <div class="glow-2"></div>
        
        <v-row align="center" class="position-relative z-10">
          <v-col cols="12" md="8">
            <div class="d-flex align-center mb-6">
              <div class="logo-icon-box me-4">
                <v-icon icon="mdi-office-building" color="white" />
              </div>
              <span class="text-overline font-weight-black text-white opacity-60 letter-spacing-widest">RESIDENCIAL CAMPUS</span>
            </div>
            <h1 class="text-h2 font-weight-black text-white mb-6 leading-tight">
              Tu comunidad, <br>
              <span class="text-gradient-light">más conectada.</span>
            </h1>
            <p class="text-h6 text-white opacity-70 mb-10 max-width-500 font-weight-medium">
              Gestiona tus espacios comunes de forma inteligente y disfruta de una convivencia premium.
            </p>
            
            <div class="d-flex ga-4 flex-wrap">
              <v-card rounded="20" class="glass-info pa-4 min-width-160" elevation="0">
                <div class="text-caption text-white opacity-50 mb-1">VIVIENDA</div>
                <div class="text-subtitle-1 font-weight-black text-white">Portal {{ authStore.user?.portal || '7' }} · {{ authStore.user?.letter || 'B' }}</div>
              </v-card>
              <v-card rounded="20" class="glass-info pa-4 min-width-160" elevation="0">
                <div class="text-caption text-white opacity-50 mb-1">ESTADO</div>
                <div class="d-flex align-center">
                  <v-icon icon="mdi-shield-check" color="green-accent-2" size="18" class="me-2" />
                  <span class="text-subtitle-1 font-weight-black text-white">Validado</span>
                </div>
              </v-card>
            </div>
          </v-col>
          
          <v-col cols="12" md="4" class="text-center d-none d-md-block">
            <div class="hero-avatar-main">
              <v-avatar v-if="authStore.user?.avatar_url" size="180" class="elevation-24 border-4 border-white">
                <v-img :src="authStore.user.avatar_url" cover />
              </v-avatar>
              <v-avatar v-else size="180" class="elevation-24 premium-avatar-large border-4 border-white">
                <span class="text-h2 font-weight-black">{{ userInitials }}</span>
              </v-avatar>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- Main Actions / Content -->
      <div class="mt-16">
        <div class="d-flex align-center mb-8 px-2">
          <h2 class="text-h4 font-weight-black text-slate-900">Instalaciones Disponibles</h2>
          <v-spacer />
          <v-btn variant="text" color="primary" class="font-weight-black">Ver todas</v-btn>
        </div>

        <v-row>
          <v-col v-for="room in rooms" :key="room.id" cols="12" sm="6" lg="4">
            <v-card 
              rounded="32" 
              class="room-card-premium elevation-12 border-0 overflow-hidden" 
              @click="$router.push('/room/' + room.id)"
            >
              <v-img :src="room.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'" height="280" cover class="align-end bg-slate-200">
                <div class="pa-6 room-overlay">
                  <v-chip color="white" variant="flat" size="x-small" class="mb-2 font-weight-black text-primary">
                    {{ room.deposit_amount }}€ FIANZA
                  </v-chip>
                  <h3 class="text-h5 font-weight-black text-white mb-1">{{ room.name }}</h3>
                  <div class="text-caption text-white opacity-80 d-flex align-center">
                    <v-icon icon="mdi-account-group" size="14" class="me-2" />
                    Aforo: {{ room.capacity }} personas
                  </div>
                </div>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Community Feed / Alerts -->
      <section class="mt-16">
        <v-card rounded="32" class="pa-8 bg-white elevation-4 border-0">
          <div class="d-flex align-center mb-6">
            <v-avatar color="amber-lighten-4" size="48" class="me-4">
              <v-icon icon="mdi-bullhorn" color="amber-darken-3" />
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-black">Aviso de Administración</h3>
              <div class="text-caption opacity-60">Publicado hace 2 horas</div>
            </div>
          </div>
          <p class="text-body-1 text-slate-600 leading-relaxed">
            Recordamos a todos los vecinos que el uso del Salón Social durante el fin de semana requiere reserva previa con al menos 48h de antelación. Por favor, asegúrese de revisar el estado de la limpieza al finalizar para el reembolso íntegro de su fianza.
          </p>
        </v-card>
      </section>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'

const authStore = useAuthStore()
const bookingStore = useBookingStore()

const userInitials = computed(() => {
  if (!authStore.user?.name) return 'U'
  const parts = authStore.user.name.split(' ')
  return parts.map(p => p[0]).slice(0,2).join('').toUpperCase()
})

const rooms = computed(() => bookingStore.rooms)
const isPending = computed(() => authStore.user?.status === 'PENDING')

onMounted(async () => {
  await Promise.all([
    bookingStore.fetchRooms(),
    bookingStore.fetchBookings()
  ])
})
</script>

<style scoped>
.hero-mesh-card {
  background: #0f172a !important;
}

.glow-1 {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 60%;
  height: 100%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
  filter: blur(60px);
}

.glow-2 {
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 60%;
  height: 100%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
  filter: blur(60px);
}

.text-gradient-light {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-info {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.room-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
  width: 100%;
}

.premium-avatar-large {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
  color: white !important;
}

.leading-tight { line-height: 1.1 !important; }
.z-10 { position: relative; z-index: 10; }
.max-width-500 { max-width: 500px; }
.letter-spacing-widest { letter-spacing: 0.2em !important; }

.room-card-premium {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.room-card-premium:hover {
  transform: translateY(-10px) scale(1.02);
}
</style>

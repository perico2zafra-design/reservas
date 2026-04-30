<template>
  <div class="community-dashboard">
    <v-container class="pt-8 pb-16 px-4 px-md-8">
      
      <!-- Hero Section: Premium Mesh Card -->
      <v-card rounded="40" class="hero-premium-card pa-8 pa-md-12 elevation-24 border-0 position-relative overflow-hidden mb-16">
        <div class="mesh-glow-1"></div>
        <div class="mesh-glow-2"></div>
        <div class="mesh-glow-3"></div>
        
        <v-row align="center" class="position-relative z-10">
          <v-col cols="12" md="7" lg="8">
            <div class="d-flex align-center mb-8">
              <div class="brand-badge me-4">
                <v-icon icon="mdi-office-building" color="white" size="18" />
              </div>
              <span class="text-overline font-weight-black text-white opacity-40 letter-spacing-widest">RESIDENCIAL CAMPUS</span>
            </div>
            
            <h1 class="text-h2 font-weight-black text-white mb-8 leading-tight">
              Tu comunidad, <br>
              <span class="text-gradient-vibrant">más conectada.</span>
            </h1>
            
            <div class="d-flex ga-4 flex-wrap mt-10">
              <v-card rounded="24" class="glass-stat-card pa-5 min-width-180" elevation="0">
                <div class="d-flex align-center mb-1">
                  <v-icon icon="mdi-home-variant-outline" color="white" size="16" class="me-2 opacity-50" />
                  <span class="text-caption text-white opacity-50 font-weight-bold">VIVIENDA</span>
                </div>
                <div class="text-h6 font-weight-black text-white">Portal {{ authStore.user?.portal || '-' }} · {{ authStore.user?.letter || '-' }}</div>
              </v-card>

              <v-card rounded="24" class="glass-stat-card pa-5 min-width-180" elevation="0">
                <div class="d-flex align-center mb-1">
                  <v-icon icon="mdi-shield-check-outline" color="green-accent-2" size="16" class="me-2" />
                  <span class="text-caption text-white opacity-50 font-weight-bold">ESTADO</span>
                </div>
                <div class="text-h6 font-weight-black text-white d-flex align-center">
                  Validado
                  <v-icon icon="mdi-check-circle" color="green-accent-2" size="18" class="ms-2" />
                </div>
              </v-card>
            </div>
          </v-col>
          
          <v-col cols="12" md="5" lg="4" class="text-center position-relative">
            <div class="avatar-highlight-aura"></div>
            <InitialAvatar 
              :name="authStore.user?.name" 
              :url="authStore.user?.avatar_url" 
              size="200" 
              variant="large"
              class="hero-avatar-pro"
            />
          </v-col>
        </v-row>
      </v-card>

      <!-- Facilities Section -->
      <div class="section-container">
        <div class="d-flex align-center justify-space-between mb-10 px-2">
          <div>
            <h2 class="text-h4 font-weight-black text-slate-900 mb-2">Instalaciones</h2>
            <p class="text-body-1 text-slate-400 font-weight-medium">Espacios comunes listos para tus eventos</p>
          </div>
          <v-btn variant="tonal" color="primary" rounded="xl" class="font-weight-black px-6" prepend-icon="mdi-filter-variant">
            Filtrar
          </v-btn>
        </div>

        <v-row class="ga-y-8">
          <v-col v-for="room in rooms" :key="room.id" cols="12" sm="6" lg="4">
            <RoomCard 
              :name="room.name"
              :image="room.image"
              :deposit="room.deposit_amount"
              :capacity="room.capacity"
              height="320"
              custom-class="room-card-hover-pro"
              @click="$router.push('/room/' + room.id)"
            />
          </v-col>
        </v-row>
      </div>

    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import InitialAvatar from '@/components/common/InitialAvatar.vue'
import RoomCard from '@/components/common/RoomCard.vue'

const authStore = useAuthStore()
const bookingStore = useBookingStore()

const rooms = computed(() => bookingStore.rooms)

onMounted(async () => {
  await Promise.all([
    bookingStore.fetchRooms(),
    bookingStore.fetchBookings()
  ])
})
</script>

<style scoped>
.hero-premium-card { background: #0f172a !important; }

/* Mesh Gradient Effects */
.mesh-glow-1 {
  position: absolute; top: -30%; left: -10%; width: 70%; height: 140%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%); filter: blur(80px);
}
.mesh-glow-2 {
  position: absolute; bottom: -40%; right: -10%; width: 70%; height: 140%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%); filter: blur(80px);
}
.mesh-glow-3 {
  position: absolute; top: 10%; right: 20%; width: 40%; height: 80%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%); filter: blur(60px);
}

.text-gradient-vibrant {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.brand-badge {
  background: rgba(255, 255, 255, 0.1); width: 36px; height: 36px;
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-stat-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: transform 0.3s ease;
}
.glass-stat-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.08) !important; }

.avatar-highlight-aura {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 120%; height: 120%; background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  z-index: 0;
}

.hero-avatar-pro {
  border: 8px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  position: relative; z-index: 10;
}

.room-card-hover-pro {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.leading-tight { line-height: 1.1 !important; }
.z-10 { position: relative; z-index: 10; }
.letter-spacing-widest { letter-spacing: 0.25em !important; }
.min-width-180 { min-width: 180px; }

@media (max-width: 600px) {
  .text-h2 { font-size: 2.5rem !important; }
  .hero-premium-card { padding: 40px 24px !important; }
  .min-width-180 { min-width: 100%; }
}
</style>

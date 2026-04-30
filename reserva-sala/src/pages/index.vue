<template>
  <div class="community-pro-app">
    <!-- Hero Section: Floating Mesh Card -->
    <v-container class="pt-10 pb-16">
      <v-card rounded="32" class="hero-mesh-card pa-8 pa-md-12 elevation-24 border-0 overflow-hidden position-relative">
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
            
            <div class="d-flex ga-4 flex-wrap">
              <v-card rounded="20" class="glass-info pa-4 min-width-160" elevation="0">
                <div class="text-caption text-white opacity-50 mb-1">VIVIENDA</div>
                <div class="text-subtitle-1 font-weight-black text-white">Portal {{ authStore.user?.portal || '-' }} · {{ authStore.user?.letter || '-' }}</div>
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
            <InitialAvatar 
              :name="authStore.user?.name" 
              :url="authStore.user?.avatar_url" 
              size="180" 
              variant="large" 
            />
          </v-col>
        </v-row>
      </v-card>

      <!-- Main Content -->
      <div class="mt-16">
        <div class="d-flex align-center mb-8 px-2">
          <h2 class="text-h4 font-weight-black text-slate-900">Instalaciones Disponibles</h2>
        </div>

        <v-row>
          <v-col v-for="room in rooms" :key="room.id" cols="12" sm="6" lg="4">
            <RoomCard 
              :name="room.name"
              :image="room.image"
              :deposit="room.deposit_amount"
              :capacity="room.capacity"
              height="280"
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
.hero-mesh-card { background: #0f172a !important; }
.glow-1 {
  position: absolute; top: -20%; left: -10%; width: 60%; height: 100%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%); filter: blur(60px);
}
.glow-2 {
  position: absolute; bottom: -20%; right: -10%; width: 60%; height: 100%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%); filter: blur(60px);
}
.text-gradient-light {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.glass-info {
  background: rgba(255, 255, 255, 0.1) !important; backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
.leading-tight { line-height: 1.1 !important; }
.z-10 { position: relative; z-index: 10; }
.letter-spacing-widest { letter-spacing: 0.2em !important; }
</style>

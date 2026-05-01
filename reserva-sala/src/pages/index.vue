<template>
  <div class="community-dashboard dashboard-container">
    <v-container class="pt-4 pb-8 px-4 px-md-8">
      <!-- Resident Profile Panel -->
      <v-card
        rounded="24"
        class="resident-panel-card pa-4 pa-md-6 elevation-20 border-0 position-relative overflow-hidden mb-6"
      >
        <div class="panel-mesh-glow"></div>

        <v-row align="center" class="position-relative z-10 no-gutters">
          <v-col cols="12" md="9">
            <!-- Brand & Context -->
            <div class="d-flex align-center mb-3">
              <div class="brand-logo-panel me-3">
                <v-icon
                  icon="mdi-shield-crown-outline"
                  color="amber-darken-1"
                  size="18"
                />
              </div>
              <div class="d-flex flex-column">
                <span class="panel-brand-top">RESIDENCIAL</span>
                <span class="panel-brand-bottom">CAMPUS</span>
              </div>
            </div>

            <div class="mb-4">
              <h1
                class="text-subtitle-1 font-weight-light text-white mb-0 opacity-60"
              >
                Bienvenido de nuevo,
              </h1>
              <h2
                class="text-h3 font-weight-black text-white text-playfair leading-tight"
              >
                {{ authStore.user?.name || "Residente" }}
              </h2>
            </div>

            <div class="d-flex ga-2 flex-wrap mt-4">
              <v-card
                rounded="12"
                class="glass-info-card pa-2 px-3"
                min-width="130"
                elevation="0"
              >
                <div class="d-flex align-center mb-0">
                  <v-icon
                    icon="mdi-map-marker-outline"
                    color="amber-darken-1"
                    size="12"
                    class="me-2"
                  />
                  <span class="info-label">UBICACIÓN</span>
                </div>
                <div class="info-value text-caption">
                  P. {{ authStore.user?.portal || "-" }} · Letra
                  {{ authStore.user?.letter || "-" }}
                </div>
              </v-card>

              <v-card
                rounded="12"
                class="glass-info-card pa-2 px-3"
                min-width="130"
                elevation="0"
              >
                <div class="d-flex align-center mb-0">
                  <v-icon
                    icon="mdi-account-check-outline"
                    color="green-accent-2"
                    size="12"
                    class="me-2"
                  />
                  <span class="info-label">MEMBRESÍA</span>
                </div>
                <div class="info-value text-caption">Socio Premium</div>
              </v-card>

              <v-card
                rounded="12"
                class="glass-info-card pa-2 px-3"
                min-width="130"
                elevation="0"
              >
                <div class="d-flex align-center mb-0">
                  <v-icon
                    icon="mdi-shield-star-outline"
                    color="cyan-accent-2"
                    size="12"
                    class="me-2"
                  />
                  <span class="info-label">ESTADO</span>
                </div>
                <div class="info-value text-caption d-flex align-center">
                  Verificado
                  <v-icon
                    icon="mdi-check-decagram"
                    color="cyan-accent-2"
                    size="12"
                    class="ms-1"
                  />
                </div>
              </v-card>
            </div>
          </v-col>

          <v-col
            cols="12"
            md="3"
            class="text-center position-relative d-none d-md-block"
          >
            <div class="avatar-panel-aura"></div>
            <InitialAvatar
              :name="authStore.user?.name"
              :url="authStore.user?.avatar_url"
              size="100"
              variant="large"
              class="panel-avatar-elite"
            />
          </v-col>
        </v-row>
      </v-card>

      <!-- Facilities Section -->
      <div class="section-container mt-4">
        <div class="d-flex align-center justify-space-between mb-4 px-2">
          <div class="d-flex align-center">
            <div class="section-accent me-2"></div>
            <h2
              class="text-h5 text-sm-h4 font-weight-black text-slate-900 section-title"
            >
              Instalaciones
            </h2>
          </div>
        </div>

        <v-slide-group class="pa-0 rooms-carousel-clean" show-arrows>
          <v-slide-group-item v-for="room in rooms" :key="room.id">
            <div
              class="py-4 px-3"
              :style="{ width: $vuetify.display.mobile ? '260px' : '320px' }"
            >
              <RoomCard
                :name="room.name"
                :image="room.image"
                :deposit="room.deposit_amount"
                :capacity="room.capacity"
                :height="$vuetify.display.mobile ? 220 : 300"
                custom-class="room-card-hover-pro"
                @click="$router.push('/room/' + room.id)"
              />
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useBookingStore } from "@/stores/booking";
import InitialAvatar from "@/components/common/InitialAvatar.vue";
import RoomCard from "@/components/common/RoomCard.vue";

const authStore = useAuthStore();
const bookingStore = useBookingStore();

const rooms = computed(() => bookingStore.rooms);

onMounted(async () => {
  await Promise.all([bookingStore.fetchRooms(), bookingStore.fetchBookings()]);
});
</script>

<style scoped>
.resident-panel-card {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.panel-mesh-glow {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 100%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.15) 0%,
    transparent 70%
  );
  filter: blur(100px);
}

.panel-brand-top {
  font-size: 0.5rem;
  font-weight: 800;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1;
}

.panel-brand-bottom {
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: #ffffff;
  font-family: "Playfair Display", serif;
  line-height: 1.2;
}

.brand-logo-panel {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-info-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s ease;
}

.info-label {
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.3);
}

.info-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.avatar-panel-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.1) 0%,
    transparent 70%
  );
}

.panel-avatar-elite {
  border: 2px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4) !important;
}

.section-accent {
  width: 4px;
  height: 32px;
  background: linear-gradient(to bottom, #fbbf24, #d97706);
  border-radius: 4px;
}

.section-title {
  letter-spacing: -1px;
}

.filter-btn-elite {
  background: #0f172a !important;
  color: white !important;
  font-weight: 800 !important;
  font-size: 0.75rem !important;
  letter-spacing: 1px !important;
  padding: 0 20px !important;
  height: 44px !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s ease !important;
}

.filter-btn-elite:hover {
  background: #1e293b !important;
  border-color: rgba(251, 191, 36, 0.3) !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.filter-btn-elite :deep(.v-icon) {
  color: #fbbf24 !important;
}

.rooms-carousel-clean {
  background: transparent !important;
}

.rooms-carousel-clean :deep(.v-slide-group__content) {
  background: transparent !important;
}

.rooms-carousel-clean :deep(.v-slide-group__prev),
.rooms-carousel-clean :deep(.v-slide-group__next) {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border-radius: 50%;
  margin: 0 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  min-width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.rooms-carousel-clean :deep(.v-slide-group__prev:hover),
.rooms-carousel-clean :deep(.v-slide-group__next:hover) {
  background: #0f172a !important;
  color: #fbbf24 !important;
}

.dashboard-container {
  background: #f1f5f9;
  overflow-x: hidden;
}

@media (max-width: 600px) {
  .text-h3 {
    font-size: 1.75rem !important;
  }
  .text-h4 {
    font-size: 1.5rem !important;
  }
  .section-accent {
    height: 24px;
  }
  .resident-panel-card {
    padding: 16px !important;
  }
  .glass-info-card {
    width: 100% !important;
    min-width: 0 !important;
  }
}
</style>

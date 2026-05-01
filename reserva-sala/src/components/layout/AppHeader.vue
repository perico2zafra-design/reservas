<template>
  <v-app-bar flat class="header-premium px-6" height="70">
    <v-app-bar-nav-icon
      v-if="!$vuetify.display.mobile"
      @click="$emit('toggle-drawer')"
      class="icon-btn-refined"
    />

    <!-- Mobile Brand Identity -->
    <div v-if="$vuetify.display.mobile" class="d-flex align-center">
      <div class="mobile-brand-mark me-3 d-flex align-center justify-center">
        <v-icon
          icon="mdi-shield-crown-outline"
          color="amber-darken-1"
          size="18"
        />
      </div>
      <div class="d-flex flex-column">
        <span class="mobile-brand-top">RESIDENCIAL</span>
        <span class="mobile-brand-bottom">CAMPUS</span>
      </div>
    </div>

    <v-spacer />

    <div class="d-flex align-center ga-3">
      <v-btn
        icon="mdi-bell-outline"
        variant="text"
        size="small"
        class="icon-btn-refined"
      />

      <v-menu location="bottom end" transition="slide-y-transition" offset="15">
        <template v-slot:activator="{ props }">
          <div
            v-bind="props"
            class="d-flex align-center cursor-pointer profile-trigger ms-2"
          >
            <div class="text-right me-3 d-none d-sm-block">
              <div
                class="text-subtitle-2 font-weight-black text-white-op leading-tight"
              >
                {{ userName }}
              </div>
              <div
                class="text-caption font-weight-bold text-amber-op text-uppercase letter-spacing-lg"
              >
                {{ userRole }}
              </div>
            </div>
            <v-avatar
              v-if="avatarUrl"
              :size="$vuetify.display.mobile ? 34 : 38"
              class="elevation-4 border-2 border-white"
            >
              <v-img :src="avatarUrl" cover />
            </v-avatar>
            <v-avatar
              v-else
              :size="$vuetify.display.mobile ? 34 : 38"
              class="elevation-4 premium-avatar border-2 border-white"
            >
              <span>{{ initials }}</span>
            </v-avatar>
            <v-icon
              icon="mdi-chevron-down"
              size="14"
              color="rgba(255,255,255,0.3)"
              class="ms-1"
            />
          </div>
        </template>

        <v-list class="dropdown-premium pa-0" width="280">
          <!-- User Profile Header in Dropdown -->
          <div class="pa-5 dropdown-header">
            <div class="d-flex align-center mb-1">
              <div class="elite-gold-marker-header me-3"></div>
              <span class="text-overline text-amber-op">Cuenta Premium</span>
            </div>
            <div class="text-h6 text-playfair text-white mb-0">
              {{ userName }}
            </div>
            <div class="text-caption text-slate-400">{{ userRole }}</div>
          </div>

          <v-divider class="border-white-op" />

          <div class="pa-2">
            <v-list-item
              prepend-icon="mdi-account-outline"
              title="Mi Perfil"
              to="/settings"
              class="menu-item-premium py-3"
              rounded="lg"
            >
              <template v-slot:append>
                <v-icon icon="mdi-chevron-right" size="14" class="opacity-30" />
              </template>
            </v-list-item>

            <v-list-item
              prepend-icon="mdi-calendar-clock"
              title="Mis Reservas"
              to="/my-bookings"
              class="menu-item-premium py-3"
              rounded="lg"
            >
              <template v-slot:append>
                <v-icon icon="mdi-chevron-right" size="14" class="opacity-30" />
              </template>
            </v-list-item>

            <v-divider class="my-2 border-white-op" />

            <v-list-item
              prepend-icon="mdi-logout-variant"
              title="Cerrar Sesión"
              class="menu-item-premium py-3 logout-item"
              rounded="lg"
              @click="$emit('logout')"
            >
              <template v-slot:append>
                <v-icon icon="mdi-power" size="14" class="opacity-50" />
              </template>
            </v-list-item>
          </div>

          <div class="dropdown-footer pa-3 text-center">
            <span
              class="text-tiny text-slate-500 text-uppercase letter-spacing-lg"
              >Residencial Campus Elite</span
            >
          </div>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
defineProps<{
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  initials: string;
}>();

defineEmits(["toggle-drawer", "logout"]);
</script>

<style scoped>
.header-premium {
  background: #0f172a !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
}

.icon-btn-refined {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.5) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-btn-refined:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fbbf24 !important;
  border-color: rgba(251, 191, 36, 0.3) !important;
  transform: translateY(-1px);
}

.profile-trigger {
  padding: 3px 3px 3px 12px;
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-trigger:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 215, 0, 0.25) !important;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.1);
}

.premium-avatar {
  background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%) !important;
  color: #0f172a !important;
  font-weight: 900;
  border: 2px solid rgba(255, 255, 255, 0.1) !important;
}

.mobile-brand-mark {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 8px;
}

.mobile-brand-top {
  font-size: 0.45rem;
  font-weight: 800;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1;
}

.mobile-brand-bottom {
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #ffffff;
  font-family: "Playfair Display", serif;
  line-height: 1.1;
}

.text-white-op {
  color: rgba(255, 255, 255, 0.95) !important;
  font-size: 0.8rem !important;
}

.text-amber-op {
  color: #fbbf24 !important;
  font-size: 0.6rem !important;
  font-weight: 700 !important;
  letter-spacing: 2px !important;
  opacity: 0.8;
}

.logout-menu-item {
  color: rgba(255, 255, 255, 0.6) !important;
  transition: all 0.3s ease;
}

.logout-menu-item:hover {
  background: rgba(251, 191, 36, 0.08) !important;
  color: #fbbf24 !important;
}

@media (max-width: 600px) {
  .header-premium {
    height: 60px !important;
    padding: 0 12px !important;
  }

  :deep(.v-toolbar__content) {
    height: 60px !important;
    padding: 0 12px !important;
  }

  .profile-trigger {
    padding: 2px !important;
    background: transparent !important;
    border: none !important;
  }
}

/* Dropdown Premium Styles */
.dropdown-premium {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  border-radius: 12px !important;
  overflow: hidden;
}

.dropdown-header {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03),
    transparent
  );
}

.elite-gold-marker-header {
  width: 12px;
  height: 2px;
  background: #d4af37;
  border-radius: 2px;
}

.border-white-op {
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.menu-item-premium {
  color: rgba(255, 255, 255, 0.7) !important;
  font-family: "Outfit", sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item-premium :deep(.v-list-item-title) {
  font-weight: 600 !important;
  font-size: 0.9rem !important;
}

.menu-item-premium:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
  transform: translateX(4px);
}

.menu-item-premium :deep(.v-icon) {
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.3s ease;
}

.menu-item-premium:hover :deep(.v-icon) {
  color: #fbbf24;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.08) !important;
  color: #ef4444 !important;
}

.logout-item:hover :deep(.v-icon) {
  color: #ef4444;
}

.dropdown-footer {
  background: rgba(0, 0, 0, 0.2);
}

.text-tiny {
  font-size: 0.6rem;
  font-weight: 800;
}

.text-slate-400 {
  color: #94a3b8;
}
.text-slate-500 {
  color: #64748b;
}
.opacity-30 {
  opacity: 0.3;
}
.opacity-50 {
  opacity: 0.5;
}
</style>

<template>
  <v-bottom-navigation 
    grow 
    class="mobile-nav-elite" 
    height="70"
    active-color="amber-darken-1"
    base-color="white"
  >
    <v-btn to="/" value="home">
      <v-icon>mdi-plus-circle-outline</v-icon>
      <span class="nav-text">RESERVAR</span>
    </v-btn>
    
    <v-btn to="/my-bookings" value="bookings">
      <v-icon>mdi-calendar-clock-outline</v-icon>
      <span class="nav-text">RESERVAS</span>
    </v-btn>
    
    <v-btn v-if="isAdmin" to="/admin" value="admin">
      <v-icon>mdi-shield-crown-outline</v-icon>
      <span class="nav-text">ADMIN</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
defineProps<{
  isAdmin: boolean
}>()
</script>

<style scoped>
.mobile-nav-elite {
  background: #0f172a !important;
  border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3) !important;
}

.nav-text {
  font-size: 0.65rem !important;
  font-weight: 800 !important;
  letter-spacing: 1.5px !important;
  margin-top: 4px;
}

:deep(.v-btn) {
  background: transparent !important;
  opacity: 0.7; /* Standard white look */
}

:deep(.v-btn--active) {
  background: transparent !important;
  opacity: 1 !important;
}

:deep(.v-btn--active .v-icon) {
  filter: drop-shadow(0 0 5px rgba(255, 179, 0, 0.4));
}
</style>

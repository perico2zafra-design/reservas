<template>
  <v-bottom-navigation grow class="mobile-nav-glass" height="80">
    <v-btn to="/" value="home">
      <v-icon>mdi-home-variant-outline</v-icon>
      <span>Inicio</span>
    </v-btn>
    <v-btn to="/my-bookings" value="bookings">
      <v-icon>mdi-calendar-clock-outline</v-icon>
      <span>Reservas</span>
    </v-btn>
    <v-btn v-if="isAdmin" to="/admin/users" value="admin">
      <v-icon>mdi-shield-account-outline</v-icon>
      <span>Admin</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
defineProps<{
  isAdmin: boolean
}>()
</script>

<style scoped>
.mobile-nav-glass {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
}
</style>

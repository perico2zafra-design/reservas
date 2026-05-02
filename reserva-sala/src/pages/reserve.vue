<template>
  <div class="reserve-page">
    <v-container>
      <MobileReserveView />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import MobileReserveView from '@/components/dashboard/MobileReserveView.vue';
import { onMounted } from 'vue';
import { useBookingStore } from '@/stores/booking';

const bookingStore = useBookingStore();

onMounted(() => {
  bookingStore.fetchRooms();
});
</script>

<style scoped>
.reserve-page {
  background: #f8fafc;
  min-height: 100vh;
}
</style>

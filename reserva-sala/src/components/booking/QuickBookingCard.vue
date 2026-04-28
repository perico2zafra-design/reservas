<template>
  <v-card rounded="xl" class="premium-gradient-btn elevation-4 pa-6 text-white h-100 overflow-hidden relative">
    <div class="glass-overlay" />
    <div class="relative z-10">
      <div class="text-h5 font-weight-black mb-6 d-flex align-center">
        <v-icon icon="mdi-lightning-bolt" class="me-2" />
        Quick Booking
      </div>
      <v-form>
        <v-select
          variant="solo"
          bg-color="rgba(255, 255, 255, 0.15)"
          flat
          density="comfortable"
          :label="$t('booking.roomName')"
          :items="roomNames"
          class="mb-4 custom-input"
          rounded="lg"
        />
        <v-text-field
          variant="solo"
          bg-color="rgba(255, 255, 255, 0.15)"
          flat
          density="comfortable"
          type="date"
          :label="$t('booking.date')"
          class="mb-4 custom-input"
          rounded="lg"
        />
        <div class="d-flex gap-4">
          <v-text-field
            variant="solo"
            bg-color="rgba(255, 255, 255, 0.15)"
            flat
            density="comfortable"
            type="time"
            label="Start"
            class="me-2 custom-input"
            rounded="lg"
          />
          <v-text-field
            variant="solo"
            bg-color="rgba(255, 255, 255, 0.15)"
            flat
            density="comfortable"
            type="time"
            label="End"
            class="custom-input"
            rounded="lg"
          />
        </div>
        <v-btn
          block
          color="white"
          size="x-large"
          rounded="xl"
          class="mt-6 text-primary font-weight-black hover-lift"
          elevation="4"
        >
          {{ $t('booking.bookNow') }}
        </v-btn>
      </v-form>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  roomNames: string[]
}>()
</script>

<style scoped>
.gap-4 {
  gap: 1rem;
}
.relative {
  position: relative;
}
.z-10 {
  z-index: 10;
}
.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  z-index: 1;
}
.custom-input :deep(.v-field) {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}
</style>

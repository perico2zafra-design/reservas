<template>
  <v-card rounded="xl" class="border-0 hover-lift overflow-hidden glass-card" v-bind="$attrs">
    <v-img
      :src="room.image"
      height="220"
      cover
      class="align-end"
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </template>
      
      <div class="pa-4 d-flex justify-space-between align-center w-100 bg-gradient-overlay">
        <v-chip color="white" variant="flat" class="text-primary font-weight-black" size="small" v-if="room.price">
          ${{ room.price }}/hr
        </v-chip>
        <slot name="append" />
      </div>
    </v-img>

    <v-card-text class="pa-6">
      <div class="d-flex align-center mb-3">
        <h2 class="text-h6 font-weight-bold line-clamp-1">{{ room.name }}</h2>
        <v-spacer v-if="room.rating" />
        <v-chip v-if="room.rating" size="x-small" color="warning" variant="tonal" class="font-weight-bold">
          <v-icon icon="mdi-star" start size="12" />
          {{ room.rating }}
        </v-chip>
      </div>

      <div class="d-flex align-center mb-2 text-medium-emphasis text-caption">
        <v-avatar color="primary" variant="tonal" size="20" class="me-2">
          <v-icon icon="mdi-clock-outline" size="12" />
        </v-avatar>
        <span class="font-weight-medium">{{ room.availability?.startTime }} - {{ room.availability?.endTime }}</span>
      </div>

      <div class="d-flex align-center mb-5 text-medium-emphasis text-caption">
        <v-avatar color="secondary" variant="tonal" size="20" class="me-2">
          <v-icon icon="mdi-calendar-week" size="12" />
        </v-avatar>
        <span class="font-weight-medium">{{ formattedDays }}</span>
      </div>

      <v-divider class="mb-5 opacity-50" />

      <div class="d-flex align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-group-outline" size="20" class="me-2 text-primary" />
          <span class="text-body-2 font-weight-bold">{{ room.capacity }} personas</span>
        </div>
        <v-spacer />
        <v-btn
          color="primary"
          rounded="lg"
          class="text-none px-6 premium-gradient-btn"
          elevation="0"
          @click="$emit('book', room)"
        >
          {{ $t('booking.bookNow') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface DetailedRoom {
  id: string
  name: string
  capacity: number
  price?: number
  rating?: number
  location?: string
  features?: string[]
  image: string
  availability?: {
    days: number[]
    startTime: string
    endTime: string
  }
}

const props = defineProps<{
  room: DetailedRoom
}>()

defineEmits(['book'])

const dayLabels = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
const formattedDays = computed(() => {
  if (!props.room.availability?.days) return 'No definido'
  return props.room.availability.days
    .sort((a, b) => a - b)
    .map(d => dayLabels[d])
    .join(', ')
})
</script>

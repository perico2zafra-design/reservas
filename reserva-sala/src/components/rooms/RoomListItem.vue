<template>
  <v-list-item
    class="rounded-xl mb-3 glass-card hover-lift border-0 pa-4"
    :prepend-avatar="room.image"
  >
    <template v-slot:prepend>
      <v-avatar size="64" rounded="lg" class="me-4 elevation-2">
        <v-img :src="room.image" cover />
      </v-avatar>
    </template>

    <template v-slot:title>
      <span class="text-h6 font-weight-bold">{{ room.name }}</span>
    </template>
    
    <template v-slot:subtitle>
      <div class="d-flex align-center mt-1">
        <v-chip size="x-small" color="primary" variant="tonal" class="me-3 font-weight-bold">
          <v-icon icon="mdi-account-group" start size="12" />
          {{ room.capacity }} personas
        </v-chip>
        <v-chip size="x-small" :color="room.status === 'Available' ? 'success' : 'warning'" variant="flat" class="font-weight-bold">
          <v-icon :icon="room.status === 'Available' ? 'mdi-check-circle' : 'mdi-clock'" start size="12" />
          {{ room.status }}
        </v-chip>
      </div>
    </template>

    <template v-slot:append>
      <v-btn
        color="primary"
        size="large"
        rounded="pill"
        class="text-none premium-gradient-btn"
        @click="$emit('book', room)"
      >
        {{ $t('booking.bookNow') }}
      </v-btn>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
interface Room {
  id: number
  name: string
  capacity: number
  status: string
  image: string
}

defineProps<{
  room: Room
}>()

defineEmits(['book'])
</script>

<template>
  <div class="d-flex flex-wrap gap-2">
    <v-tooltip v-for="amenity in amenities" :key="amenity" bottom>
      <template v-slot:activator="{ props }">
        <v-avatar
          v-bind="props"
          size="32"
          :color="getColor(amenity) + '-lighten-4'"
          class="amenity-icon elevation-1"
        >
          <v-icon :icon="getIcon(amenity)" :color="getColor(amenity)" size="18" />
        </v-avatar>
      </template>
      <span>{{ getLabel(amenity) }}</span>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  amenities: string[]
}>()

const amenityMap: any = {
  wifi: { icon: 'mdi-wifi', color: 'primary', label: 'WiFi 6' },
  tv: { icon: 'mdi-television', color: 'error', label: 'Pantalla 4K' },
  projector: { icon: 'mdi-projector', color: 'warning', label: 'Proyector' },
  whiteboard: { icon: 'mdi-presentation', color: 'success', label: 'Pizarra' },
  coffee: { icon: 'mdi-coffee', color: 'brown', label: 'Máquina Café' },
  ac: { icon: 'mdi-air-conditioner', color: 'info', label: 'Aire Acond.' },
}

const getIcon = (key: string) => amenityMap[key]?.icon || 'mdi-plus'
const getColor = (key: string) => amenityMap[key]?.color || 'grey'
const getLabel = (key: string) => amenityMap[key]?.label || key
</script>

<style scoped>
.gap-2 { gap: 8px; }
.amenity-icon {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.amenity-icon:hover {
  transform: scale(1.2) rotate(5deg);
}
</style>

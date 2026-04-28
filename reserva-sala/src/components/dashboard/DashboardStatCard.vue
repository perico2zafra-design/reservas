<template>
  <v-card rounded="xl" class="pa-4 border-0 hover-lift glass-card" v-bind="$attrs">
    <div class="d-flex align-center mb-3">
      <v-avatar :color="color" variant="tonal" rounded="lg" size="54" class="premium-avatar">
        <v-icon :icon="icon" size="28" />
      </v-avatar>
      <v-spacer />
      <v-chip size="small" :color="trend > 0 ? 'success' : 'error'" variant="flat" class="font-weight-bold">
        <v-icon :icon="trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down'" start size="14" />
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </v-chip>
    </div>
    <div class="text-h4 font-weight-black mb-1 text-gradient">{{ value }}</div>
    <div class="text-subtitle-2 text-medium-emphasis font-weight-medium">{{ label }}</div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  color: string
  trend: number
}>()
</script>

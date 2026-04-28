<template>
  <v-card rounded="xl" class="premium-stat-card pa-6 border-0 elevation-2 fill-height">
    <div class="d-flex align-center mb-6">
      <v-avatar :color="color + '-lighten-4'" size="56" class="me-4">
        <v-icon :icon="icon" :color="color" size="28" />
      </v-avatar>
      <div>
        <div class="text-overline text-medium-emphasis line-height-1 mb-1">{{ label }}</div>
        <div class="text-h4 font-weight-black" :class="'text-' + color">{{ value }}</div>
      </div>
    </div>
    
    <div class="d-flex align-center">
      <v-icon :icon="trendIcon" :color="trendColor" size="18" class="me-1" />
      <span class="text-caption font-weight-bold" :class="'text-' + trendColor">{{ trendText }}</span>
      <v-spacer />
      <span class="text-caption text-medium-emphasis">vs mes anterior</span>
    </div>

    <div class="mt-4 sparkline-container">
      <div class="sparkline-bar" v-for="i in 10" :key="i" :style="{ height: Math.random() * 100 + '%', opacity: 0.1 + (i/10) }" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trendIcon: string;
  trendColor: string;
  trendText: string;
}>();
</script>

<style scoped>
.premium-stat-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}
.premium-stat-card:hover {
  transform: translateY(-5px);
}
.sparkline-container {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 30px;
}
.sparkline-bar {
  flex: 1;
  background: currentColor;
  border-radius: 2px;
}
.line-height-1 {
  line-height: 1;
}
</style>

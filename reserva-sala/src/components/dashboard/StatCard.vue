<template>
  <div class="stat-card-elite">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-indicator" :class="trendColor">
      <v-icon :icon="icon" size="14" class="me-1" />
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  subtitle: string;
  icon: string;
  trendColor: string;
}>();
</script>

<style scoped>
.stat-card-elite {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 1px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.2;
}

.stat-indicator {
  font-size: 0.7rem;
  font-weight: 700;
  margin-top: 4px;
}
</style>

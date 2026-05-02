<template>
  <v-card 
    :to="to" 
    class="action-card-elite overflow-hidden border-0" 
    elevation="0"
  >
    <div class="action-card-glow" :style="{ background: color }"></div>
    <div class="pa-6 d-flex align-center">
      <div class="action-icon-box me-5" :style="{ backgroundColor: bg }">
        <v-icon :icon="icon" :color="color" size="32" />
      </div>
      <div class="flex-grow-1">
        <div class="action-title">{{ title }}</div>
        <div class="action-desc">{{ desc }}</div>
      </div>
      <v-icon icon="mdi-chevron-right" color="slate-300" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  desc: string;
  icon: string;
  to: string;
  color: string;
  bg: string;
}>();
</script>

<style scoped>
.action-card-elite {
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 24px !important;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}

.action-card-elite:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: #fbbf24 !important;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.15) !important;
}

.action-card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  opacity: 0.3;
}

.action-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-title {
  font-size: 1.1rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.action-desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.3;
}
</style>

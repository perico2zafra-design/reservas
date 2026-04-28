<template>
  <v-card rounded="xl" class="glass-card pa-6 border-0 elevation-4">
    <div class="d-flex align-center mb-6">
      <v-icon icon="mdi-fire" color="orange" class="me-3" />
      <h3 class="text-h6 font-weight-black">Mapa de Ocupación (Heatmap)</h3>
      <v-spacer />
      <v-chip size="x-small" variant="tonal" color="success">Tiempo Real</v-chip>
    </div>

    <div class="heatmap-grid">
      <div class="day-labels">
        <div v-for="day in ['L', 'M', 'X', 'J', 'V']" :key="day" class="day-label">{{ day }}</div>
      </div>
      <div class="hours-grid">
        <div v-for="hour in 12" :key="hour" class="hour-column">
          <div 
            v-for="day in 5" 
            :key="day" 
            class="heatmap-cell"
            :style="{ backgroundColor: getHeatColor() }"
            v-tooltip="'Ocupación: ' + (Math.random()*100).toFixed(0) + '%'"
          />
          <div class="hour-label">{{ 8 + hour }}:00</div>
        </div>
      </div>
    </div>
    
    <div class="d-flex justify-center mt-6 gap-4">
      <div class="d-flex align-center text-caption">
        <div class="legend-box color-0" /> <span class="ms-1">Libre</span>
      </div>
      <div class="d-flex align-center text-caption">
        <div class="legend-box color-1" /> <span class="ms-1">Baja</span>
      </div>
      <div class="d-flex align-center text-caption">
        <div class="legend-box color-2" /> <span class="ms-1">Alta</span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
const getHeatColor = () => {
  const colors = [
    'rgba(var(--v-theme-primary), 0.05)',
    'rgba(var(--v-theme-primary), 0.2)',
    'rgba(var(--v-theme-primary), 0.5)',
    'rgba(var(--v-theme-primary), 0.8)',
    'rgba(255, 100, 100, 0.9)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
</script>

<style scoped>
.heatmap-grid {
  display: flex;
  gap: 10px;
}
.day-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-bottom: 20px;
}
.day-label {
  font-size: 10px;
  font-weight: bold;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
.hours-grid {
  display: flex;
  flex: 1;
  gap: 4px;
}
.hour-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.heatmap-cell {
  height: 20px;
  border-radius: 4px;
  transition: all 0.2s;
}
.heatmap-cell:hover {
  transform: scale(1.2);
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.hour-label {
  font-size: 8px;
  text-align: center;
  margin-top: 5px;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
.legend-box {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
.color-0 { background: rgba(var(--v-theme-primary), 0.05); }
.color-1 { background: rgba(var(--v-theme-primary), 0.4); }
.color-2 { background: rgba(255, 100, 100, 0.9); }
.gap-4 { gap: 16px; }
</style>

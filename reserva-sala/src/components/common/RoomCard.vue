<template>
  <v-card 
    rounded="32" 
    :class="['room-card-premium border-0 overflow-hidden', customClass]" 
    @click="$emit('click')"
  >
    <v-img 
      :src="image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'" 
      :height="$vuetify.display.mobile ? 240 : height" 
      cover 
      class="align-end bg-slate-200 card-image-zoom"
    >
      <div :class="[$vuetify.display.mobile ? 'pa-4' : 'pa-6', 'room-overlay']">
        <div :class="['d-flex align-center', $vuetify.display.mobile ? 'mb-2' : 'mb-3']">
          <v-chip variant="flat" size="x-small" class="fianza-chip">
            {{ deposit }}€ FIANZA
          </v-chip>
          <v-spacer />
          <slot name="top-right"></slot>
        </div>
        
        <h3 :class="[$vuetify.display.mobile ? 'text-h6' : 'text-h5', 'font-weight-black text-white mb-1 room-name']">
          {{ name }}
        </h3>
        
        <div class="d-flex align-center justify-space-between">
          <div class="text-caption text-white-op-80 d-flex align-center">
            <v-icon icon="mdi-account-group-outline" :size="$vuetify.display.mobile ? 14 : 16" class="me-2 amber-text" />
            Aforo: <span class="ms-1 font-weight-bold">{{ capacity }}</span>
          </div>
          <div v-if="!$vuetify.display.mobile" class="view-pill">
            Explorar <v-icon icon="mdi-arrow-right" size="14" class="ms-1" />
          </div>
        </div>
        
        <slot name="footer"></slot>
      </div>
    </v-img>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  image?: string
  deposit: number | string
  capacity: number | string
  height?: string | number
  customClass?: string
}>()

defineEmits(['click'])
</script>

<style scoped>
.room-card-premium {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.room-card-premium:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3) !important;
  border-color: rgba(251, 191, 36, 0.2) !important;
}

.card-image-zoom :deep(.v-img__img) {
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.room-card-premium:hover .card-image-zoom :deep(.v-img__img) {
  transform: scale(1.1);
}

.room-overlay {
  background: linear-gradient(to top, 
    rgba(15, 23, 42, 0.95) 0%, 
    rgba(15, 23, 42, 0.6) 40%, 
    rgba(15, 23, 42, 0) 100%
  );
  width: 100%;
}

.fianza-chip {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-weight: 800 !important;
  letter-spacing: 1px;
}

.room-name {
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.text-white-op-80 {
  color: rgba(255, 255, 255, 0.8);
}

.amber-text {
  color: #fbbf24;
}

.view-pill {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.4s ease;
}

.room-card-premium:hover .view-pill {
  opacity: 1;
  transform: translateX(0);
}
</style>

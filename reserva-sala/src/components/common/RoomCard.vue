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
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height bg-slate-50">
          <v-progress-circular indeterminate color="amber-darken-1" size="24" width="2" />
        </div>
      </template>

      <template v-slot:error>
        <div class="d-flex flex-column align-center justify-center fill-height bg-slate-100 text-slate-400">
          <v-icon icon="mdi-image-off-outline" size="48" class="mb-2" />
          <span class="text-caption font-weight-bold">Imagen no disponible</span>
        </div>
      </template>

      <div :class="[$vuetify.display.mobile ? 'pa-4' : 'pa-6', 'room-overlay']">
        <div :class="['d-flex align-center', $vuetify.display.mobile ? 'mb-2' : 'mb-3']">
          <v-chip variant="flat" size="x-small" class="fianza-chip">
            {{ deposit }}€ FIANZA
          </v-chip>
          <v-spacer />
          <slot name="top-right"></slot>
        </div>
        
        <h3 :class="[$vuetify.display.mobile ? 'text-h6' : 'text-h5', 'font-weight-black text-white mb-2 room-name text-playfair']">
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
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid #f1f5f9 !important;
}

.room-card-premium:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.25) !important;
  border-color: #d4af37 !important;
}

.card-image-zoom :deep(.v-img__img) {
  transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.room-card-premium:hover .card-image-zoom :deep(.v-img__img) {
  transform: scale(1.15);
}

.room-overlay {
  background: linear-gradient(to top, 
    rgba(15, 23, 42, 0.95) 0%, 
    rgba(15, 23, 42, 0.5) 50%, 
    transparent 100%
  );
  width: 100%;
}

.fianza-chip {
  background: #fbbf24 !important;
  color: #0f172a !important;
  font-weight: 900 !important;
  letter-spacing: 1px;
  border-radius: 6px !important;
  box-shadow: 0 4px 10px rgba(251, 191, 36, 0.3);
}

.room-name {
  letter-spacing: -0.5px;
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
}

.text-white-op-80 {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  letter-spacing: 0.5px;
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

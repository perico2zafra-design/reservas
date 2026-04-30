<template>
  <v-card 
    rounded="32" 
    :class="['room-card-premium elevation-12 border-0 overflow-hidden', customClass]" 
    @click="$emit('click')"
  >
    <v-img 
      :src="image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'" 
      :height="height" 
      cover 
      class="align-end bg-slate-200"
    >
      <div class="pa-6 room-overlay">
        <div class="d-flex align-center mb-1">
          <v-chip color="white" variant="flat" size="x-small" class="me-2 font-weight-black text-primary">
            {{ deposit }}€ FIANZA
          </v-chip>
          <v-spacer />
          <slot name="top-right"></slot>
        </div>
        <h3 class="text-h5 font-weight-black text-white mb-1">{{ name }}</h3>
        <div class="text-caption text-white opacity-80 d-flex align-center">
          <v-icon icon="mdi-account-group" size="14" class="me-2" />
          Aforo: {{ capacity }} personas
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
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}
.room-card-premium:hover {
  transform: translateY(-10px) scale(1.02);
}
.room-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%);
  width: 100%;
}
</style>

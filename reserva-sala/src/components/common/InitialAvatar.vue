<template>
  <v-avatar :size="size" :class="[avatarClass, 'elevation-4 border-2 border-white']">
    <v-img v-if="url" :src="url" cover />
    <span v-else :class="textClass">{{ initials }}</span>
  </v-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name?: string
  url?: string
  size?: string | number
  variant?: 'normal' | 'large'
}>()

const initials = computed(() => {
  if (!props.name) return 'U'
  const parts = props.name.split(' ')
  return parts.map(p => p[0]).slice(0, 2).join('').toUpperCase()
})

const avatarClass = computed(() => props.variant === 'large' ? 'premium-avatar-large' : 'premium-avatar')
const textClass = computed(() => props.variant === 'large' ? 'text-h4 font-weight-black' : 'text-caption font-weight-black')
</script>

<style scoped>
.premium-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.5) !important;
}
.premium-avatar-large {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
  box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.6) !important;
}
.premium-avatar span, .premium-avatar-large span {
  color: white !important;
}
</style>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { snackbar } = storeToRefs(appStore)

const closeSnackbar = () => {
  appStore.hideSnackbar()
}
</script>

<template>
  <Transition name="snackbar">
    <div v-if="snackbar.show" class="snackbar-container" :class="snackbar.type">
      <div class="snackbar-content">
        <div class="icon-container">
          <v-icon v-if="snackbar.type === 'success'" icon="mdi-check-circle-outline" size="20" />
          <v-icon v-else-if="snackbar.type === 'error'" icon="mdi-alert-circle-outline" size="20" />
          <v-icon v-else-if="snackbar.type === 'warning'" icon="mdi-alert-outline" size="20" />
          <v-icon v-else icon="mdi-information-outline" size="20" />
        </div>
        <div class="text-group">
          <p class="title text-playfair">{{ snackbar.type === 'error' ? 'Atención' : 'Residencial Campus' }}</p>
          <p class="message">{{ snackbar.message }}</p>
        </div>
        <button @click="closeSnackbar" class="close-btn">
          <v-icon icon="mdi-close" size="16" />
        </button>
      </div>
      <div class="progress-bar" :style="{ animationDuration: `${snackbar.timeout}ms` }"></div>
    </div>
  </Transition>
</template>

<style scoped>
.snackbar-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
  min-width: 350px;
  max-width: 450px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px; /* More angular/premium look */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Outfit', sans-serif;
}

.snackbar-content {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  gap: 16px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.success .icon-container { color: #d4af37; } /* Gold success */
.error .icon-container { color: #ef4444; }
.warning .icon-container { color: #f59e0b; }
.info .icon-container { color: #3b82f6; }

.text-group {
  flex-grow: 1;
}

.title {
  margin: 0 0 4px 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #94a3b8;
}

.message {
  margin: 0;
  color: white;
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.4;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -4px;
  margin-right: -8px;
}

.close-btn:hover {
  color: white;
}

.progress-bar {
  height: 2px;
  width: 100%;
  background: currentColor;
  opacity: 0.5;
  transform-origin: left;
  animation: shrink linear forwards;
}

/* Elite Gold Marker Style */
.snackbar-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #d4af37; /* Gold by default */
}

.success { color: #d4af37; }
.success::before { background: #d4af37; }

.error { color: #ef4444; }
.error::before { background: #ef4444; }

.warning { color: #f59e0b; }
.warning::before { background: #f59e0b; }

.info { color: #3b82f6; }
.info::before { background: #3b82f6; }

@keyframes shrink {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Transitions */
.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.snackbar-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.snackbar-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 640px) {
  .snackbar-container {
    left: 16px;
    right: 16px;
    bottom: 16px;
    min-width: 0;
  }
}
</style>

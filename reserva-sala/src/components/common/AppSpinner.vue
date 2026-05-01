<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { loading } = storeToRefs(appStore)
</script>

<template>
  <Transition name="fade">
    <div v-if="loading" class="spinner-overlay">
      <div class="spinner-content">
        <div class="elite-spinner">
          <div class="spinner-ring primary-ring"></div>
          <div class="spinner-ring gold-ring"></div>
          <div class="center-brand">
            <v-icon icon="mdi-shield-crown-outline" color="#d4af37" size="32" />
          </div>
        </div>
        <div class="text-container">
          <h2 class="loading-title text-playfair">Residencial Campus</h2>
          <p class="loading-subtitle">Preparando su espacio...</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.spinner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.elite-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
}

.primary-ring {
  width: 100%;
  height: 100%;
  border-top-color: #2563eb;
  border-left-color: #2563eb;
  animation: spin 2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.gold-ring {
  width: 80%;
  height: 80%;
  border-bottom-color: #d4af37;
  border-right-color: #d4af37;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse;
}

.center-brand {
  z-index: 2;
  animation: pulse 2s ease-in-out infinite;
}

.text-container {
  text-align: center;
}

.loading-title {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.loading-subtitle {
  color: #94a3b8;
  font-family: 'Outfit', sans-serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

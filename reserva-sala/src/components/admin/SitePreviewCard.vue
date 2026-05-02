<template>
  <div class="sidebar-elite-container">
    <!-- Superadmin Badge -->
    <div class="elite-badge-card pa-6 mb-6">
      <div class="d-flex align-center mb-3">
        <v-icon
          icon="mdi-shield-crown-outline"
          color="amber"
          class="me-3"
        />
        <span
          class="text-caption font-weight-black letter-spacing-lg text-white"
          >NIVEL SUPERADMIN</span
        >
      </div>
      <p class="text-caption text-slate-400 mb-0">
        Control total sobre los activos digitales y la normativa pública
        de la mancomunidad.
      </p>
    </div>

    <!-- Neighbor Preview (Truly Premium) -->
    <div class="preview-elite-v3">
      <div class="preview-inner">
        <div class="preview-label mb-6">PREVISUALIZACIÓN VECINO</div>
        <div class="preview-brand-box">
          <h3 class="text-playfair mb-1">
            {{ settings.name || "Elite Residential" }}
          </h3>
          <div class="d-flex align-center opacity-60">
            <v-icon icon="mdi-map-marker" size="12" class="me-1" />
            <span class="text-caption truncate">{{
              settings.address || "España"
            }}</span>
          </div>
        </div>
        <v-divider class="my-4 opacity-10" />
        <div class="preview-footer-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SiteSettings } from "@/types";

defineProps<{
  settings: Partial<SiteSettings>;
}>();
</script>

<style scoped>
.elite-badge-card {
  background: #0f172a;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
}

.preview-elite-v3 {
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
}

.preview-label {
  font-size: 0.6rem;
  font-weight: 900;
  color: #cbd5e1;
  letter-spacing: 2px;
}

.preview-footer-dots {
  display: flex;
  gap: 6px;
}
.preview-footer-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e2e8f0;
}
</style>

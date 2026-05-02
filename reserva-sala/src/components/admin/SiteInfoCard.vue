<template>
  <div class="elite-glass-card pa-6 pa-md-8 position-relative overflow-hidden mb-8">
    <div class="glass-shine"></div>

    <div class="d-flex align-center mb-12">
      <div class="icon-box-elite me-4">
        <v-icon icon="mdi-bank-outline" color="amber-darken-2" />
      </div>
      <h2 class="text-h5 font-weight-black text-slate-800">
        Información del Complejo
      </h2>
    </div>

    <v-row class="ga-y-8">
      <v-col cols="12">
        <div class="info-group-ultimate">
          <label>NOMBRE DE LA MANCOMUNIDAD</label>
          <div class="info-content text-playfair">
            {{ settings.name || "Residencial Campus" }}
          </div>
          <div class="gold-line-under"></div>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="info-group-ultimate">
          <label>DIRECCIÓN ESTRATÉGICA</label>
          <div class="info-content d-flex align-center">
            <v-icon
              icon="mdi-map-marker-path"
              size="20"
              class="me-3 text-amber-darken-1"
            />
            {{ settings.address || "Ubicación Premium" }}
          </div>
          <div class="gold-line-under"></div>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="info-group-ultimate">
          <label>LÍMITE DE RESERVAS POR VECINO</label>
          <div class="info-content d-flex align-center">
            <v-icon icon="mdi-calendar-check" size="24" class="me-3 text-amber-darken-1" />
            {{ settings.max_bookings_per_month }} reservas / mes natural
          </div>
          <div class="gold-line-under"></div>
        </div>
      </v-col>

      <v-col cols="12">
        <v-divider class="my-6 opacity-10" />
        <div class="info-group-ultimate">
          <label>NORMATIVA Y GOBERNANZA</label>
          <div class="info-text-box mt-4">
            {{
              settings.urbanization_details ||
              "Los estatutos de la comunidad definen un entorno de convivencia exclusiva y respetuosa."
            }}
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { SiteSettings } from "@/types";

defineProps<{
  settings: Partial<SiteSettings>;
}>();
</script>

<style scoped>
.elite-glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 24px !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02) !important;
}

.glass-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.icon-box-elite {
  width: 54px;
  height: 54px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
}

.info-group-ultimate label {
  font-size: 0.65rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
  display: block;
}

.info-content {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.gold-line-under {
  width: 40px;
  height: 3px;
  background: #fbbf24;
  margin-top: 12px;
  border-radius: 2px;
  opacity: 0.3;
}

.info-text-box {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.8;
  padding-left: 20px;
  border-left: 1px solid #e2e8f0;
}
</style>

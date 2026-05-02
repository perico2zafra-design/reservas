<template>
  <v-dialog
    v-model="internalModel"
    max-width="650"
    transition="dialog-bottom-transition"
  >
    <v-card rounded="xl" class="elite-dark-modal-v2 overflow-hidden">
      <div class="elite-modal-header-accent"></div>

      <div class="pa-10">
        <div class="d-flex align-start justify-space-between mb-10">
          <div>
            <h2 class="modal-title-ultimate text-playfair text-white">
              Ajustes del Portal
            </h2>
            <p
              class="text-caption text-amber font-weight-bold uppercase-track"
            >
              Configuración de Alto Nivel
            </p>
          </div>
          <v-btn
            icon="mdi-close"
            variant="tonal"
            color="white"
            density="comfortable"
            @click="internalModel = false"
          />
        </div>

        <v-form @submit.prevent="save">
          <v-row class="ga-y-4">
            <v-col cols="12">
              <label class="dark-input-label">Identidad Mancomunidad</label>
              <v-text-field
                v-model="localForm.name"
                variant="solo"
                flat
                bg-color="rgba(255,255,255,0.05)"
                class="elite-input-field"
                rounded="lg"
                placeholder="Ej: Residencial Campus Elite"
              />
            </v-col>

            <v-col cols="12">
              <label class="dark-input-label">Dirección del Complejo</label>
              <v-text-field
                v-model="localForm.address"
                variant="solo"
                flat
                bg-color="rgba(255,255,255,0.05)"
                class="elite-input-field"
                rounded="lg"
                placeholder="Calle, Número, Ciudad"
                prepend-inner-icon="mdi-map-marker-outline"
              />
            </v-col>

            <v-col cols="12" md="6">
              <div class="dark-input-label">Límite Reservas / Mes</div>
              <v-text-field
                v-model.number="localForm.max_bookings_per_month"
                type="number"
                variant="solo"
                flat
                bg-color="rgba(255,255,255,0.03)"
                class="elite-input-field"
                rounded="lg"
                min="1"
                max="30"
                prepend-inner-icon="mdi-counter"
              />
            </v-col>

            <v-col cols="12" md="6">
              <div class="dark-input-label">Horizonte Reserva (Meses)</div>
              <v-text-field
                v-model.number="localForm.booking_horizon_months"
                type="number"
                variant="solo"
                flat
                bg-color="rgba(255,255,255,0.03)"
                class="elite-input-field"
                rounded="lg"
                min="1"
                max="12"
                prepend-inner-icon="mdi-calendar-clock"
              />
            </v-col>

            <v-col cols="12" md="6">

              <div class="dark-input-label">Hora Apertura</div>
              <v-text-field
                v-model="localForm.start_hour"
                type="time"
                variant="solo"
                flat
                bg-color="rgba(255,255,255,0.03)"
                class="elite-input-field"
                rounded="lg"
                prepend-inner-icon="mdi-clock-start"
              />
            </v-col>

            <v-col cols="12" md="4">
              <div class="dark-input-label">Hora Cierre</div>
              <v-text-field
                v-model="localForm.end_hour"
                type="time"
                variant="solo"
                flat
                bg-color="rgba(255,255,255,0.03)"
                class="elite-input-field"
                rounded="lg"
                prepend-inner-icon="mdi-clock-end"
              />
            </v-col>

            <v-col cols="12">
              <label class="dark-input-label">Estatutos y Normativa</label>
              <v-textarea
                v-model="localForm.urbanization_details"
                variant="solo"
                flat
                bg-color="rgba(255,255,255,0.05)"
                class="elite-input-field"
                rounded="lg"
                rows="4"
                placeholder="Redacta aquí las normas de convivencia..."
              />
            </v-col>
          </v-row>

          <v-btn
            color="amber-darken-2"
            block
            height="60"
            rounded="xl"
            class="mt-10 font-weight-black text-slate-900 elite-save-btn"
            type="submit"
            :loading="loading"
          >
            GUARDAR CONFIGURACIÓN
          </v-btn>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import type { SiteSettings } from "@/types";

const props = defineProps<{
  modelValue: boolean;
  settings: Partial<SiteSettings>;
  loading?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'save']);

const internalModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const localForm = reactive({
  name: "",
  address: "",
  urbanization_details: "",
  max_bookings_per_month: 0,
  booking_horizon_months: 1,
  start_hour: "",
  end_hour: "",
});


watch(() => props.settings, (newSettings) => {
  if (newSettings && Object.keys(newSettings).length > 0) {
    localForm.name = newSettings.name || "";
    localForm.address = newSettings.address || "";
    localForm.urbanization_details = newSettings.urbanization_details || "";
    localForm.max_bookings_per_month = newSettings.max_bookings_per_month ?? 2;
    localForm.booking_horizon_months = newSettings.booking_horizon_months ?? 1;
    localForm.start_hour = newSettings.start_hour || "09:00";
    localForm.end_hour = newSettings.end_hour || "23:59";
  }

}, { immediate: true, deep: true });


const save = () => {
  emit('save', { ...localForm });
};
</script>


<style scoped>
.elite-dark-modal-v2 {
  background: #0f172a !important;
}

.elite-modal-header-accent {
  height: 6px;
  background: linear-gradient(to right, #d4af37, #fbbf24);
}

.modal-title-ultimate {
  font-size: 1.85rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.uppercase-track {
  letter-spacing: 1px;
  text-transform: uppercase;
}

.dark-input-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
  display: block;
}

.elite-input-field :deep(.v-field__input) {
  color: white !important;
}

.elite-save-btn {
  box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3) !important;
}
</style>

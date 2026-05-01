<template>
  <div class="admin-settings-page-ultimate">
    <!-- Mesh Background Decor -->
    <div class="elite-mesh-background"></div>
    <div class="elite-top-accent"></div>

    <v-container
      class="pt-10 pb-6 px-4 px-md-10 main-content-limit position-relative z-10"
    >
      <!-- Header Section -->
      <v-row no-gutters align="center" class="mb-12">
        <v-col cols="12" md="8" class="d-flex align-center">
          <div class="elite-gold-marker-thick me-5"></div>
          <div>
            <h1 class="page-title-ultimate text-playfair mb-1">
              Configuración
            </h1>
            <div class="d-flex align-center">
              <v-chip
                size="x-small"
                color="amber-darken-3"
                variant="flat"
                class="me-3 font-weight-black"
                >PORTAL ELITE</v-chip
              >
              <span
                class="text-caption text-slate-400 font-weight-bold uppercase-track"
                >Gestión de Identidad & Normativa</span
              >
            </div>
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="12" md="auto" class="mt-6 mt-md-0">
          <v-btn
            color="#0f172a"
            class="text-white font-weight-black elite-btn-premium shadow-amber"
            rounded="xl"
            height="52"
            min-width="200"
            prepend-icon="mdi-pencil-box-outline"
            @click="editModal = true"
          >
            EDITAR PORTAL
          </v-btn>
        </v-col>
      </v-row>

      <!-- Main Layout -->
      <v-row>
        <!-- Info Card: Glassmorphism style -->
        <v-col cols="12" lg="8">
          <div
            class="elite-glass-card pa-8 pa-md-12 position-relative overflow-hidden mb-8"
          >
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
                    {{ form.name || "Residencial Campus" }}
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
                    {{ form.address || "Ubicación Premium" }}
                  </div>
                  <div class="gold-line-under"></div>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="info-group-ultimate">
                  <label>NORMATIVA Y GOBERNANZA</label>
                  <div class="info-text-box mt-4">
                    {{
                      form.urbanization_details ||
                      "Los estatutos de la comunidad definen un entorno de convivencia exclusiva y respetuosa."
                    }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <!-- Sidebar: Premium Insights -->
        <v-col cols="12" lg="4">
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
                    {{ form.name || "Elite Residential" }}
                  </h3>
                  <div class="d-flex align-center opacity-60">
                    <v-icon icon="mdi-map-marker" size="12" class="me-1" />
                    <span class="text-caption truncate">{{
                      form.address || "España"
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
        </v-col>
      </v-row>
    </v-container>

    <!-- PREMIUM EDIT MODAL (Improved) -->
    <v-dialog
      v-model="editModal"
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
              @click="editModal = false"
            />
          </div>

          <v-form @submit.prevent="saveSettings">
            <v-row class="ga-y-4">
              <v-col cols="12">
                <label class="dark-input-label">Identidad Mancomunidad</label>
                <v-text-field
                  v-model="form.name"
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
                  v-model="form.address"
                  variant="solo"
                  flat
                  bg-color="rgba(255,255,255,0.05)"
                  class="elite-input-field"
                  rounded="lg"
                  placeholder="Calle, Número, Ciudad"
                  prepend-inner-icon="mdi-map-marker-outline"
                />
              </v-col>

              <v-col cols="12">
                <label class="dark-input-label">Estatutos y Normativa</label>
                <v-textarea
                  v-model="form.urbanization_details"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { siteService } from "@/services/site.service";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const loading = ref(false);
const editModal = ref(false);

const form = reactive({
  name: "",
  address: "",
  urbanization_details: "",
});

const fetchSettings = async () => {
  try {
    const data = await siteService.getSettings();
    form.name = data.name;
    form.address = data.address;
    form.urbanization_details = data.urbanization_details;
  } catch (err) {
    console.error("Error al cargar ajustes:", err);
  }
};

const saveSettings = async () => {
  loading.value = true;
  try {
    await siteService.updateSettings(form);
    appStore.showSnackbar("Configuración del portal actualizada", "success");
    editModal.value = false;
  } catch (err) {
    appStore.showSnackbar("Fallo al guardar la configuración", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSettings);
</script>

<style scoped>
.admin-settings-page-ultimate {
  background-color: #f8fafc;
  position: relative;
  overflow: hidden; /* Prevent unwanted scrolls */
}

.elite-mesh-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      circle at 0% 0%,
      rgba(212, 175, 55, 0.05) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 100% 100%,
      rgba(15, 23, 42, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.elite-top-accent {
  height: 4px;
  background: linear-gradient(to right, #d4af37, #fbbf24, #d4af37);
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.2);
}

.z-10 {
  z-index: 10;
}

.elite-gold-marker-thick {
  width: 6px;
  height: 50px;
  background: linear-gradient(to bottom, #d4af37, #fbbf24);
  border-radius: 10px;
}

.page-title-ultimate {
  font-size: 3.25rem;
  line-height: 0.8;
  font-weight: 900;
  letter-spacing: -2.5px;
  color: #0f172a;
}

.elite-btn-premium {
  letter-spacing: 1.5px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.shadow-amber:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px -10px rgba(212, 175, 55, 0.4) !important;
}

/* GLASS CARD INFO */
.elite-glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 32px !important;
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
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.1;
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

/* SIDEBAR ELITE */
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

/* MODAL ULTIMATE */
.elite-dark-modal-v2 {
  background: #0f172a !important;
}

.elite-modal-header-accent {
  height: 6px;
  background: linear-gradient(to right, #d4af37, #fbbf24);
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

@media (max-width: 600px) {
  .page-title-ultimate {
    font-size: 2.25rem;
  }
  .info-content {
    font-size: 1.25rem;
  }
  .elite-glass-card {
    padding: 24px !important;
  }
}
</style>

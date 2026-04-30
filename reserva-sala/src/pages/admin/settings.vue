<template>
  <div class="admin-settings-page">
    <!-- Header Decorativo (Cover) -->
    <div class="settings-cover">
      <div class="mesh-gradient-overlay"></div>
    </div>

    <v-container class="settings-content pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          
          <!-- Header Card -->
          <v-card rounded="32" class="settings-header-card pa-8 mb-8 elevation-24 border-0 mt-n16">
            <div class="d-flex align-center flex-wrap ga-6 text-center text-md-left">
              <v-avatar color="primary" size="80" class="elevation-12 mx-auto mx-md-0">
                <v-icon icon="mdi-cog-box" color="white" size="40" />
              </v-avatar>
              <div class="flex-grow-1">
                <h1 class="text-h3 font-weight-black text-slate-900 mb-1">Ajustes del Portal</h1>
                <p class="text-subtitle-1 text-slate-500">Configura la identidad y normas de la Mancomunidad</p>
              </div>
              <v-chip color="slate-900" class="text-white font-weight-black px-4" size="large">
                <v-icon icon="mdi-shield-crown-outline" class="me-2" />
                SUPERADMIN
              </v-chip>
            </div>
          </v-card>

          <!-- Main Configuration Card -->
          <v-card rounded="32" class="pa-8 pa-md-12 border-0 elevation-xl glass-card-settings mb-8">
            <div class="section-title mb-10">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-office-building-cog" color="primary" class="me-3" />
                <h2 class="text-h5 font-weight-black text-slate-900">Información General</h2>
              </div>
              <p class="text-body-2 text-slate-500">Estos datos aparecerán en los encabezados y documentos de la comunidad.</p>
            </div>

            <v-form @submit.prevent="saveSettings">
              <v-row>
                <v-col cols="12">
                  <div class="field-label mb-2">Nombre de la Mancomunidad</div>
                  <v-text-field 
                    v-model="form.name" 
                    placeholder="Ej: Residencial Campus" 
                    variant="solo" 
                    rounded="xl" 
                    bg-color="slate-50" 
                    flat 
                    class="custom-field-pro" 
                  />
                </v-col>
                
                <v-col cols="12">
                  <div class="field-label mb-2">Dirección Física</div>
                  <v-text-field 
                    v-model="form.address" 
                    placeholder="Calle, Número, Ciudad" 
                    variant="solo" 
                    rounded="xl" 
                    bg-color="slate-50" 
                    flat 
                    prepend-inner-icon="mdi-map-marker-outline"
                    class="custom-field-pro" 
                  />
                </v-col>

                <v-col cols="12">
                  <div class="field-label mb-2">Detalles y Normativa (Acta de Junta)</div>
                  <v-textarea 
                    v-model="form.urbanization_details" 
                    placeholder="Describe las normas generales..." 
                    variant="solo" 
                    rounded="24" 
                    bg-color="slate-50" 
                    flat 
                    rows="5"
                    class="custom-field-pro" 
                    hint="Esta información es vital para que los vecinos conozcan sus derechos y deberes."
                    persistent-hint
                  />
                </v-col>
              </v-row>

              <v-btn
                type="submit"
                block
                color="primary"
                size="x-large"
                rounded="xl"
                class="mt-10 font-weight-black premium-action-btn"
                :loading="loading"
              >
                Actualizar Configuración Global
              </v-btn>
            </v-form>
          </v-card>

          <!-- Real-time Preview Overlay -->
          <v-alert
            type="info"
            variant="tonal"
            rounded="xl"
            icon="mdi-monitor-eye"
            class="mb-6 mx-2"
          >
            <div class="text-subtitle-2 font-weight-bold">Simulación de Panel de Vecino</div>
            <div class="text-caption">Así visualizarán los residentes la información actualizada.</div>
          </v-alert>

          <v-card rounded="32" class="preview-panel-card pa-10 text-white elevation-24 position-relative overflow-hidden">
            <div class="preview-glow"></div>
            <div class="position-relative z-10">
              <div class="text-overline opacity-40 mb-2 letter-spacing-widest">VISTA DEL RESIDENTE</div>
              <h3 class="text-h4 font-weight-black mb-4">{{ form.name || 'Mancomunidad Campus' }}</h3>
              <div class="d-flex align-center opacity-60 text-body-2 mb-6">
                <v-icon icon="mdi-map-marker" size="16" class="me-2" />
                {{ form.address || 'Ubicación no configurada' }}
              </div>
              <v-divider class="mb-6 opacity-10" />
              <p class="text-body-1 opacity-80 leading-relaxed">{{ form.urbanization_details || 'Los detalles del acta aparecerán en este espacio para todos los vecinos...' }}</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="success" color="success" rounded="pill" elevation="24">
      <v-icon icon="mdi-cloud-check-outline" class="me-2" />
      Configuración global actualizada con éxito
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { siteService } from '@/services/site.service'

const loading = ref(false)
const success = ref(false)

const form = reactive({
  name: '',
  address: '',
  urbanization_details: ''
})

const fetchSettings = async () => {
  try {
    const data = await siteService.getSettings()
    form.name = data.name
    form.address = data.address
    form.urbanization_details = data.urbanization_details
  } catch (err) {
    console.error('Error al cargar ajustes:', err)
  }
}

const saveSettings = async () => {
  loading.value = true
  try {
    await siteService.updateSettings(form)
    success.value = true
  } catch (err) {
    console.error('Error al guardar ajustes:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchSettings)
</script>

<style scoped>
.admin-settings-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.settings-cover {
  height: 220px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  position: relative;
  overflow: hidden;
}

.mesh-gradient-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 40%);
  filter: blur(50px);
}

.settings-content {
  margin-top: -110px;
  position: relative;
  z-index: 2;
}

.settings-header-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
}

.glass-card-settings {
  background: white !important;
  border: 1px solid rgba(0,0,0,0.03) !important;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.custom-field-pro :deep(.v-field__input) {
  padding-top: 14px !important;
  padding-bottom: 14px !important;
  font-weight: 500;
  color: #0f172a;
}

.preview-panel-card {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.preview-glow {
  position: absolute;
  top: -50%; right: -20%; width: 80%; height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  filter: blur(60px);
}

.premium-action-btn {
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4) !important;
  transition: all 0.3s ease;
}

.premium-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5) !important;
}

.leading-relaxed { line-height: 1.7 !important; }
.letter-spacing-widest { letter-spacing: 0.2em !important; }
.z-10 { position: relative; z-index: 10; }
</style>

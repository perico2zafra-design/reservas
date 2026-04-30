<template>
  <div class="premium-page">
    <div class="mb-10">
      <h1 class="text-h3 font-weight-black text-gradient mb-2">Configuración Base</h1>
      <p class="text-subtitle-1 text-medium-emphasis">Gestiona la información principal de la urbanización y la web.</p>
    </div>

    <v-row>
      <v-col cols="12" md="8">
        <v-card rounded="xl" class="glass-card pa-8 border-0 elevation-4">
          <v-form @submit.prevent="handleSave" v-model="valid">
            <h2 class="text-h5 font-weight-bold mb-6">Información General</h2>
            
            <v-text-field
              v-model="settings.name"
              label="Nombre de la Web / Aplicación"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              :rules="[v => !!v || 'Campo requerido']"
            />

            <v-text-field
              v-model="settings.address"
              label="Dirección de la Urbanización"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              :rules="[v => !!v || 'Campo requerido']"
            />

            <v-textarea
              v-model="settings.urbanization_details"
              label="Detalles / Descripción de la Urbanización"
              variant="outlined"
              rounded="lg"
              rows="4"
              class="mb-8"
            />

            <v-divider class="mb-8" />

            <div class="d-flex justify-end">
              <v-btn
                color="primary"
                size="large"
                rounded="xl"
                type="submit"
                :loading="saving"
                class="px-8 font-weight-black elevation-8 premium-gradient-btn"
              >
                Guardar Cambios
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card rounded="xl" class="glass-card pa-6 border-0 elevation-4 bg-primary-darken-1 text-white">
          <v-icon icon="mdi-shield-crown-outline" size="48" class="mb-4" />
          <h3 class="text-h6 font-weight-bold mb-2">Acceso Super Admin</h3>
          <p class="text-body-2 opacity-80 mb-6">
            Solo los Super Administradores pueden modificar esta información global. Estos datos se mostrarán en la página de inicio y en los correos electrónicos.
          </p>
          <v-divider class="mb-6 opacity-20" />
          <div class="text-caption">
            Última actualización: {{ settings.updated_at ? new Date(settings.updated_at).toLocaleString() : 'N/A' }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="showSuccess" color="success" timeout="3000" rounded="pill">
      Configuración guardada correctamente
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const settings = ref({
  name: '',
  address: '',
  urbanization_details: '',
  updated_at: null
})
const valid = ref(false)
const loading = ref(false)
const saving = ref(false)
const showSuccess = ref(false)

const fetchSettings = async () => {
  loading.value = true
  try {
    const res = await api.get('/settings')
    settings.value = res.data
  } catch (err) {
    console.error('Error fetching settings:', err)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!valid.value) return
  saving.value = true
  try {
    const res = await api.put('/settings', settings.value)
    settings.value = res.data
    showSuccess.value = true
  } catch (err) {
    console.error('Error saving settings:', err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

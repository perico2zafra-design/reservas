<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <div class="d-flex align-center mb-8">
          <v-avatar color="primary" size="56" class="me-4 elevation-4">
            <v-icon icon="mdi-cog-outline" color="white" size="32" />
          </v-avatar>
          <div>
            <h1 class="text-h4 font-weight-black text-slate-900">Configuración del Portal</h1>
            <p class="text-slate-500">Ajustes generales de la Mancomunidad</p>
          </div>
        </div>

        <v-card rounded="32" class="pa-8 border-0 elevation-xl mb-8">
          <h2 class="text-h6 font-weight-black mb-6">Información General</h2>
          <v-form @submit.prevent="saveSettings">
            <v-text-field
              v-model="form.name"
              label="Nombre de la Mancomunidad"
              variant="outlined"
              rounded="xl"
              class="mb-4"
              prepend-inner-icon="mdi-office-building"
            />
            
            <v-text-field
              v-model="form.address"
              label="Dirección Física"
              variant="outlined"
              rounded="xl"
              class="mb-4"
              prepend-inner-icon="mdi-map-marker"
            />

            <v-textarea
              v-model="form.urbanization_details"
              label="Detalles de la Urbanización (Acta de Junta)"
              variant="outlined"
              rounded="32"
              rows="4"
              class="mb-6"
              prepend-inner-icon="mdi-text-box-check-outline"
              hint="Esta información aparecerá en la página principal"
              persistent-hint
            />

            <v-btn
              type="submit"
              block
              color="primary"
              size="x-large"
              rounded="xl"
              class="font-weight-black"
              :loading="loading"
            >
              Guardar Cambios Globales
            </v-btn>
          </v-form>
        </v-card>

        <!-- Preview Card -->
        <v-alert
          type="info"
          variant="tonal"
          rounded="xl"
          icon="mdi-eye-outline"
          class="mb-8"
        >
          <div class="text-subtitle-2 font-weight-bold mb-1">Vista Previa</div>
          <div class="text-caption">Así es como los vecinos verán la información en el panel principal.</div>
        </v-alert>

        <v-card rounded="32" class="pa-8 bg-grey-darken-4 text-white elevation-24">
          <div class="text-overline text-grey-lighten-1 mb-2">Previsualización del Panel</div>
          <div class="text-h5 font-weight-black mb-4">{{ form.name || 'Sin nombre definido' }}</div>
          <div class="d-flex align-center text-grey-lighten-2 text-caption mb-6">
            <v-icon icon="mdi-map-marker" size="14" class="me-2" />
            {{ form.address || 'Sin dirección' }}
          </div>
          <p class="text-body-2 text-grey-lighten-3">{{ form.urbanization_details || 'Sin detalles configurados' }}</p>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="success" color="success" rounded="pill">
      Configuración guardada correctamente
    </v-snackbar>
  </v-container>
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

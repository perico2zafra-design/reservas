<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Profile Header -->
        <div class="text-center mb-10">
          <InitialAvatar 
            :name="authStore.user?.name" 
            :url="authStore.user?.avatar_url" 
            size="120" 
            variant="large"
            class="mb-4"
          />
          <h1 class="text-h4 font-weight-black text-slate-900">{{ authStore.user?.name }}</h1>
          <p class="text-slate-500">{{ authStore.user?.email }}</p>
          <v-chip size="small" :color="getStatusColor(authStore.user?.status || '')" class="mt-2 font-weight-black">
            CUENTA {{ authStore.user?.status }}
          </v-chip>
        </div>

        <!-- Settings Form -->
        <v-card rounded="32" class="pa-8 border-0 elevation-xl">
          <h2 class="text-h6 font-weight-black mb-6">Información Personal</h2>
          
          <v-form @submit.prevent="saveProfile">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.first_name"
                  label="Nombre"
                  variant="outlined"
                  rounded="xl"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.last_name"
                  label="Apellidos"
                  variant="outlined"
                  rounded="xl"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.avatar_url"
                  label="URL del Avatar"
                  variant="outlined"
                  rounded="xl"
                  prepend-inner-icon="mdi-link"
                />
              </v-col>
              
              <v-divider class="my-4 mx-3 opacity-10" />
              <v-col cols="12">
                <h3 class="text-subtitle-1 font-weight-bold mb-4">Ubicación en la Comunidad</h3>
              </v-col>
              
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.portal" label="Portal" variant="outlined" rounded="xl" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.floor" label="Piso" variant="outlined" rounded="xl" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.letter" label="Letra" variant="outlined" rounded="xl" />
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              block
              color="primary"
              size="x-large"
              rounded="xl"
              class="mt-6 font-weight-black"
              :loading="loading"
            >
              Guardar Cambios
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Success Snackbar -->
    <v-snackbar v-model="success" color="success" rounded="pill" elevation="24">
      Perfil actualizado correctamente
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/user.service'
import { getStatusColor } from '@/utils/formatters'
import InitialAvatar from '@/components/common/InitialAvatar.vue'
import type { User } from '@/types'

const authStore = useAuthStore()
const loading = ref(false)
const success = ref(false)

// Inicializar formulario con datos del store
const form = reactive({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
  avatar_url: authStore.user?.avatar_url || '',
  portal: authStore.user?.portal || '',
  floor: authStore.user?.floor || '',
  letter: authStore.user?.letter || ''
})

const saveProfile = async () => {
  loading.value = true
  try {
    const updatedUser = await userService.updateProfile(form)
    authStore.user = { ...authStore.user, ...updatedUser }
    success.value = true
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

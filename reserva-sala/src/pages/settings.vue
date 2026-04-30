<template>
  <div class="settings-page">
    <!-- Header Decorativo (Cover) -->
    <div class="profile-cover">
      <div class="mesh-gradient-overlay"></div>
    </div>

    <v-container class="profile-content pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          
          <!-- Profile Header Card -->
          <v-card rounded="32" class="profile-header-card pa-8 mb-8 elevation-24 border-0 text-center overflow-visible">
            <div class="avatar-wrapper mt-n16">
              <InitialAvatar 
                :name="authStore.user?.name" 
                :url="authStore.user?.avatar_url" 
                size="140" 
                variant="large"
                class="main-avatar"
              />
              <v-btn icon="mdi-camera-outline" color="primary" class="avatar-edit-btn" size="small" />
            </div>

            <h1 class="text-h3 font-weight-black text-slate-900 mt-6 mb-2">{{ authStore.user?.name }}</h1>
            <p class="text-subtitle-1 text-slate-500 mb-6">{{ authStore.user?.email }}</p>
            
            <div class="d-flex justify-center ga-3">
              <v-chip :color="getStatusColor(authStore.user?.status || '')" variant="flat" size="small" class="font-weight-black px-4">
                {{ authStore.user?.status }}
              </v-chip>
              <v-chip color="slate-100" variant="flat" size="small" class="text-slate-600 font-weight-black px-4">
                {{ authStore.user?.role }}
              </v-chip>
            </div>
          </v-card>

          <!-- Main Settings Card -->
          <v-card rounded="32" class="pa-8 pa-md-12 border-0 elevation-xl glass-card">
            <v-tabs v-model="tab" color="primary" class="mb-10" align-tabs="center">
              <v-tab value="personal" class="font-weight-black">
                <v-icon start icon="mdi-account-details-outline" /> Perfil
              </v-tab>
              <v-tab value="location" class="font-weight-black">
                <v-icon start icon="mdi-map-marker-outline" /> Vivienda
              </v-tab>
              <v-tab value="security" class="font-weight-black">
                <v-icon start icon="mdi-shield-lock-outline" /> Seguridad
              </v-tab>
            </v-tabs>

            <v-window v-model="tab">
              <!-- Tab 1: Personal -->
              <v-window-item value="personal">
                <div class="section-title mb-8">
                  <h2 class="text-h5 font-weight-black text-slate-900">Información Personal</h2>
                  <p class="text-body-2 text-slate-500">Actualiza tus datos básicos y tu imagen de perfil</p>
                </div>
                
                <v-form @submit.prevent="saveProfile">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="form.first_name" label="Nombre" variant="solo" rounded="xl" bg-color="slate-50" flat class="custom-field" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="form.last_name" label="Apellidos" variant="solo" rounded="xl" bg-color="slate-50" flat class="custom-field" />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="form.avatar_url" label="URL de tu foto" variant="solo" rounded="xl" bg-color="slate-50" flat prepend-inner-icon="mdi-link-variant" class="custom-field" />
                    </v-col>
                  </v-row>
                  <div class="d-flex justify-end mt-6">
                    <v-btn type="submit" color="primary" size="x-large" rounded="xl" class="px-10 font-weight-black" :loading="loading">
                      Guardar Cambios
                    </v-btn>
                  </div>
                </v-form>
              </v-window-item>

              <!-- Tab 2: Location -->
              <v-window-item value="location">
                <div class="section-title mb-8">
                  <h2 class="text-h5 font-weight-black text-slate-900">Ubicación</h2>
                  <p class="text-body-2 text-slate-500">Datos de tu vivienda en la comunidad</p>
                </div>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="form.portal" label="Portal" variant="solo" rounded="xl" bg-color="slate-50" flat class="custom-field" />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="form.floor" label="Piso" variant="solo" rounded="xl" bg-color="slate-50" flat class="custom-field" />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="form.letter" label="Letra" variant="solo" rounded="xl" bg-color="slate-50" flat class="custom-field" />
                  </v-col>
                </v-row>
                <div class="d-flex justify-end mt-6">
                  <v-btn color="primary" size="x-large" rounded="xl" class="px-10 font-weight-black" @click="saveProfile" :loading="loading">
                    Actualizar Vivienda
                  </v-btn>
                </div>
              </v-window-item>

              <!-- Tab 3: Security -->
              <v-window-item value="security">
                <div class="section-title mb-8">
                  <h2 class="text-h5 font-weight-black text-slate-900">Seguridad</h2>
                  <p class="text-body-2 text-slate-500">Maneja el acceso a tu cuenta</p>
                </div>
                <v-card variant="tonal" color="primary" rounded="xl" class="pa-6 mb-6">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-shield-check" size="40" class="me-4" />
                    <div>
                      <div class="text-subtitle-1 font-weight-black">Autenticación Protegida</div>
                      <div class="text-caption">Tu cuenta está vinculada a {{ authStore.user?.email }}</div>
                    </div>
                  </div>
                </v-card>
                <v-btn block variant="outlined" color="primary" rounded="xl" size="large" class="font-weight-black">
                  Cambiar Contraseña
                </v-btn>
              </v-window-item>
            </v-window>
          </v-card>

        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="success" color="success" rounded="pill" elevation="24">
      <v-icon icon="mdi-check-circle" class="me-2" />
      Perfil actualizado con éxito
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/user.service'
import { getStatusColor } from '@/utils/formatters'
import InitialAvatar from '@/components/common/InitialAvatar.vue'

const authStore = useAuthStore()
const loading = ref(false)
const success = ref(false)
const tab = ref('personal')

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

<style scoped>
.settings-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.profile-cover {
  height: 200px;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  position: relative;
  overflow: hidden;
}

.mesh-gradient-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 50%);
  filter: blur(40px);
}

.profile-content {
  margin-top: -100px;
  position: relative;
  z-index: 2;
}

.profile-header-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.main-avatar {
  border: 6px solid white !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
}

.glass-card {
  background: white !important;
  border: 1px solid rgba(0,0,0,0.05) !important;
}

.custom-field :deep(.v-field__input) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  font-weight: 500;
}

.v-tab {
  text-transform: none !important;
  letter-spacing: 0 !important;
}

@media (max-width: 600px) {
  .profile-content {
    margin-top: -80px;
    padding: 0 16px;
  }
  .text-h3 {
    font-size: 1.75rem !important;
  }
}
</style>

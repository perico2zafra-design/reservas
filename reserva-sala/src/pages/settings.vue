<template>
  <div class="profile-page pa-4">
    <!-- Header Premium -->
    <div class="text-center mb-10 pt-6">
      <div class="avatar-container d-inline-block position-relative mb-4">
        <v-avatar size="120" class="elevation-10 border-4 border-white shadow-xl">
          <v-img :src="profileForm.avatar_url || 'https://i.pravatar.cc/300?u=' + authStore.user?.id" cover />
        </v-avatar>
        <v-btn
          icon="mdi-camera"
          color="primary"
          size="small"
          class="position-absolute bottom-0 right-0 elevation-4"
          @click="triggerImageUpload"
        />
      </div>
      <h1 class="text-h4 font-weight-black text-slate-900">{{ profileForm.first_name }} {{ profileForm.last_name }}</h1>
      <p class="text-subtitle-2 text-slate-400">Vecino de Residencial Campus</p>
    </div>

    <!-- Secciones de Ajustes -->
    <v-card rounded="24" class="pa-6 border-0 elevation-xl mb-6">
      <div class="text-overline font-weight-black text-primary mb-4">DATOS PERSONALES</div>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="profileForm.first_name" label="Nombre" variant="filled" rounded="lg" hide-details class="mb-4" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="profileForm.last_name" label="Apellidos" variant="filled" rounded="lg" hide-details class="mb-4" />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="profileForm.email" label="Email" variant="filled" rounded="lg" hide-details disabled class="mb-4" />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="profileForm.phone" label="Teléfono de Contacto" variant="filled" rounded="lg" hide-details />
        </v-col>
      </v-row>
    </v-card>

    <v-card rounded="24" class="pa-6 border-0 elevation-xl mb-10">
      <div class="text-overline font-weight-black text-primary mb-4">TU VIVIENDA</div>
      <v-row>
        <v-col cols="4">
          <v-text-field v-model="profileForm.portal" label="Portal" variant="filled" rounded="lg" hide-details />
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="profileForm.floor" label="Piso" variant="filled" rounded="lg" hide-details />
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="profileForm.letter" label="Letra" variant="filled" rounded="lg" hide-details />
        </v-col>
      </v-row>
    </v-card>

    <!-- Botón Flotante de Guardar -->
    <div class="d-flex ga-4 mb-12">
      <v-btn
        block
        color="primary"
        size="x-large"
        rounded="xl"
        class="font-weight-black premium-btn"
        :loading="saving"
        @click="handleSave"
      >
        Guardar Cambios
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" color="success" rounded="pill">
      Perfil actualizado correctamente
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()
const saving = ref(false)
const snackbar = ref(false)

const profileForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  portal: '',
  floor: '',
  letter: '',
  avatar_url: ''
})

const fetchProfile = async () => {
  try {
    const res = await api.get('/auth/me')
    profileForm.value = { ...res.data }
  } catch (err) {
    console.error('Error fetching profile:', err)
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    await api.patch('/users/me', profileForm.value)
    snackbar.value = true
    // Actualizar datos en el store global
    authStore.user = { ...authStore.user, ...profileForm.value, name: `${profileForm.value.first_name} ${profileForm.value.last_name}` }
  } catch (err) {
    console.error('Error updating profile:', err)
  } finally {
    saving.value = false
  }
}

const triggerImageUpload = () => {
  // Simulación de subida: en un entorno real usaríamos un input file
  const url = prompt('Introduce la URL de tu nueva imagen de perfil:')
  if (url) profileForm.value.avatar_url = url
}

onMounted(fetchProfile)
</script>

<style scoped>
.avatar-container {
  border-radius: 50%;
}

.border-4 {
  border-width: 4px !important;
  border-style: solid !important;
}

.shadow-xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

.v-field--variant-filled {
  background: #f1f5f9 !important;
  border-radius: 16px !important;
}
</style>

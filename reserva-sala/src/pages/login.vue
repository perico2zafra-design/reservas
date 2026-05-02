<template>
  <v-container fluid class="fill-height pa-0 login-wrapper">
    <v-row no-gutters class="fill-height">
      <!-- Left Side: Luxury Hero Section -->
      <v-col
        cols="12"
        md="7"
        lg="8"
        class="d-none d-md-flex align-center justify-center hero-image-container"
      >
        <img src="@/assets/login-hero.png" alt="Luxury Meeting Room" class="hero-image" />
        <div class="hero-overlay d-flex flex-column justify-end pa-16">
          <div class="hero-content pb-10">
            <span class="text-overline text-white mb-2 d-block letter-spacing-lg">Residencial Campus</span>
            <h1 class="text-h1 text-playfair text-white font-weight-bold mb-6">Tu Hogar, <br/> Tu Espacio</h1>
            <p class="text-h5 text-white opacity-80 max-width-600 font-weight-light">
              Gestione las zonas comunes de su comunidad con total comodidad y elegancia.
            </p>
          </div>
        </div>
      </v-col>

      <!-- Right Side: Refined Login Form -->
      <v-col
        cols="12"
        md="5"
        lg="4"
        class="d-flex align-center justify-center bg-white"
      >
        <div class="pa-10 w-100 max-width-500">
          <div class="brand-header mb-10 d-flex align-center">
            <v-icon icon="mdi-shield-crown-outline" color="amber-darken-1" size="32" class="mr-3" />
            <span class="text-h6 font-weight-bold letter-spacing-lg text-uppercase">Residencial Campus</span>
          </div>

          <div class="mb-10">
            <h2 class="text-h3 text-playfair font-weight-bold mb-2">Iniciar Sesión</h2>
            <p class="text-body-1 text-muted">Acceda a su cuenta para gestionar sus reservas.</p>
          </div>

          <v-form @submit.prevent="handleLogin" v-model="valid">
            <v-text-field
              v-model="email"
              label="Correo Electrónico"
              placeholder="nombre@empresa.com"
              variant="underlined"
              class="mb-6 input-refined"
              color="primary"
              density="comfortable"
              :rules="[v => !!v || 'Obligatorio', v => /.+@.+\..+/.test(v) || 'Inválido']"
              required
            />

            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              variant="underlined"
              class="mb-8 input-refined"
              color="primary"
              density="comfortable"
              :rules="[v => !!v || 'Obligatorio']"
              required
            />

            <v-btn
              block
              color="primary"
              size="x-large"
              flat
              type="submit"
              :loading="authStore.loading"
              class="premium-btn mb-6"
              height="60"
            >
              Iniciar Sesión
            </v-btn>

            <div class="d-flex justify-space-between align-center mt-4">
              <router-link to="/forgot-password" class="text-caption text-muted text-decoration-none hover-primary">
                ¿Olvidó su contraseña?
              </router-link>
              
              <router-link to="/register" class="text-caption font-weight-bold text-primary text-decoration-none">
                Registrarse
              </router-link>
            </div>
          </v-form>
          
          <div class="mt-16 pt-8 border-top text-center">
            <p class="text-caption text-muted">© 2026 Residencial Campus Elite. Todos los derechos reservados.</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const email = ref('')
const password = ref('')
const valid = ref(false)

const handleLogin = async () => {
  if (!valid.value) return
  
  try {
    appStore.setLoading(true)
    await authStore.login({ email: email.value, password: password.value })
    appStore.showSuccess('¡Bienvenido de nuevo!')
    router.push('/')
  } catch (error: any) {
    console.error('Login failed:', error)
    appStore.showError(error.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.')
  } finally {
    appStore.setLoading(false)
  }
}
</script>

<style scoped>
.login-wrapper {
  background-color: #fff;
  overflow: hidden;
}

.hero-image-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: slowZoom 20s infinite alternate ease-in-out;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%);
  z-index: 2;
}

.hero-content {
  z-index: 3;
  max-width: 800px;
}

.max-width-500 {
  max-width: 500px;
}

.max-width-600 {
  max-width: 600px;
}

.opacity-80 {
  opacity: 0.8;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.hover-primary:hover {
  color: var(--primary) !important;
}

@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .login-wrapper {
    background: #fff;
  }
}
</style>

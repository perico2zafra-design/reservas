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
        <img
          src="@/assets/login-hero.png"
          alt="Luxury Meeting Room"
          class="hero-image"
        />
        <div class="hero-overlay d-flex flex-column justify-end pa-16">
          <div class="hero-content pb-10">
            <span
              class="text-overline text-white mb-2 d-block letter-spacing-lg"
              >Residencial Campus</span
            >
            <h1 class="text-h1 text-playfair text-white font-weight-bold mb-6">
              Tu Hogar, <br />
              Tu Espacio
            </h1>
            <p
              class="text-h5 text-white opacity-80 max-width-600 font-weight-light"
            >
              Recuperar su acceso es sencillo y seguro. Estamos aquí para
              ayudarle.
            </p>
          </div>
        </div>
      </v-col>

      <!-- Right Side: Refined Recover Form -->
      <v-col
        cols="12"
        md="5"
        lg="4"
        class="d-flex align-center justify-center bg-white"
      >
        <div class="pa-10 w-100 max-width-500">
          <div class="brand-header mb-10 d-flex align-center">
            <v-icon
              icon="mdi-shield-crown-outline"
              color="amber-darken-1"
              size="32"
              class="mr-3"
            />
            <span
              class="text-h6 font-weight-bold letter-spacing-lg text-uppercase"
              >Residencial Campus</span
            >
          </div>

          <div class="mb-10">
            <h2 class="text-h3 text-playfair font-weight-bold mb-2">
              Recuperar Contraseña
            </h2>
            <p class="text-body-1 text-muted">
              Introduzca su correo para restablecer su contraseña.
            </p>
          </div>

          <v-form
            v-if="!submitted"
            @submit.prevent="handleSubmit"
            v-model="valid"
          >
            <v-text-field
              v-model="email"
              label="Correo Electrónico"
              placeholder="nombre@empresa.com"
              variant="underlined"
              class="mb-8 input-refined"
              color="primary"
              density="comfortable"
              hide-details="auto"
              :rules="[
                (v) => !!v || 'Obligatorio',
                (v) => /.+@.+\..+/.test(v) || 'Inválido',
              ]"
              required
            />

            <v-btn
              block
              color="primary"
              size="x-large"
              flat
              type="submit"
              :loading="loading"
              class="premium-btn mb-6"
              height="60"
            >
              Enviar Instrucciones
            </v-btn>

            <div class="text-center mt-4">
              <router-link
                to="/login"
                class="text-caption font-weight-bold text-primary text-decoration-none"
              >
                Volver al Inicio de Sesión
              </router-link>
            </div>
          </v-form>

          <div v-else class="text-center">
            <v-icon
              icon="mdi-email-check-outline"
              color="success"
              size="64"
              class="mb-6"
            />
            <h3 class="text-h4 text-playfair mb-4">Correo Enviado</h3>
            <p class="text-body-1 text-muted mb-10">
              Si existe una cuenta asociada a ese correo, recibirá las
              instrucciones de restablecimiento en breve.
            </p>
            <v-btn
              block
              variant="outlined"
              color="primary"
              size="large"
              to="/login"
              class="premium-btn"
              height="50"
            >
              Regresar al Portal
            </v-btn>
          </div>

          <div class="mt-16 pt-8 border-top text-center">
            <p class="text-caption text-muted">
              © 2026 Residencial Campus Elite. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authService } from "@/services/auth.service";

const email = ref("");
const valid = ref(false);
const loading = ref(false);
const submitted = ref(false);

const handleSubmit = async () => {
  if (!valid.value) return;

  loading.value = true;
  try {
    await authService.forgotPassword(email.value);
    submitted.value = true;
  } catch (error) {
    // Security best practice: don't reveal if email exists
    submitted.value = true;
  } finally {
    loading.value = false;
  }
};
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
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.9) 0%,
    rgba(15, 23, 42, 0.2) 60%,
    transparent 100%
  );
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

@keyframes slowZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

@media (max-width: 960px) {
  .login-wrapper {
    background: #fff;
  }
}
</style>

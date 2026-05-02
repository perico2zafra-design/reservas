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
              Únase a la plataforma de gestión de espacios más exclusiva de su
              comunidad.
            </p>
          </div>
        </div>
      </v-col>

      <!-- Right Side: Refined Register Form -->
      <v-col
        cols="12"
        md="5"
        lg="4"
        class="d-flex align-center justify-center bg-white"
      >
        <div
          class="pa-10 w-100 max-width-500 fill-height d-flex flex-column justify-center"
        >
          <div class="brand-header mb-4 d-flex align-center">
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

          <div class="mb-6">
            <h2 class="text-h3 text-playfair font-weight-bold mb-2">
              Registrarse
            </h2>
            <p class="text-body-1 text-muted">
              Cree su cuenta para comenzar a reservar.
            </p>
          </div>

          <v-form @submit.prevent="handleRegister" v-model="valid">
            <v-row density="comfortable">
              <v-col cols="6">
                <v-text-field
                  v-model="firstName"
                  label="Nombre"
                  variant="underlined"
                  class="mb-3 input-refined"
                  color="primary"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Obligatorio']"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="lastName"
                  label="Apellidos"
                  variant="underlined"
                  class="mb-3 input-refined"
                  color="primary"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Obligatorio']"
                  required
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="address"
              label="Dirección"
              variant="underlined"
              class="mb-3 input-refined"
              color="primary"
              density="comfortable"
              :rules="[(v) => !!v || 'Obligatorio']"
              required
            />

            <v-row density="comfortable">
              <v-col cols="4">
                <v-text-field
                  v-model="portal"
                  label="Portal"
                  variant="underlined"
                  class="mb-3 input-refined"
                  color="primary"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="floor"
                  label="Piso"
                  variant="underlined"
                  class="mb-3 input-refined"
                  color="primary"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="letter"
                  label="Letra"
                  variant="underlined"
                  class="mb-3 input-refined"
                  color="primary"
                  density="comfortable"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="email"
              label="Correo Electrónico"
              placeholder="nombre@empresa.com"
              variant="underlined"
              class="mb-3 input-refined"
              color="primary"
              density="comfortable"
              :rules="[
                (v) => !!v || 'Obligatorio',
                (v) => /.+@.+\..+/.test(v) || 'Inválido',
              ]"
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
              :rules="[
                (v) => !!v || 'Obligatorio',
                (v) => v.length >= 6 || 'Min 6 carac.',
              ]"
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
              Registrarse
            </v-btn>

            <div class="text-center mt-4">
              <span class="text-caption text-muted">¿Ya tiene cuenta? </span>
              <router-link
                to="/login"
                class="text-caption font-weight-bold text-primary text-decoration-none"
              >
                Iniciar Sesión
              </router-link>
            </div>
          </v-form>

          <div class="mt-10 pt-6 border-top text-center">
            <p class="text-caption text-muted">
              © 2026 Residencial Campus Elite. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="showError" color="error" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const address = ref("");
const portal = ref("");
const floor = ref("");
const letter = ref("");
const phone = ref("");
const valid = ref(false);
const showError = ref(false);
const errorMessage = ref("");

const handleRegister = async () => {
  if (!valid.value) return;

  try {
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      address: address.value,
      portal: portal.value,
      floor: floor.value,
      letter: letter.value,
      phone: phone.value,
    });
    router.push("/login?registered=true");
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Error en el registro";
    showError.value = true;
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

.overflow-y-auto {
  overflow-y: auto;
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

<template>
  <div class="settings-page">
    <!-- Header Decorativo con Mesh Gradient Animado -->
    <div class="profile-cover">
      <div class="mesh-gradient-overlay"></div>
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        color="white"
        class="back-btn-profile d-md-none"
        @click="$router.back()"
      />
    </div>

    <v-container class="profile-content pb-16 px-4 px-md-6">
      <v-row justify="center">
        <v-col cols="12" lg="10" xl="8">
          <!-- Profile Header Card: La "Cara" del usuario -->
          <v-card
            rounded="32"
            class="profile-header-card pa-6 pa-md-10 mb-8 elevation-24 border-0 overflow-visible"
          >
            <v-row align="center" class="text-center text-md-left">
              <v-col cols="12" md="auto" class="d-flex justify-center">
                <div class="avatar-wrapper mt-n16 mt-md-0">
                  <div class="avatar-glow"></div>
                  <InitialAvatar
                    :name="authStore.user?.name"
                    :url="authStore.user?.avatar_url"
                    size="150"
                    variant="large"
                    class="main-avatar-pro"
                  />
                  <v-btn
                    icon="mdi-camera-plus"
                    color="primary"
                    class="avatar-edit-badge"
                    size="small"
                    elevation="8"
                  />
                </div>
              </v-col>

              <v-col cols="12" md class="ps-md-8">
                <div
                  class="d-flex align-center justify-center justify-md-start mb-2 flex-wrap ga-2"
                >
                  <h1
                    class="text-h3 font-weight-black text-slate-900 leading-tight"
                  >
                    {{ authStore.user?.name }}
                  </h1>
                  <v-icon
                    icon="mdi-check-decagram"
                    color="primary"
                    size="28"
                    class="ms-2"
                  />
                </div>
                <p
                  class="text-subtitle-1 text-slate-500 font-weight-medium mb-6"
                >
                  {{ authStore.user?.email }}
                </p>

                <div
                  class="d-flex justify-center justify-md-start ga-3 flex-wrap"
                >
                  <v-chip
                    color="success-lighten-4"
                    class="text-success font-weight-black px-4"
                    size="small"
                    variant="flat"
                  >
                    <v-icon start icon="mdi-shield-check" />
                    {{ authStore.user?.status }}
                  </v-chip>
                  <v-chip
                    color="primary-lighten-5"
                    class="text-primary font-weight-black px-4"
                    size="small"
                    variant="flat"
                  >
                    <v-icon start icon="mdi-account-tie" />
                    {{ authStore.user?.role }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Navigation Tabs: Estilo Cápsula -->
          <div class="tabs-container-premium mb-8">
            <v-tabs
              v-model="tab"
              color="primary"
              align-tabs="center"
              hide-slider
              class="custom-tabs-pill"
            >
              <v-tab value="personal" class="pill-tab">
                <v-icon start icon="mdi-account-circle-outline" /> Perfil
              </v-tab>
              <v-tab value="location" class="pill-tab">
                <v-icon start icon="mdi-home-outline" /> Vivienda
              </v-tab>
              <v-tab value="security" class="pill-tab">
                <v-icon start icon="mdi-lock-outline" /> Seguridad
              </v-tab>
            </v-tabs>
          </div>

          <!-- Content Card -->
          <v-card
            rounded="32"
            class="pa-8 pa-md-12 border-0 shadow-soft-xl bg-white position-relative overflow-hidden"
          >
            <div class="card-bg-decoration"></div>

            <v-window v-model="tab" class="position-relative z-10">
              <!-- SECCIÓN PERSONAL -->
              <v-window-item value="personal">
                <div class="d-flex align-center mb-10">
                  <div class="icon-box-pro me-4">
                    <v-icon icon="mdi-account-edit-outline" color="primary" />
                  </div>
                  <div>
                    <h2 class="text-h5 font-weight-black text-slate-900">
                      Datos Personales
                    </h2>
                    <p class="text-caption text-slate-400">
                      Gestiona cómo te ven los demás vecinos
                    </p>
                  </div>
                </div>

                <v-form @submit.prevent="saveProfile">
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="pro-label">Nombre</div>
                      <v-text-field
                        v-model="form.first_name"
                        variant="solo"
                        rounded="xl"
                        bg-color="slate-50"
                        flat
                        class="pro-input"
                        prepend-inner-icon="mdi-account-outline"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="pro-label">Apellidos</div>
                      <v-text-field
                        v-model="form.last_name"
                        variant="solo"
                        rounded="xl"
                        bg-color="slate-50"
                        flat
                        class="pro-input"
                        prepend-inner-icon="mdi-account-outline"
                      />
                    </v-col>
                    <v-col cols="12">
                      <div class="pro-label">URL de Fotografía</div>
                      <v-text-field
                        v-model="form.avatar_url"
                        variant="solo"
                        rounded="xl"
                        bg-color="slate-50"
                        flat
                        class="pro-input"
                        prepend-inner-icon="mdi-image-edit-outline"
                        placeholder="https://..."
                      />
                    </v-col>
                  </v-row>

                  <div class="d-flex justify-end mt-8">
                    <v-btn
                      type="submit"
                      color="primary"
                      size="x-large"
                      rounded="xl"
                      class="px-12 font-weight-black elevation-12"
                      :loading="loading"
                    >
                      Actualizar Perfil
                    </v-btn>
                  </div>
                </v-form>
              </v-window-item>

              <!-- SECCIÓN VIVIENDA -->
              <v-window-item value="location">
                <div class="d-flex align-center mb-10">
                  <div class="icon-box-pro me-4">
                    <v-icon
                      icon="mdi-map-marker-radius-outline"
                      color="primary"
                    />
                  </div>
                  <div>
                    <h2 class="text-h5 font-weight-black text-slate-900">
                      Ubicación Residencial
                    </h2>
                    <p class="text-caption text-slate-400">
                      Datos verificados de tu propiedad
                    </p>
                  </div>
                </div>

                <v-row>
                  <v-col cols="12" md="4">
                    <div class="pro-label">Portal</div>
                    <v-text-field
                      v-model="form.portal"
                      variant="solo"
                      rounded="xl"
                      bg-color="slate-50"
                      flat
                      class="pro-input"
                    />
                  </v-col>
                  <v-col cols="6" md="4">
                    <div class="pro-label">Piso</div>
                    <v-text-field
                      v-model="form.floor"
                      variant="solo"
                      rounded="xl"
                      bg-color="slate-50"
                      flat
                      class="pro-input"
                    />
                  </v-col>
                  <v-col cols="6" md="4">
                    <div class="pro-label">Letra</div>
                    <v-text-field
                      v-model="form.letter"
                      variant="solo"
                      rounded="xl"
                      bg-color="slate-50"
                      flat
                      class="pro-input"
                    />
                  </v-col>
                </v-row>

                <div class="d-flex justify-end mt-8">
                  <v-btn
                    color="primary"
                    size="x-large"
                    rounded="xl"
                    class="px-12 font-weight-black elevation-12"
                    @click="saveProfile"
                    :loading="loading"
                  >
                    Guardar Ubicación
                  </v-btn>
                </div>
              </v-window-item>

              <!-- SECCIÓN SEGURIDAD -->
              <v-window-item value="security">
                <div class="d-flex align-center mb-10">
                  <div class="icon-box-pro me-4">
                    <v-icon icon="mdi-shield-lock-outline" color="primary" />
                  </div>
                  <div>
                    <h2 class="text-h5 font-weight-black text-slate-900">
                      Seguridad
                    </h2>
                    <p class="text-caption text-slate-400">
                      Protege el acceso a tu cuenta
                    </p>
                  </div>
                </div>

                <v-card
                  variant="outlined"
                  border="primary dashed"
                  rounded="24"
                  class="pa-8 mb-8 text-center"
                >
                  <v-icon
                    icon="mdi-email-check-outline"
                    color="primary"
                    size="56"
                    class="mb-4"
                  />
                  <div class="text-h6 font-weight-black mb-1">
                    Email Verificado
                  </div>
                  <div class="text-body-2 text-slate-500 mb-6">
                    {{ authStore.user?.email }}
                  </div>
                  <v-btn
                    variant="tonal"
                    color="primary"
                    rounded="xl"
                    class="font-weight-black"
                  >
                    Cambiar Email de Acceso
                  </v-btn>
                </v-card>

                <v-btn
                  block
                  variant="flat"
                  color="slate-900"
                  rounded="xl"
                  size="x-large"
                  class="text-white font-weight-black py-4"
                >
                  Actualizar Contraseña
                </v-btn>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="success" color="success" rounded="pill" elevation="24">
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle-outline" class="me-3" />
        <span class="font-weight-bold">Cambios guardados correctamente</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { userService } from "@/services/user.service";
import InitialAvatar from "@/components/common/InitialAvatar.vue";

const authStore = useAuthStore();
const loading = ref(false);
const success = ref(false);
const tab = ref("personal");

const form = reactive({
  first_name: authStore.user?.first_name || "",
  last_name: authStore.user?.last_name || "",
  avatar_url: authStore.user?.avatar_url || "",
  portal: authStore.user?.portal || "",
  floor: authStore.user?.floor || "",
  letter: authStore.user?.letter || "",
});

const saveProfile = async () => {
  loading.value = true;
  try {
    const updatedUser = await userService.updateProfile(form);
    authStore.user = { ...authStore.user, ...updatedUser };
    success.value = true;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.settings-page {
  background-color: #f1f5f9;
  min-height: 100vh;
}

.profile-cover {
  height: 250px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  overflow: hidden;
}

.mesh-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(
      circle at 10% 20%,
      rgba(99, 102, 241, 0.2) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(168, 85, 247, 0.2) 0%,
      transparent 40%
    );
  filter: blur(50px);
}

.profile-content {
  margin-top: -120px;
  position: relative;
  z-index: 5;
}

/* Tarjeta de Cabecera Pro */
.profile-header-card {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
}

.avatar-wrapper {
  position: relative;
}
.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.2) 0%,
    transparent 70%
  );
  z-index: -1;
}
.main-avatar-pro {
  border: 8px solid white !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  transition: transform 0.3s ease;
}
.main-avatar-pro:hover {
  transform: scale(1.05);
}

.avatar-edit-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  border: 3px solid white !important;
}

/* Tabs Estilo Cápsula */
.tabs-container-premium {
  display: flex;
  justify-content: center;
}
.custom-tabs-pill {
  background: rgba(255, 255, 255, 0.5);
  padding: 6px;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.pill-tab {
  border-radius: 40px !important;
  text-transform: none !important;
  font-weight: 700 !important;
  color: #64748b !important;
  transition: all 0.3s ease !important;
  margin: 0 4px;
}
.v-tab--selected {
  background: white !important;
  color: #6366f1 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

/* Inputs Pro */
.pro-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  margin-left: 12px;
}
.pro-input :deep(.v-field) {
  border: 2px solid transparent !important;
  transition: all 0.3s ease !important;
}
.pro-input :deep(.v-field--focused) {
  border-color: rgba(99, 102, 241, 0.3) !important;
  background: white !important;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.05) !important;
}

.icon-box-pro {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-bg-decoration {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.03) 0%,
    transparent 70%
  );
}

.shadow-soft-xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05) !important;
}

@media (max-width: 600px) {
  .profile-content {
    margin-top: -100px;
  }
  .text-h3 {
    font-size: 1.8rem !important;
  }
  .main-avatar-pro {
    width: 120px !important;
    height: 120px !important;
  }
}
</style>

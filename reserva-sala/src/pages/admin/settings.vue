<template>
  <div class="admin-settings-page-ultimate">
    <!-- Mesh Background Decor -->
    <div class="elite-mesh-background"></div>
    <div class="elite-top-accent"></div>

    <v-container
      class="pt-6 pb-6 px-4 px-md-10 main-content-limit position-relative z-10"
    >
      <!-- Header Section -->
      <v-row no-gutters align="center" class="mb-8">
        <v-col cols="12" md="8" class="d-flex align-center">
          <div class="elite-gold-marker-thick me-5"></div>
          <div>
            <h1 class="page-title-ultimate text-playfair mb-1">
              Configuración
            </h1>
            <div class="d-flex align-center">
              <v-chip
                size="x-small"
                color="amber-darken-3"
                variant="flat"
                class="me-3 font-weight-black"
                >PORTAL ELITE</v-chip
              >
              <span
                class="text-caption text-slate-400 font-weight-bold uppercase-track"
                >Gestión de Identidad & Normativa</span
              >
            </div>
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="12" md="auto" class="mt-6 mt-md-0">
          <v-btn
            color="#0f172a"
            class="text-white font-weight-black elite-btn-premium shadow-amber"
            rounded="xl"
            height="52"
            min-width="200"
            prepend-icon="mdi-pencil-box-outline"
            @click="editModal = true"
          >
            EDITAR PORTAL
          </v-btn>
        </v-col>
      </v-row>

      <!-- Main Layout -->
      <v-row>
        <v-col cols="12" lg="8">
          <SiteInfoCard :settings="settings" />
        </v-col>

        <v-col cols="12" lg="4">
          <SitePreviewCard :settings="settings" />
        </v-col>
      </v-row>
    </v-container>

    <!-- PREMIUM EDIT MODAL -->
    <SiteSettingsModal
      v-model="editModal"
      :settings="settings"
      :loading="loading"
      @save="saveSettings"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { siteService } from "@/services/site.service";
import { useAppStore } from "@/stores/app";
import type { SiteSettings } from "@/types";
import SiteSettingsModal from "@/components/admin/modals/SiteSettingsModal.vue";
import SiteInfoCard from "@/components/admin/SiteInfoCard.vue";
import SitePreviewCard from "@/components/admin/SitePreviewCard.vue";

const appStore = useAppStore();
const loading = ref(false);
const editModal = ref(false);
const settings = ref<Partial<SiteSettings>>({});

const fetchSettings = async () => {
  try {
    settings.value = await siteService.getSettings();
  } catch (err) {
    console.error("Error al cargar ajustes:", err);
  }
};

const saveSettings = async (formData: Partial<SiteSettings>) => {
  loading.value = true;
  try {
    await siteService.updateSettings(formData);
    await fetchSettings();
    appStore.showSnackbar("Configuración del portal actualizada", "success");
    editModal.value = false;
  } catch (err) {
    appStore.showSnackbar("Fallo al guardar la configuración", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSettings);
</script>

<style scoped>
.admin-settings-page-ultimate {
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
}

.elite-mesh-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      circle at 0% 0%,
      rgba(212, 175, 55, 0.05) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 100% 100%,
      rgba(15, 23, 42, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.elite-top-accent {
  height: 4px;
  background: linear-gradient(to right, #d4af37, #fbbf24, #d4af37);
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.2);
}

.z-10 {
  z-index: 10;
}

.elite-gold-marker-thick {
  width: 6px;
  height: 50px;
  background: linear-gradient(to bottom, #d4af37, #fbbf24);
  border-radius: 10px;
}

.page-title-ultimate {
  font-size: 2.25rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #0f172a;
}

.elite-btn-premium {
  letter-spacing: 1.5px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.shadow-amber:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px -10px rgba(212, 175, 55, 0.4) !important;
}

.uppercase-track {
  letter-spacing: 1px;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .page-title-ultimate {
    font-size: 1.75rem;
  }
}
</style>


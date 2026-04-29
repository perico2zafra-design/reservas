<template>
  <div class="workspace-explorer">
    <!-- Hero Section -->
    <div class="hero-section mb-12">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="7">
            <h1 class="text-h2 font-weight-black mb-4 text-white">
              Encuentra tu <span class="text-primary-light">espacio ideal</span>
            </h1>
            <p class="text-h6 text-white opacity-80 mb-8 font-weight-medium">
              Reserva salas de reuniones, laboratorios y espacios creativos en segundos.
            </p>
            
            <!-- Search Bar Pro -->
            <v-card rounded="pill" class="search-bar-pro pa-2 elevation-8 border-0">
              <v-row no-gutters align="center">
                <v-col cols="8">
                  <v-text-field
                    v-model="search"
                    placeholder="¿En qué edificio o zona quieres estar?"
                    variant="plain"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    class="ms-4"
                  />
                </v-col>
                <v-divider vertical class="mx-4 my-2" />
                <v-col cols="4" class="text-right">
                  <v-btn color="primary" rounded="pill" size="large" class="text-none font-weight-black px-8">
                    Explorar
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          
          <!-- Quick Stats Overlay -->
          <v-col cols="12" md="5" class="d-none d-md-block">
            <div class="quick-stats-grid">
              <v-card class="stat-overlay-card pa-6 mb-4 glass-dark text-white" rounded="xl">
                <div class="text-overline opacity-70">Salas Libres Ahora</div>
                <div class="text-h4 font-weight-black">12 <v-icon icon="mdi-check-decagram" color="success" size="24" /></div>
              </v-card>
              <v-card class="stat-overlay-card pa-6 glass-dark text-white" rounded="xl">
                <div class="text-overline opacity-70">Tus Reservas Hoy</div>
                <div class="text-h4 font-weight-black">2</div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container>
      <div class="d-flex align-center mb-8">
        <div>
          <h2 class="text-h4 font-weight-black text-gradient">Nuestros Edificios</h2>
          <p class="text-subtitle-1 text-medium-emphasis">Selecciona un bloque para gestionar sus espacios.</p>
        </div>
        <v-spacer />
        <v-btn
          v-if="authStore.isAdmin"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-plus"
          rounded="xl"
          class="font-weight-black"
          @click="openBlockModal()"
        >
          Añadir Bloque
        </v-btn>
      </div>

      <!-- Blocks Grid -->
      <v-row v-if="!loading">
        <v-col v-for="block in filteredBlocks" :key="block.id" cols="12" sm="6" lg="4">
          <v-card rounded="xl" class="premium-block-card overflow-hidden elevation-2 border-0" @click="$router.push('/block/' + block.id)">
            <v-img :src="block.image" height="280" cover class="align-end">
              <div class="pa-6 block-card-content">
                <v-chip size="x-small" color="primary" variant="flat" class="mb-2 font-weight-black shadow-sm">EDIFICIO PRO</v-chip>
                <h3 class="text-h5 font-weight-black text-white mb-1">{{ block.name }}</h3>
                <div class="d-flex align-center text-white opacity-80 text-caption">
                  <v-icon icon="mdi-map-marker" size="14" class="me-1" />
                  {{ block.location }}
                </div>
              </div>
              
              <!-- Admin Actions Overlay -->
              <div class="admin-actions pa-2" v-if="authStore.isAdmin" @click.stop>
                <v-btn icon="mdi-pencil" size="x-small" color="white" variant="flat" class="me-1" @click="openBlockModal(block)" />
                <v-btn icon="mdi-delete" size="x-small" color="error" variant="flat" @click="confirmDelete(block)" />
              </div>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Block Modal -->
    <v-dialog v-model="blockModal" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="pa-6 font-weight-bold">
          {{ editedBlock.id ? 'Editar Bloque' : 'Nuevo Bloque' }}
        </v-card-title>
        <v-card-text class="px-6 pb-6">
          <v-form ref="form">
            <v-text-field v-model="editedBlock.name" label="Nombre" variant="outlined" rounded="lg" class="mb-4" />
            <v-text-field v-model="editedBlock.location" label="Ubicación" variant="outlined" rounded="lg" class="mb-4" />
            <v-textarea v-model="editedBlock.description" label="Descripción" variant="outlined" rounded="lg" class="mb-4" />
            <v-text-field v-model="editedBlock.image" label="URL de Imagen" variant="outlined" rounded="lg" />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="blockModal = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" rounded="lg" @click="saveBlock" :loading="saving">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="pa-6 font-weight-bold">¿Eliminar Bloque?</v-card-title>
        <v-card-text class="px-6">
          Esta acción no se puede deshacer. Se eliminarán todas las salas asociadas.
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" rounded="lg" @click="doDelete" :loading="saving">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import type { Block } from '@/types'

const authStore = useAuthStore()
const bookingStore = useBookingStore()
const search = ref('')
const loading = computed(() => bookingStore.isLoading)
const blocks = computed(() => bookingStore.blocks)
const saving = ref(false)

const filteredBlocks = computed(() => {
  if (!search.value) return blocks.value
  return blocks.value.filter(b => 
    b.name.toLowerCase().includes(search.value.toLowerCase()) ||
    b.location.toLowerCase().includes(search.value.toLowerCase())
  )
})

const blockModal = ref(false)
const deleteDialog = ref(false)
const editedBlock = ref<Partial<Block>>({})
const blockToDelete = ref<Block | null>(null)

const fetchBlocks = async () => {
  await bookingStore.fetchBlocks()
}

const openBlockModal = (block?: Block) => {
  editedBlock.value = block ? { ...block } : { image: 'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000) }
  blockModal.value = true
}

const saveBlock = async () => {
  saving.value = true
  // Note: For simplicity using store's fetch after mock action
  await fetchBlocks()
  blockModal.value = false
  saving.value = false
}

const confirmDelete = (block: Block) => {
  blockToDelete.value = block
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!blockToDelete.value) return
  saving.value = true
  await fetchBlocks()
  deleteDialog.value = false
  saving.value = false
}

onMounted(fetchBlocks)
</script>

<style scoped>
.workspace-explorer {
  margin-top: -40px;
}

.hero-section {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  padding: 100px 0 80px 0;
  border-radius: 0 0 60px 60px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
  opacity: 0.1;
}

.search-bar-pro {
  background: white !important;
  max-width: 600px;
}

.glass-dark {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.text-primary-light {
  color: #4fc3f7;
}

.premium-block-card {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.premium-block-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
}

.block-card-content {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
}

.admin-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
  border-radius: 40px;
  opacity: 0;
  transition: opacity 0.3s;
}

.premium-block-card:hover .admin-actions {
  opacity: 1;
}

.shadow-sm {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>

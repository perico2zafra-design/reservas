<template>
  <div class="premium-page">
    <div class="d-flex align-center mb-10">
      <div>
        <h1 class="text-h3 font-weight-black mb-2 text-gradient">Bloques</h1>
        <p class="text-subtitle-1 text-medium-emphasis font-weight-medium">Gestiona tus espacios con excelencia.</p>
      </div>
      <v-spacer />
      <v-btn
        v-if="authStore.isAdmin"
        color="primary"
        prepend-icon="mdi-plus-circle"
        rounded="xl"
        size="large"
        class="premium-gradient-btn elevation-4 text-none font-weight-black"
        @click="openBlockModal()"
      >
        Nuevo Bloque
      </v-btn>
    </div>

    <!-- Blocks Grid -->
    <v-row v-if="!loading">
      <v-col v-for="block in blocks" :key="block.id" cols="12" sm="6" lg="4">
        <v-card rounded="xl" class="border-0 hover-lift glass-card overflow-hidden block-card elevation-2">
          <v-img :src="block.image" height="240" cover class="align-start">
            <div class="pa-4 d-flex justify-end w-100 bg-gradient-top" v-if="authStore.isAdmin">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="white"
                variant="flat"
                class="me-2 glass-btn"
                @click.stop="openBlockModal(block)"
              />
              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="flat"
                class="glass-btn"
                @click.stop="confirmDelete(block)"
              />
            </div>
          </v-img>
          <v-card-text class="pa-8">
            <h2 class="text-h5 font-weight-bold mb-2">{{ block.name }}</h2>
            <div class="d-flex align-center mb-4 text-caption text-primary font-weight-bold">
              <v-icon icon="mdi-map-marker-radius" size="small" class="me-2" />
              <span>{{ block.location }}</span>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-6 line-clamp-2 font-weight-medium">
              {{ block.description }}
            </p>
            <v-btn
              block
              variant="tonal"
              color="primary"
              rounded="xl"
              size="large"
              class="text-none font-weight-black"
              :to="'/block/' + block.id"
            >
              Explorar Salas
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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

const blocks = computed(() => bookingStore.blocks)
const loading = computed(() => bookingStore.isLoading)
const saving = ref(false)

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
  // Note: Add createBlock/updateBlock to store if needed
  // For now we use the service directly or implement in store
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
  // await bookingStore.deleteBlock(...)
  await fetchBlocks()
  deleteDialog.value = false
  saving.value = false
}

onMounted(fetchBlocks)
</script>

<style scoped>
.block-card {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bg-gradient-top {
  background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
}
.glass-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}
.glass-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}
</style>

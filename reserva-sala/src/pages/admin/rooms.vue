<template>
  <div class="admin-rooms-page-elite">
    <div class="elite-top-accent"></div>

    <v-container class="pt-6 pb-12 px-4 px-md-10 main-content-limit">
      <!-- Header Section -->
      <v-row no-gutters align="center" class="mb-10">
        <v-col cols="12" md="6" class="d-flex mb-4 mb-md-0">
          <div class="elite-gold-marker me-4 align-self-stretch"></div>
          <div>
            <h1 class="page-title-elite text-slate-900 text-playfair mb-1 mt-0">Instalaciones</h1>
            <p class="text-caption text-slate-500 font-weight-bold text-uppercase letter-spacing-lg">Gestión de Espacios Comunes</p>
          </div>
        </v-col>

        <v-spacer class="d-none d-md-block"></v-spacer>

        <v-col cols="12" md="auto">
          <v-btn
            prepend-icon="mdi-plus"
            height="54"
            rounded="xl"
            class="btn-elite-gold-action px-8"
            @click="openRoomDialog()"
          >
            AÑADIR INSTALACIÓN
          </v-btn>
        </v-col>
      </v-row>

      <!-- Lista de Salas Usando RoomCard -->
      <v-row>
        <v-col v-for="room in bookingStore.rooms" :key="room.id" cols="12" sm="6" lg="4">
          <v-fade-transition>
            <RoomCard
              :name="room.name"
              :image="room.image"
              :deposit="room.deposit_amount"
              :capacity="room.capacity"
              height="340"
              class="room-card-elite"
            >
              <template #top-right>
                <div class="d-flex ga-2 action-pills">
                  <v-btn icon="mdi-pencil-outline" size="x-small" color="white" variant="flat" class="action-pill-btn" @click.stop="openRoomDialog(room)" />
                  <v-btn icon="mdi-trash-can-outline" size="x-small" color="white" variant="flat" class="action-pill-btn danger" @click.stop="confirmDelete(room)" />
                </div>
              </template>
              <template #footer>
                <div class="d-flex align-center mt-4">
                  <div :class="['status-badge', room.is_active ? 'active' : 'inactive']">
                    {{ room.is_active ? 'DISPONIBLE' : 'MANTENIMIENTO' }}
                  </div>
                </div>
              </template>
            </RoomCard>
          </v-fade-transition>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div v-if="bookingStore.rooms.length === 0" class="empty-state-premium py-16 px-6">
        <v-icon icon="mdi-office-building-cog-outline" size="64" color="slate-200" class="mb-4" />
        <h2 class="text-h6 font-weight-black text-slate-400">No hay instalaciones configuradas todavía</h2>
      </div>
    </v-container>

    <!-- Diálogo de Edición/Creación (Premium Dark Style) -->
    <v-dialog v-model="dialog" max-width="500" persistent transition="dialog-bottom-transition">
      <v-card rounded="xl" class="elite-dark-modal-v2 overflow-hidden">
        <div class="elite-modal-glow bg-gold"></div>
        <div class="pa-6 pa-md-8">
          <div class="text-center mb-6">
            <div class="icon-ring-small bg-white-op mb-3">
              <v-icon :icon="isEditing ? 'mdi-pencil-box-outline' : 'mdi-plus-box-outline'" color="white" size="28" />
            </div>
            <h3 class="modal-title-white-v2">{{ isEditing ? 'Editar Instalación' : 'Nueva Instalación' }}</h3>
            <p class="modal-subtitle-silver-v2 mt-1">Gestión de espacios exclusivos</p>
          </div>
          
          <v-form @submit.prevent="saveRoom">
            <v-row dense>
              <v-col cols="12">
                <v-text-field 
                  v-model="roomForm.name" 
                  label="Nombre de la sala" 
                  variant="solo" 
                  rounded="lg" 
                  bg-color="rgba(255,255,255,0.03)"
                  class="mb-1 select-dark-elite-v2" 
                  hide-details
                />
              </v-col>
              
              <v-col cols="12">
                <v-textarea 
                  v-model="roomForm.description" 
                  label="Descripción" 
                  variant="solo" 
                  rounded="lg" 
                  bg-color="rgba(255,255,255,0.03)"
                  rows="2" 
                  class="mb-1 select-dark-elite-v2" 
                  hide-details
                />
              </v-col>
              
              <v-col cols="6">
                <v-text-field 
                  v-model.number="roomForm.capacity" 
                  label="Aforo" 
                  type="number" 
                  variant="solo" 
                  rounded="lg" 
                  bg-color="rgba(255,255,255,0.03)"
                  class="select-dark-elite-v2"
                  hide-details
                />
              </v-col>
              <v-col cols="6">
                <v-text-field 
                  v-model.number="roomForm.deposit_amount" 
                  label="Fianza (€)" 
                  type="number" 
                  variant="solo" 
                  rounded="lg" 
                  bg-color="rgba(255,255,255,0.03)"
                  class="select-dark-elite-v2"
                  hide-details
                />
              </v-col>

              <v-col cols="12">
                <v-text-field 
                  v-model="roomForm.image" 
                  label="URL de imagen" 
                  variant="solo" 
                  rounded="lg" 
                  bg-color="rgba(255,255,255,0.03)"
                  class="mb-4 select-dark-elite-v2" 
                  hide-details
                />
              </v-col>
            </v-row>
            
            <div class="d-flex align-center justify-space-between mb-6 px-1">
              <span class="text-caption text-silver-v2 font-weight-bold">ESTADO OPERATIVO</span>
              <v-switch 
                v-model="roomForm.is_active" 
                color="amber" 
                hide-details
                inset
                density="compact"
                class="elite-switch-compact"
              />
            </div>

            <div class="d-flex flex-column ga-2">
              <v-btn 
                block 
                color="#fbbf24" 
                height="50" 
                rounded="lg" 
                class="btn-elite-gold-v2" 
                type="submit" 
                :loading="saving"
              >
                {{ isEditing ? 'GUARDAR CAMBIOS' : 'CREAR INSTALACIÓN' }}
              </v-btn>
              <v-btn 
                variant="text" 
                height="40" 
                rounded="lg" 
                color="grey-lighten-1" 
                class="btn-elite-cancel-v2"
                @click="dialog = false"
              >
                Cerrar
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Eliminación -->
    <v-dialog v-model="deleteDialog" max-width="440" transition="dialog-bottom-transition">
      <v-card rounded="xl" class="elite-dark-modal overflow-hidden">
        <div class="elite-modal-glow bg-error"></div>
        <div class="pa-8">
          <div class="text-center mb-8">
            <div class="icon-ring bg-error-op mb-4">
              <v-icon icon="mdi-trash-can-outline" color="error" size="32" />
            </div>
            <h3 class="modal-title-white">¿Eliminar Sala?</h3>
            <p class="modal-subtitle-silver mt-2">Esta acción no se puede deshacer.</p>
          </div>

          <div class="d-flex flex-column ga-3">
            <v-btn color="#ef4444" height="54" rounded="lg" block class="btn-elite-danger-v2" @click="executeDelete">
              ELIMINAR DEFINITIVAMENTE
            </v-btn>
            <v-btn variant="text" color="grey-lighten-1" height="44" rounded="lg" block class="btn-elite-cancel" @click="deleteDialog = false">
              Volver
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useBookingStore } from '@/stores/booking'
import RoomCard from '@/components/common/RoomCard.vue'
import type { Room } from '@/types'

const bookingStore = useBookingStore()
const dialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const selectedRoom = ref<Room | null>(null)

const roomForm = reactive({
  name: '',
  description: '',
  capacity: 50,
  deposit_amount: 50,
  image: '',
  is_active: true
})

const openRoomDialog = (room?: Room) => {
  if (room) {
    isEditing.value = true
    selectedRoom.value = room
    Object.assign(roomForm, room)
  } else {
    isEditing.value = false
    selectedRoom.value = null
    Object.assign(roomForm, {
      name: '', description: '', capacity: 50, deposit_amount: 50, image: '', is_active: true
    })
  }
  dialog.value = true
}

const saveRoom = async () => {
  saving.value = true
  try {
    if (isEditing.value && selectedRoom.value) {
      await bookingStore.updateRoom(selectedRoom.value.id, roomForm)
    } else {
      await bookingStore.addRoom(roomForm as any)
    }
    dialog.value = false
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (room: Room) => {
  selectedRoom.value = room
  deleteDialog.value = true
}

const executeDelete = async () => {
  if (selectedRoom.value) {
    await bookingStore.deleteRoom(selectedRoom.value.id)
    deleteDialog.value = false
  }
}

onMounted(() => {
  bookingStore.fetchRooms()
})
</script>

<style scoped>
.admin-rooms-page-elite {
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-content-limit {
  max-width: 1400px;
}

.elite-top-accent {
  height: 4px;
  background: linear-gradient(to right, #d4af37, #fbbf24);
}

.elite-gold-marker {
  width: 5px;
  background: #d4af37;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
}

.page-title-elite {
  font-size: 2.75rem;
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -2px;
  color: #0f172a;
}

.btn-elite-gold-action {
  background: #0f172a !important;
  color: #fbbf24 !important;
  font-weight: 900 !important;
  letter-spacing: 1px !important;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.3) !important;
  transition: all 0.3s ease !important;
  border: 1px solid rgba(251, 191, 36, 0.3) !important;
}

.btn-elite-gold-action:hover {
  transform: translateY(-3px);
  background: #1e293b !important;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.4) !important;
}

/* ROOM CARD CUSTOM */
.room-card-elite {
  border-radius: 24px !important;
}

.action-pill-btn {
  opacity: 0.8;
  transition: all 0.3s ease;
  color: #0f172a !important;
}

.action-pill-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.action-pill-btn.danger:hover {
  color: #ef4444 !important;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 1px;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-badge.inactive {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* DIALOGS ELITE V2 COMPACT */
.elite-dark-modal-v2 {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.icon-ring-small {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.modal-title-white-v2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.modal-subtitle-silver-v2 {
  font-size: 0.85rem;
  color: #94a3b8;
}

.select-dark-elite-v2 :deep(.v-field) {
  border-radius: 10px !important;
  color: white !important;
  border: 1px solid rgba(255,255,255,0.05) !important;
}

.select-dark-elite-v2 :deep(.v-label) {
  color: rgba(255,255,255,0.4) !important;
  font-size: 0.85rem !important;
}

.text-silver-v2 {
  color: #94a3b8;
  letter-spacing: 1px;
}

.btn-elite-gold-v2 {
  font-weight: 900 !important;
  letter-spacing: 1px !important;
  color: #0f172a !important;
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.2) !important;
}

.btn-elite-cancel-v2 {
  font-weight: 700 !important;
  text-transform: none !important;
  color: rgba(255,255,255,0.4) !important;
}

.elite-switch :deep(.v-label) {
  color: #94a3b8 !important;
  font-weight: 700 !important;
  font-size: 0.9rem !important;
}

.empty-state-premium {
  background: white;
  border: 1px dashed #e2e8f0;
  border-radius: 24px;
  text-align: center;
}

@media (max-width: 600px) {
  .page-title-elite {
    font-size: 1.75rem;
  }
}
</style>

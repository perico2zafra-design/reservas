<template>
  <div>
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4 text-none"
      to="/"
    >
      Volver a Bloques
    </v-btn>

    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">Salas del Bloque</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gestiona las salas y sus horarios.</p>
      </div>
      <v-spacer />
      <v-btn
        v-if="authStore.isBlockAdmin"
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        @click="openRoomModal()"
      >
        Nueva Sala
      </v-btn>
    </div>

    <v-row v-if="!loading">
      <v-col v-for="room in rooms" :key="room.id" cols="12" sm="6" lg="4">
        <RoomCard :room="room" @book="$router.push('/room/' + room.id)">
          <template v-slot:append v-if="authStore.isBlockAdmin">
            <div class="pa-4 d-flex justify-end position-absolute top-0 right-0">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="white"
                class="me-2"
                @click.stop="openRoomModal(room)"
              />
              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                @click.stop="confirmDelete(room)"
              />
            </div>
          </template>
        </RoomCard>
      </v-col>
    </v-row>

    <!-- Room Modal -->
    <v-dialog v-model="roomModal" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="pa-6 font-weight-bold">
          {{ editedRoom.id ? 'Editar Sala' : 'Nueva Sala' }}
        </v-card-title>
        <v-card-text class="px-6 pb-6">
          <v-form ref="form">
            <v-text-field v-model="editedRoom.name" label="Nombre" variant="outlined" rounded="lg" class="mb-4" />
            <v-text-field v-model.number="editedRoom.capacity" label="Capacidad" type="number" variant="outlined" rounded="lg" class="mb-4" />
            
            <!-- Availability Section -->
            <div class="mb-4">
              <div class="text-subtitle-2 mb-2">Días Disponibles</div>
              <v-btn-toggle
                v-model="editedRoom.workDays"
                multiple
                rounded="lg"
                color="primary"
                variant="outlined"
                density="comfortable"
                class="w-100"
              >
                <v-btn v-for="(day, i) in dayLabels" :key="i" :value="i" class="flex-grow-1">
                  {{ day }}
                </v-btn>
              </v-btn-toggle>
            </div>

            <v-row class="mb-2">
              <v-col cols="6">
                <v-text-field
                  v-model="editedRoom.openTime"
                  label="Hora Apertura"
                  type="time"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editedRoom.closeTime"
                  label="Hora Cierre"
                  type="time"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>
            </v-row>

            <v-textarea v-model="editedRoom.description" label="Descripción" variant="outlined" rounded="lg" class="mb-4" />
            <v-text-field v-model="editedRoom.image" label="URL de Imagen" variant="outlined" rounded="lg" />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="roomModal = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" rounded="lg" @click="saveRoom" :loading="saving">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="pa-6 font-weight-bold">¿Eliminar Sala?</v-card-title>
        <v-card-text class="px-6">
          Esta acción no se puede deshacer. Se perderán todos los datos de esta sala.
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
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import type { Room } from '@/types/api'

const route = useRoute()
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const blockId = route.params.id as string

const rooms = computed(() => bookingStore.rooms)
const loading = computed(() => bookingStore.isLoading)
const saving = ref(false)
const roomModal = ref(false)
const deleteDialog = ref(false)
const editedRoom = ref<any>({ 
  openTime: '09:00', 
  closeTime: '18:00',
  workDays: [1, 2, 3, 4, 5] 
})
const roomToDelete = ref<Room | null>(null)

const dayLabels = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

const fetchRooms = async () => {
  await bookingStore.fetchRooms()
}

const openRoomModal = (room?: Room) => {
  if (room) {
    editedRoom.value = { 
      ...room,
      workDays: typeof room.workDays === 'string' ? room.workDays.split(',').map(Number) : room.workDays
    }
  } else {
    editedRoom.value = { 
      name: '',
      capacity: 10,
      description: '',
      image: 'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000),
      openTime: '09:00', 
      closeTime: '18:00',
      workDays: [1, 2, 3, 4, 5]
    }
  }
  roomModal.value = true
}

const saveRoom = async () => {
  saving.value = true
  try {
    if (editedRoom.value.id) {
      await bookingStore.updateRoom(editedRoom.value.id, editedRoom.value)
    } else {
      await bookingStore.addRoom(editedRoom.value)
    }
    roomModal.value = false
  } catch (err) {
    console.error('Error saving room:', err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (room: Room) => {
  roomToDelete.value = room
  deleteDialog.value = true
}

const doDelete = async () => {
  if (!roomToDelete.value) return
  saving.value = true
  try {
    await bookingStore.deleteRoom(roomToDelete.value.id)
    deleteDialog.value = false
  } catch (err) {
    console.error('Error deleting room:', err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchRooms)
</script>

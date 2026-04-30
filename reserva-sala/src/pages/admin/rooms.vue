<template>
  <v-container class="py-10">
    <!-- Header Section -->
    <div class="d-flex align-center mb-8 px-4">
      <div>
        <h1 class="text-h4 font-weight-black text-slate-900">Instalaciones</h1>
        <p class="text-slate-500">Gestiona los espacios comunes de la comunidad</p>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        rounded="xl"
        class="font-weight-black elevation-8"
        @click="openRoomDialog()"
      >
        Nueva Sala
      </v-btn>
    </div>

    <!-- Lista de Salas Usando RoomCard -->
    <v-row>
      <v-col v-for="room in bookingStore.rooms" :key="room.id" cols="12" sm="6" lg="4">
        <RoomCard
          :name="room.name"
          :image="room.image"
          :deposit="room.deposit_amount"
          :capacity="room.capacity"
          height="300"
        >
          <template #top-right>
            <div class="d-flex ga-2">
              <v-btn icon="mdi-pencil" size="x-small" color="white" variant="flat" class="text-primary" @click.stop="openRoomDialog(room)" />
              <v-btn icon="mdi-delete" size="x-small" color="white" variant="flat" class="text-error" @click.stop="confirmDelete(room)" />
            </div>
          </template>
          <template #footer>
            <div class="mt-4">
              <v-chip :color="room.is_active ? 'success' : 'error'" size="x-small" variant="flat" class="font-weight-black">
                {{ room.is_active ? 'ACTIVA' : 'INACTIVA' }}
              </v-chip>
            </div>
          </template>
        </RoomCard>
      </v-col>
    </v-row>

    <!-- Diálogo de Edición/Creación -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card rounded="32" class="pa-8">
        <h2 class="text-h5 font-weight-black mb-6">{{ isEditing ? 'Editar Sala' : 'Nueva Sala' }}</h2>
        
        <v-form @submit.prevent="saveRoom">
          <v-text-field v-model="roomForm.name" label="Nombre de la sala" variant="outlined" rounded="xl" class="mb-4" />
          <v-textarea v-model="roomForm.description" label="Descripción" variant="outlined" rounded="24" rows="3" class="mb-4" />
          
          <v-row>
            <v-col cols="6">
              <v-text-field v-model.number="roomForm.capacity" label="Aforo" type="number" variant="outlined" rounded="xl" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model.number="roomForm.deposit_amount" label="Fianza (€)" type="number" variant="outlined" rounded="xl" />
            </v-col>
          </v-row>

          <v-text-field v-model="roomForm.image" label="URL de la imagen" variant="outlined" rounded="xl" class="mb-6" />
          
          <v-switch v-model="roomForm.is_active" label="Sala activa y disponible" color="primary" class="mb-6" />

          <div class="d-flex ga-4">
            <v-btn block color="primary" size="x-large" rounded="xl" class="font-weight-black" type="submit" :loading="saving">
              {{ isEditing ? 'Guardar Cambios' : 'Crear Sala' }}
            </v-btn>
            <v-btn block variant="text" size="x-large" rounded="xl" color="slate-400" @click="dialog = false">
              Cancelar
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useBookingStore } from '@/stores/booking'
import RoomCard from '@/components/common/RoomCard.vue'
import type { Room } from '@/types'

const bookingStore = useBookingStore()
const dialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const selectedRoomId = ref<number | null>(null)

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
    selectedRoomId.value = room.id
    Object.assign(roomForm, room)
  } else {
    isEditing.value = false
    selectedRoomId.value = null
    Object.assign(roomForm, {
      name: '', description: '', capacity: 50, deposit_amount: 50, image: '', is_active: true
    })
  }
  dialog.value = true
}

const saveRoom = async () => {
  saving.value = true
  try {
    if (isEditing.value && selectedRoomId.value) {
      await bookingStore.updateRoom(selectedRoomId.value, roomForm)
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

const confirmDelete = async (room: Room) => {
  if (confirm(`¿Estás seguro de eliminar ${room.name}?`)) {
    await bookingStore.deleteRoom(room.id)
  }
}

onMounted(() => {
  bookingStore.fetchRooms()
})
</script>

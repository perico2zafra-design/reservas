<template>
  <div class="admin-rooms-page pa-4">
    <div class="d-flex align-center mb-6">
      <h1 class="text-h4 font-weight-black text-slate-900">Instalaciones</h1>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="xl"
        class="font-weight-black shadow-blue"
        @click="openRoomModal()"
      >
        Nueva Sala
      </v-btn>
    </div>

    <!-- Grid de Salas -->
    <v-row>
      <v-col v-for="room in rooms" :key="room.id" cols="12" sm="6" lg="4">
        <v-card rounded="24" class="premium-room-admin-card overflow-hidden border-0 elevation-xl">
          <v-img :src="room.image" height="180" cover />
          <div class="pa-5">
            <div class="d-flex align-center mb-2">
              <h3 class="text-h6 font-weight-black text-slate-900">{{ room.name }}</h3>
              <v-spacer />
              <v-switch
                v-model="room.is_active"
                hide-details
                color="success"
                density="compact"
                @change="toggleRoomActive(room)"
              />
            </div>
            
            <div class="d-flex ga-2 mb-4">
              <v-chip size="x-small" variant="tonal" color="slate-500" prepend-icon="mdi-account-group">
                {{ room.capacity }} pers.
              </v-chip>
              <v-chip size="x-small" variant="tonal" color="primary" prepend-icon="mdi-cash">
                {{ room.deposit_amount }}€ fianza
              </v-chip>
            </div>

            <div class="d-flex ga-2">
              <v-btn block variant="tonal" color="primary" rounded="lg" size="small" @click="openRoomModal(room)">
                Configurar
              </v-btn>
              <v-btn icon="mdi-delete-outline" variant="text" color="error" size="small" @click="confirmDelete(room)" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Configuración de Sala -->
    <v-dialog v-model="roomModal" max-width="600" persistent>
      <v-card rounded="24" class="pa-6">
        <div class="d-flex align-center mb-6">
          <h2 class="text-h5 font-weight-black">{{ editedRoom.id ? 'Editar Sala' : 'Nueva Sala' }}</h2>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="roomModal = false" />
        </div>

        <v-form ref="roomForm">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editedRoom.name" label="Nombre de la Sala" variant="outlined" rounded="xl" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="editedRoom.description" label="Descripción / Normas Específicas" variant="outlined" rounded="xl" rows="3" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedRoom.capacity" label="Aforo Máximo" type="number" variant="outlined" rounded="xl" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedRoom.deposit_amount" label="Fianza (€)" type="number" variant="outlined" rounded="xl" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedRoom.image" label="URL de la Imagen" variant="outlined" rounded="xl" />
            </v-col>
          </v-row>
        </v-form>

        <div class="d-flex ga-3 mt-6">
          <v-btn block color="primary" size="large" rounded="xl" class="font-weight-black" :loading="saving" @click="saveRoom">
            Guardar Instalación
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()
const rooms = computed(() => bookingStore.rooms)
const roomModal = ref(false)
const saving = ref(false)
const editedRoom = ref<any>({})

const openRoomModal = (room?: any) => {
  editedRoom.value = room ? { ...room } : { 
    name: '', 
    description: '', 
    capacity: 50, 
    deposit_amount: 50, 
    is_active: true,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1200'
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

const toggleRoomActive = async (room: any) => {
  await bookingStore.updateRoom(room.id, { is_active: room.is_active })
}

const confirmDelete = async (room: any) => {
  if (confirm(`¿Seguro que quieres eliminar la sala "${room.name}"? Se perderán todas sus reservas.`)) {
    await bookingStore.deleteRoom(room.id)
  }
}

onMounted(() => {
  bookingStore.fetchRooms()
})
</script>

<style scoped>
.premium-room-admin-card {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.premium-room-admin-card:hover {
  transform: translateY(-5px);
}

.shadow-blue {
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3) !important;
}
</style>

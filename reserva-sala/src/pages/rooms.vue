<template>
  <div class="rooms-explorer">
    <div class="d-flex align-center mb-8">
      <v-btn
        variant="tonal"
        icon="mdi-arrow-left"
        to="/"
        class="me-4 elevation-1"
        color="primary"
      />
      <div>
        <h1 class="text-h4 font-weight-black text-gradient">Salas Disponibles</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Explora y reserva el espacio que necesitas.</p>
      </div>
      <v-spacer />
      <div class="d-flex gap-2">
        <v-btn
          v-if="authStore.isAdmin"
          color="secondary"
          variant="tonal"
          prepend-icon="mdi-account-group"
          rounded="xl"
          class="text-none font-weight-black"
          @click="openMembersModal()"
        >
          Miembros
        </v-btn>
        <v-btn
          v-if="authStore.isAdmin"
          color="primary"
          prepend-icon="mdi-plus"
          rounded="xl"
          class="text-none font-weight-black elevation-4"
          @click="openRoomModal()"
        >
          Nueva Sala
        </v-btn>
      </div>
    </div>

    <!-- Filter Bar -->
    <v-card rounded="xl" class="glass-card pa-4 mb-8 border-0 elevation-2">
      <v-row align="center" no-gutters>
        <v-col cols="12" md="4" class="px-2">
          <v-text-field
            v-model="roomSearch"
            prepend-inner-icon="mdi-magnify"
            label="Buscar por nombre..."
            variant="solo-filled"
            flat
            hide-details
            rounded="lg"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12" md="3" class="px-2">
          <v-select
            v-model="capacityFilter"
            :items="['Todas', '2-5 personas', '6-10 personas', '10+ personas']"
            label="Capacidad"
            variant="solo-filled"
            flat
            hide-details
            rounded="lg"
            density="comfortable"
            prepend-inner-icon="mdi-account-group-outline"
          />
        </v-col>
        <v-spacer />
        <v-col cols="auto" class="px-2">
          <v-btn-toggle v-model="viewMode" rounded="lg" mandatory density="comfortable" color="primary">
            <v-btn value="grid" icon="mdi-view-grid-outline" />
            <v-btn value="list" icon="mdi-view-list" />
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card>

    <!-- Rooms List -->
    <v-fade-transition mode="out-in">
      <v-row v-if="!loading && viewMode === 'grid'">
        <v-col v-for="room in filteredRooms" :key="room.id" cols="12" sm="6" lg="4">
          <RoomCard :room="room" @book="$router.push('/room/' + room.id)">
            <template v-slot:append v-if="authStore.isAdmin">
              <div class="pa-2 d-flex glass-actions rounded-pill">
                <v-btn icon="mdi-pencil" size="x-small" color="white" variant="text" @click.stop="openRoomModal(room)" />
                <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click.stop="confirmDelete(room)" />
              </div>
            </template>
          </RoomCard>
        </v-col>
      </v-row>
      
      <div v-else-if="!loading && viewMode === 'list'" class="list-container">
        <v-card v-for="room in filteredRooms" :key="room.id" rounded="xl" class="mb-4 glass-card pa-4 border-0 hover-lift d-flex align-center cursor-pointer" @click="$router.push('/room/' + room.id)">
          <v-avatar size="100" rounded="lg" class="me-6">
            <v-img :src="room.image" cover />
          </v-avatar>
          <div class="flex-grow-1">
            <h3 class="text-h6 font-weight-black mb-1">{{ room.name }}</h3>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon icon="mdi-account-group" size="14" class="me-1" /> {{ room.capacity }} personas
              <v-divider vertical class="mx-3" />
              <v-icon icon="mdi-clock-outline" size="14" class="me-1" /> {{ room.openTime }} - {{ room.closeTime }}
            </div>
          </div>
          <v-spacer />
          <v-btn color="primary" rounded="xl" class="text-none font-weight-black px-6">Reservar</v-btn>
        </v-card>
      </div>
    </v-fade-transition>

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

    <!-- Members Modal -->
    <v-dialog v-model="membersModal" max-width="600">
      <v-card rounded="xl">
        <v-card-title class="pa-6 font-weight-bold d-flex align-center">
          <span>Miembros del Bloque</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="membersModal = false" />
        </v-card-title>
        <v-card-text class="px-6 pb-6">
          <!-- Add Member Form -->
          <v-row class="mb-4 align-center">
            <v-col cols="7">
              <v-text-field v-model="newMemberEmail" label="Email del usuario" variant="outlined" density="comfortable" hide-details rounded="lg" />
            </v-col>
            <v-col cols="3">
              <v-select v-model="newMemberRole" :items="['MEMBER', 'ADMIN']" variant="outlined" density="comfortable" hide-details rounded="lg" />
            </v-col>
            <v-col cols="2">
              <v-btn color="primary" icon="mdi-plus" @click="addMember" :loading="memberLoading" />
            </v-col>
          </v-row>

          <!-- Members List -->
          <v-list v-if="members.length > 0">
            <v-list-item v-for="member in members" :key="member.id" class="px-0">
              <template v-slot:prepend>
                <v-avatar color="primary-lighten-4" class="text-primary font-weight-bold">
                  {{ member.user?.user_metadata?.name?.[0] || 'U' }}
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">{{ member.user?.user_metadata?.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ member.user?.email }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-chip size="small" :color="member.role === 'ADMIN' ? 'error' : 'info'" class="me-2">{{ member.role }}</v-chip>
                <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="removeMember(member.id)" />
              </template>
            </v-list-item>
          </v-list>
          <div v-else class="text-center pa-8 text-medium-emphasis">No hay miembros en este bloque aún.</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import api from '@/services/api'
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
const roomSearch = ref('')
const capacityFilter = ref('Todas')
const viewMode = ref('grid')

const editedRoom = ref<any>({ 
  openTime: '09:00', 
  closeTime: '18:00',
  workDays: [1, 2, 3, 4, 5] 
})

const filteredRooms = computed(() => {
  let result = bookingStore.rooms
  
  if (roomSearch.value) {
    result = result.filter(r => r.name.toLowerCase().includes(roomSearch.value.toLowerCase()))
  }
  
  if (capacityFilter.value !== 'Todas') {
    if (capacityFilter.value === '2-5 personas') result = result.filter(r => r.capacity >= 2 && r.capacity <= 5)
    else if (capacityFilter.value === '6-10 personas') result = result.filter(r => r.capacity >= 6 && r.capacity <= 10)
    else if (capacityFilter.value === '10+ personas') result = result.filter(r => r.capacity > 10)
  }
  
  return result
})
const roomToDelete = ref<Room | null>(null)
const dayLabels = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

// --- Member Logic ---
const members = ref<any[]>([])
const membersModal = ref(false)
const memberLoading = ref(false)
const newMemberEmail = ref('')
const newMemberRole = ref('MEMBER')

const fetchMembers = async () => {
  try {
    const res = await api.get(`/blocks/${blockId}/members`)
    members.value = res.data
  } catch (err) {
    console.error('Error fetching members:', err)
  }
}

const openMembersModal = () => {
  fetchMembers()
  membersModal.value = true
}

const addMember = async () => {
  if (!newMemberEmail.value) return
  memberLoading.value = true
  try {
    await api.post(`/blocks/${blockId}/members`, { 
      email: newMemberEmail.value, 
      role: newMemberRole.value 
    })
    newMemberEmail.value = ''
    fetchMembers()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Error adding member')
  } finally {
    memberLoading.value = false
  }
}

const removeMember = async (memberId: number) => {
  if (!confirm('¿Seguro que quieres quitar a este miembro?')) return
  try {
    await api.delete(`/blocks/members/${memberId}`)
    fetchMembers()
  } catch (err) {
    console.error('Error removing member:', err)
  }
}

// --- Room Logic ---
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

onMounted(() => {
  fetchRooms()
})
</script>

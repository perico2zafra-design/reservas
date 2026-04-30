<template>
  <div class="premium-page">
    <div class="d-flex align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-black text-gradient mb-1">Gestión de Salas</h1>
        <p class="text-subtitle-2 text-medium-emphasis">Crea y configura salas, horarios y excepciones.</p>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="xl"
        class="font-weight-black elevation-4 px-6"
        @click="openRoomDialog()"
      >
        Nueva Sala
      </v-btn>
    </div>

    <v-row v-if="loading">
      <v-col v-for="i in 3" :key="i" cols="12" md="4">
        <v-skeleton-loader type="card" rounded="xl" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="room in rooms" :key="room.id" cols="12" md="4">
        <v-card rounded="xl" class="glass-card overflow-hidden border-0 elevation-4 hover-lift">
          <v-img
            :src="room.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'"
            height="180"
            cover
            class="align-end"
          >
            <div class="pa-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div class="text-h6 font-weight-bold">{{ room.name }}</div>
              <div class="text-caption opacity-80">Capacidad: {{ room.capacity }} personas</div>
            </div>
          </v-img>

          <v-card-text>
            <p class="text-body-2 text-medium-emphasis line-clamp-2 mb-4">
              {{ room.description }}
            </p>
            <div class="d-flex ga-2">
              <v-btn
                variant="tonal"
                color="primary"
                rounded="lg"
                size="small"
                class="flex-grow-1"
                prepend-icon="mdi-pencil"
                @click="openRoomDialog(room)"
              >
                Editar
              </v-btn>
              <v-btn
                variant="tonal"
                color="secondary"
                rounded="lg"
                size="small"
                class="flex-grow-1"
                prepend-icon="mdi-calendar-clock"
                @click="openScheduleDialog(room)"
              >
                Horarios
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Room Form Dialog -->
    <v-dialog v-model="roomDialog" max-width="600">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h5 font-weight-bold">
          {{ editedRoom.id ? 'Editar Sala' : 'Nueva Sala' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedRoom.name"
              label="Nombre de la Sala"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              :rules="[v => !!v || 'Requerido']"
            />
            <v-textarea
              v-model="editedRoom.description"
              label="Descripción"
              variant="outlined"
              rounded="lg"
              rows="3"
              class="mb-4"
            />
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="editedRoom.capacity"
                  label="Capacidad"
                  type="number"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editedRoom.image"
                  label="URL Imagen (opcional)"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" rounded="xl" @click="roomDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" rounded="xl" @click="saveRoom" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Schedule Dialog -->
    <v-dialog v-model="scheduleDialog" max-width="800">
      <v-card rounded="xl" class="pa-6">
        <v-card-title class="text-h5 font-weight-bold mb-4 d-flex align-center">
          <v-icon icon="mdi-calendar-clock" class="me-2" color="primary" />
          Horarios: {{ selectedRoom?.name }}
        </v-card-title>
        
        <v-tabs v-model="activeScheduleTab" color="primary" grow>
          <v-tab value="weekly">Horario Semanal</v-tab>
          <v-tab value="exceptions">Días Bloqueados</v-tab>
        </v-tabs>

        <v-window v-model="activeScheduleTab" class="mt-6">
          <v-window-item value="weekly">
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Define los tramos horarios disponibles cada día de la semana.</div>
            
            <div v-for="day in weekDays" :key="day.value" class="mb-6 pb-4 border-b">
              <div class="d-flex align-center mb-3">
                <span class="font-weight-bold text-uppercase" style="width: 100px">{{ day.label }}</span>
                <v-btn
                  size="x-small"
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-plus"
                  rounded="pill"
                  @click="addScheduleSlot(day.value)"
                >
                  Añadir Tramo
                </v-btn>
              </div>
              
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="(slot, idx) in getSchedulesForDay(day.value)"
                  :key="idx"
                  closable
                  @click:close="removeScheduleSlot(slot.id)"
                  color="primary"
                  variant="outlined"
                  rounded="lg"
                >
                  {{ slot.start_time.substring(0, 5) }} - {{ slot.end_time.substring(0, 5) }}
                </v-chip>
                <div v-if="getSchedulesForDay(day.value).length === 0" class="text-caption text-error italic">
                  Cerrado / No reservable
                </div>
              </div>
            </div>
          </v-window-item>

          <v-window-item value="exceptions">
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Añade días específicos en los que la sala no podrá ser reservada.</div>
            
            <v-row class="mb-6">
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model="newException.date"
                  type="date"
                  label="Fecha"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model="newException.reason"
                  label="Motivo (opcional)"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="2">
                <v-btn
                  block
                  color="error"
                  height="48"
                  rounded="lg"
                  @click="addException"
                  :loading="exceptionLoading"
                >
                  Bloquear
                </v-btn>
              </v-col>
            </v-row>

            <v-table class="bg-transparent">
              <thead>
                <tr>
                  <th class="text-left">Fecha</th>
                  <th class="text-left">Motivo</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="exc in exceptions" :key="exc.id">
                  <td>{{ new Date(exc.exception_date).toLocaleDateString() }}</td>
                  <td>{{ exc.reason }}</td>
                  <td class="text-right">
                    <v-btn
                      icon="mdi-delete-outline"
                      variant="text"
                      color="error"
                      size="small"
                      @click="removeException(exc.id)"
                    />
                  </td>
                </tr>
                <tr v-if="exceptions.length === 0">
                  <td colspan="3" class="text-center text-medium-emphasis py-4">No hay días bloqueados.</td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
        </v-window>

        <v-card-actions class="mt-8">
          <v-spacer />
          <v-btn variant="tonal" rounded="xl" @click="scheduleDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Slot Add Dialog -->
    <v-dialog v-model="slotDialog" max-width="400">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="font-weight-bold">Añadir Tramo Horario</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="newSlot.start" label="Inicio" type="time" variant="outlined" rounded="lg" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="newSlot.end" label="Fin" type="time" variant="outlined" rounded="lg" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" rounded="xl" @click="slotDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" rounded="xl" @click="saveSlot" :loading="slotLoading">Añadir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const rooms = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)
const roomDialog = ref(false)
const editedRoom = ref<any>({})

// Schedule logic
const scheduleDialog = ref(false)
const selectedRoom = ref<any>(null)
const activeScheduleTab = ref('weekly')
const schedules = ref<any[]>([])
const exceptions = ref<any[]>([])

const slotDialog = ref(false)
const slotLoading = ref(false)
const newSlot = ref({ day: 0, start: '09:00', end: '14:00' })

const newException = ref({ date: '', reason: '' })
const exceptionLoading = ref(false)

const weekDays = [
  { label: 'Lunes', value: 1 },
  { label: 'Martes', value: 2 },
  { label: 'Miércoles', value: 3 },
  { label: 'Jueves', value: 4 },
  { label: 'Viernes', value: 5 },
  { label: 'Sábado', value: 6 },
  { label: 'Domingo', value: 0 },
]

const fetchRooms = async () => {
  loading.value = true
  try {
    const res = await api.get('/rooms')
    rooms.value = res.data
  } catch (err) {
    console.error('Error fetching rooms:', err)
  } finally {
    loading.value = false
  }
}

const openRoomDialog = (room: any = null) => {
  editedRoom.value = room ? { ...room } : { name: '', description: '', capacity: 10, image: '' }
  roomDialog.value = true
}

const saveRoom = async () => {
  saving.value = true
  try {
    if (editedRoom.value.id) {
      await api.put(`/rooms/${editedRoom.value.id}`, editedRoom.value)
    } else {
      await api.post('/rooms', editedRoom.value)
    }
    roomDialog.value = false
    fetchRooms()
  } catch (err) {
    console.error('Error saving room:', err)
  } finally {
    saving.value = false
  }
}

const openScheduleDialog = async (room: any) => {
  selectedRoom.value = room
  scheduleDialog.value = true
  fetchSchedules()
  fetchExceptions()
}

const fetchSchedules = async () => {
  try {
    const res = await api.get(`/rooms/${selectedRoom.value.id}/schedules`)
    schedules.value = res.data
  } catch (err) {
    console.error('Error fetching schedules:', err)
  }
}

const fetchExceptions = async () => {
  try {
    const res = await api.get(`/rooms/${selectedRoom.value.id}/exceptions`)
    exceptions.value = res.data
  } catch (err) {
    console.error('Error fetching exceptions:', err)
  }
}

const getSchedulesForDay = (day: number) => {
  return schedules.value.filter(s => s.day_of_week === day)
}

const addScheduleSlot = (day: number) => {
  newSlot.value = { day, start: '09:00', end: '14:00' }
  slotDialog.value = true
}

const saveSlot = async () => {
  slotLoading.value = true
  try {
    await api.post(`/rooms/${selectedRoom.value.id}/schedules`, {
      day_of_week: newSlot.value.day,
      start_time: newSlot.value.start,
      end_time: newSlot.value.end
    })
    slotDialog.value = false
    fetchSchedules()
  } catch (err) {
    console.error('Error saving slot:', err)
  } finally {
    slotLoading.value = false
  }
}

const removeScheduleSlot = async (slotId: number) => {
  try {
    await api.delete(`/rooms/schedules/${slotId}`)
    fetchSchedules()
  } catch (err) {
    console.error('Error removing slot:', err)
  }
}

const addException = async () => {
  if (!newException.value.date) return
  exceptionLoading.value = true
  try {
    await api.post(`/rooms/${selectedRoom.value.id}/exceptions`, {
      exception_date: newException.value.date,
      reason: newException.value.reason
    })
    newException.value = { date: '', reason: '' }
    fetchExceptions()
  } catch (err) {
    console.error('Error adding exception:', err)
  } finally {
    exceptionLoading.value = false
  }
}

const removeException = async (excId: number) => {
  try {
    await api.delete(`/rooms/exceptions/${excId}`)
    fetchExceptions()
  } catch (err) {
    console.error('Error removing exception:', err)
  }
}

onMounted(() => {
  fetchRooms()
})
</script>

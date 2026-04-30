<template>
  <div class="admin-users-page pa-4">
    <div class="d-flex align-center mb-6">
      <h1 class="text-h4 font-weight-black text-slate-900">Vecinos</h1>
      <v-spacer />
      <v-btn icon="mdi-magnify" variant="text" color="slate-400" @click="showSearch = !showSearch" />
    </div>

    <v-text-field
      v-if="showSearch"
      v-model="search"
      placeholder="Buscar por nombre, email o portal..."
      variant="solo"
      rounded="xl"
      flat
      density="comfortable"
      bg-color="white"
      class="mb-6 elevation-2"
      hide-details
    />

    <!-- Tabs Estilo iOS -->
    <div class="custom-tabs mb-6">
      <button 
        v-for="tab in ['PENDING', 'APPROVED', 'BLOCKED']" 
        :key="tab"
        :class="['tab-item', { active: activeStatus === tab }]"
        @click="activeStatus = tab"
      >
        {{ getTabLabel(tab) }}
        <v-badge v-if="tab === 'PENDING' && pendingCount > 0" :content="pendingCount" color="error" inline />
      </button>
    </div>

    <!-- Lista de Vecinos -->
    <v-fade-transition group>
      <UserListItem 
        v-for="user in filteredUsers" 
        :key="user.id"
        :user="user"
        @update-status="updateStatus"
        @open-block="openBlockDialog"
        @confirm-delete="confirmDelete"
      />
    </v-fade-transition>

    <!-- Diálogo de Bloqueo Temporal -->
    <v-dialog v-model="blockDialog" max-width="400">
      <v-card rounded="24" class="pa-6">
        <h3 class="text-h6 font-weight-black mb-2">Bloquear Vecino</h3>
        <p class="text-body-2 text-slate-500 mb-6">Indica cuánto tiempo durará la sanción para {{ selectedUser?.first_name }}.</p>
        
        <v-select
          v-model="blockDuration"
          :items="blockOptions"
          label="Duración del bloqueo"
          variant="outlined"
          rounded="xl"
          class="mb-4"
        />

        <v-btn block color="warning" size="large" rounded="xl" class="font-weight-black" @click="applyBlock">
          Confirmar Bloqueo
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import UserListItem from '@/components/admin/UserListItem.vue'

const users = ref<any[]>([])
const activeStatus = ref('PENDING')
const search = ref('')
const showSearch = ref(false)
const blockDialog = ref(false)
const selectedUser = ref<any>(null)
const blockDuration = ref(7)

const blockOptions = [
  { title: '1 Semana', value: 7 },
  { title: '15 Días', value: 15 },
  { title: '1 Mes', value: 30 },
  { title: '3 Meses', value: 90 },
  { title: 'Indefinido', value: 3650 }
]

const pendingCount = computed(() => users.value.filter(u => u.status === 'PENDING').length)

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesStatus = u.status === activeStatus.value
    const matchesSearch = !search.value || 
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase()) ||
      u.portal?.includes(search.value)
    return matchesStatus && matchesSearch
  })
})

const getTabLabel = (status: string) => {
  switch(status) {
    case 'PENDING': return 'Solicitudes'
    case 'APPROVED': return 'Activos'
    case 'BLOCKED': return 'Sancionados'
    default: return status
  }
}

const fetchUsers = async () => {
  const res = await api.get('/users')
  users.value = res.data
}

const updateStatus = async (userId: string, status: string, blockedUntil: any = null) => {
  await api.patch(`/users/${userId}/status`, { status, blocked_until: blockedUntil })
  fetchUsers()
}

const openBlockDialog = (user: any) => {
  selectedUser.value = user
  blockDialog.value = true
}

const applyBlock = () => {
  const date = new Date()
  date.setDate(date.getDate() + blockDuration.value)
  updateStatus(selectedUser.value.id, 'BLOCKED', date.toISOString())
  blockDialog.value = false
}

const confirmDelete = async (user: any) => {
  if (confirm(`¿Estás seguro de que quieres eliminar a ${user.first_name}? Esta acción no se puede deshacer.`)) {
    await api.delete(`/users/${user.id}`)
    fetchUsers()
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.custom-tabs { display: flex; background: #f1f5f9; padding: 4px; border-radius: 16px; ga: 4px; }
.tab-item { flex: 1; padding: 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; color: #64748b; transition: all 0.3s ease; }
.tab-item.active { background: white; color: #0f172a; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
</style>

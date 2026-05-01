<template>
  <div class="admin-users-page-elite">
    <div class="elite-top-accent"></div>

    <v-container class="pt-6 pb-12 px-4 px-md-10 main-content-limit">
      <!-- Header Section -->
      <v-row no-gutters align="center" class="mb-8">
        <v-col cols="12" md="6" class="d-flex mb-4 mb-md-0">
          <div class="elite-gold-marker me-4 align-self-stretch"></div>
          <div>
            <h1 class="page-title-elite text-slate-900 text-playfair mb-1 mt-0">Vecinos</h1>
            <p class="text-caption text-slate-500 font-weight-bold text-uppercase letter-spacing-lg">Gestión de Residentes</p>
          </div>
        </v-col>

        <v-spacer class="d-none d-md-block"></v-spacer>

        <v-col cols="12" md="5">
          <v-text-field
            v-model="search"
            placeholder="Buscar residente..."
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            rounded="lg"
            flat
            density="comfortable"
            bg-color="white"
            class="elevation-1 search-refined"
            hide-details
          />
        </v-col>
      </v-row>

      <!-- Tabs Estilo Premium -->
      <v-row class="mb-8">
        <v-col cols="12">
          <div class="tabs-container-premium pa-1">
            <v-tabs
              v-model="activeStatus"
              color="white"
              grow
              hide-slider
              class="tabs-elite-full"
            >
              <v-tab value="PENDING" class="tab-item-elite text-none">
                <v-icon start icon="mdi-account-clock" size="18" />
                Solicitudes
                <v-badge v-if="pendingCount > 0" :content="pendingCount" color="error" class="ms-2" />
              </v-tab>
              <v-tab value="APPROVED" class="tab-item-elite text-none">
                <v-icon start icon="mdi-account-check" size="18" />
                Activos
              </v-tab>
              <v-tab value="BLOCKED" class="tab-item-elite text-none">
                <v-icon start icon="mdi-account-cancel" size="18" />
                Sancionados
              </v-tab>
            </v-tabs>
          </div>
        </v-col>
      </v-row>

      <!-- Grid de Vecinos -->
      <v-row>
        <v-col 
          v-for="user in filteredUsers" 
          :key="user.id" 
          cols="12" 
          sm="6" 
          lg="4"
        >
          <v-fade-transition>
            <UserListItem 
              :user="user"
              @update-status="updateStatus"
              @open-block="openBlockDialog"
              @confirm-delete="confirmDelete"
            />
          </v-fade-transition>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="empty-state-premium py-16 px-6">
        <v-icon icon="mdi-account-search-outline" size="64" color="slate-200" class="mb-4" />
        <h2 class="text-h6 font-weight-black text-slate-400">No se encontraron vecinos en esta sección</h2>
      </div>
    </v-container>

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
.admin-users-page-elite {
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
  width: 6px;
  background: #d4af37;
  border-radius: 3px;
}

.page-title-elite {
  font-size: 2.5rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -1px;
}

.search-refined :deep(.v-field) {
  border: 1px solid #e2e8f0 !important;
  transition: all 0.3s ease;
}

.search-refined :deep(.v-field--focused) {
  border-color: #d4af37 !important;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1) !important;
}

.tabs-container-premium {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.tabs-elite-full :deep(.v-tab) {
  flex: 1;
  height: 48px !important;
  font-size: 0.9rem !important;
  font-weight: 700 !important;
  color: #64748b !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tabs-elite-full :deep(.v-tab--selected) {
  background: #0f172a !important;
  color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
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

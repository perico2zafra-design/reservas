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
              <span v-if="pendingCount > 0" class="badge-custom-elite ms-2">{{ pendingCount }}</span>
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

    <!-- Diálogo de Bloqueo Temporal (Sancionar) -->
    <v-dialog v-model="blockDialog" max-width="440" persistent transition="dialog-bottom-transition">
      <v-card rounded="xl" class="elite-dark-modal overflow-hidden">
        <div class="elite-modal-glow bg-amber"></div>
        <div class="pa-8">
          <div class="text-center mb-8">
            <div class="icon-ring bg-amber-op mb-4">
              <v-icon icon="mdi-shield-alert" color="amber" size="32" />
            </div>
            <h3 class="modal-title-white">Aplicar Sanción</h3>
            <p class="modal-subtitle-silver mt-2">Se restringirá el acceso a las instalaciones</p>
          </div>
          
          <v-select
            v-model="blockDuration"
            :items="blockOptions"
            label="Periodo de restricción"
            variant="solo"
            rounded="lg"
            bg-color="rgba(255,255,255,0.05)"
            class="mb-8 select-dark-elite"
            hide-details
          />

          <div class="d-flex flex-column ga-3">
            <v-btn color="#fbbf24" height="54" rounded="lg" block class="btn-elite-gold" @click="applyBlock">
              CONFIRMAR SANCIÓN
            </v-btn>
            <v-btn variant="text" color="grey-lighten-1" height="44" rounded="lg" block class="btn-elite-cancel" @click="blockDialog = false">
              Cancelar y volver
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Confirmación General (Admitir/Rehabilitar) -->
    <v-dialog v-model="confirmDialog" max-width="440" transition="dialog-bottom-transition">
      <v-card rounded="xl" class="elite-dark-modal overflow-hidden">
        <div class="elite-modal-glow bg-gold"></div>
        <div class="pa-8">
          <div class="text-center mb-8">
            <div class="icon-ring bg-white-op mb-4">
              <v-icon icon="mdi-shield-check" color="white" size="32" />
            </div>
            <h3 class="modal-title-white">Confirmar Acción</h3>
            <p class="modal-subtitle-silver mt-2">¿Autorizar acceso a {{ selectedUser?.first_name }}?</p>
          </div>

          <div class="d-flex flex-column ga-3">
            <v-btn color="#fbbf24" height="54" rounded="lg" block class="btn-elite-gold" @click="executeConfirmedAction">
              AUTORIZAR ACCESO
            </v-btn>
            <v-btn variant="text" color="grey-lighten-1" height="44" rounded="lg" block class="btn-elite-cancel" @click="confirmDialog = false">
              Cerrar
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Eliminación (Danger Zone) -->
    <v-dialog v-model="deleteDialog" max-width="440" transition="dialog-bottom-transition">
      <v-card rounded="xl" class="elite-dark-modal overflow-hidden">
        <div class="elite-modal-glow bg-error"></div>
        <div class="pa-8">
          <div class="text-center mb-8">
            <div class="icon-ring bg-error-op mb-4">
              <v-icon icon="mdi-alert-octagon" color="error" size="32" />
            </div>
            <h3 class="modal-title-white">Eliminar Vecino</h3>
            <p class="modal-subtitle-silver mt-2">Esta acción eliminará todos los datos de forma permanente.</p>
          </div>

          <div class="d-flex flex-column ga-3">
            <v-btn color="#ef4444" height="54" rounded="lg" block class="btn-elite-danger-v2" @click="executeDelete">
              ELIMINAR DEFINITIVAMENTE
            </v-btn>
            <v-btn variant="text" color="grey-lighten-1" height="44" rounded="lg" block class="btn-elite-cancel" @click="deleteDialog = false">
              Volver atrás
            </v-btn>
          </div>
        </div>
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
const confirmDialog = ref(false)
const deleteDialog = ref(false)
const selectedUser = ref<any>(null)
const blockDuration = ref(7)
const pendingAction = ref<{ type: string, userId: string, status: string } | null>(null)

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

const updateStatus = (userId: string, status: string) => {
  const user = users.value.find(u => u.id === userId)
  selectedUser.value = user
  pendingAction.value = { type: 'status', userId, status }
  confirmDialog.value = true
}

const executeConfirmedAction = async () => {
  if (pendingAction.value) {
    await api.patch(`/users/${pendingAction.value.userId}/status`, { status: pendingAction.value.status })
    fetchUsers()
  }
  confirmDialog.value = false
  pendingAction.value = null
}

const openBlockDialog = (user: any) => {
  selectedUser.value = user
  blockDialog.value = true
}

const applyBlock = async () => {
  const date = new Date()
  date.setDate(date.getDate() + blockDuration.value)
  await api.patch(`/users/${selectedUser.value.id}/status`, { 
    status: 'BLOCKED', 
    blocked_until: date.toISOString() 
  })
  fetchUsers()
  blockDialog.value = false
}

const confirmDelete = (user: any) => {
  selectedUser.value = user
  deleteDialog.value = true
}

const executeDelete = async () => {
  if (selectedUser.value) {
    await api.delete(`/users/${selectedUser.value.id}`)
    fetchUsers()
  }
  deleteDialog.value = false
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

.search-refined :deep(.v-field) {
  border: 1px solid #e2e8f0 !important;
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(8px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-refined :deep(.v-field--focused) {
  background: white !important;
  border-color: #d4af37 !important;
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.1) !important;
  transform: translateY(-2px);
}

.tabs-container-premium {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.badge-custom-elite {
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 900;
  min-width: 18px;
  height: 18px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  box-shadow: 0 2px 5px rgba(239, 68, 68, 0.4);
}

.tabs-elite-full :deep(.v-tab) {
  flex: 1;
  height: 52px !important;
  font-size: 0.85rem !important;
  font-weight: 800 !important;
  color: #64748b !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px !important;
}

.tabs-elite-full :deep(.v-tab--selected) {
  background: #0f172a !important;
  color: #fbbf24 !important;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3) !important;
}

.tabs-elite-full :deep(.v-tab__slider) {
  display: none !important;
}

.empty-state-premium {
  background: white;
  border: 1px dashed #e2e8f0;
  border-radius: 24px;
  text-align: center;
}

/* DIALOGS ELITE DARK */
.elite-dark-modal {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7) !important;
}

.elite-modal-glow {
  height: 2px;
  width: 100%;
}

.icon-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.bg-amber-op { background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.2); }
.bg-white-op { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); }
.bg-error-op { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); }

.modal-title-white {
  font-family: 'Playfair Display', serif;
  font-size: 1.85rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.modal-subtitle-silver {
  font-size: 0.95rem;
  color: #94a3b8;
  font-weight: 500;
}

.btn-elite-gold {
  font-weight: 900 !important;
  letter-spacing: 1.5px !important;
  color: #0f172a !important;
  text-transform: uppercase !important;
  box-shadow: 0 10px 20px rgba(251, 191, 36, 0.3) !important;
}

.btn-elite-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(251, 191, 36, 0.4) !important;
}

.btn-elite-danger-v2 {
  font-weight: 900 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
}

.btn-elite-cancel {
  font-weight: 800 !important;
  letter-spacing: 0.5px !important;
  text-transform: none !important;
  color: rgba(255,255,255,0.5) !important;
}

.select-dark-elite :deep(.v-field) {
  border-radius: 12px !important;
  color: white !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
}

.select-dark-elite :deep(.v-field__input) {
  color: white !important;
}

@media (max-width: 600px) {
  .page-title-elite {
    font-size: 1.75rem;
  }
}
</style>

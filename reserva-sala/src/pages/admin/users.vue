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
              :show-arrows="false"
            >
              <v-tab value="PENDING" class="tab-item-elite text-none px-2 px-md-4">
                <v-icon :start="!$vuetify.display.mobile" icon="mdi-account-clock" size="18" />
                <span class="tab-text-elite">{{ $vuetify.display.mobile ? 'Pend.' : 'Solicitudes' }}</span>
                <span v-if="pendingCount > 0" class="badge-custom-elite ms-1">{{ pendingCount }}</span>
              </v-tab>
              <v-tab value="APPROVED" class="tab-item-elite text-none px-2 px-md-4">
                <v-icon :start="!$vuetify.display.mobile" icon="mdi-account-check" size="18" />
                <span class="tab-text-elite">{{ $vuetify.display.mobile ? 'Act.' : 'Activos' }}</span>
              </v-tab>
              <v-tab value="BLOCKED" class="tab-item-elite text-none px-2 px-md-4">
                <v-icon :start="!$vuetify.display.mobile" icon="mdi-account-cancel" size="18" />
                <span class="tab-text-elite">{{ $vuetify.display.mobile ? 'Sanc.' : 'Sancionados' }}</span>
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

    <!-- Modals -->
    <UserBlockModal
      v-model="blockDialog"
      :loading="loading"
      @confirm="applyBlock"
    />

    <UserConfirmModal
      v-model="confirmDialog"
      :user-name="selectedUser?.first_name"
      :loading="loading"
      @confirm="executeConfirmedAction"
    />

    <UserDeleteModal
      v-model="deleteDialog"
      :loading="loading"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { userService } from '@/services/user.service'
import type { User, UserStatus } from '@/types'
import UserListItem from '@/components/admin/UserListItem.vue'
import UserBlockModal from '@/components/admin/modals/UserBlockModal.vue'
import UserConfirmModal from '@/components/admin/modals/UserConfirmModal.vue'
import UserDeleteModal from '@/components/admin/modals/UserDeleteModal.vue'

const users = ref<User[]>([])
const activeStatus = ref<UserStatus>('PENDING')
const search = ref('')
const loading = ref(false)

const blockDialog = ref(false)
const confirmDialog = ref(false)
const deleteDialog = ref(false)
const selectedUser = ref<User | null>(null)
const pendingAction = ref<{ type: string, userId: string, status: UserStatus } | null>(null)

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

const fetchUsers = async () => {
  try {
    users.value = await userService.getAll()
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const updateStatus = (userId: string, status: UserStatus) => {
  const user = users.value.find(u => u.id === userId)
  selectedUser.value = user || null
  pendingAction.value = { type: 'status', userId, status }
  confirmDialog.value = true
}

const executeConfirmedAction = async () => {
  if (pendingAction.value) {
    loading.value = true
    try {
      await userService.updateStatus(pendingAction.value.userId, pendingAction.value.status)
      await fetchUsers()
      confirmDialog.value = false
      pendingAction.value = null
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      loading.value = false
    }
  }
}

const openBlockDialog = (user: User) => {
  selectedUser.value = user
  blockDialog.value = true
}

const applyBlock = async (days: number) => {
  if (!selectedUser.value) return
  
  loading.value = true
  try {
    const date = new Date()
    date.setDate(date.getDate() + days)
    await userService.updateStatus(selectedUser.value.id, 'BLOCKED', date.toISOString())
    await fetchUsers()
    blockDialog.value = false
  } catch (error) {
    console.error('Error applying block:', error)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (user: User) => {
  selectedUser.value = user
  deleteDialog.value = true
}

const executeDelete = async () => {
  if (selectedUser.value) {
    loading.value = true
    try {
      await userService.delete(selectedUser.value.id)
      await fetchUsers()
      deleteDialog.value = false
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      loading.value = false
    }
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
  height: 48px !important;
  font-size: 0.75rem !important;
  font-weight: 800 !important;
  color: #64748b !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px !important;
  min-width: auto !important;
}

.tabs-elite-full :deep(.v-tab--selected) {
  background: #0f172a !important;
  color: #fbbf24 !important;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.2) !important;
}

@media (max-width: 600px) {
  .tab-text-elite {
    font-size: 0.65rem;
    margin-left: 4px;
  }
  .tabs-elite-full :deep(.v-tab) {
    padding: 0 8px !important;
  }
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

@media (max-width: 600px) {
  .page-title-elite {
    font-size: 1.75rem;
  }
}
</style>


<template>
  <div class="premium-page">
    <div class="d-flex align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-black text-gradient mb-1">Gestión de Usuarios</h1>
        <p class="text-subtitle-2 text-medium-emphasis">Aprueba o rechaza solicitudes de registro y gestiona los vecinos.</p>
      </div>
      <v-spacer />
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar vecino..."
        variant="solo"
        rounded="xl"
        flat
        density="comfortable"
        hide-details
        class="max-width-300 elevation-2"
      />
    </div>

    <v-card rounded="xl" class="glass-card border-0 elevation-4 overflow-hidden">
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :loading="loading"
        class="bg-transparent"
        hover
      >
        <template v-slot:item.full_name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="primary" size="36" class="me-3 elevation-2">
              <span class="text-caption text-white font-weight-bold">{{ item.first_name?.charAt(0) || 'U' }}</span>
            </v-avatar>
            <div class="font-weight-bold">{{ item.first_name }} {{ item.last_name }}</div>
          </div>
        </template>

        <template v-slot:item.address_full="{ item }">
          <div class="text-caption">
            {{ item.address }}, P:{{ item.portal }}, {{ item.floor }}º{{ item.letter }}
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            class="font-weight-bold px-3"
            rounded="lg"
            variant="flat"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2">
            <v-btn
              v-if="item.status === 'PENDING'"
              icon="mdi-check"
              color="success"
              variant="tonal"
              size="small"
              @click="handleUpdateStatus(item.id, 'APPROVED')"
              title="Aprobar"
            />
            <v-btn
              v-if="item.status === 'PENDING'"
              icon="mdi-close"
              color="error"
              variant="tonal"
              size="small"
              @click="handleUpdateStatus(item.id, 'REJECTED')"
              title="Rechazar"
            />
            <v-btn
              icon="mdi-delete-outline"
              color="error"
              variant="text"
              size="small"
              @click="confirmDelete(item)"
              title="Eliminar"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">¿Eliminar usuario?</v-card-title>
        <v-card-text>
          Esta acción eliminará permanentemente a <strong>{{ selectedUser?.first_name }} {{ selectedUser?.last_name }}</strong> y todas sus reservas.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" rounded="xl" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" rounded="xl" @click="handleDelete" :loading="actionLoading">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const users = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const deleteDialog = ref(false)
const selectedUser = ref<any>(null)
const actionLoading = ref(false)

const headers = [
  { title: 'Nombre', key: 'full_name' },
  { title: 'Email', key: 'email' },
  { title: 'Vivienda', key: 'address_full' },
  { title: 'Rol', key: 'role' },
  { title: 'Estado', key: 'status' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await api.get('/users')
    users.value = res.data
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'success'
    case 'PENDING': return 'warning'
    case 'REJECTED': return 'error'
    default: return 'grey'
  }
}

const handleUpdateStatus = async (userId: string, status: string) => {
  try {
    await api.patch(`/users/${userId}/status`, { status })
    fetchUsers()
  } catch (err) {
    console.error('Error updating status:', err)
  }
}

const confirmDelete = (user: any) => {
  selectedUser.value = user
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!selectedUser.value) return
  actionLoading.value = true
  try {
    await api.delete(`/users/${selectedUser.value.id}`)
    deleteDialog.value = false
    fetchUsers()
  } catch (err) {
    console.error('Error deleting user:', err)
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style>

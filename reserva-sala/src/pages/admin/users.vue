<template>
  <div class="premium-page">
    <div class="d-flex align-center mb-8">
      <div>
        <h1 class="text-h4 font-weight-black text-gradient mb-1">Panel de Admisión</h1>
        <p class="text-subtitle-2 text-medium-emphasis">Gestiona las solicitudes de acceso y los vecinos admitidos.</p>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-account-plus"
        rounded="xl"
        class="font-weight-black elevation-4 px-6 me-4"
        @click="openAddUserDialog"
      >
        Añadir Vecino
      </v-btn>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar..."
        variant="solo"
        rounded="xl"
        flat
        density="comfortable"
        hide-details
        class="max-width-300 elevation-2"
      />
    </div>

    <v-tabs v-model="activeTab" color="primary" class="mb-6">
      <v-tab value="pending">
        Pendientes
        <v-badge
          v-if="pendingUsers.length > 0"
          :content="pendingUsers.length"
          color="error"
          inline
        />
      </v-tab>
      <v-tab value="approved">Admitidos</v-tab>
      <v-tab value="rejected">Rechazados</v-tab>
    </v-tabs>

    <v-card rounded="xl" class="glass-card border-0 elevation-4 overflow-hidden">
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
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
            <div>
              <div class="font-weight-bold">{{ item.first_name }} {{ item.last_name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.address_full="{ item }">
          <div class="text-caption">
            {{ item.address }}, P:{{ item.portal }}, {{ item.floor }}º{{ item.letter }}
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2">
            <v-btn
              v-if="item.status === 'PENDING' || item.status === 'REJECTED'"
              icon="mdi-check"
              color="success"
              variant="tonal"
              size="small"
              @click="handleUpdateStatus(item.id, 'APPROVED')"
              title="Admitir"
            />
            <v-btn
              v-if="item.status === 'PENDING' || item.status === 'APPROVED'"
              icon="mdi-close"
              color="error"
              variant="tonal"
              size="small"
              @click="handleUpdateStatus(item.id, 'REJECTED')"
              title="Denegar acceso"
            />
            <v-btn
              icon="mdi-delete-outline"
              color="error"
              variant="text"
              size="small"
              @click="confirmDelete(item)"
              title="Eliminar permanentemente"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Manual User Dialog -->
    <v-dialog v-model="addUserDialog" max-width="600">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h5 font-weight-bold">Añadir Vecino Manualmente</v-card-title>
        <v-card-text>
          <v-form v-model="formValid" ref="formRef">
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="newUser.firstName" label="Nombre" variant="outlined" rounded="lg" :rules="[v => !!v || 'Requerido']" />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="newUser.lastName" label="Apellidos" variant="outlined" rounded="lg" :rules="[v => !!v || 'Requerido']" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newUser.email" label="Email" variant="outlined" rounded="lg" :rules="[v => !!v || 'Requerido', v => /.+@.+\..+/.test(v) || 'Email inválido']" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newUser.password" label="Contraseña" type="password" variant="outlined" rounded="lg" :rules="[v => !!v || 'Requerido']" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newUser.address" label="Dirección" variant="outlined" rounded="lg" :rules="[v => !!v || 'Requerido']" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="newUser.portal" label="Portal" variant="outlined" rounded="lg" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="newUser.floor" label="Piso" variant="outlined" rounded="lg" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="newUser.letter" label="Letra" variant="outlined" rounded="lg" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" rounded="xl" @click="addUserDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" rounded="xl" @click="handleAddUser" :loading="actionLoading">Admitir Vecino</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const users = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const activeTab = ref('pending')
const deleteDialog = ref(false)
const addUserDialog = ref(false)
const selectedUser = ref<any>(null)
const actionLoading = ref(false)
const formValid = ref(false)
const formRef = ref<any>(null)

const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  address: '',
  portal: '',
  floor: '',
  letter: ''
})

const headers = [
  { title: 'Vecino', key: 'full_name' },
  { title: 'Vivienda', key: 'address_full' },
  { title: 'Rol', key: 'role' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const pendingUsers = computed(() => users.value.filter(u => u.status === 'PENDING'))
const filteredUsers = computed(() => {
  return users.value.filter(u => u.status === activeTab.value.toUpperCase())
})

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

const handleUpdateStatus = async (userId: string, status: string) => {
  try {
    await api.patch(`/users/${userId}/status`, { status })
    fetchUsers()
  } catch (err) {
    console.error('Error updating status:', err)
  }
}

const openAddUserDialog = () => {
  newUser.value = { firstName: '', lastName: '', email: '', password: '', address: '', portal: '', floor: '', letter: '' }
  addUserDialog.value = true
}

const handleAddUser = async () => {
  if (!formValid.value) return
  actionLoading.value = true
  try {
    await api.post('/users', newUser.value)
    addUserDialog.value = false
    fetchUsers()
    activeTab.value = 'approved'
  } catch (err) {
    console.error('Error adding user:', err)
  } finally {
    actionLoading.value = false
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

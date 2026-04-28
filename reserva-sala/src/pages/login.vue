<template>
  <v-container fluid class="fill-height pa-0 login-bg">
    <v-row no-gutters class="fill-height">
      <!-- Left Side: Branding/Image (Hidden on mobile) -->
      <v-col
        cols="12"
        md="7"
        lg="8"
        class="d-none d-md-flex align-center justify-center relative bg-primary-darken-1"
      >
        <div class="pa-12 text-white relative z-10">
          <v-icon icon="mdi-office-building-marker" size="80" class="mb-6" />
          <h1 class="text-h2 font-weight-bold mb-4">Optimize Your Workspace</h1>
          <p class="text-h5 text-medium-emphasis">Efficient room booking and resource management for modern teams.</p>
        </div>
        <div class="overlay" />
      </v-col>

      <!-- Right Side: Login Form -->
      <v-col
        cols="12"
        md="5"
        lg="4"
        class="d-flex align-center justify-center bg-background relative"
      >
        <div class="pa-4 w-100 d-flex justify-center">
          <v-card flat width="440" class="pa-10 glass-card rounded-xl elevation-4 hover-lift">
            <div class="text-center mb-10">
              <v-icon icon="mdi-office-building-marker" color="primary" size="56" class="mb-4 d-md-none" />
              <h2 class="text-h3 font-weight-black mb-2 text-gradient">Welcome</h2>
              <p class="text-subtitle-1 text-medium-emphasis font-weight-medium">Access your workspace booking</p>
            </div>

            <v-form @submit.prevent="handleLogin" v-model="valid">
              <v-text-field
                v-model="email"
                label="Email Address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                rounded="lg"
                class="mb-4"
                density="comfortable"
                :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                required
              />

              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock-outline"
                type="password"
                variant="outlined"
                rounded="lg"
                class="mb-6"
                density="comfortable"
                required
              />

              <v-btn
                block
                color="primary"
                size="x-large"
                rounded="xl"
                type="submit"
                :loading="loading"
                class="text-none font-weight-black premium-gradient-btn elevation-8"
              >
                Sign In
              </v-btn>

              <div class="mt-8 text-center">
                <span class="text-body-2 text-medium-emphasis">Need access? </span>
                <a href="#" class="text-body-2 font-weight-black text-primary text-decoration-none">Contact Administrator</a>
              </div>
            </v-form>

            <!-- Quick Mock Access -->
            <v-divider class="my-10 opacity-50" />
            <div class="text-center">
              <p class="text-caption text-medium-emphasis font-weight-bold mb-4">MOCK ACCOUNTS</p>
              <div class="d-flex justify-center flex-wrap gap-2">
                <v-chip variant="tonal" color="primary" size="small" @click="email = 'admin@example.com'" class="cursor-pointer font-weight-bold">Super Admin</v-chip>
                <v-chip variant="tonal" color="secondary" size="small" @click="email = 'manager@example.com'" class="cursor-pointer font-weight-bold">Manager</v-chip>
                <v-chip variant="tonal" color="info" size="small" @click="email = 'john@example.com'" class="cursor-pointer font-weight-bold">User</v-chip>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('admin@example.com')
const password = ref('password')
const loading = ref(false)
const valid = ref(false)

const handleLogin = async () => {
  if (!valid.value) return
  
  loading.value = true
  try {
    await authStore.login(email.value)
    router.push('/')
  } catch (error) {
    alert('Login failed: ' + (error as Error).message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  background-color: rgb(var(--v-theme-background));
}

.relative {
  position: relative;
}

.z-10 {
  z-index: 10;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.8) 0%, rgba(var(--v-theme-primary-darken-1), 0.9) 100%);
}

.cursor-pointer {
  cursor: pointer;
}

.gap-2 {
  gap: 8px;
}
</style>

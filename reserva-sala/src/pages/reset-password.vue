<template>
  <v-container fluid class="fill-height pa-0 auth-bg">
    <v-row no-gutters class="fill-height align-center justify-center">
      <v-col cols="12" sm="8" md="6" lg="4" class="pa-4">
        <v-card flat class="pa-10 glass-card rounded-xl elevation-4 text-center">
          <v-icon icon="mdi-shield-lock-outline" color="primary" size="64" class="mb-6" />
          <h2 class="text-h3 font-weight-black mb-2">Reset Password</h2>
          <p class="text-subtitle-1 text-medium-emphasis mb-8">
            Create a new secure password for your account.
          </p>

          <v-form @submit.prevent="handleSubmit" v-model="valid">
            <v-text-field
              v-model="password"
              label="New Password"
              prepend-inner-icon="mdi-lock-outline"
              type="password"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              density="comfortable"
              :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Min 6 characters']"
              required
            />

            <v-text-field
              v-model="confirmPassword"
              label="Confirm Password"
              prepend-inner-icon="mdi-lock-check-outline"
              type="password"
              variant="outlined"
              rounded="lg"
              class="mb-6"
              density="comfortable"
              :rules="[v => v === password || 'Passwords must match']"
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
              Update Password
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/auth.service'

const router = useRouter()
const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const valid = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const token = ref('')

onMounted(() => {
  token.value = route.query.token as string || ''
  if (!token.value) {
    snackbarText.value = 'Invalid or missing token'
    snackbarColor.value = 'error'
    snackbar.value = true
    setTimeout(() => router.push('/login'), 3000)
  }
})

const handleSubmit = async () => {
  if (!valid.value) return
  
  loading.value = true
  try {
    await authService.resetPassword(token.value, password.value)
    snackbarText.value = 'Password updated successfully! Redirecting to login...'
    snackbarColor.value = 'success'
    snackbar.value = true
    setTimeout(() => router.push('/login'), 2000)
  } catch (error: any) {
    snackbarText.value = error.response?.data?.message || 'Failed to reset password'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-bg {
  background: linear-gradient(135deg, rgb(var(--v-theme-background)) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
}
</style>

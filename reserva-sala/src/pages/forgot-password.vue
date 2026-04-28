<template>
  <v-container fluid class="fill-height pa-0 auth-bg">
    <v-row no-gutters class="fill-height align-center justify-center">
      <v-col cols="12" sm="8" md="6" lg="4" class="pa-4">
        <v-card flat class="pa-10 glass-card rounded-xl elevation-4 text-center">
          <v-icon icon="mdi-lock-reset" color="primary" size="64" class="mb-6" />
          <h2 class="text-h3 font-weight-black mb-2">Forgot Password?</h2>
          <p class="text-subtitle-1 text-medium-emphasis mb-8">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <v-form v-if="!submitted" @submit.prevent="handleSubmit" v-model="valid">
            <v-text-field
              v-model="email"
              label="Email Address"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              rounded="lg"
              class="mb-6"
              density="comfortable"
              :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
              required
            />

            <v-btn
              block
              color="primary"
              size="x-large"
              rounded="xl"
              type="submit"
              :loading="loading"
              class="text-none font-weight-black premium-gradient-btn elevation-8 mb-6"
            >
              Send Reset Link
            </v-btn>

            <router-link to="/login" class="text-body-2 font-weight-bold text-primary text-decoration-none">
              Back to Login
            </router-link>
          </v-form>

          <div v-else class="py-4">
            <v-alert
              type="success"
              variant="tonal"
              class="mb-6 rounded-lg text-left"
              title="Check your email"
              text="If an account exists for that email, you will receive a password reset link shortly."
            />
            <v-btn
              block
              variant="outlined"
              color="primary"
              size="large"
              rounded="xl"
              to="/login"
              class="text-none font-weight-bold"
            >
              Return to Login
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '@/services/auth.service'

const email = ref('')
const valid = ref(false)
const loading = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  if (!valid.value) return
  
  loading.value = true
  try {
    await authService.forgotPassword(email.value)
    submitted.value = true
  } catch (error) {
    // We usually show success even if user not found for security, 
    // but here we just proceed to success state
    submitted.value = true
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

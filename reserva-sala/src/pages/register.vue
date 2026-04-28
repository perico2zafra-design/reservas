<template>
  <v-container fluid class="fill-height pa-0 register-bg">
    <v-row no-gutters class="fill-height">
      <!-- Left Side: Branding (Hidden on mobile) -->
      <v-col
        cols="12"
        md="7"
        lg="8"
        class="d-none d-md-flex align-center justify-center relative bg-primary-darken-1"
      >
        <div class="pa-12 text-white relative z-10">
          <v-icon icon="mdi-account-plus-outline" size="80" class="mb-6" />
          <h1 class="text-h2 font-weight-bold mb-4">Join Our Community</h1>
          <p class="text-h5 text-medium-emphasis">Start managing your workspace more efficiently today.</p>
        </div>
        <div class="overlay" />
      </v-col>

      <!-- Right Side: Register Form -->
      <v-col
        cols="12"
        md="5"
        lg="4"
        class="d-flex align-center justify-center bg-background relative"
      >
        <div class="pa-4 w-100 d-flex justify-center">
          <v-card flat width="440" class="pa-10 glass-card rounded-xl elevation-4">
            <div class="text-center mb-10">
              <h2 class="text-h3 font-weight-black mb-2 text-gradient">Create Account</h2>
              <p class="text-subtitle-1 text-medium-emphasis">Fill in your details to get started</p>
            </div>

            <v-form @submit.prevent="handleRegister" v-model="valid">
              <v-text-field
                v-model="name"
                label="Full Name"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                rounded="lg"
                class="mb-4"
                density="comfortable"
                :rules="[v => !!v || 'Name is required']"
                required
              />

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
                :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Min 6 characters']"
                required
              />

              <v-btn
                block
                color="primary"
                size="x-large"
                rounded="xl"
                type="submit"
                :loading="authStore.loading"
                class="text-none font-weight-black premium-gradient-btn elevation-8"
              >
                Sign Up
              </v-btn>

              <div class="mt-8 text-center">
                <span class="text-body-2 text-medium-emphasis">Already have an account? </span>
                <router-link to="/login" class="text-body-2 font-weight-black text-primary text-decoration-none">
                  Sign In
                </router-link>
              </div>
            </v-form>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="showError" color="error" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const valid = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  if (!valid.value) return
  
  try {
    await authStore.register({ 
      name: name.value, 
      email: email.value, 
      password: password.value 
    })
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Registration failed'
    showError.value = true
  }
}
</script>

<style scoped>
.register-bg {
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

.text-gradient {
  background: linear-gradient(to right, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

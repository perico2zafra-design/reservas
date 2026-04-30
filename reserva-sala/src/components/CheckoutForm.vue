<template>
  <div class="stripe-checkout">
    <div id="payment-element" class="mb-6"></div>
    
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      rounded="lg"
    >
      {{ errorMessage }}
    </v-alert>

    <div class="d-flex align-center justify-space-between mb-6 pa-4 bg-primary-lighten-5 rounded-lg border">
      <div>
        <div class="text-caption text-medium-emphasis">Fianza Reembolsable</div>
        <div class="text-h5 font-weight-black text-primary">50,00 €</div>
      </div>
      <v-icon icon="mdi-shield-check" color="primary" size="32" />
    </div>

    <v-btn
      block
      color="primary"
      size="x-large"
      rounded="xl"
      class="text-none font-weight-black premium-gradient-btn"
      :loading="loading"
      @click="handleSubmit"
    >
      Pagar Fianza y Reservar
    </v-btn>
    
    <p class="text-center text-caption text-medium-emphasis mt-4">
      Pago seguro procesado por Stripe. La fianza se devolverá tras la revisión de la sala.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

const props = defineProps<{
  clientSecret: string
}>()

const emit = defineEmits(['success', 'error'])

const stripe = ref<any>(null)
const elements = ref<any>(null)
const loading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  // Usar una clave de prueba pública (el usuario debería cambiarla por la suya)
  stripe.value = await loadStripe('pk_test_placeholder')
  
  elements.value = stripe.value.elements({
    clientSecret: props.clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#1867C0',
        borderRadius: '12px'
      }
    }
  })

  const paymentElement = elements.value.create('payment')
  paymentElement.mount('#payment-element')
})

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const { error, paymentIntent } = await stripe.value.confirmPayment({
      elements: elements.value,
      redirect: 'if_required'
    })

    if (error) {
      errorMessage.value = error.message
      emit('error', error.message)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      emit('success', paymentIntent.id)
    }
  } catch (e: any) {
    errorMessage.value = 'Error al procesar el pago'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.stripe-checkout {
  min-height: 300px;
}
</style>

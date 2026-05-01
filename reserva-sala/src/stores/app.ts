import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    snackbar: {
      show: false,
      message: '',
      type: 'success' as 'success' | 'error' | 'info' | 'warning',
      timeout: 4000
    }
  }),
  actions: {
    setLoading(value: boolean) {
      this.loading = value
    },
    showSnackbar(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', timeout = 4000) {
      this.snackbar.message = message
      this.snackbar.type = type
      this.snackbar.timeout = timeout
      this.snackbar.show = true
      
      // Auto hide
      setTimeout(() => {
        this.hideSnackbar()
      }, timeout)
    },
    hideSnackbar() {
      this.snackbar.show = false
    },
    showSuccess(message: string) {
      this.showSnackbar(message, 'success')
    },
    showError(message: string) {
      this.showSnackbar(message, 'error')
    }
  }
})

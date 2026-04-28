import { defineStore } from 'pinia';
import type { User, UserRole } from '@/types';
import { appService } from '@/services/app.service';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isSuperAdmin: (state) => state.user?.role === 'SUPER_ADMIN',
    isBlockAdmin: (state) => state.user?.role === 'BLOCK_ADMIN' || state.user?.role === 'SUPER_ADMIN',
  },
  actions: {
    async login(email: string) {
      this.loading = true;
      try {
        const user = await appService.login(email);
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },
    initialize() {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
  }
});

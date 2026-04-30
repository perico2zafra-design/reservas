import { defineStore } from 'pinia';
import type { User, LoginData, RegisterData } from '@/types/auth';
import { authService } from '@/services/auth.service';
import api from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'SUPERADMIN',
    isSuperAdmin: (state) => state.user?.role === 'SUPERADMIN',
    isBlockAdmin: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'SUPERADMIN',
  },
  actions: {
    async login(data: LoginData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await authService.login(data);
        this.setAuth(res);
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async register(data: RegisterData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await authService.register(data);
        this.setAuth(res);
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Registration failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    setAuth(res: { token: string, user: User }) {
      this.token = res.token;
      this.user = res.user;
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    },
    async initialize() {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (token && savedUser) {
        this.token = token;
        this.user = JSON.parse(savedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Optional: verify token by fetching profile
        try {
          const freshUser = await authService.getMe();
          this.user = freshUser;
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (err) {
          this.logout();
        }
      }
    }
  }
});


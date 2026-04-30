import api from './api';
import type { User, UserStatus } from '@/types';

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await api.get('/users');
    return res.data;
  },

  async updateStatus(id: string, status: UserStatus, blockedUntil: string | null = null): Promise<User> {
    const res = await api.patch(`/users/${id}/status`, { status, blocked_until: blockedUntil });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.patch('/users/me', data);
    return res.data;
  }
};

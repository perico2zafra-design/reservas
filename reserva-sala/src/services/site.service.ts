import api from './api';
import type { SiteSettings } from '@/types';

export const siteService = {
  async getSettings(): Promise<SiteSettings> {
    const res = await api.get('/settings');
    return Array.isArray(res.data) ? res.data[0] : res.data;
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await api.patch('/settings', data);
    return res.data;
  }
};

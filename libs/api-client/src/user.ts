import { User } from '@lexora/types';
import { apiClient } from './api.ts';

export const user = {
  getMe: async (token: string) => {
    const res = await apiClient.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  getUsers: async (token: string) => {
    const res = await apiClient.get<User[]>('/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

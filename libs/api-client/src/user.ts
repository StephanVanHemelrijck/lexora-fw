import { User } from '@lexora/types';
import { api } from './api.ts';

export const user = {
  getMe: async (token: string) => {
    const res = await api.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  getUsers: async (token: string) => {
    const res = await api.get<User[]>('/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

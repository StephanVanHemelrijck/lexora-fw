import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error (no server response)
      console.warn('Network error detected:', error.message);
    }

    return Promise.reject(error);
  }
);

import axios from 'axios';

const baseURL = 'http://192.168.0.129:3000/api'; // local
const baseURLProd = 'https://stephanvh.com/api'; // cloud

export const apiClient = axios.create({
  baseURL: baseURLProd,
  timeout: 60000, // 1 minute
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;
  console.log('[AXIOS REQUEST]:', config.method?.toUpperCase(), fullUrl);
  return config;
});

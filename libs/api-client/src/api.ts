import axios from 'axios';

const baseURL = 'http://192.168.0.129:3000/api'; // use local
const baseURLProd = 'https://stephanvh.com/api'; // use production

export const apiClient = axios.create({
  baseURL: 'https://stephanvh.com/api',
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

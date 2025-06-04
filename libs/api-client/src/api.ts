import axios from 'axios';

const baseURL = 'http://192.168.0.129:3000/api';
const baseURLProd = 'https://stephanvh.com/api';

export const api = axios.create({
  baseURL: baseURL,
  timeout: 60000, // 1 minute
  headers: {
    'Content-Type': 'application/json',
  },
});

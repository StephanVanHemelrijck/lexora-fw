import axios from 'axios';

const baseURL = 'http://192.168.0.129:3000/api'; // use local
const baseURLProd = 'https://stephanvh.com/api'; // use production

export const api = axios.create({
  baseURL: baseURLProd,
  timeout: 60000, // 1 minute
  headers: {
    'Content-Type': 'application/json',
  },
});

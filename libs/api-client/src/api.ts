import axios from 'axios';

// const baseURL = 'http://192.168.0.129:3000/api';
const baseURLProd = 'https://stephanvh.com/api';

export const api = axios.create({
  baseURL: baseURLProd,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

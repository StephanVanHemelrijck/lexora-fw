import axios from 'axios';

const MOBILE_BASE_URL = 'http://192.168.0.129:3000/api';
const WEB_BASE_URL = 'http://localhost:3000/api';

console.log(MOBILE_BASE_URL, WEB_BASE_URL);

export const api = axios.create({
  baseURL: MOBILE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

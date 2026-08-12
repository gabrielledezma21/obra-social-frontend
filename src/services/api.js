import axios from 'axios';

const configuredUrl = import.meta.env.VITE_API_URL?.trim();
const defaultUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3002'
    : 'https://medintegral-api.vercel.app';

const api = axios.create({
  baseURL: (configuredUrl || defaultUrl).replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export default api;

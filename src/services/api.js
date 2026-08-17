import axios from 'axios';

const CLAVE_TOKEN = 'medintegral_token';
const urlConfigurada = import.meta.env.VITE_API_URL?.trim();
const urlPredeterminada =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3002'
    : 'https://medintegral-api.vercel.app';

const clienteApi = axios.create({
  baseURL: (urlConfigurada || urlPredeterminada).replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

clienteApi.interceptors.request.use((configuracion) => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) configuracion.headers.Authorization = `Bearer ${token}`;
  return configuracion;
});

export default clienteApi;

import axios from 'axios';

export const TOKEN_KEY = 'acai:admin-token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://api-acai-delivey.onrender.com',
  // Render's free tier can take ~50s to wake up
  timeout: 60000,
});

// Sends the admin token (when logged in) on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Human-readable message from an API/axios error. */
export function apiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
    const data = error.response.data as { error?: string } | undefined;
    if (data?.error) return data.error;
  }
  return fallback;
}

import axios from 'axios';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    if (host === 'servdeal-frontend.onrender.com') {
      return 'https://servdeal-backend.onrender.com/api/v1';
    }
    if (host.endsWith('.onrender.com')) {
      return `https://${host.replace('.onrender.com', '')}-backend.onrender.com/api/v1`;
    }
  }
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return 'http://localhost:5000/api/v1';
};

const api = axios.create({
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const baseURL = getApiUrl();
  // Explicitly build absolute URL — do not rely on axios baseURL merging
  if (config.url && !config.url.startsWith('http')) {
    const cleanBase = baseURL.replace(/\/$/, '');
    const cleanUrl = config.url.replace(/^\//, '');
    config.url = `${cleanBase}/${cleanUrl}`;
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || '';
    // Skip redirect for /auth/me (handled by AuthInit) and for non-401 errors
    const isAuthMe = url.includes('/auth/me');
    if (status === 401 && typeof window !== 'undefined' && !isAuthMe) {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

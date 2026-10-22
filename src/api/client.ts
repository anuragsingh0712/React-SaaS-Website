import axios from 'axios';
import toast from 'react-hot-toast';

// Single shared axios instance. Every store/service module's non-mock branch
// should import this instead of instantiating axios/fetch ad hoc.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

apiClient.interceptors.request.use((config: import('axios').InternalAxiosRequestConfig) => {
  const raw = localStorage.getItem('auth_token');
  if (raw) {
    const token = JSON.parse(raw);
    config.headers = config.headers ?? ({} as import('axios').AxiosRequestHeaders);
    config.headers.Authorization = `Bearer ${token.userId ?? ''}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: import('axios').AxiosResponse) => response,
  (error: import('axios').AxiosError<{ message?: string }>) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
    toast.error(message);
    return Promise.reject(error);
  },
);

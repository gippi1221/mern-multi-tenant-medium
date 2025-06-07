import axios from 'axios';
import { refreshToken } from './endpoints/auth';
import { appRoutes } from '@/router/routes';

const getBaseURL = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = import.meta.env.VITE_API_PORT || 5050;
  return `${protocol}//${hostname}:${port}/api`;
};

const $host = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

$host.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._isRetry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            originalRequest._isRetry = true;
            return $host(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        await refreshToken();
        processQueue(null);
        return $host(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        if (axios.isAxiosError(refreshError) && refreshError.response?.status === 409) {
          window.location.href = appRoutes.SIGN_IN_ROUTE;
          return new Promise(() => {});
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default $host;
export * from './endpoints/books';
export * from './endpoints/auth';
export * from './endpoints/tenants';

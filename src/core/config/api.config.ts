import { getEnvVar } from './env.utils';

export const apiConfig = {
  baseURL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080/api'),
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000,
} as const;

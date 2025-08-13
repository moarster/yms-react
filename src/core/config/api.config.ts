import { getEnvVar } from './index'

export const apiConfig = {
    baseURL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080/api'),
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
} as const
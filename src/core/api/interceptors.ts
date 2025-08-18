import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import { ApiError } from './api.types.ts';

export interface TokenProvider {
  getToken: () => null | string;
  logout: () => void;
  refreshToken: () => Promise<string>;
}

export class ApiInterceptors {
  private tokenProvider: null | TokenProvider = null;

  constructor(
    private client: AxiosInstance,
    private abortControllers: Map<string, AbortController>,
  ) {}

  setTokenProvider(provider: TokenProvider) {
    this.tokenProvider = provider;
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }
  private getRequestKey(config: AxiosRequestConfig): null | string {
    if (config.method?.toUpperCase() === 'GET' && config.url) {
      return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
    }
    return null;
  }
  private setupRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.tokenProvider?.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const requestKey = this.getRequestKey(config);
        if (requestKey) {
          // Cancel previous request if exists
          this.cancelRequest(requestKey);

          // Create new abort controller
          const controller = new AbortController();
          this.abortControllers.set(requestKey, controller);
          config.signal = controller.signal;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  private setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Clean up abort controller
        const requestKey = this.getRequestKey(response.config);
        if (requestKey) {
          this.abortControllers.delete(requestKey);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.tokenProvider?.refreshToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client.request(originalRequest);
            }
          } catch (refreshError) {
            this.tokenProvider?.logout();
            this.redirectToLogin();
            return Promise.reject(refreshError);
          }
        }

        let message: string;

        const data = error.response && error.response.data;
        if (data && typeof data === 'object' && 'message' in data) {
          message = String((data as { message?: unknown }).message);
        } else {
          message = error.message || 'An error occurred';
        }

        const apiError: ApiError = {
          code: error.response?.status?.toString() || 'UNKNOWN',
          details: { data },
          message,
          path: originalRequest.url,
          timestamp: new Date().toISOString(),
        };

        if (error.response?.status !== 401) {
          toast.error(apiError.message);
        }
        if (error.config) {
          const requestKey = this.getRequestKey(error.config);
          if (requestKey) {
            this.abortControllers.delete(requestKey);
          }
        }

        return Promise.reject(apiError);
      },
    );
  }
  private cancelRequest(key: string) {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(key);
    }
  }
  public cancelAll() {
    this.abortControllers.forEach((controller) => controller.abort());
    this.abortControllers.clear();
  }
  private redirectToLogin() {
    // Avoid redirect during login/logout flows
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
}

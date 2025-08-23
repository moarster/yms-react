import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { BaseEntity } from '@/types';

import { apiConfig } from '../config';
import { PaginatedResponse } from './api.types.ts';
import { ApiInterceptors, TokenProvider } from './interceptors';

class RequestBatcher {
  private queue = new Map<string, Promise<any>>();
  private batchTimeout = 10; // ms

  async batch<T>(key: string, request: () => Promise<T>): Promise<T> {
    // Check if request is already in queue
    if (this.queue.has(key)) {
      return this.queue.get(key) as Promise<T>;
    }

    // Add to queue
    const promise = request().finally(() => {
      // Remove from queue after completion
      setTimeout(() => this.queue.delete(key), this.batchTimeout);
    });

    this.queue.set(key, promise);
    return promise;
  }
}

export class Client {
  private readonly client: AxiosInstance;
  private batcher = new RequestBatcher();
  private abortControllers = new Map<string, AbortController>();
  public interceptors: ApiInterceptors;

  constructor() {
    this.client = axios.create({
      baseURL: apiConfig.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: apiConfig.timeout,
    });

    this.interceptors = new ApiInterceptors(this.client, this.abortControllers);
  }

  setTokenProvider(provider: TokenProvider) {
    this.interceptors.setTokenProvider(provider);
  }

  async get<T extends BaseEntity>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async getMany<T extends BaseEntity>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<PaginatedResponse<T>> {
    const key = `GET:${url}:${JSON.stringify(config?.params || {})}`;
    return this.batcher.batch(key, async () => {
      return (await this.client.get<PaginatedResponse<T>>(url, config)).data;
    });
  }

  async getAny<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T extends BaseEntity>(url: string, data?: T, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T extends BaseEntity>(
    url: string,
    data: Partial<T>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
    await this.client.delete(url, config);
  }
  // Batch multiple GET requests
  async batchGet<T>(requests: Array<{ url: string; config?: AxiosRequestConfig }>): Promise<T[]> {
    return Promise.all(requests.map((req) => this.get<T>(req.url, req.config)));
  }

  async getWithRetry<T>(
    url: string,
    config?: AxiosRequestConfig,
    maxRetries = 3,
    retryDelay = 1000,
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.get<T>(url, config);
      } catch (error: any) {
        lastError = error;

        // Don't retry on client errors (4xx)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error;
        }

        // Wait before retry
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (i + 1)));
        }
      }
    }

    throw lastError;
  }

  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, { responseType: 'blob' });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export const apiClient = new Client();

export const cancelAllRequests = () => apiClient.interceptors.cancelAll();

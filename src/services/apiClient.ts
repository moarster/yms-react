import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import {ApiResponse, ApiError, PaginatedResponse} from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { ENV } from '@/constants'
import toast from 'react-hot-toast'
import {BaseEntity} from "@/types/dataModel.ts";

class ApiClient {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: ENV.API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor for auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = useAuthStore.getState().token
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                const originalRequest = error.config

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true

                    try {
                        await useAuthStore.getState().refreshToken()
                        const token = useAuthStore.getState().token
                        if (token) {
                            originalRequest.headers.Authorization = `Bearer ${token}`
                            return this.client(originalRequest)
                        }
                    } catch (refreshError) {
                        useAuthStore.getState().logout()
                        window.location.href = '/login'
                        return Promise.reject(refreshError)
                    }
                }

                // Handle other errors
                const apiError: ApiError = {
                    message: error.response?.data?.message || error.message || 'An error occurred',
                    code: error.response?.status?.toString() || 'UNKNOWN',
                    details: error.response?.data,
                }

                // Show error toast for non-auth errors
                if (error.response?.status !== 401) {
                    toast.error(apiError.message)
                }

                return Promise.reject(apiError)
            }
        )
    }

    async get<T extends BaseEntity>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config)
        return response.data
    }

    async getMany<T extends BaseEntity>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
        const response = await this.client.get<PaginatedResponse<T>>(url, config)
        return response.data
    }

    async getNaked<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config)
        return response.data
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, data, config)
        return response.data
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.put<ApiResponse<T>>(url, data, config)
        return response.data
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.patch<ApiResponse<T>>(url, data, config)
        return response.data
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(url, config)
        return response.data
    }

    // File upload with progress
    async uploadFile<T>(
        url: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<T>> {
        const formData = new FormData()
        formData.append('file', file)

        const response = await this.client.post<ApiResponse<T>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    onProgress(progress)
                }
            },
        })

        return response.data
    }

    // Download file
    async downloadFile(url: string, filename?: string): Promise<void> {
        const response = await this.client.get(url, {
            responseType: 'blob',
        })

        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
    }
}

export const apiClient = new ApiClient()
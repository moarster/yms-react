import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { BaseEntity } from '@/types'

import { apiConfig } from '../config'
import {PaginatedResponse} from "./api.types.ts";
import { ApiInterceptors, TokenProvider } from './interceptors'

export class Client {
    private client: AxiosInstance
    private interceptors: ApiInterceptors

    constructor() {
        this.client = axios.create({
            baseURL: apiConfig.baseURL,
            timeout: apiConfig.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.interceptors = new ApiInterceptors(this.client)
    }

    setTokenProvider(provider: TokenProvider) {
        this.interceptors.setTokenProvider(provider)
    }

    async get<T extends BaseEntity>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config)
        return response.data
    }

    async getMany<T extends BaseEntity>(url: string, paginated?: boolean, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
        let response
        if (paginated===false) {
            response = {
                content: (await this.client.get<T[]>(url, config)).data
            }
        } else {
            response = (await this.client.get<PaginatedResponse<T>>(url, config)).data
        }
        return response
    }

    async getAny<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config)
        return response.data
    }

    async post<T extends BaseEntity>(url: string, data?: T, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config)
        return response.data
    }

    async put<T extends BaseEntity>(url: string, data?: T, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config)
        return response.data
    }

    async patch<T>(url: string, data?: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config)
        return response.data
    }

    async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
        await this.client.delete(url, config)
    }

    async uploadFile<T>(
        url: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<T> {
        const formData = new FormData()
        formData.append('file', file)

        const response = await this.client.post<T>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    onProgress(progress)
                }
            },
        })

        return response.data
    }

    async downloadFile(url: string, filename?: string): Promise<void> {
        const response = await this.client.get(url, { responseType: 'blob' })

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

export const apiClient = new Client()
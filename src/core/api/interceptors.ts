import { AxiosError,AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import toast from "react-hot-toast"

import {ApiError} from "./api.types.ts";



export interface TokenProvider {
    getToken(): string | null
    refreshToken(): Promise<string>
    logout(): void
}

export class ApiInterceptors {
    private tokenProvider: TokenProvider | null = null

    constructor(private client: AxiosInstance) {}

    setTokenProvider(provider: TokenProvider) {
        this.tokenProvider = provider
        this.setupInterceptors()
    }

    private setupInterceptors() {
        this.setupRequestInterceptor()
        this.setupResponseInterceptor()
    }

    private setupRequestInterceptor() {
        this.client.interceptors.request.use(
            (config) => {
                const token = this.tokenProvider?.getToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )
    }

    private setupResponseInterceptor() {
        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

                // Handle 401 errors with token refresh
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true

                    try {
                        const newToken = await this.tokenProvider?.refreshToken()
                        if (newToken && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`
                            return this.client.request(originalRequest)
                        }
                    } catch (refreshError) {
                        this.tokenProvider?.logout()
                        this.redirectToLogin()
                        return Promise.reject(refreshError)
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
                    message,
                    code: error.response?.status?.toString() || 'UNKNOWN',
                    details: {data},
                    timestamp: new Date().toISOString(),
                    path: originalRequest.url,
                }

                if (error.response?.status !== 401) {
                    toast.error(apiError.message)
                }

                return Promise.reject(apiError)
            }
        )
    }

    private redirectToLogin() {
        // Avoid redirect during login/logout flows
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
        }
    }
}
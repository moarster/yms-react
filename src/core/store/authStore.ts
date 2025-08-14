import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { TokenProvider } from '@/core/api'

import { apiClient } from '../api'
import { authService, authServiceFactory } from '../auth/authService'
import { AuthState, User } from '../auth/types'
import { authConfig } from '../config'


interface AuthStore extends AuthState {
    login: (email?: string, password?: string) => Promise<void>
    logout: () => Promise<void>
    refreshToken: () => Promise<void>
    setUser: (user: User) => void
    setLoading: (loading: boolean) => void
    setToken: (token: string) => void
    switchMode: (mode: 'keycloak' | 'demo') => void
    initialize: () => Promise<void>
}

class AuthTokenProvider implements TokenProvider {
    getToken(): string | null {
        return useAuthStore.getState().token
    }

    async refreshToken(): Promise<string> {
        const tokens = await authService.refreshToken()
        useAuthStore.getState().setToken(tokens.accessToken)
        return tokens.accessToken
    }

    logout(): void {
        useAuthStore.getState().logout()
    }
}
export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            authMode: authConfig.mode,

            login: async (email?: string, password?: string) => {
                set({ isLoading: true })
                try {
                    if (get().authMode === 'keycloak') {
                        await authService.login(email, password)
                    } else {
                        // For demo mode, handle the response normally
                        const response = await authService.login(email, password)
                        set({
                            user: response.user,
                            token: response.tokens.accessToken,
                            isAuthenticated: true,
                            isLoading: false,
                        })
                    }
                } catch (error) {
                    set({ isLoading: false })
                    throw error
                }
            },

            logout: async () => {
                set({ isLoading: true })
                try {
                    await authService.logout()
                } catch (error) {
                    console.warn('Logout error:', error)
                } finally {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    })
                }
            },

            refreshToken: async () => {
                try {
                    const tokens = await authService.refreshToken()
                    const user = await authService.getCurrentUser()

                    set({
                        user,
                        token: tokens.accessToken,
                        isAuthenticated: true,
                    })
                } catch (error) {
                    get().logout()
                    throw error
                }
            },

            setUser: (user: User) => set({ user }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),

            setToken: (token: string) => set({ token }),

            switchMode: (mode: 'keycloak' | 'demo') => {
                // Clear current state
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    authMode: mode,
                })

                // Clear persisted state
                localStorage.removeItem('auth-storage')

                // Update auth service
                const newService = authServiceFactory.getService(mode)
                Object.assign(authService, newService)
            },

            initialize: async () => {
                set({ isLoading: true })
                try {
                    if (authConfig.mode === 'keycloak') {
                        const keycloakService = authServiceFactory.getKeycloakService()
                        const initialized = await keycloakService.initialize()

                        if (initialized && keycloakService.isAuthenticated()) {
                            const authResponse = await keycloakService.getAuthResponse()
                            set({
                                user: authResponse.user,
                                token: authResponse.tokens.accessToken,
                                isAuthenticated: true,
                            })
                        }
                    } else if (authService.isAuthenticated()) {
                        const user = await authService.getCurrentUser()
                        set({ user, isAuthenticated: true })
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error)
                } finally {
                    set({ isLoading: false })
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                authMode: state.authMode,
            }),
        }
    )
)

apiClient.setTokenProvider(new AuthTokenProvider())
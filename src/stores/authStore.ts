import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Keycloak from 'keycloak-js'
import { User, AuthState } from '@/types'
import { authService } from '@/services/authService'
import { authConfig } from '../config/keycloak'

interface AuthStore extends AuthState {
    login: (email?: string, password?: string) => Promise<void>
    logout: () => void
    refreshToken: () => Promise<void>
    setUser: (user: User) => void
    setLoading: (loading: boolean) => void
    setKeycloak: (keycloak: Keycloak) => void
    switchToDemoMode: () => void
    switchToKeycloakMode: () => void
    initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            keycloak: undefined,
            authMode: authConfig.mode,
            isDemoMode: authConfig.isDemoMode,

            login: async (email?: string, password?: string) => {
                set({ isLoading: true })
                try {
                    const response = await authService.login(email, password)
                    const { user, token } = response.data

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    })
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
                const { token } = get()
                if (!token) return

                try {
                    const response = await authService.refreshToken(token)
                    const { user, token: newToken } = response.data

                    set({
                        user,
                        token: newToken,
                        isAuthenticated: true,
                    })
                } catch (error) {
                    // If refresh fails, logout user
                    get().logout()
                    throw error
                }
            },

            setUser: (user: User) => {
                set({ user })
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            },

            setKeycloak: (keycloak: Keycloak) => {
                authService.initKeycloak(keycloak)
                set({ keycloak })
            },

            switchToDemoMode: () => {
                set({
                    authMode: 'demo',
                    isDemoMode: true,
                    user: null,
                    token: null,
                    isAuthenticated: false,
                })
                // Clear persisted state
                localStorage.removeItem('auth-storage')
            },

            switchToKeycloakMode: () => {
                set({
                    authMode: 'keycloak',
                    isDemoMode: false,
                    user: null,
                    token: null,
                    isAuthenticated: false,
                })
                // Clear persisted state
                localStorage.removeItem('auth-storage')
            },

            initializeAuth: async () => {
                const { keycloak, isDemoMode } = get()

                if (isDemoMode) {
                    // In demo mode, just check if we have a valid token
                    return
                }

                if (keycloak && keycloak.authenticated) {
                    try {
                        // Update user info from Keycloak
                        const response = await authService.getCurrentUser()
                        set({
                            user: response.data,
                            token: keycloak.token!,
                            isAuthenticated: true,
                        })
                    } catch (error) {
                        console.error('Failed to get current user:', error)
                        get().logout()
                    }
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
                isDemoMode: state.isDemoMode,
            }),
        }
    )
)
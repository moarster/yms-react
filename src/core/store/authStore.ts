import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { TokenProvider } from '@/core/api';

import { apiClient } from '../api';
import { authService, authServiceFactory } from '../auth/authService';
import { AuthState, User } from '../auth/types';
import { authConfig } from '../config';

interface AuthStore extends AuthState {
  initialize: () => Promise<void>;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  switchMode: (mode: 'demo' | 'keycloak') => void;
}

class AuthTokenProvider implements TokenProvider {
  getToken(): null | string {
    return useAuthStore.getState().token;
  }

  async refreshToken(): Promise<string> {
    const tokens = await authService.refreshToken();
    useAuthStore.getState().setToken(tokens.accessToken);
    return tokens.accessToken;
  }

  logout(): void {
    useAuthStore.getState().logout();
  }
}
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      authMode: authConfig.mode,
      initialize: async () => {
        set({ isLoading: true });
        try {
          if (authConfig.mode === 'keycloak') {
            const keycloakService = authServiceFactory.getKeycloakService();
            const initialized = await keycloakService.initialize();

            if (initialized && keycloakService.isAuthenticated()) {
              const authResponse = await keycloakService.getAuthResponse();
              set({
                isAuthenticated: true,
                token: authResponse.tokens.accessToken,
                user: authResponse.user,
              });
            }
          } else if (authService.isAuthenticated()) {
            const user = await authService.getCurrentUser();
            set({ isAuthenticated: true, user });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      isAuthenticated: false,
      isLoading: false,
      login: async (email?: string, password?: string) => {
        set({ isLoading: true });
        try {
          if (get().authMode === 'keycloak') {
            await authService.login(email, password);
          } else {
            // For demo mode, handle the response normally
            const response = await authService.login(email, password);
            set({
              isAuthenticated: true,
              isLoading: false,
              token: response.tokens.accessToken,
              user: response.user,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Logout error:', error);
        } finally {
          set({
            isAuthenticated: false,
            isLoading: false,
            token: null,
            user: null,
          });
        }
      },

      refreshToken: async () => {
        try {
          const tokens = await authService.refreshToken();
          const user = await authService.getCurrentUser();

          set({
            isAuthenticated: true,
            token: tokens.accessToken,
            user,
          });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setToken: (token: string) => set({ token }),

      setUser: (user: User) => set({ user }),

      switchMode: (mode: 'demo' | 'keycloak') => {
        // Clear current state
        set({
          authMode: mode,
          isAuthenticated: false,
          token: null,
          user: null,
        });

        // Clear persisted state
        localStorage.removeItem('auth-storage');

        // Update auth service
        const newService = authServiceFactory.getService(mode);
        Object.assign(authService, newService);
      },

      token: null,

      user: null,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        authMode: state.authMode,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    },
  ),
);

apiClient.setTokenProvider(new AuthTokenProvider());

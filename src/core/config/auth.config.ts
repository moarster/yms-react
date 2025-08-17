import { getEnvVar } from './env.utils';

export const authConfig = {
  demoSuperuser: {
    email: import.meta.env.VITE_DEMO_SUPERUSER_EMAIL || 'admin@demo.com',
    password: import.meta.env.VITE_DEMO_SUPERUSER_PASSWORD || 'admin123',
  },
  demoUsersEnabled: import.meta.env.VITE_DEMO_USERS_ENABLED === 'true',
  get isDemoMode() {
    return this.mode === 'demo';
  },
  mode: (import.meta.env.VITE_AUTH_MODE || 'keycloak') as 'demo' | 'keycloak',
} as const;

export const keycloakConfig = {
  clientId: getEnvVar('VITE_KEYCLOAK_CLIENT_ID'),
  realm: getEnvVar('VITE_KEYCLOAK_REALM'),
  url: getEnvVar('VITE_KEYCLOAK_URL'),
};

export const keycloakInitOptions = {
  checkLoginIframe: false,
  onLoad: 'check-sso' as const,
  pkceMethod: 'S256' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
};

import { getEnvVar } from './index'

export const authConfig = {
    mode: (import.meta.env.VITE_AUTH_MODE || 'keycloak') as 'keycloak' | 'demo',
    get isDemoMode() { return this.mode === 'demo' },
    demoUsersEnabled: import.meta.env.VITE_DEMO_USERS_ENABLED === 'true',
    demoSuperuser: {
        email: import.meta.env.VITE_DEMO_SUPERUSER_EMAIL || 'admin@demo.com',
        password: import.meta.env.VITE_DEMO_SUPERUSER_PASSWORD || 'admin123',
    },
} as const

export const keycloakConfig = {
    url: getEnvVar('VITE_KEYCLOAK_URL'),
    realm: getEnvVar('VITE_KEYCLOAK_REALM'),
    clientId: getEnvVar('VITE_KEYCLOAK_CLIENT_ID'),
}

export const keycloakInitOptions = {
    onLoad: 'check-sso' as const,
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    checkLoginIframe: false,
    pkceMethod: 'S256' as const,
}
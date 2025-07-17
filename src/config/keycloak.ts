import Keycloak from 'keycloak-js'

// Get environment variables
const getEnvVar = (name: string, defaultValue?: string): string => {
    const value = import.meta.env[name] || defaultValue
    if (!value) {
        throw new Error(`Environment variable ${name} is required`)
    }
    return value
}

// Keycloak configuration
export const keycloakConfig = {
    url: getEnvVar('VITE_KEYCLOAK_URL'),
    realm: getEnvVar('VITE_KEYCLOAK_REALM'),
    clientId: getEnvVar('VITE_KEYCLOAK_CLIENT_ID'),
}

// Initialize Keycloak instance
export const keycloak = new Keycloak(keycloakConfig)

// Keycloak init options
export const keycloakInitOptions = {
    onLoad: 'check-sso' as const,
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    checkLoginIframe: false,
    pkceMethod: 'S256' as const,
}

// Auth mode configuration
export const authConfig = {
    mode: (import.meta.env.VITE_AUTH_MODE || 'keycloak') as 'keycloak' | 'demo',
    isDemoMode: import.meta.env.VITE_AUTH_MODE === 'demo',
    demoUsersEnabled: import.meta.env.VITE_DEMO_USERS_ENABLED === 'true',
    demoSuperuser: {
        email: import.meta.env.VITE_DEMO_SUPERUSER_EMAIL || 'admin@demo.com',
        password: import.meta.env.VITE_DEMO_SUPERUSER_PASSWORD || 'admin123',
    },
}

// Demo users for testing
export const demoUsers = [
    {
        email: 'logist@demo.com',
        password: 'demo123',
        user: {
            id: 'demo-logist-1',
            email: 'logist@demo.com',
            name: 'Demo Logist',
            roles: [
                {
                    id: 'role-logist',
                    name: 'LOGIST' as const,
                    permissions: [
                        'DOCUMENT_CREATE',
                        'DOCUMENT_READ',
                        'DOCUMENT_UPDATE',
                        'RFP_CREATE',
                        'RFP_ASSIGN',
                        'RFP_CANCEL',
                        'RFP_COMPLETE',
                        'CATALOG_READ',
                    ],
                },
            ],
            organization: {
                id: 'demo-org-1',
                name: 'Demo Logistics Company',
                inn: '1234567890',
                ogrn: '1234567890123',
                address: '123 Demo Street, Demo City',
            },
        },
    },
    {
        email: 'carrier@demo.com',
        password: 'demo123',
        user: {
            id: 'demo-carrier-1',
            email: 'carrier@demo.com',
            name: 'Demo Carrier',
            roles: [
                {
                    id: 'role-carrier',
                    name: 'CARRIER' as const,
                    permissions: [
                        'DOCUMENT_READ',
                        'RFP_SUBMIT_RATE',
                        'CATALOG_READ',
                    ],
                },
            ],
            organization: {
                id: 'demo-org-2',
                name: 'Demo Transport Company',
                inn: '0987654321',
                ogrn: '3210987654321',
                address: '456 Transport Ave, Carrier City',
            },
        },
    },
    {
        email: authConfig.demoSuperuser.email,
        password: authConfig.demoSuperuser.password,
        user: {
            id: 'demo-admin-1',
            email: authConfig.demoSuperuser.email,
            name: 'Demo Admin',
            roles: [
                {
                    id: 'role-admin',
                    name: 'ADMIN' as const,
                    permissions: [
                        'DOCUMENT_CREATE',
                        'DOCUMENT_READ',
                        'DOCUMENT_UPDATE',
                        'DOCUMENT_DELETE',
                        'RFP_CREATE',
                        'RFP_ASSIGN',
                        'RFP_CANCEL',
                        'RFP_COMPLETE',
                        'RFP_SUBMIT_RATE',
                        'CATALOG_CREATE',
                        'CATALOG_READ',
                        'CATALOG_UPDATE',
                        'CATALOG_DELETE',
                        'USER_CREATE',
                        'USER_READ',
                        'USER_UPDATE',
                        'USER_DELETE',
                    ],
                },
            ],
            organization: {
                id: 'demo-org-admin',
                name: 'Demo Admin Organization',
                inn: '1111111111',
                ogrn: '1111111111111',
                address: 'Admin HQ, Demo City',
            },
        },
    },
]
interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_AUTH_MODE: string
    readonly VITE_KEYCLOAK_URL: string
    readonly VITE_KEYCLOAK_REALM: string
    readonly VITE_KEYCLOAK_CLIENT_ID: string
    readonly NODE_ENV: 'development' | 'production' | 'test'
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
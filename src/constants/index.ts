export const ENV = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://kvm-yarddev.solvo.ru:8083',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Carrier Portal',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development',
    IS_PRODUCTION: import.meta.env.NODE_ENV === 'production',
} as const

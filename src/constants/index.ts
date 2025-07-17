// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
        PROFILE: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    CATALOGS: '/catalogs',
    LISTS: '/lists',
    CATALOG: '/catalog',
    DOMAIN: '/domain',
} as const

// Document statuses
export const DOCUMENT_STATUSES = {
    DRAFT: 'DRAFT',
    ASSIGNED: 'ASSIGNED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const

// User roles
export const USER_ROLES = {
    LOGIST: 'LOGIST',
    CARRIER: 'CARRIER',
    ADMIN: 'ADMIN',
} as const

// Permissions
export const PERMISSIONS = {
    // Catalog permissions
    CATALOG_CREATE: 'CATALOG_CREATE',
    CATALOG_READ: 'CATALOG_READ',
    CATALOG_UPDATE: 'CATALOG_UPDATE',
    CATALOG_DELETE: 'CATALOG_DELETE',

    // Document permissions
    DOCUMENT_CREATE: 'DOCUMENT_CREATE',
    DOCUMENT_READ: 'DOCUMENT_READ',
    DOCUMENT_UPDATE: 'DOCUMENT_UPDATE',
    DOCUMENT_DELETE: 'DOCUMENT_DELETE',

    // RFP specific permissions
    RFP_CREATE: 'RFP_CREATE',
    RFP_ASSIGN: 'RFP_ASSIGN',
    RFP_CANCEL: 'RFP_CANCEL',
    RFP_COMPLETE: 'RFP_COMPLETE',
    RFP_SUBMIT_RATE: 'RFP_SUBMIT_RATE',

    // User management
    USER_CREATE: 'USER_CREATE',
    USER_READ: 'USER_READ',
    USER_UPDATE: 'USER_UPDATE',
    USER_DELETE: 'USER_DELETE',
} as const

// Cargo types
export const CARGO_TYPES = [
    { value: 'general', label: 'General Cargo' },
    { value: 'fragile', label: 'Fragile' },
    { value: 'perishable', label: 'Perishable' },
    { value: 'hazardous', label: 'Hazardous' },
    { value: 'oversized', label: 'Oversized' },
    { value: 'liquid', label: 'Liquid' },
    { value: 'bulk', label: 'Bulk' },
] as const

// Packaging types
export const PACKAGING_TYPES = [
    { value: 'boxes', label: 'Boxes' },
    { value: 'pallets', label: 'Pallets' },
    { value: 'containers', label: 'Containers' },
    { value: 'bulk', label: 'Bulk' },
    { value: 'bags', label: 'Bags' },
    { value: 'drums', label: 'Drums' },
] as const

// Special requirements
export const SPECIAL_REQUIREMENTS = [
    { value: 'temperature_controlled', label: 'Temperature Controlled' },
    { value: 'dangerous_goods', label: 'Dangerous Goods' },
    { value: 'oversized', label: 'Oversized' },
    { value: 'high_value', label: 'High Value' },
    { value: 'fragile', label: 'Fragile Handling' },
    { value: 'fast_delivery', label: 'Fast Delivery' },
    { value: 'insurance_required', label: 'Insurance Required' },
] as const

// File upload constraints
export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif'],
} as const

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100,
} as const

// Table settings
export const TABLE = {
    DEFAULT_SORT_DIRECTION: 'asc',
    DEBOUNCE_DELAY: 300, // ms for search input
} as const

// UI settings
export const UI = {
    SIDEBAR_WIDTH: 256, // pixels
    SIDEBAR_COLLAPSED_WIDTH: 64, // pixels
    HEADER_HEIGHT: 64, // pixels
    NOTIFICATION_DURATION: 5000, // ms
    TOAST_DURATION: 4000, // ms
} as const

// Date/time formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
    INPUT: 'yyyy-MM-dd',
    INPUT_WITH_TIME: 'yyyy-MM-dd HH:mm',
    TIME_ONLY: 'HH:mm',
    API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
} as const

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    SIDEBAR_STATE: 'sidebar_state',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const

// Application routes
export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    CATALOGS: '/catalogs',
    CATALOG_ITEMS: '/catalogs/:catalogKey',
    SHIPMENT_RFPS: '/shipment-rfps',
    SHIPMENT_RFP_DETAIL: '/shipment-rfps/:id',
    SHIPMENT_RFP_NEW: '/shipment-rfps/new',
    SHIPMENT_RFP_EDIT: '/shipment-rfps/:id/edit',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    NOT_FOUND: '*',
} as const

// Error codes
export const ERROR_CODES = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
    LOGIN: 'Successfully logged in',
    LOGOUT: 'Successfully logged out',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    ITEM_CREATED: 'Item created successfully',
    ITEM_UPDATED: 'Item updated successfully',
    ITEM_DELETED: 'Item deleted successfully',
    FILE_UPLOADED: 'File uploaded successfully',
} as const

// Error messages
export const ERROR_MESSAGES = {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access forbidden.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported file.',
} as const

// Regular expressions
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/,
    INN_10: /^\d{10}$/,
    INN_12: /^\d{12}$/,
    OGRN_13: /^\d{13}$/,
    OGRN_15: /^\d{15}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const

// Environment variables (with defaults)

export const ENV = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://kvm-yarddev.solvo.ru:8083',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Carrier Portal',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development',
    IS_PRODUCTION: import.meta.env.NODE_ENV === 'production',
} as const

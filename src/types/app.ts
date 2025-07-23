import { AuthState } from './auth'
import { UiState } from './ui'
import { CatalogInfo } from './index'

// Application state
export interface AppState {
    auth: AuthState
    ui: UiState
    catalogs: CatalogState
    documents: DocumentState
    preferences: UserPreferences
}

export interface CatalogState {
    available: CatalogInfo[]
    loading: boolean
    lastFetched?: string
    cache: Record<string, any>
}

export interface DocumentState {
    recentDocuments: RecentDocument[]
    drafts: string[]
    templates: DocumentTemplate[]
}

export interface RecentDocument {
    id: string
    type: string
    title: string
    status: string
    lastAccessed: string
    url: string
}

export interface DocumentTemplate {
    id: string
    name: string
    description: string
    type: string
    data: Record<string, any>
    createdBy: string
    createdAt: string
    isPublic: boolean
}

// User preferences
export interface UserPreferences {
    language: 'en' | 'ru'
    timezone: string
    dateFormat: string
    timeFormat: '12h' | '24h'
    theme: 'light' | 'dark' | 'auto'
    density: 'compact' | 'comfortable' | 'spacious'
    sidebarCollapsed: boolean
    tablePageSize: number
    notifications: NotificationPreferences
    dashboard: DashboardPreferences
}

export interface NotificationPreferences {
    email: boolean
    browser: boolean
    desktop: boolean
    types: {
        documentUpdates: boolean
        systemAlerts: boolean
        reminders: boolean
        assignments: boolean
    }
}

export interface DashboardPreferences {
    widgets: DashboardWidget[]
    layout: 'grid' | 'list'
    refreshInterval: number
}

export interface DashboardWidget {
    id: string
    type: string
    title: string
    position: { x: number; y: number; w: number; h: number }
    config: Record<string, any>
    visible: boolean
}

// Environment and configuration
export interface AppConfig {
    apiBaseUrl: string
    appName: string
    version: string
    environment: 'development' | 'staging' | 'production'
    features: FeatureFlags
    keycloak?: KeycloakConfig
    upload: UploadConfig
    table: TableConfig
}

export interface FeatureFlags {
    enableDemo: boolean
    enableKeycloak: boolean
    enableBulkOperations: boolean
    enableExport: boolean
    enableImport: boolean
    enableNotifications: boolean
    enableWorkflow: boolean
    enableAudit: boolean
    enableTelemetry: boolean
}

export interface KeycloakConfig {
    url: string
    realm: string
    clientId: string
    enableLogging: boolean
}

export interface UploadConfig {
    maxFileSize: number
    allowedTypes: string[]
    allowedExtensions: string[]
    multiple: boolean
    directory: boolean
}

export interface TableConfig {
    defaultPageSize: number
    pageSizeOptions: number[]
    maxPageSize: number
    enableVirtualization: boolean
    enableColumnReorder: boolean
    enableColumnResize: boolean
    enableRowSelection: boolean
    enableFiltering: boolean
    enableSorting: boolean
    enableGrouping: boolean
    enableExport: boolean
}

// Error handling
export interface AppError {
    id: string
    type: 'network' | 'validation' | 'permission' | 'system' | 'unknown'
    message: string
    details?: any
    timestamp: string
    userId?: string
    url?: string
    userAgent?: string
    resolved: boolean
}

// Application metadata
export interface AppMetadata {
    version: string
    buildDate: string
    buildNumber: string
    gitCommit: string
    environment: string
    features: string[]
    dependencies: Record<string, string>
}

// Health check
export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy'
    timestamp: string
    checks: {
        api: 'up' | 'down'
        database: 'up' | 'down'
        cache: 'up' | 'down'
        auth: 'up' | 'down'
    }
    performance: {
        responseTime: number
        memoryUsage: number
        cpuUsage: number
    }
}
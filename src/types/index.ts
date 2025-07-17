import  Keycloak  from 'keycloak-js'
import {ShipmentRfpData} from "./shipmentRfpData";

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    keycloak?: Keycloak
    authMode: 'keycloak' | 'demo'
    isDemoMode: boolean
}

export interface AuthContextType extends AuthState {
    login: (email?: string, password?: string) => Promise<void>
    logout: () => void
    refreshToken: () => Promise<void>
    setUser: (user: User) => void
    setLoading: (loading: boolean) => void
    switchToDemoMode: () => void
    switchToKeycloakMode: () => void
}

export interface DemoUser {
    email: string
    password: string
    user: User
}

// Update existing User interface if needed
export interface User {
    id: string
    email: string
    name: string
    roles: UserRole[]
    organization?: Organization
    // Add Keycloak specific fields if needed
    keycloakId?: string
    preferredUsername?: string
}


export interface UserRole {
    id: string
    name: 'LOGIST' | 'CARRIER'
    permissions: string[]
}

export interface Organization {
    id: string
    name: string
    inn: string
    ogrn: string
    address: string
}



// Catalog and List types (NSI - Master Data)
export interface CatalogInfo {
    key: string
    title: string
    description: string
    type: 'LIST' | 'CATALOG'
    schema?: JsonSchema
}

export interface ListItem {
    id: string
    title: string
    createdAt: string
    updatedAt: string
}

export interface CatalogItem {
    id: string
    title: string
    data: Record<string, any>
    createdAt: string
    updatedAt: string
}

export interface JsonSchema {
    type: string
    properties: Record<string, SchemaProperty>
    required?: string[]
    title?: string
    description?: string
}

export interface SchemaProperty {
    type: string
    title?: string
    description?: string
    enum?: any[]
    format?: string
    properties?: Record<string, SchemaProperty>
    items?: SchemaProperty
}

// Document types
export interface DocumentBase<T> {
    id: string
    status: DocumentStatus
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate: string
    title: string
    data: T
}

export type ShipmentRfp = DocumentBase<ShipmentRfpData>

export interface AccessRule {
    field: string
    roles: string[]
    permissions: ('READ' | 'WRITE')[]
    conditions?: Record<string, any>
}

export type DocumentStatus =
    | 'DRAFT'
    | 'ASSIGNED'
    | 'COMPLETED'
    | 'CANCELLED'

export interface DocumentAction {
    key: string
    label: string
    description: string
    roles: string[]
    availableInStatuses: DocumentStatus[]
    confirmationRequired: boolean
}

// API Response types
export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
    errors?: string[]
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        size: number
        total: number
        totalPages: number
    }
}

export interface ApiError {
    message: string
    code: string
    details?: Record<string, any>
}

// UI State types
export interface TableColumn<T = any> {
    key: keyof T | string
    title: string
    sortable?: boolean
    filterable?: boolean
    render?: (value: any, row: T) => React.ReactNode
    width?: string
}

export interface TableFilter {
    field: string
    operator: 'eq' | 'ne' | 'like' | 'in' | 'between' | 'gte' | 'lte'
    value: any
}

export interface TableSort {
    field: string
    direction: 'asc' | 'desc'
}

export interface PageInfo {
    title: string
    breadcrumbs: Breadcrumb[]
    actions?: PageAction[]
}

export interface Breadcrumb {
    label: string
    href?: string
}

export interface PageAction {
    label: string
    icon?: string
    variant: 'primary' | 'secondary' | 'danger' | 'outline'
    onClick: () => void
}

// Form types
export interface FormField {
    name: string
    type: string
    label: string
    required?: boolean
    validation?: any
    options?: { value: any; label: string }[]
    placeholder?: string
    help?: string
}

export interface FormState {
    values: Record<string, any>
    errors: Record<string, string>
    touched: Record<string, boolean>
    isSubmitting: boolean
    isDirty: boolean
}

// Notification types
export interface Notification {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: string
    read: boolean
    actions?: NotificationAction[]
}

export interface NotificationAction {
    label: string
    action: () => void
}

// Application State
export interface AppState {
    auth: AuthState
    ui: {
        sidebarOpen: boolean
        theme: 'light' | 'dark'
        notifications: Notification[]
    }
    catalogs: {
        available: CatalogInfo[]
        loading: boolean
    }
}

export interface PaginatedResponse<T> {
    content: T[] // Changed from 'data' to 'content'
    page: {
        number: number
        size: number
        totalElements: number
        totalPages: number
        first: boolean
        last: boolean
        numberOfElements: number
        empty: boolean
    }
}
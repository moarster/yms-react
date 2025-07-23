import { ReactNode } from 'react'

// Table types
export interface TableColumn<T = any> {
    key: keyof T | string
    title: string
    sortable?: boolean
    filterable?: boolean
    editable?: boolean
    width?: string | number
    minWidth?: number
    maxWidth?: number
    render?: (value: any, row: T, index: number) => ReactNode
    className?: string
    headerClassName?: string
}

export interface TableFilter {
    field: string
    operator: 'eq' | 'ne' | 'like' | 'in' | 'between' | 'gte' | 'lte' | 'contains' | 'startsWith' | 'endsWith'
    value: any
    values?: any[] // for 'in' operator
}

export interface TableSort {
    field: string
    direction: 'asc' | 'desc'
}

export interface TableState {
    filters: TableFilter[]
    sorting: TableSort[]
    pagination: {
        page: number
        pageSize: number
    }
    selection: any[]
    expandedRows: string[]
}

// Page layout types
export interface PageInfo {
    title: string
    subtitle?: string
    breadcrumbs: Breadcrumb[]
    actions?: PageAction[]
    tabs?: PageTab[]
}

export interface Breadcrumb {
    label: string
    href?: string
    icon?: string
    current?: boolean
}

export interface PageAction {
    label: string
    icon?: string
    variant: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    onClick: () => void
    href?: string
    tooltip?: string
}

export interface PageTab {
    id: string
    label: string
    icon?: string
    href?: string
    current?: boolean
    disabled?: boolean
    badge?: string | number
}

// Form types
export interface FormField {
    name: string
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'textarea' | 'file'
    label: string
    placeholder?: string
    help?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    validation?: FormValidation
    options?: FormOption[]
    multiple?: boolean
    accept?: string // for file inputs
    rows?: number // for textarea
    cols?: number // for textarea
    min?: number | string // for number/date inputs
    max?: number | string // for number/date inputs
    step?: number // for number inputs
}

export interface FormOption {
    value: any
    label: string
    disabled?: boolean
    group?: string
}

export interface FormValidation {
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: string | RegExp
    email?: boolean
    url?: boolean
    custom?: (value: any) => string | null
    message?: string
}

export interface FormState {
    values: Record<string, any>
    errors: Record<string, string>
    touched: Record<string, boolean>
    isSubmitting: boolean
    isDirty: boolean
    isValid: boolean
}

// Notification types
export interface Notification {
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    duration?: number
    persistent?: boolean
    timestamp: string
    read: boolean
    actions?: NotificationAction[]
    data?: Record<string, any>
}

export interface NotificationAction {
    label: string
    action: () => void
    variant?: 'primary' | 'secondary'
}

// Modal types
export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    closable?: boolean
    maskClosable?: boolean
    keyboard?: boolean
    centered?: boolean
    className?: string
}

// Theme and UI state
export interface UiState {
    sidebarOpen: boolean
    sidebarCollapsed: boolean
    theme: 'light' | 'dark' | 'auto'
    notifications: Notification[]
    modals: string[]
    loading: boolean
    error: string | null
}

// Loading states
export interface LoadingState {
    loading: boolean
    error: string | null
    lastUpdated?: string
}

// Search and filter UI
export interface SearchState {
    query: string
    filters: Record<string, any>
    suggestions: string[]
    recentSearches: string[]
}

// Layout breakpoints
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Color variants
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

// Size variants
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
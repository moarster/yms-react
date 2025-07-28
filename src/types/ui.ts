export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type InputVariant = 'default' | 'error' | 'success'

export interface NotificationAction {
    label: string
    action: () => void
    variant?: ButtonVariant
}

export interface Notification {
    id: string
    type: NotificationType
    title: string
    message: string
    duration?: number
    persistent?: boolean
    timestamp: string
    read: boolean
    actions?: NotificationAction[]
    data?: Record<string, unknown>
}

// Table types
export interface TableColumn<T = unknown> {
    key: string
    title: string
    sortable?: boolean
    render?: (value: unknown, row: T) => React.ReactNode
    width?: string
    align?: 'left' | 'center' | 'right'
}

export interface TableAction<T = unknown> {
    label: string
    action: (item: T) => void
    variant?: ButtonVariant
    condition?: (item: T) => boolean
    icon?: React.ComponentType<{ className?: string }>
}

// Form types
export interface FormField {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'date' | 'file'
    required?: boolean
    validation?: Record<string, unknown>
    options?: { value: string; label: string }[]
    placeholder?: string
    disabled?: boolean
}

// Modal types
export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    children: React.ReactNode
}
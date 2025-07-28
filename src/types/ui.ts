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

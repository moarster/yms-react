import { create } from 'zustand'

import { Notification } from '@/types'

interface UiStore {
    sidebarOpen: boolean
    theme: 'light' | 'dark'
    notifications: Notification[]

    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    setTheme: (theme: 'light' | 'dark') => void
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
    markNotificationRead: (id: string) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void
}

export const useUiStore = create<UiStore>((set, get) => ({
    sidebarOpen: true,
    theme: 'light',
    notifications: [],

    toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
    },

    setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
    },

    setTheme: (theme: 'light' | 'dark') => {
        set({ theme })
        document.documentElement.classList.toggle('dark', theme === 'dark')
    },

    addNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            read: false,
        }

        set((state) => ({
            notifications: [newNotification, ...state.notifications].slice(0, 10), // Keep only last 10
        }))

        // Auto-remove after 10 seconds for non-error notifications
        if (notification.type !== 'error') {
            setTimeout(() => {
                get().removeNotification(newNotification.id)
            }, 10000)
        }
    },

    markNotificationRead: (id: string) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        }))
    },

    removeNotification: (id: string) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }))
    },

    clearNotifications: () => {
        set({ notifications: [] })
    },
}))
import { create } from 'zustand';

import { Notification } from '@/types';

interface UiStore {
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  clearNotifications: () => void;
  markNotificationRead: (id: string) => void;

  notifications: Notification[];
  removeNotification: (id: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  toggleSidebar: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 10), // Keep only last 10
    }));

    // Auto-remove after 10 seconds for non-error notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, 10000);
    }
  },
  clearNotifications: () => {
    set({ notifications: [] });
  },
  markNotificationRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  notifications: [],

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  setTheme: (theme: 'dark' | 'light') => {
    set({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },

  sidebarOpen: true,

  theme: 'light',

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
}));

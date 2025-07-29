import React from 'react'

import { useUiStore } from '@/stores/uiStore'

import NotificationCenter from '../ui/NotificationCenter'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppLayoutProps {
    children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { sidebarOpen } = useUiStore()

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <Header />

                {/* Page content */}
                <main
                    className={`flex-1 relative overflow-y-auto focus:outline-none transition-all duration-200 ${
                        sidebarOpen ? 'ml-64' : 'ml-16'
                    }`}
                >
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Notification Center */}
            <NotificationCenter />
        </div>
    )
}

export default AppLayout
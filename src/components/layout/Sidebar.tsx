import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    HomeIcon,
    ArchiveBoxIcon,
    TruckIcon,
    UserIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useUiStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import clsx from 'clsx'

interface NavigationItem {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    requiredRole?: string
    badge?: string
}

const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Catalogs', href: '/catalogs', icon: ArchiveBoxIcon },
    {
        name: 'Shipment RFPs',
        href: '/shipment-rfps',
        icon: TruckIcon
    },
    { name: 'Profile', href: '/profile', icon: UserIcon },
]

const Sidebar: React.FC = () => {
    const { sidebarOpen, toggleSidebar } = useUiStore()
    const { user } = useAuthStore()
    const location = useLocation()

    const filteredNavigation = navigation.filter(item =>
        !item.requiredRole || authService.hasRole(user, item.requiredRole)
    )

    return (
        <div
            className={clsx(
                'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-200',
                sidebarOpen ? 'w-64' : 'w-16'
            )}
        >
            {/* Logo and toggle */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                {sidebarOpen && (
                    <div className="flex items-center">
                        <TruckIcon className="h-8 w-8 text-primary-600" />
                        <span className="ml-2 text-lg font-semibold text-gray-900">
              Carrier Portal
            </span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    {sidebarOpen ? (
                        <ChevronLeftIcon className="h-5 w-5" />
                    ) : (
                        <ChevronRightIcon className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {filteredNavigation.map((item) => {
                    const isActive = location.pathname === item.href ||
                        (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={clsx(
                                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                                isActive
                                    ? 'bg-primary-100 text-primary-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                            title={!sidebarOpen ? item.name : undefined}
                        >
                            <item.icon
                                className={clsx(
                                    'flex-shrink-0 h-6 w-6',
                                    isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                                    !sidebarOpen && 'mx-auto'
                                )}
                            />
                            {sidebarOpen && (
                                <>
                                    <span className="ml-3">{item.name}</span>
                                    {item.badge && (
                                        <span className="ml-auto inline-block py-0.5 px-2 text-xs bg-red-100 text-red-800 rounded-full">
                      {item.badge}
                    </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* User info */}
            {sidebarOpen && user && (
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                            </div>
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user.roles.map(r => r.name).join(', ')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar
import { Menu, Transition } from '@headlessui/react'
import {
    ArrowRightOnRectangleIcon,
    BellIcon,
    Cog6ToothIcon,
    UserIcon} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React, { useState } from 'react'

import { useAuthStore } from '@/core/store/authStore.ts'
import { useUiStore } from '@/core/store/uiStore.ts'

const Header: React.FC = () => {
    const { user, logout } = useAuthStore()
    const { sidebarOpen, notifications } = useUiStore()
    const [showNotifications, setShowNotifications] = useState(false)

    const unreadCount = notifications.filter(n => !n.read).length

    const handleLogout = () => {
        logout()
    }

    return (
        <header
            className={clsx(
                'bg-white shadow-sm border-b border-gray-200 transition-all duration-200',
                sidebarOpen ? 'ml-64' : 'ml-16'
            )}
        >
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Page title will be set by individual pages */}
                <div className="flex-1">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {/* This can be controlled by a context or passed down */}
                    </h1>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button
                        type="button"
                        className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <BellIcon className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                        )}
                    </button>

                    {/* User menu */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center max-w-xs bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <span className="sr-only">Open user menu</span>
                            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                            </div>
                        </Menu.Button>

                        <Transition
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>

                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/profile"
                                            className={clsx(
                                                'flex items-center px-4 py-2 text-sm',
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            )}
                                        >
                                            <UserIcon className="mr-3 h-5 w-5" />
                                            Profile
                                        </a>
                                    )}
                                </Menu.Item>

                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/settings"
                                            className={clsx(
                                                'flex items-center px-4 py-2 text-sm',
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            )}
                                        >
                                            <Cog6ToothIcon className="mr-3 h-5 w-5" />
                                            Settings
                                        </a>
                                    )}
                                </Menu.Item>

                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleLogout}
                                            className={clsx(
                                                'flex w-full items-center px-4 py-2 text-sm text-left',
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            )}
                                        >
                                            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    )
}

export default Header
import { CogIcon, TruckIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { useAuthStore } from '@/core/store/authStore.ts'

interface BaseLoginLayoutProps {
    children: React.ReactNode
    title: string
    subtitle: string
    showModeSwitch?: boolean
}

const BaseLoginLayout: React.FC<BaseLoginLayoutProps> = ({
                                                             children,
                                                             title,
                                                             subtitle,
                                                             showModeSwitch = true
                                                         }) => {
    const [showModeSwitchPanel, setShowModeSwitchPanel] = useState(false)
    const { switchMode, authMode } = useAuthStore()
    const isDemoMode = authMode === 'demo'

    const handleModeSwitch = () => {
        if (isDemoMode) {
            switchMode('keycloak')
            toast.success('Switched to Keycloak authentication')
        } else {
            switchMode('demo')
            toast.success('Switched to demo mode')
        }
        setShowModeSwitchPanel(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-600">
                        <TruckIcon className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {subtitle}
                    </p>

                    {/* Mode indicator */}
                    <div className="mt-2 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isDemoMode
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {isDemoMode ? 'Demo Mode' : 'Keycloak Mode'}
                        </span>
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    {children}

                    {/* Mode switch button */}
                    {showModeSwitch && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setShowModeSwitchPanel(!showModeSwitchPanel)}
                                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                <CogIcon className="h-4 w-4 mr-1" />
                                Auth Settings
                            </button>

                            {showModeSwitchPanel && (
                                <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-2">
                                        Switch authentication mode
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleModeSwitch}
                                        className="text-xs bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50"
                                    >
                                        Switch to {isDemoMode ? 'Keycloak' : 'Demo'} Mode
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BaseLoginLayout
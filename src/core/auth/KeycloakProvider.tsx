import { ReactKeycloakProvider } from '@react-keycloak/web'
import React, {useEffect, useRef, useState} from 'react'

import {authServiceFactory} from "@/core/auth/authService.ts";
import {keycloakInitOptions} from "@/core/config";
import { useAuthStore } from '@/core/store/authStore.ts'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.tsx'

const KeycloakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [initError, setInitError] = useState<string | null>(null)
    const [isInitializing, setIsInitializing] = useState(true)
    const {authMode,initialize } = useAuthStore()
    const hasInitializedStore = useRef(false)
    const keycloakRef = useRef(authServiceFactory.getKeycloakService().getKeycloakInstance())
    useEffect(() => {
        if (!hasInitializedStore.current && authMode === 'keycloak') {
            hasInitializedStore.current = true
            // Small delay to ensure ReactKeycloakProvider initialization completes
            setTimeout(() => {
                initialize().finally(() => {
                    setIsInitializing(false)
                })
            }, 100)
        }
    }, [authMode, initialize])

    // If in demo mode, just render children
    if (authMode === 'demo') {
        return <>{children}</>
    }


    const LoadingComponent = () => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Initializing authentication...</p>
            </div>
        </div>
    )

    const ErrorComponent = () => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-red-600 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-xl font-semibold">Authentication Error</h2>
                    <p className="text-gray-600 mt-2">{initError}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    Retry
                </button>
            </div>
        </div>
    )

    if (initError || !keycloakRef.current) {
        return <ErrorComponent />
    }

    return (
        <ReactKeycloakProvider
            authClient={keycloakRef.current}
            initOptions={keycloakInitOptions}
            onEvent={async (event, _error) => {
                console.log('Keycloak event:', event, _error)

                if (event === 'onAuthSuccess') {
                    console.log('Authentication successful')
                    if (!hasInitializedStore.current) {
                        hasInitializedStore.current = true
                        try {
                            await initialize()
                        } finally {
                            setIsInitializing(false)
                        }
                    }
                }
                if (event === 'onAuthError') {
                    console.error('Keycloak auth error:', _error)
                    setInitError(_error?.error || 'Authentication failed')
                    setIsInitializing(false)
                }
                if (event === 'onReady') {
                    if (!hasInitializedStore.current) {
                        hasInitializedStore.current = true
                        try {
                            await initialize()
                        } finally {
                            setIsInitializing(false)
                        }
                    } else {
                        setIsInitializing(false)
                    }
                }
                if (event === 'onInitError') {
                    console.error('Keycloak init error:', _error)
                    setInitError(_error?.error || 'Initialization failed')
                    setIsInitializing(false)
                }
            }}
            onTokens={(tokens) => {
                // Update token in store when Keycloak refreshes it
                if (tokens?.token) {
                    useAuthStore.getState().setToken(tokens.token)
                }
            }}
        >
            {isInitializing ? <LoadingComponent /> : children}
        </ReactKeycloakProvider>
    )
}

export default KeycloakProvider
// src/components/auth/KeycloakProvider.tsx
import React, { useEffect, useState } from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { keycloak, keycloakInitOptions, authConfig } from '@/config/keycloak'
import { useAuthStore } from '@/stores/authStore'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface KeycloakProviderProps {
    children: React.ReactNode
}

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
    const [initError, setInitError] = useState<string | null>(null)
    const { setKeycloak, setLoading, isDemoMode } = useAuthStore()

    // If in demo mode, just render children
    if (isDemoMode) {
        return <>{children}</>
    }

    const handleKeycloakInit = (authenticated: boolean) => {
        console.log('Keycloak initialized:', authenticated)
        setKeycloak(keycloak)
        setLoading(false)

        if (authenticated) {
            useAuthStore.getState().initializeAuth()
        }
    }

    const handleKeycloakInitError = (error: any) => {
        console.error('Keycloak initialization error:', error)
        setInitError('Failed to initialize authentication system')
        setLoading(false)
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

    if (initError) {
        return <ErrorComponent />
    }

    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={keycloakInitOptions}
            onEvent={(event, error) => {
                console.log('Keycloak event:', event, error)
            }}
            onTokens={(tokens) => {
                console.log('Keycloak tokens updated:', tokens)
            }}
            LoadingComponent={LoadingComponent}
            onInitSuccess={handleKeycloakInit}
            onInitError={handleKeycloakInitError}
        >
            {children}
        </ReactKeycloakProvider>
    )
}

export default KeycloakProvider
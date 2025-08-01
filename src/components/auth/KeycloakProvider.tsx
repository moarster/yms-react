import { ReactKeycloakProvider } from '@react-keycloak/web'
import React, {  useRef,useState } from 'react'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { keycloak, keycloakInitOptions } from '@/config/keycloak'
import { useAuthStore } from '@/stores/authStore'

interface KeycloakProviderProps {
    children: React.ReactNode
}

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
    const [initError, _setInitError] = useState<string | null>(null)
    const { /*setKeycloak, setLoading,*/ isDemoMode } = useAuthStore()
    const initializingRef = useRef(false)
    // If in demo mode, just render children
    if (isDemoMode) {
        return <>{children}</>
    }

    const initOptions = {
        ...keycloakInitOptions,
        onLoad: initializingRef.current ? undefined : keycloakInitOptions.onLoad
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
            initOptions={initOptions}
            onEvent={(event, _error) => {
                if (event === 'onAuthSuccess' || event === 'onAuthError') {
                    initializingRef.current = true
                }
            }}
            onTokens={(_tokens) => {
                //console.log('Keycloak tokens updated:', tokens)
            }}

            //onInitSuccess={handleKeycloakInit}
            //onInitError={handleKeycloakInitError}
        >
            {children}
            <LoadingComponent/>
        </ReactKeycloakProvider>
    )
}

export default KeycloakProvider
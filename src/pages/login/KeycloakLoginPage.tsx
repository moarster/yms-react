import React from 'react'

import { useAuthStore } from '@/core/store/authStore.ts'
import { useUiStore } from '@/core/store/uiStore.ts'
import BaseLoginLayout from "@/layout/BaseLoginLayout.tsx";
import LoadingSpinner from '@/shared/ui/LoadingSpinner'


const KeycloakLoginPage: React.FC = () => {
    const { login, isLoading } = useAuthStore()
    const { addNotification } = useUiStore()

    const handleKeycloakLogin = async () => {
        try {
            await login()

            addNotification({
                type: 'success',
                title: 'Welcome back!',
                message: 'You have successfully logged in.',
            })
        } catch (error: unknown) {
            const message = error?.message || 'Keycloak login failed. Please try again.'
            addNotification({
                type: 'error',
                title: 'Login Failed',
                message,
            })
        }
    }

    return (
        <BaseLoginLayout
            title="Carrier Portal"
            subtitle="Sign in to your account"
        >
            <div className="space-y-6">
                <div className="text-center text-sm text-gray-600">
                    <p>You will be redirected to Keycloak for authentication</p>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={handleKeycloakLogin}
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : 'Sign in with Keycloak'}
                    </button>
                </div>
            </div>
        </BaseLoginLayout>
    )
}

export default KeycloakLoginPage
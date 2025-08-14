import React from 'react'

import { useAuthStore } from '@/core/store/authStore.ts'

import DemoLoginPage from './DemoLoginPage'
import KeycloakLoginPage from './KeycloakLoginPage'

const LoginPage: React.FC = () => {
    const { authMode } = useAuthStore()

    return authMode === 'demo' ? <DemoLoginPage /> : <KeycloakLoginPage />
}

export default LoginPage
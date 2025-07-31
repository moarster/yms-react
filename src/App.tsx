import React, { useEffect } from 'react'
import { Navigate,Route, Routes } from 'react-router-dom'

import KeycloakProvider from '@/components/auth/KeycloakProvider'
import LoginPage from '@/components/auth/LoginPage'
import AppLayout from '@/components/layout/AppLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import CatalogItemsPage from '@/pages/catalogs/CatalogItemsPage'
import CatalogsPage from '@/pages/catalogs/CatalogsPage'
import DashboardPage from '@/pages/DashboardPage'
import ShipmentRfpDetailPage from '@/pages/documents/ShipmentRfpDetailPage'
import ShipmentRfpsPage from '@/pages/documents/ShipmentRfpsPage'
import ShipmentRfpWizardPage from '@/pages/documents/ShipmentRfpWizardPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProfilePage from '@/pages/ProfilePage'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import MockWizard from "@/components/wizards/MockWizard.tsx";

// Protected route component
interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: string
    requiredPermission?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                           children,
                                                           requiredRole,
                                                           requiredPermission
                                                       }) => {
    const { isAuthenticated, user } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Check if user is demo superuser (bypasses all security)
    if (authService.isDemoSuperuser(user)) {
        return <>{children}</>
    }

    // Check role requirement
    if (requiredRole && !authService.hasRole(user, requiredRole)) {
        return <Navigate to="/dashboard" replace />
    }

    // Check permission requirement
    if (requiredPermission && !authService.hasPermission(user, requiredPermission)) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}

const AppContent: React.FC = () => {
    const { isAuthenticated, isLoading, refreshToken, isDemoMode } = useAuthStore()
    const { setTheme } = useUiStore()

    // Initialize app
    useEffect(() => {
        const initApp = async () => {
            // Set theme from localStorage or system preference
            const savedTheme = localStorage.getItem('theme')
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            setTheme((savedTheme as 'light' | 'dark') || systemTheme)

            // Try to refresh token if user is logged in (only for demo mode)
            if (isAuthenticated && isDemoMode) {
                try {
                    await refreshToken()
                } catch (error) {
                    console.warn('Failed to refresh token:', error)
                }
            }
        }

        initApp()
    }, [isAuthenticated, refreshToken, setTheme, isDemoMode])

    // Show loading spinner during initial auth check
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                }
            />

            {/* Protected routes */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<DashboardPage />} />

                                {/* Catalogs (NSI) routes */}
                                <Route
                                    path="/catalogs"
                                    element={
                                        <ProtectedRoute requiredPermission="CATALOG_READ">
                                            <CatalogsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                {/* Catalog routes */}
                                <Route
                                    path="/catalog/:catalogKey"
                                    element={
                                        <ProtectedRoute requiredPermission="CATALOG_READ">
                                            <CatalogItemsPage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* List routes */}
                                <Route
                                    path="/list/:catalogKey"
                                    element={
                                        <ProtectedRoute requiredPermission="CATALOG_READ">
                                            <CatalogItemsPage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Document routes */}
                                <Route
                                    path="/shipment-rfps"
                                    element={
                                        <ProtectedRoute requiredPermission="DOCUMENT_READ">
                                            <ShipmentRfpsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/shipment-rfps/new"
                                    element={
                                        <ProtectedRoute requiredPermission="RFP_CREATE">
                                            <ShipmentRfpWizardPage />
                                            {/*<MockWizard />*/}
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/shipment-rfps/:id"
                                    element={
                                        <ProtectedRoute requiredPermission="DOCUMENT_READ">
                                            <ShipmentRfpDetailPage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* User profile */}
                                <Route path="/profile" element={<ProfilePage />} />

                                {/* Catch all - 404 */}
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

const App: React.FC = () => {
    return (
        <KeycloakProvider>
            <AppContent />
        </KeycloakProvider>
    )
}

export default App
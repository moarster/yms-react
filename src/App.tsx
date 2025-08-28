import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import KeycloakProvider from '@/core/auth/KeycloakProvider.tsx';
import { ResourceHints, useAdjacentRoutePrefetch } from '@/core/router/Router';
import { useAuthStore } from '@/core/store/authStore.ts';
import { useUiStore } from '@/core/store/uiStore.ts';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import { PermissionProvider, usePermissions, useUserPermissions } from '@/core/contexts/PermissionContext.tsx';
import { UserRole } from '@/core/auth/types.ts';

// Lazy load all pages
const AppLayout = lazy(() => import('@/layout/AppLayout'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const LoginPage = lazy(() => import('@/pages/login/LoginPage.tsx'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

// Lazy load feature pages
const CatalogsPage = lazy(() => import('@/features/catalogs/CatalogsPage.tsx'));
const CatalogItemsPage = lazy(() => import('@/features/catalogs/CatalogItemsPage.tsx'));
const ShipmentRfpDetailPage = lazy(
  () => import('@/features/documents/pages/ShipmentRfpDetailPage.tsx'),
);
const ShipmentRfpsPage = lazy(() => import('@/features/documents/pages/ShipmentRfpsPage.tsx'));
const ShipmentRfpWizardPage = lazy(
  () => import('@/features/documents/pages/ShipmentRfpWizardPage.tsx'),
);

// Loading fallback component
const PageLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

// Prefetch component for route prefetching
const usePrefetch = () => {
  const prefetchRoute = (routeModule: () => Promise<any>) => {
    routeModule();
  };

  return { prefetchRoute };
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: UserRole;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({
                                                           children,
                                                           requiredPermission,
                                                           requiredRole,
                                                         }) => {
  const { hasPermission, isRole } = usePermissions();

  // Check role requirement
  if (requiredRole && !isRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check permission requirement
  if (requiredPermission) {
    const [resource, action] = requiredPermission.split('.');
    if (!hasPermission(resource, action)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
const AppContent: React.FC = () => {
  const { authMode, isAuthenticated, isLoading, refreshToken, user } = useAuthStore();
  const isDemoMode = authMode === 'demo';
  const { setTheme } = useUiStore();
  const { prefetchRoute } = usePrefetch();

  const userPermissions = useUserPermissions(user);

  // Use adjacent route prefetching
  useAdjacentRoutePrefetch();

  // Theme initialization - separate effect, runs once
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    setTheme((savedTheme as 'dark' | 'light') || systemTheme);
  }, []);

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      // Try to refresh token if user is logged in (only for demo mode)
      if (isAuthenticated && isDemoMode) {
        try {
          await refreshToken();
        } catch (error) {
          console.warn('Failed to refresh token:', error);
        }
      }

      // Prefetch common routes after authentication
      if (isAuthenticated) {
        setTimeout(() => {
          prefetchRoute(() => import('@/pages/DashboardPage'));
          prefetchRoute(() => import('@/features/catalogs/CatalogsPage.tsx'));
          prefetchRoute(() => import('@/features/documents/pages/ShipmentRfpsPage.tsx'));
        }, 1000);
      }
    };

    initApp();
  }, [isAuthenticated, refreshToken, isDemoMode]);

  // Show loading spinner during initial auth check
  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <PermissionProvider userPermissions={userPermissions}>
                <AppLayout>
                  <Suspense fallback={<PageLoading />}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<DashboardPage />} />

                      {/* Catalogs (NSI) routes */}
                      <Route
                        element={
                          <PermissionRoute requiredPermission="catalogs.view">
                            <CatalogsPage />
                          </PermissionRoute>
                        }
                        path="/catalogs"
                      />
                      {/* Catalog routes */}
                      <Route
                        element={
                          <PermissionRoute requiredPermission="catalogs.view">
                            <CatalogItemsPage />
                          </PermissionRoute>
                        }
                        path="/catalog/:catalogKey"
                      />

                      {/* List routes */}
                      <Route
                        element={
                          <PermissionRoute requiredPermission="catalogs.view">
                            <CatalogItemsPage />
                          </PermissionRoute>
                        }
                        path="/list/:catalogKey"
                      />

                      {/* Document routes */}
                      <Route
                        element={
                          <PermissionRoute requiredPermission="shipment_rfps.view">
                            <ShipmentRfpsPage />
                          </PermissionRoute>
                        }
                        path="/shipment-rfps"
                      />
                      <Route
                        element={
                          <PermissionRoute requiredPermission="shipment_rfps.create">
                            <ShipmentRfpWizardPage />
                          </PermissionRoute>
                        }
                        path="/shipment-rfps/new"
                      />
                      <Route
                        element={
                          <PermissionRoute requiredPermission="shipment_rfps.view">
                            <ShipmentRfpDetailPage />
                          </PermissionRoute>
                        }
                        path="/shipment-rfps/:id"
                      />

                      {/* User profile */}
                      <Route path="/profile" element={<ProfilePage />} />

                      {/* Catch all - 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </AppLayout>
              </PermissionProvider>
            </ProtectedRoute>
          }
          path="/*"
        />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <KeycloakProvider>
      <ResourceHints />
      <AppContent />
    </KeycloakProvider>
  );
};

export default App;

import React from 'react';

import { authServiceFactory } from '@/core/auth/authService.ts';
import { useUiStore } from '@/core/store/uiStore.ts';
import BaseLoginLayout from '@/layout/BaseLoginLayout.tsx';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

const KeycloakLoginPage: React.FC = () => {
  const { addNotification } = useUiStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const handleKeycloakLogin = async () => {
    try {
      setIsLoading(true);
      const keycloakService = authServiceFactory.getKeycloakService();

      await keycloakService.login();
    } catch (error: unknown) {
      setIsLoading(false);
      const message =
        error instanceof Error ? error.message : 'Keycloak login failed. Please try again.';
      addNotification({
        message,
        title: 'Login Failed',
        type: 'error',
      });
    }
  };

  return (
    <BaseLoginLayout title="Carrier Portal" subtitle="Sign in to your account">
      <div className="space-y-6">
        <div className="text-center text-sm text-gray-600">
          <p>You will be redirected to Keycloak for authentication</p>
        </div>

        <div>
          <button
            type="button"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleKeycloakLogin}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Sign in with Keycloak'}
          </button>
        </div>
      </div>
    </BaseLoginLayout>
  );
};

export default KeycloakLoginPage;

import React, { createContext, useCallback, useContext } from 'react';
import {  User, UserRole } from '@/core/auth/types';
import { authServiceFactory } from '@/core/auth/authService.ts';
import { PermissionResource, PermissionScope } from '@/core/contexts/types.ts';
import { useQuery } from '@tanstack/react-query';


interface PermissionContextValue {
  checkPermission: (resource: PermissionResource, scope: PermissionScope) => Promise<boolean>;
  isRole: (role: UserRole) => boolean;
  canAccess: (resource: string) => Promise<boolean>;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

interface PermissionProviderProps {
  children: React.ReactNode;
  user: User | null;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children, user }) => {
  const checkPermission = useCallback(
    async (resource: PermissionResource, scope: PermissionScope) => {
      const keycloakService = authServiceFactory.getKeycloakService();
      return await keycloakService.checkPermission({ resource, scope });
    },
    [],
  );

  const isRole = useCallback(
    (role: UserRole) => {
      return user?.roles.some((r) => r.name === role) ?? false;
    },
    [user],
  );

  const canAccess = useCallback(
    async (resource: string) => {
      const resourceMap: Record<string, PermissionResource> = {
        shipment_rfps: 'shipment-rfps',
        'shipment-rfp': 'shipment-rfps',
        referents: 'referents',
        lists: 'referents',
        catalogs: 'referents',
        users: 'users',
        user: 'users',
      };

      const mappedResource = resourceMap[resource];
      if (!mappedResource) return false;

      return await checkPermission(mappedResource, 'view');
    },
    [checkPermission],
  );

  return (
    <PermissionContext.Provider
      value={{
        checkPermission,
        isRole,
        canAccess,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};


export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

// New hook for async permission checks
export const useAsyncPermissions = () => {
  const { checkPermission, canAccess } = usePermissions();

  return {
    checkPermission,
    canAccess,
  };
};

export const usePermissionCheck = (
  resource: PermissionResource,
  scope: PermissionScope,
  enabled = true,
) => {
  const { checkPermission } = usePermissions();

  return useQuery({
    queryKey: ['permission', resource, scope],
    queryFn: () => checkPermission(resource, scope),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
export const useResourceAccess = (resource: string, enabled = true) => {
  const { canAccess } = usePermissions();

  return useQuery({
    queryKey: ['resource-access', resource],
    queryFn: () => canAccess(resource),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

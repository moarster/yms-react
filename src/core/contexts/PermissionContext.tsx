import React, { createContext, useCallback, useContext } from 'react';
import { Role, User, UserRole } from '@/core/auth/types';

interface Permission {
  resource: string;
  actions: string[];
  role: UserRole;
}

interface PermissionContextValue {
  hasPermission: (resource: string, action: string) => boolean;
  isRole: (role: UserRole) => boolean;
  canAccess: (resource: string) => boolean;
  permissions: Permission[];
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

interface PermissionProviderProps {
  children: React.ReactNode;
  userPermissions: Permission[];
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
  userPermissions,
}) => {
  const hasPermission = useCallback(
    (resource: string, action: string) => {
      return userPermissions.some((p) => p.resource === resource && p.actions.includes(action));
    },
    [userPermissions],
  );

  const isRole = useCallback(
    (role: UserRole) => {
      return userPermissions.some((p) => p.role === role);
    },
    [userPermissions],
  );

  const canAccess = useCallback(
    (resource: string) => {
      return userPermissions.some((p) => p.resource === resource);
    },
    [userPermissions],
  );

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        isRole,
        canAccess,
        permissions: userPermissions,
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

export const useUserPermissions = (user: User) => {
  return React.useMemo(() => {
    if (!user?.roles) return [];

    return user.roles.flatMap((role: Role): Permission[] =>
      role.permissions.map((permission: string) => ({
        resource: permission.split('_')[0].toLowerCase(),
        actions: [permission.split('_')[1]?.toLowerCase() || 'read'],
        role: role.name as UserRole,
      })),
    );
  }, [user?.roles]);
};

import React from 'react';
import { usePermissionCheck } from '@/core/contexts/PermissionContext';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import { PermissionResource, PermissionScope } from '@/core/contexts/types.ts';

interface PermissionGuardProps {
  children: React.ReactNode;
  resource: PermissionResource;
  scope: PermissionScope;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  resource,
  scope,
  fallback = null,
  loadingComponent = <LoadingSpinner size="sm" />,
}) => {
  const { data: hasPermission, isLoading } = usePermissionCheck(resource, scope);

  if (isLoading) return <>{loadingComponent}</>;
  if (!hasPermission) return <>{fallback}</>;

  return <>{children}</>;
};

// Convenience components for common permission checks
export const ViewGuard: React.FC<Omit<PermissionGuardProps, 'scope'>> = (props) => (
  <PermissionGuard {...props} scope="view" />
);

export const ManageGuard: React.FC<Omit<PermissionGuardProps, 'scope'>> = (props) => (
  <PermissionGuard {...props} scope="manage" />
);

export const DeleteGuard: React.FC<Omit<PermissionGuardProps, 'scope'>> = (props) => (
  <PermissionGuard {...props} scope="delete" />
);

export const ParticipateGuard: React.FC<Omit<PermissionGuardProps, 'scope'>> = (props) => (
  <PermissionGuard {...props} scope="participate" />
);

// Resource-specific guards
export const ReferentsGuard: React.FC<Omit<PermissionGuardProps, 'resource'>> = (props) => (
  <PermissionGuard {...props} resource="referents" />
);

export const ShipmentRfpGuard: React.FC<Omit<PermissionGuardProps, 'resource'>> = (props) => (
  <PermissionGuard {...props} resource="shipment-rfp" />
);

export const UsersGuard: React.FC<Omit<PermissionGuardProps, 'resource'>> = (props) => (
  <PermissionGuard {...props} resource="users" />
);

// Combined guards for common use cases
export const ShipmentRfpViewGuard: React.FC<Omit<PermissionGuardProps, 'resource' | 'scope'>> = (
  props,
) => <PermissionGuard {...props} resource="shipment-rfp" scope="view" />;

export const ShipmentRfpManageGuard: React.FC<Omit<PermissionGuardProps, 'resource' | 'scope'>> = (
  props,
) => <PermissionGuard {...props} resource="shipment-rfp" scope="manage" />;

export const ReferentsManageGuard: React.FC<Omit<PermissionGuardProps, 'resource' | 'scope'>> = (
  props,
) => <PermissionGuard {...props} resource="referents" scope="manage" />;

export const UsersManageGuard: React.FC<Omit<PermissionGuardProps, 'resource' | 'scope'>> = (
  props,
) => <PermissionGuard {...props} resource="users" scope="manage" />;

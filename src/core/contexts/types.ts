export type PermissionResource = 'referents' | 'shipment-rfps' | 'users';
export type PermissionScope = 'view' | 'manage' | 'delete' | 'participate';

export interface PermissionResult {
    resource: PermissionResource;
    scope: PermissionScope;
    allowed: boolean;
}

export type PermissionRequest = Omit<PermissionResult, 'allowed'>
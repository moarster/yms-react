import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'

export const usePermissions = () => {
    const { user } = useAuthStore()

    const hasRole = (role: string) => {
        return authService.hasRole(user, role)
    }

    const hasPermission = (permission: string) => {
        return authService.hasPermission(user, permission)
    }

    const hasAnyRole = (roles: string[]) => {
        return roles.some(role => hasRole(role))
    }

    const hasAnyPermission = (permissions: string[]) => {
        return permissions.some(permission => hasPermission(permission))
    }

    const hasAllRoles = (roles: string[]) => {
        return roles.every(role => hasRole(role))
    }

    const hasAllPermissions = (permissions: string[]) => {
        return permissions.every(permission => hasPermission(permission))
    }

    const isLogist = () => {
        return authService.isLogist(user)
    }

    const isCarrier = () => {
        return authService.isCarrier(user)
    }

    const canAccessResource = (resource: string, action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE') => {
        const permission = `${resource}_${action}`
        return hasPermission(permission)
    }

    return {
        user,
        hasRole,
        hasPermission,
        hasAnyRole,
        hasAnyPermission,
        hasAllRoles,
        hasAllPermissions,
        isLogist,
        isCarrier,
        canAccessResource,
    }
}
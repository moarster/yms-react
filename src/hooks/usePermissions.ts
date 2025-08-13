import {
    userHasAnyRole,
    userHasPermission,
    userHasRole, userIsAdmin,
    userIsCarrier,
    userIsLogist,
    UserRole
} from "@/core/auth/types.ts";
import { useAuthStore } from '@/core/store/authStore.ts'

export const usePermissions = () => {
    const { user } = useAuthStore()

    const hasRole = (role: UserRole) => {
        return  userHasRole(user, role)
    }

    const hasPermission = (permission: string) => {
        return userHasPermission(user, permission)
    }

    const hasAnyRole = (roles: UserRole[]) => {
        return userHasAnyRole(user, roles)
    }

    const hasAnyPermission = (permissions: string[]) => {
        return permissions.some(permission => hasPermission(permission))
    }

    const hasAllRoles = (roles: UserRole[]) => {
        return roles.every(role => hasRole(role))
    }

    const hasAllPermissions = (permissions: string[]) => {
        return permissions.every(permission => hasPermission(permission))
    }

    const isLogist = () => {
        return userIsLogist(user)
    }

    const isCarrier = () => {
        return userIsCarrier(user)
    }

    const isAdmin = () => {
        return userIsAdmin(user)
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
        isAdmin,
        canAccessResource,
    }
}
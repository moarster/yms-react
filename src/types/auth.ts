import type Keycloak from 'keycloak-js'

export type UserRole = 'LOGIST' | 'CARRIER' | 'ADMIN'
export type AuthMode = 'keycloak' | 'demo'

export interface Organization {
    id: string
    name: string
    inn: string
    ogrn: string
    address: string
    phone?: string
    email?: string
}

export interface User {
    id: string
    email: string
    name: string
    roles: UserRole[]
    organization?: Organization
    // Keycloak specific
    keycloakId?: string
    preferredUsername?: string
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    keycloak?: Keycloak
    authMode: AuthMode
    isDemoMode: boolean
}

// Permission helpers
export const hasRole = (user: User | null, role: UserRole): boolean =>
    user?.roles.includes(role) ?? false

export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean =>
    roles.some(role => hasRole(user, role))

export const isLogist = (user: User | null): boolean => hasRole(user, 'LOGIST')
export const isCarrier = (user: User | null): boolean => hasRole(user, 'CARRIER')
export const isAdmin = (user: User | null): boolean => hasRole(user, 'ADMIN')
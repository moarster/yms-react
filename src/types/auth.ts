import Keycloak from 'keycloak-js'

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    keycloak?: Keycloak
    authMode: 'keycloak' | 'demo'
    isDemoMode: boolean
}

export interface AuthContextType extends AuthState {
    login: (email?: string, password?: string) => Promise<void>
    logout: () => void
    refreshToken: () => Promise<void>
    setUser: (user: User) => void
    setLoading: (loading: boolean) => void
    switchToDemoMode: () => void
    switchToKeycloakMode: () => void
}

export interface DemoUser {
    email: string
    password: string
    user: User
}

export interface User {
    id: string
    email: string
    name: string
    roles: UserRole[]
    organization?: Organization
    // Keycloak specific fields
    keycloakId?: string
    preferredUsername?: string
}

export interface UserRole {
    id: string
    name: 'LOGIST' | 'CARRIER' | 'ADMIN'
    permissions: string[]
}

export interface Organization {
    id: string
    name: string
    inn: string
    ogrn: string
    address: string
    phone?: string
    email?: string
}
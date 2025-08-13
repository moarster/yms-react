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

export interface Role {
    id: string
    name: UserRole
    permissions: string[]
}

export interface User {
    id: string
    email: string
    name: string
    roles: Role[]
    organization?: Organization
    keycloakId?: string
    preferredUsername?: string
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    authMode: AuthMode
}

export interface AuthTokens {
    accessToken: string
    refreshToken?: string
}

export interface AuthResponse {
    user: User
    tokens: AuthTokens
}

export interface AuthService {
    login(email?: string, password?: string): Promise<AuthResponse>
    logout(): Promise<void>
    refreshToken(): Promise<AuthTokens>
    getCurrentUser(): Promise<User>
    isAuthenticated(): boolean
}

export const userHasRole = (user: User | null, role: UserRole): boolean =>
    user?.roles.some(r => r.name === role) ?? false

export const userHasAnyRole = (user: User | null, roles: UserRole[]): boolean =>
    roles.some(role => userHasRole(user, role))

export const userHasPermission = (user: User | null, permission: string): boolean =>
    user?.roles?.some(role => role.permissions.includes(permission)) ?? false

export const userIsLogist = (user: User | null): boolean => userHasRole(user, 'LOGIST')
export const userIsCarrier = (user: User | null): boolean => userHasRole(user, 'CARRIER')
export const userIsAdmin = (user: User | null): boolean => userHasRole(user, 'ADMIN')
import  Keycloak  from 'keycloak-js'
import { User, ApiResponse } from '@/types'
import { authConfig, demoUsers } from '../config/keycloak'


interface LoginResponse {
    user: User
    token: string
    refreshToken: string
}

interface RefreshTokenResponse {
    user: User
    token: string
}

class AuthService {
    private keycloak: Keycloak | null = null

    // Initialize Keycloak
    initKeycloak(keycloakInstance: Keycloak) {
        this.keycloak = keycloakInstance
    }

    // Login method that handles both modes
    async login(email?: string, password?: string): Promise<ApiResponse<LoginResponse>> {
        if (authConfig.isDemoMode) {
            return this.loginDemo(email!, password!)
        } else {
            return this.loginKeycloak()
        }
    }

    // Demo mode login
    private async loginDemo(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        const demoUser = demoUsers.find(u => u.email === email && u.password === password)

        if (!demoUser) {
            throw new Error('Invalid demo credentials')
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const token = this.generateDemoToken(demoUser.user)

        return {
            data: {
                user: demoUser.user,
                token,
                refreshToken: token,
            },
            success: true,
            message: 'Demo login successful',
        }
    }

    // Keycloak login
    private async loginKeycloak(): Promise<ApiResponse<LoginResponse>> {
        if (!this.keycloak) {
            throw new Error('Keycloak not initialized')
        }

        try {
            const authenticated = await this.keycloak.login({
                redirectUri: window.location.origin,
            })

            if (!authenticated) {
                throw new Error('Keycloak authentication failed')
            }

            const user = await this.mapKeycloakUser(this.keycloak)
            const token = this.keycloak.token!

            return {
                data: {
                    user,
                    token,
                    refreshToken: this.keycloak.refreshToken!,
                },
                success: true,
                message: 'Keycloak login successful',
            }
        } catch (error) {
            console.error('Keycloak login error:', error)
            throw error
        }
    }

    // Logout
    async logout(): Promise<void> {
        if (authConfig.isDemoMode) {
            // Just clear local storage for demo mode
            localStorage.removeItem('auth-storage')
            return
        }

        if (this.keycloak) {
            try {
                await this.keycloak.logout({
                    redirectUri: window.location.origin,
                })
            } catch (error) {
                console.warn('Keycloak logout error:', error)
            }
        }
    }

    // Refresh token
    async refreshToken(token: string): Promise<ApiResponse<RefreshTokenResponse>> {
        if (authConfig.isDemoMode) {
            return this.refreshDemoToken(token)
        } else {
            return this.refreshKeycloakToken()
        }
    }

    // Demo token refresh
    private async refreshDemoToken(token: string): Promise<ApiResponse<RefreshTokenResponse>> {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const demoUser = demoUsers.find(u => u.user.id === payload.sub)

            if (!demoUser) {
                throw new Error('Invalid demo token')
            }

            const newToken = this.generateDemoToken(demoUser.user)

            return {
                data: {
                    user: demoUser.user,
                    token: newToken,
                },
                success: true,
            }
        } catch (error) {
            throw new Error('Demo token refresh failed')
        }
    }

    // Keycloak token refresh
    private async refreshKeycloakToken(): Promise<ApiResponse<RefreshTokenResponse>> {
        if (!this.keycloak) {
            throw new Error('Keycloak not initialized')
        }

        try {
            const refreshed = await this.keycloak.updateToken(5)

            if (!refreshed) {
                throw new Error('Token refresh failed')
            }

            const user = await this.mapKeycloakUser(this.keycloak)

            return {
                data: {
                    user,
                    token: this.keycloak.token!,
                },
                success: true,
            }
        } catch (error) {
            console.error('Keycloak token refresh error:', error)
            throw error
        }
    }

    // Get current user
    async getCurrentUser(): Promise<ApiResponse<User>> {
        if (authConfig.isDemoMode) {
            // In demo mode, user info is already in token
            throw new Error('Use token to get user in demo mode')
        }

        if (!this.keycloak?.authenticated) {
            throw new Error('Not authenticated')
        }

        const user = await this.mapKeycloakUser(this.keycloak)
        return {
            data: user,
            success: true,
        }
    }

    // Map Keycloak user to our User type
    private async mapKeycloakUser(keycloak: Keycloak): Promise<User> {
        const profile = keycloak.profile
        const tokenParsed = keycloak.tokenParsed

        if (!profile || !tokenParsed) {
            throw new Error('Keycloak profile not available')
        }

        // Extract roles from Keycloak token
        const realmRoles = tokenParsed.realm_access?.roles || []
        const resourceRoles = tokenParsed.resource_access?.[authConfig.mode]?.roles || []
        const allRoles = [...realmRoles, ...resourceRoles]

        // Map Keycloak roles to our role structure
        const roles = allRoles.map(role => ({
            id: role,
            name: role.toUpperCase() as 'LOGIST' | 'CARRIER' | 'ADMIN',
            permissions: this.getPermissionsForRole(role),
        }))

        return {
            id: profile.id!,
            email: profile.email!,
            name: `${profile.firstName} ${profile.lastName}`.trim(),
            roles,
            keycloakId: profile.id,
            preferredUsername: profile.username,
            // You might want to fetch organization from your backend
            organization: undefined,
        }
    }

    // Generate demo JWT token
    private generateDemoToken(user: User): string {
        const header = { alg: 'HS256', typ: 'JWT' }
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles.map(r => r.name),
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
            iat: Math.floor(Date.now() / 1000),
        }

        // This is a fake JWT for demo purposes only
        const encodedHeader = btoa(JSON.stringify(header))
        const encodedPayload = btoa(JSON.stringify(payload))
        const signature = btoa('demo-signature')

        return `${encodedHeader}.${encodedPayload}.${signature}`
    }

    // Get permissions for role (customize based on your needs)
    private getPermissionsForRole(role: string): string[] {
        const rolePermissions: Record<string, string[]> = {
            LOGIST: [
                'DOCUMENT_CREATE',
                'DOCUMENT_READ',
                'DOCUMENT_UPDATE',
                'RFP_CREATE',
                'RFP_ASSIGN',
                'RFP_CANCEL',
                'RFP_COMPLETE',
                'CATALOG_READ',
            ],
            CARRIER: [
                'DOCUMENT_READ',
                'RFP_SUBMIT_RATE',
                'CATALOG_READ',
            ],
            ADMIN: [
                'DOCUMENT_CREATE',
                'DOCUMENT_READ',
                'DOCUMENT_UPDATE',
                'DOCUMENT_DELETE',
                'RFP_CREATE',
                'RFP_ASSIGN',
                'RFP_CANCEL',
                'RFP_COMPLETE',
                'RFP_SUBMIT_RATE',
                'CATALOG_CREATE',
                'CATALOG_READ',
                'CATALOG_UPDATE',
                'CATALOG_DELETE',
                'USER_CREATE',
                'USER_READ',
                'USER_UPDATE',
                'USER_DELETE',
            ],
        }

        return rolePermissions[role.toUpperCase()] || []
    }

    // Role checking methods
    hasRole(user: User | null, role: string): boolean {
        return user?.roles?.some(r => r.name === role) || false
    }

    hasPermission(user: User | null, permission: string): boolean {
        return user?.roles?.some(role =>
            role.permissions.includes(permission)
        ) || false
    }

    isLogist(user: User | null): boolean {
        return this.hasRole(user, 'LOGIST')
    }

    isCarrier(user: User | null): boolean {
        return this.hasRole(user, 'CARRIER')
    }

    isAdmin(user: User | null): boolean {
        return this.hasRole(user, 'ADMIN')
    }

    // Check if user is demo superuser (bypasses all security)
    isDemoSuperuser(user: User | null): boolean {
        return authConfig.isDemoMode && user?.email === authConfig.demoSuperuser.email
    }
}

export const authService = new AuthService()
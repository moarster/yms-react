import Keycloak from 'keycloak-js'

import { keycloakConfig } from '../../config'
import { AuthResponse, AuthService, AuthTokens, User } from '../types'

export class KeycloakAuthService implements AuthService {
    private keycloak: Keycloak | null = null

    constructor() {
        this.keycloak = new Keycloak(keycloakConfig)
    }

    async initialize(): Promise<boolean> {
        if (!this.keycloak) return false

        try {
            return await this.keycloak.init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                checkLoginIframe: false,
                pkceMethod: 'S256',
            })
        } catch (error) {
            console.error('Keycloak initialization failed:', error)
            return false
        }
    }

    async login(): Promise<AuthResponse> {
        if (!this.keycloak) throw new Error('Keycloak not initialized')

        try {
            await this.keycloak.login({
                redirectUri: window.location.origin,
            })

            if (!this.keycloak.authenticated || !this.keycloak.token) {
                throw new Error('Authentication failed')
            }

            const user = await this.mapKeycloakUser(this.keycloak)

            return {
                user,
                tokens: {
                    accessToken: this.keycloak.token,
                    refreshToken: this.keycloak.refreshToken,
                },
            }
        } catch (error) {
            console.error('Keycloak login error:', error)
            throw error
        }
    }

    async logout(): Promise<void> {
        if (!this.keycloak) return

        try {
            await this.keycloak.logout({
                redirectUri: window.location.origin,
            })
        } catch (error) {
            console.warn('Keycloak logout error:', error)
        }
    }

    async refreshToken(): Promise<AuthTokens> {
        if (!this.keycloak) throw new Error('Keycloak not initialized')

        try {
            const refreshed = await this.keycloak.updateToken(5)

            if (!refreshed || !this.keycloak.token) {
                throw new Error('Token refresh failed')
            }

            return {
                accessToken: this.keycloak.token,
                refreshToken: this.keycloak.refreshToken,
            }
        } catch (error) {
            console.error('Token refresh error:', error)
            throw error
        }
    }

    async getCurrentUser(): Promise<User> {
        if (!this.keycloak?.authenticated) {
            throw new Error('Not authenticated')
        }

        return this.mapKeycloakUser(this.keycloak)
    }

    isAuthenticated(): boolean {
        return this.keycloak?.authenticated ?? false
    }

    getKeycloakInstance(): Keycloak | null {
        return this.keycloak
    }

    async changePassword(newPassword: string): Promise<void> {
        if (!this.keycloak?.token) throw new Error('Not authenticated')

        await this.keycloak.updateToken()

        const userInfo = await this.keycloak.loadUserInfo()
        const userId = (userInfo as any).sub

        const adminUrl = `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users/${userId}`

        const updateData = {
            credentials: [{
                type: 'password',
                value: newPassword,
                temporary: false,
            }],
        }

        const response = await fetch(adminUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.keycloak.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        })

        if (!response.ok) {
            throw new Error('Password change failed')
        }
    }

    private async mapKeycloakUser(keycloak: Keycloak): Promise<User> {
        const profile = keycloak.profile
        const tokenParsed = keycloak.tokenParsed

        if (!profile || !tokenParsed) {
            throw new Error('Keycloak profile not available')
        }

        const realmRoles = tokenParsed.realm_access?.roles || []
        const resourceRoles = tokenParsed.resource_access?.[keycloakConfig.clientId]?.roles || []
        const allRoles = [...realmRoles, ...resourceRoles]

        const roles = allRoles
            .filter((role): role is 'LOGIST' | 'CARRIER' | 'ADMIN' =>
                ['LOGIST', 'CARRIER', 'ADMIN'].includes(role.toUpperCase())
            )
            .map(role => ({
                id: `role-${role.toLowerCase()}`,
                name: role.toUpperCase() as 'LOGIST' | 'CARRIER' | 'ADMIN',
                permissions: this.getPermissionsForRole(role),
            }))

        return {
            id: profile.id!,
            email: profile.email!,
            name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
            roles,
            keycloakId: profile.id,
            preferredUsername: profile.username,
        }
    }

    private getPermissionsForRole(role: string): string[] {
        const rolePermissions: Record<string, string[]> = {
            LOGIST: [
                'DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE',
                'RFP_CREATE', 'RFP_ASSIGN', 'RFP_CANCEL', 'RFP_COMPLETE',
                'CATALOG_READ',
            ],
            CARRIER: [
                'DOCUMENT_READ', 'RFP_SUBMIT_RATE', 'CATALOG_READ',
            ],
            ADMIN: [
                'DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_DELETE',
                'RFP_CREATE', 'RFP_ASSIGN', 'RFP_CANCEL', 'RFP_COMPLETE', 'RFP_SUBMIT_RATE',
                'CATALOG_CREATE', 'CATALOG_READ', 'CATALOG_UPDATE', 'CATALOG_DELETE',
                'USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE',
            ],
        }

        return rolePermissions[role.toUpperCase()] || []
    }
}
import Keycloak from 'keycloak-js'

import {keycloakConfig} from '../../config'
import {AuthResponse, AuthService, AuthTokens, Organization, Role, User, UserRole} from '../types'

export class KeycloakAuthService implements AuthService {
    private readonly keycloak: Keycloak | null = null

    constructor() {
        this.keycloak = new Keycloak(keycloakConfig)
    }

    async initialize(): Promise<boolean> {
        if (!this.keycloak) return false

        try {
            if (this.keycloak.authenticated !== undefined) {
                return this.keycloak.authenticated
            }

            // This path is for standalone usage without ReactKeycloakProvider
            return await this.keycloak.init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                checkLoginIframe: false,
                pkceMethod: 'S256',
            })
        } catch (error) {
            if (error instanceof Error && error.message.includes('can only be initialized once')) {
                return this.keycloak.authenticated ?? false
            }

            console.error('Keycloak initialization failed:', error)
            return false
        }
    }

    async getAuthResponse(): Promise<AuthResponse> {
        if (!this.keycloak?.authenticated || !this.keycloak.token) {
            throw new Error('Not authenticated')
        }

        if (!this.keycloak.profile) {
            await this.keycloak.loadUserProfile()
        }

        const user = await this.mapKeycloakUser(this.keycloak)

        return {
            user,
            tokens: {
                accessToken: this.keycloak.token,
                refreshToken: this.keycloak.refreshToken,
            },
        }
    }

    async login(): Promise<AuthResponse> {
        if (!this.keycloak) throw new Error('Keycloak not initialized')

        await this.keycloak.login({
            redirectUri: window.location.origin,
        })

        return {} as AuthResponse
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
        const resourceRoles = tokenParsed.resource_access?.['carrier-portal']?.roles || []

        return {
            id: tokenParsed.sub || '',
            email: profile.email || '',
            name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
            preferredUsername: tokenParsed.preferred_username,
            keycloakId: tokenParsed.sub,
            roles: this.mapRoles([...realmRoles, ...resourceRoles]),
            organization: this.extractOrganization(tokenParsed),
        }
    }

    private mapRoles(keycloakRoles: string[]): Role[] {
        const roleMapping: Record<string, UserRole> = {
            'logist': 'LOGIST',
            'carrier': 'CARRIER',
            'admin': 'ADMIN',
        }

        return keycloakRoles
            .filter(role => roleMapping[role.toLowerCase()])
            .map(role => ({
                id: role,
                name: roleMapping[role.toLowerCase()],
                permissions: this.getRolePermissions(roleMapping[role.toLowerCase()]),
            }))
    }

    private getRolePermissions(role: UserRole): string[] {
        const permissions: Record<UserRole, string[]> = {
            ADMIN: ['*'],
            LOGIST: [
                'catalogs.view',
                'catalogs.manage',
                'shipment_rfps.view',
                'shipment_rfps.create',
                'shipment_rfps.edit',
                'shipment_rfps.delete',
                'shipment_rfps.publish',
                'shipment_rfps.assign',
                'shipment_rfps.complete',
            ],
            CARRIER: [
                'catalogs.view',
                'shipment_rfps.view',
                'shipment_rfps.respond',
            ],
        }

        return permissions[role] || []
    }

    private extractOrganization(tokenParsed: any): Organization | undefined {
        if (!tokenParsed.organization) return undefined

        return {
            id: tokenParsed.organization.id || '',
            name: tokenParsed.organization.name || '',
            inn: tokenParsed.organization.inn || '',
            ogrn: tokenParsed.organization.ogrn || '',
            address: tokenParsed.organization.address || '',
            phone: tokenParsed.organization.phone,
            email: tokenParsed.organization.email,
        }
    }
}
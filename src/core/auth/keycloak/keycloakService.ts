import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';

import { keycloakConfig } from '../../config';
import {
  AuthResponse,
  AuthService,
  AuthTokens,
  Organization,
  Role,
  User,
  UserRole,
} from '../types';

export class KeycloakAuthService implements AuthService {
  private readonly keycloak: Keycloak | null = null;

  constructor() {
    this.keycloak = new Keycloak(keycloakConfig);
  }

  async initialize(): Promise<boolean> {
    if (!this.keycloak) return false;

    try {
      if (this.keycloak.authenticated !== undefined) {
        return this.keycloak.authenticated;
      }

      // This path is for standalone usage without ReactKeycloakProvider
      return await this.keycloak.init({
        checkLoginIframe: false,
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('can only be initialized once')) {
        return this.keycloak.authenticated ?? false;
      }

      console.error('Keycloak initialization failed:', error);
      return false;
    }
  }

  async getAuthResponse(): Promise<AuthResponse> {
    if (!this.keycloak?.authenticated || !this.keycloak.token) {
      throw new Error('Not authenticated');
    }

    if (!this.keycloak.profile) {
      await this.keycloak.loadUserProfile();
    }

    const user = await this.mapKeycloakUser(this.keycloak);

    return {
      tokens: {
        accessToken: this.keycloak.token,
        refreshToken: this.keycloak.refreshToken,
      },
      user,
    };
  }

  async login(): Promise<AuthResponse> {
    if (!this.keycloak) throw new Error('Keycloak not initialized');

    await this.keycloak.login({
      redirectUri: window.location.origin,
    });

    return {} as AuthResponse;
  }

  async logout(): Promise<void> {
    if (!this.keycloak) return;

    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin,
      });
    } catch (error) {
      console.warn('Keycloak logout error:', error);
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    if (!this.keycloak) throw new Error('Keycloak not initialized');

    try {
      const refreshed = await this.keycloak.updateToken(5);

      if (!refreshed || !this.keycloak.token) {
        throw new Error('Token refresh failed');
      }

      return {
        accessToken: this.keycloak.token,
        refreshToken: this.keycloak.refreshToken,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    if (!this.keycloak?.authenticated) {
      throw new Error('Not authenticated');
    }

    return this.mapKeycloakUser(this.keycloak);
  }

  isAuthenticated(): boolean {
    return this.keycloak?.authenticated ?? false;
  }

  getKeycloakInstance(): Keycloak | null {
    return this.keycloak;
  }

  async changePassword(newPassword: string): Promise<void> {
    if (!this.keycloak?.token) throw new Error('Not authenticated');

    await this.keycloak.updateToken();

    const userInfo = await this.keycloak.loadUserInfo();
    const userId = (userInfo as any).sub;

    const adminUrl = `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users/${userId}`;

    const updateData = {
      credentials: [
        {
          temporary: false,
          type: 'password',
          value: newPassword,
        },
      ],
    };

    const response = await fetch(adminUrl, {
      body: JSON.stringify(updateData),
      headers: {
        Authorization: `Bearer ${this.keycloak.token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Password change failed');
    }
  }

  private async mapKeycloakUser(keycloak: Keycloak): Promise<User> {
    const profile = keycloak.profile;
    const tokenParsed = keycloak.tokenParsed;

    if (!profile || !tokenParsed) {
      throw new Error('Keycloak profile not available');
    }

    const realmRoles = tokenParsed.realm_access?.roles || [];
    const resourceRoles = tokenParsed.resource_access?.['carrier-portal-frontend']?.roles || [];

    return {
      email: profile.email || '',
      id: tokenParsed.sub || '',
      keycloakId: tokenParsed.sub,
      name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
      organization: this.extractOrganization(tokenParsed),
      preferredUsername: tokenParsed.preferred_username,
      roles: this.mapRoles([...new Set([...realmRoles, ...resourceRoles])]),
    };
  }

  private mapRoles(keycloakRoles: string[]): Role[] {
    const roleMapping: Record<string, UserRole> = {
      admin: 'ADMIN',
      carrier: 'CARRIER',
      logist: 'LOGIST',
    };

    return keycloakRoles
      .filter((role) => roleMapping[role.toLowerCase()])
      .map((role) => ({
        id: role,
        name: roleMapping[role.toLowerCase()],
        permissions: this.getRolePermissions(roleMapping[role.toLowerCase()]),
      }));
  }

  private getRolePermissions(role: UserRole): string[] {
    const permissions: Record<UserRole, string[]> = {
      ADMIN: [
        'catalogs.view',
        'catalogs.manage',
        'shipment_rfps.view',
        'shipment_rfps.create',
        'shipment_rfps.accept',
      ],
      CARRIER: ['catalogs.view', 'shipment_rfps.view', 'shipment_rfps.accept'],
      LOGIST: ['catalogs.view', 'shipment_rfps.view', 'shipment_rfps.create'],
    };

    return permissions[role] || [];
  }

  private extractOrganization(tokenParsed: KeycloakTokenParsed): Organization | undefined {
    if (!tokenParsed.organization) return undefined;

    return {
      address: tokenParsed.organization.address || '',
      email: tokenParsed.organization.email,
      id: tokenParsed.organization.id || '',
      inn: tokenParsed.organization.inn || '',
      name: tokenParsed.organization.name || '',
      ogrn: tokenParsed.organization.ogrn || '',
      phone: tokenParsed.organization.phone,
    };
  }
}

import { authConfig } from '../config';
import { DemoAuthService } from './demo/demoService';
import { KeycloakAuthService } from './keycloak/keycloakService';
import { AuthMode, AuthService } from './types';

class AuthServiceFactory {
  private keycloakService: KeycloakAuthService | null = null;
  private demoService: DemoAuthService | null = null;

  getService(mode: AuthMode = authConfig.mode): AuthService {
    switch (mode) {
      case 'keycloak':
        if (!this.keycloakService) {
          this.keycloakService = new KeycloakAuthService();
        }
        return this.keycloakService;

      case 'demo':
        if (!this.demoService) {
          this.demoService = new DemoAuthService();
        }
        return this.demoService;

      default:
        throw new Error(`Unknown auth mode: ${mode}`);
    }
  }

  getKeycloakService(): KeycloakAuthService {
    if (!this.keycloakService) {
      this.keycloakService = new KeycloakAuthService();
    }
    return this.keycloakService;
  }
}

export const authServiceFactory = new AuthServiceFactory();
export const authService = authServiceFactory.getService();

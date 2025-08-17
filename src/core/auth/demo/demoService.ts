import { AuthResponse, AuthService, AuthTokens, User } from '../types';
import { demoUsers } from './demoUsers';

export class DemoAuthService implements AuthService {
  async login(email?: string, password?: string): Promise<AuthResponse> {
    if (!email || !password) {
      throw new Error('Email and password required for demo login');
    }

    const demoUser = demoUsers.find((u) => u.email === email && u.password === password);
    if (!demoUser) {
      throw new Error('Invalid demo credentials');
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const token = this.generateDemoToken(demoUser.user);
    localStorage.setItem('auth-token', token);
    return {
      tokens: {
        accessToken: token,
        refreshToken: token,
      },
      user: demoUser.user,
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-storage');
  }

  async refreshToken(): Promise<AuthTokens> {
    const currentUser = this.getCurrentUserFromToken();
    const newToken = this.generateDemoToken(currentUser);

    return {
      accessToken: newToken,
      refreshToken: newToken,
    };
  }

  async getCurrentUser(): Promise<User> {
    return this.getCurrentUserFromToken();
  }

  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  private getCurrentUserFromToken(): User {
    const token = localStorage.getItem('auth-token');
    if (!token) throw new Error('No token found');

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const demoUser = demoUsers.find((u) => u.user.id === payload.sub);

      if (!demoUser) throw new Error('User not found');

      return demoUser.user;
    } catch {
      throw new Error('Invalid token');
    }
  }

  private generateDemoToken(user: User): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      iat: Math.floor(Date.now() / 1000),
      name: user.name,
      roles: user.roles.map((r) => r.name),
      sub: user.id,
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa('demo-signature');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}

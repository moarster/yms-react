export type UserRole = 'ADMIN' | 'CARRIER' | 'LOGIST';
export type AuthMode = 'demo' | 'keycloak';

export interface Organization {
  address: string;
  email?: string;
  id: string;
  inn: string;
  name: string;
  ogrn: string;
  phone?: string;
}

export interface Role {
  id: string;
  name: UserRole;
  permissions: string[];
}

export interface User {
  email: string;
  id: string;
  keycloakId?: string;
  name: string;
  organization?: Organization;
  preferredUsername?: string;
  roles: Role[];
}

export interface AuthState {
  authMode: AuthMode;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: null | string;
  user: null | User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: User;
}

export interface AuthService {
  getCurrentUser: () => Promise<User>;
  isAuthenticated: () => boolean;
  login: (email?: string, password?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<AuthTokens>;
}

export const userHasRole = (user: null | User, role: UserRole): boolean =>
  user?.roles.some((r) => r.name === role) ?? false;

export const userHasAnyRole = (user: null | User, roles: UserRole[]): boolean =>
  roles.some((role) => userHasRole(user, role));

export const userHasPermission = (user: null | User, permission: string): boolean =>
  user?.roles?.some((role) => role.permissions.includes(permission)) ?? false;

export const userIsLogist = (user: null | User): boolean => userHasRole(user, 'LOGIST');
export const userIsCarrier = (user: null | User): boolean => userHasRole(user, 'CARRIER');
export const userIsAdmin = (user: null | User): boolean => userHasRole(user, 'ADMIN');

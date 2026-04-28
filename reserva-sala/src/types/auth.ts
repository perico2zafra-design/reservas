export type UserRole = 'USER' | 'ADMIN' | 'BLOCK_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password?: string; // Optional if we support passwordless, but required for now
}

export interface RegisterData {
  email: string;
  password?: string;
  name: string;
}

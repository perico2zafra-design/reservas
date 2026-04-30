export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address: string;
  portal: string;
  floor: string;
  letter: string;
  phone?: string;
}

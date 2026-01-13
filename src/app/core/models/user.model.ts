export enum Role {
  USER = 'USER',
  VIP = 'VIP',
  MODERATOR = 'MODERATOR'
}

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  profile: User;
}
import { post } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', credentials);
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/register', data);
}

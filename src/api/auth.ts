// services/authService.ts
import api from '@/lib/api';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: 'User' | 'Admin';
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', payload);
  return res.data;
};

export interface RegisterPayload {
  username: string;
  password: string;
  role: 'User' | 'Admin'; 
}

export interface RegisterResponse {
  id : string;
  username: string;
  password: string;
  role: 'User' | 'Admin';
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
    id : string;
    username : string;
    role : string;
}

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>('/auth/register', payload);
  return res.data;
};

export const profile = async (): Promise<ProfileResponse> => {
  const token = localStorage.getItem("token");

  const res = await api.get<ProfileResponse>('/auth/profile',{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

import { API_BASE_URL } from './config';
import { AuthResponse, User, LoginRequest } from '../types/auth';
import { ApiError } from './templateApi';

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.detail || 'Login failed');
    }

    return response.json();
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.detail || 'Failed to get user data');
    }

    return response.json();
  },

  async register(userData: { email: string; password: string; full_name: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.detail || 'Registration failed');
    }

    return response.json();
  },
};
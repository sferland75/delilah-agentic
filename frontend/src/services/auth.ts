import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('Login attempt with credentials:', {
      username: credentials.username,
      passwordLength: credentials.password.length
    });
    
    // Use URLSearchParams as required by OAuth2 password flow
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    console.log('Sending form data:', formData.toString());
    
    try {
      const response = await api.post<LoginResponse>('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/users/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },
};

export default authService;
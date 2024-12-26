import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Convert credentials to FormData as FastAPI expects form data for login
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};
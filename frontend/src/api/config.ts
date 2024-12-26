export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  auth: {
    login: '/login',
    register: '/register',
    me: '/me',
  },
  templates: {
    list: '/templates',
    create: '/templates',
    get: (id: string) => `/templates/${id}`,
    update: (id: string) => `/templates/${id}`,
    delete: (id: string) => `/templates/${id}`,
    updateStatus: (id: string) => `/templates/${id}/status`,
    byCategory: (categoryId: string) => `/templates/category/${categoryId}`,
  }
};
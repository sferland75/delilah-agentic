import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;
  
  private constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  public async login(email: string, password: string): Promise<any> {
    const response = await this.api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  public logout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }

  // Client endpoints
  public async getClients(page = 1, limit = 10): Promise<any> {
    const response = await this.api.get('/clients', {
      params: { page, limit }
    });
    return response.data.items || [];
  }

  public async getClient(id: string): Promise<any> {
    return (await this.api.get(`/clients/${id}`)).data;
  }

  public async createClient(clientData: any): Promise<any> {
    return (await this.api.post('/clients', clientData)).data;
  }

  public async updateClient(id: string, clientData: any): Promise<any> {
    return (await this.api.put(`/clients/${id}`, clientData)).data;
  }

  // Assessment endpoints
  public async getAssessments(page = 1, limit = 10): Promise<any> {
    const response = await this.api.get('/assessments', {
      params: { page, limit }
    });
    return response.data.items || [];
  }

  public async getAssessment(id: string): Promise<any> {
    return (await this.api.get(`/assessments/${id}`)).data;
  }

  public async createAssessment(assessmentData: any): Promise<any> {
    return (await this.api.post('/assessments', assessmentData)).data;
  }

  public async updateAssessment(id: string, assessmentData: any): Promise<any> {
    return (await this.api.put(`/assessments/${id}`, assessmentData)).data;
  }
}

export default ApiClient.getInstance();
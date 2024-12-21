import api from './api';

export interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    emergency_contact?: string;
    primary_diagnosis?: string;
    notes?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateClientData {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    emergency_contact?: string;
    primary_diagnosis?: string;
    notes?: string;
}

const ClientService = {
    getClients: async () => {
        const response = await api.get<Client[]>('/clients');
        return response.data;
    },

    getClient: async (id: string) => {
        const response = await api.get<Client>(`/clients/${id}`);
        return response.data;
    },

    createClient: async (data: CreateClientData) => {
        const response = await api.post<Client>('/clients', data);
        return response.data;
    },

    updateClient: async (id: string, data: Partial<CreateClientData>) => {
        const response = await api.put<Client>(`/clients/${id}`, data);
        return response.data;
    },

    deleteClient: async (id: string) => {
        const response = await api.delete<Client>(`/clients/${id}`);
        return response.data;
    }
};

export default ClientService;
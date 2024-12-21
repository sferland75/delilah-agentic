import api from './api';

export interface Therapist {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    license_number: string;
    license_state: string;
    years_of_experience?: number;
    assessment_count: number;
    rating: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateTherapistData {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    license_number: string;
    license_state: string;
    years_of_experience?: number;
}

const TherapistService = {
    getTherapists: async () => {
        const response = await api.get<Therapist[]>('/therapists');
        return response.data;
    },

    getTherapist: async (id: string) => {
        const response = await api.get<Therapist>(`/therapists/${id}`);
        return response.data;
    },

    createTherapist: async (data: CreateTherapistData) => {
        const response = await api.post<Therapist>('/therapists', data);
        return response.data;
    },

    updateTherapist: async (id: string, data: Partial<CreateTherapistData>) => {
        const response = await api.put<Therapist>(`/therapists/${id}`, data);
        return response.data;
    },

    deleteTherapist: async (id: string) => {
        const response = await api.delete<Therapist>(`/therapists/${id}`);
        return response.data;
    },

    updateRating: async (id: string, rating: number) => {
        const response = await api.post<Therapist>(`/therapists/${id}/update-rating`, { rating });
        return response.data;
    }
};

export default TherapistService;
import api from './api';

export interface Assessment {
    id: string;
    client_id: string;
    therapist_id: string;
    assessment_type: string;
    status: string;
    scheduled_date?: string;
    completion_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateAssessmentData {
    client_id: string;
    therapist_id: string;
    assessment_type: string;
    status: string;
    scheduled_date?: string;
    notes?: string;
}

export interface UpdateAssessmentData {
    assessment_type?: string;
    status?: string;
    scheduled_date?: string;
    completion_date?: string;
    notes?: string;
}

const AssessmentService = {
    getAssessments: async () => {
        const response = await api.get<Assessment[]>('/api/v1/assessments');
        return response.data;
    },

    getAssessment: async (id: string) => {
        const response = await api.get<Assessment>(`/api/v1/assessments/${id}`);
        return response.data;
    },

    getClientAssessments: async (clientId: string) => {
        const response = await api.get<Assessment[]>(`/api/v1/assessments/client/${clientId}`);
        return response.data;
    },

    getTherapistAssessments: async (therapistId: string) => {
        const response = await api.get<Assessment[]>(`/api/v1/assessments/therapist/${therapistId}`);
        return response.data;
    },

    createAssessment: async (data: CreateAssessmentData) => {
        const response = await api.post<Assessment>('/api/v1/assessments', data);
        return response.data;
    },

    updateAssessment: async (id: string, data: UpdateAssessmentData) => {
        const response = await api.put<Assessment>(`/api/v1/assessments/${id}`, data);
        return response.data;
    },

    deleteAssessment: async (id: string) => {
        const response = await api.delete<Assessment>(`/api/v1/assessments/${id}`);
        return response.data;
    }
};

export default AssessmentService;
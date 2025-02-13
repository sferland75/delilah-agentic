export type ADLLevel = 
    | 'independent'
    | 'modified_independent'
    | 'supervision'
    | 'minimal_assistance'
    | 'moderate_assistance'
    | 'maximal_assistance'
    | 'total_assistance'
    | 'not_applicable'
    | 'not_assessed';

export interface ADLStatus {
    independence: ADLLevel;
    notes?: string;
}

export interface ADLSection {
    [key: string]: ADLStatus;
}

export interface ADLRecommendation {
    type: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}
export type FieldType = 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'scale';

export type ValidationRule = {
  type: 'required' | 'min' | 'max' | 'pattern';
  value?: number | string;
  message: string;
};

export interface AssessmentField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  defaultValue?: any;
  description?: string;
  validation?: ValidationRule[];
  scoring?: {
    weight?: number;
    scoreMap?: Record<string, number>;
  };
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  fields: AssessmentField[];
  order: number;
}

export type TemplateStatus = 'draft' | 'active' | 'archived';

export interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  status: TemplateStatus;
  sections: AssessmentSection[];
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  scoring: {
    method: 'sum' | 'average' | 'custom';
    ranges?: {
      min: number;
      max: number;
      label: string;
      description?: string;
    }[];
    customLogic?: string;
  };
}
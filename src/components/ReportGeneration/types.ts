<<<<<<< HEAD
import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export interface ReportButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface ProgressDialogProps {
  isOpen: boolean;
  progress: number;
  status: string;
  message?: string;
  error?: string;
  onClose: () => void;
}

export interface GenerationProgress {
  section: string;
  progress: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface FormContextType {
  formData: any;
  updateFormData: (data: any) => void;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, any>;
  reset: () => void;
  getValues: () => any;
}

export interface Prompt {
  system: string;
  human: string;
}

export interface PromptEditorProps {
  sectionKey: string;
  originalPrompt: Prompt;
  onSubmit: (prompt: Prompt) => Promise<void>;
  onClose: () => void;
}

export interface SectionPreviewProps {
  sectionKey: string;
  title: string;
  content: string;
  originalPrompt: Prompt;
  onRegenerateSection: (prompt: Prompt) => Promise<void>;
  onLockSection: () => void;
  onUpdateContent: (content: string) => void;
  isLocked: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
=======
import { Assessment } from '../../types/report';

export interface ProcessedData {
    valid: boolean;
    data?: any;
    error?: string;
}

export interface ReportSection {
    name: string;
    type: string;
    orderNumber: number;
    content: string;
    valid: boolean;
    error?: string;
}

export interface AgentConfig {
    detailLevel: 'brief' | 'standard' | 'detailed';
    validateData: boolean;
    formatPreference: 'clinical' | 'plain';
    includeMetrics: boolean;
}

export interface AgentContext {
    config: AgentConfig;
    features: {
        enableNarrative: boolean;
        enableContextualAnalysis: boolean;
        enableDetailedFormatting: boolean;
    };
}

export interface AgentMetadata {
    name: string;
    description: string;
    orderNumber: number;
    dataPath: string[];
}

export interface AssessmentData {
    assessment: Assessment;
    metadata?: {
        version: string;
        processedAt: string;
    };
}

export interface NarrativeOptions {
    includeContext?: boolean;
    includeRecommendations?: boolean;
    style?: 'clinical' | 'plain';
}

export interface FormattingOptions {
    indentation?: number;
    bulletPoints?: boolean;
    headers?: boolean;
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
}
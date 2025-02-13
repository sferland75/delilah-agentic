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
}
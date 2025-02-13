import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormContext, FormContextType } from '@/context/FormContext';
import { ReportGenerationButton } from '../components/ReportGenerationButton';
import type { Assessment } from '@/types/assessment';

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ 
    children, 
    onClick, 
    disabled 
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ 
    children, 
    open 
  }: React.PropsWithChildren<{ open?: boolean }>) => (
    open ? <div>{children}</div> : null
  ),
  DialogContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DialogHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DialogTitle: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DialogFooter: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: { value: number }) => (
    <div role="progressbar" data-progress={value}>{value}%</div>
  ),
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ 
    children, 
    variant 
  }: React.PropsWithChildren<{ variant?: string }>) => (
    <div data-variant={variant}>{children}</div>
  ),
  AlertDescription: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock icons
jest.mock('lucide-react', () => ({
  FileText: () => <div data-testid="file-icon">File Icon</div>,
  Loader2: () => <div data-testid="loader-icon">Loader Icon</div>,
}));

// Mock assessment data
const mockAssessmentData: { assessment: Assessment } = {
  assessment: {
    demographics: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1980-01-01",
      gender: "Male",
      phone: "555-0123",
      email: "john.doe@email.com",
      address: "123 Main St",
      maritalStatus: "Married",
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "555-0124"
      }
    },
    medicalHistory: {
      medications: [
        {
          name: "Aspirin",
          dosage: "81mg",
          frequency: "daily",
          purpose: "blood thinner"
        }
      ],
      allergies: ["Penicillin"],
      treatments: ["Physiotherapy"],
      currentTreatment: [
        {
          name: "Dr. Smith",
          providerType: "Family Doctor",
          frequency: "Monthly",
          focus: "General health monitoring"
        }
      ],
      preExisting: "None reported",
      surgeries: "None"
    },
    symptoms: {
      physical: [
        {
          location: "Lower back",
          painType: "Dull",
          severity: "Moderate",
          frequency: "Daily",
          aggravating: "Prolonged sitting",
          relieving: "Walking"
        }
      ],
      cognitive: [
        {
          symptom: "Memory",
          severity: "Mild",
          frequency: "Occasional",
          impact: "Minor impact on daily activities",
          management: "Using reminders"
        }
      ],
      generalNotes: "Symptoms are generally manageable"
    },
    functionalAssessment: {},
    environmental: {},
    adl: {},
    amaGuides: {}
  }
};

// Mock FormContext value
const mockFormContext: FormContextType = {
  formData: mockAssessmentData,
  updateFormData: jest.fn(),
  isValid: true,
  isDirty: false,
  errors: {},
  reset: jest.fn(),
  getValues: jest.fn().mockReturnValue(mockAssessmentData)
};

describe('Report Generation Integration', () => {
  // Mock URL and document functions
  beforeEach(() => {
    // Mock URL functions
    window.URL.createObjectURL = jest.fn().mockReturnValue('mock-url');
    window.URL.revokeObjectURL = jest.fn();

    // Mock document element creation
    const mockAnchorElement = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: {},
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement;

    document.createElement = jest.fn().mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchorElement;
      return document.createElement(tag);
    });

    // Mock body methods
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('generates report with sample data', async () => {
    render(
      <FormContext.Provider value={mockFormContext}>
        <ReportGenerationButton />
      </FormContext.Provider>
    );

    // Click generate button
    const generateButton = screen.getByRole('button', { name: /generate report/i });
    fireEvent.click(generateButton);

    // Verify progress dialog appears
    await waitFor(() => {
      expect(screen.getByText('Generating Report')).toBeInTheDocument();
    });

    // Verify file download attempt
    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });

  it('handles generation error gracefully', async () => {
    // Mock failed generation
    jest.spyOn(console, 'error').mockImplementation(() => {});
    window.URL.createObjectURL = jest.fn().mockImplementation(() => {
      throw new Error('Generation failed');
    });

    render(
      <FormContext.Provider value={mockFormContext}>
        <ReportGenerationButton />
      </FormContext.Provider>
    );

    const generateButton = screen.getByRole('button', { name: /generate report/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('disables button when form is invalid', () => {
    const invalidFormContext: FormContextType = {
      ...mockFormContext,
      isValid: false,
    };

    render(
      <FormContext.Provider value={invalidFormContext}>
        <ReportGenerationButton />
      </FormContext.Provider>
    );

    const generateButton = screen.getByRole('button', { name: /generate report/i });
    expect(generateButton).toBeDisabled();
  });
});
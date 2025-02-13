import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportPreview } from '../components/ReportPreview';
import { SectionPreview } from '../components/SectionPreview';
import ReportGenerator from '@/lib/reports/ReportGenerator';
import type { Assessment } from '@/types/assessment';
import type { GenerationProgress } from '@/lib/reports/ReportGenerator';

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ 
    children, 
    className 
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
  CardHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardTitle: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ 
    children, 
    onClick, 
    disabled, 
    ...props 
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ 
    children, 
    open 
  }: React.PropsWithChildren<{ open: boolean }>) => (
    open ? <div role="dialog">{children}</div> : null
  ),
  DialogContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DialogHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DialogTitle: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DialogFooter: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ 
    children, 
    value, 
    onValueChange 
  }: React.PropsWithChildren<{
    value: string;
    onValueChange: (value: string) => void;
  }>) => (
    <div data-testid="tabs-container">
      <select 
        value={value} 
        onChange={(e) => onValueChange(e.target.value)}
        data-testid="tab-select"
      >
        <option value="demographics">Demographics</option>
        <option value="medical">Medical History</option>
      </select>
      {children}
    </div>
  ),
  TabsList: ({ children }: React.PropsWithChildren) => (
    <div role="tablist">{children}</div>
  ),
  TabsTrigger: ({ 
    children, 
    value 
  }: React.PropsWithChildren<{ value: string }>) => (
    <button role="tab" value={value}>{children}</button>
  ),
  TabsContent: ({ 
    children, 
    value 
  }: React.PropsWithChildren<{ value: string }>) => (
    <div role="tabpanel" data-value={value}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: { value: number }) => (
    <div 
      role="progressbar" 
      data-progress={value}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {value}%
    </div>
  ),
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ 
    value, 
    onChange, 
    className 
  }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea value={value} onChange={onChange} className={className} />
  ),
}));

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ 
    children, 
    className 
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="scroll-area" className={className}>{children}</div>
  ),
}));

// Mock icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-circle-icon">Alert Icon</div>,
  Check: () => <div data-testid="check-icon">Check Icon</div>,
  Edit2: () => <div data-testid="edit-icon">Edit Icon</div>,
  Lock: () => <div data-testid="lock-icon">Lock Icon</div>,
  Unlock: () => <div data-testid="unlock-icon">Unlock Icon</div>,
  History: () => <div data-testid="history-icon">History Icon</div>,
  RefreshCw: () => <div data-testid="refresh-icon">Refresh Icon</div>,
  Save: () => <div data-testid="save-icon">Save Icon</div>,
}));

// Mock the prompt templates
jest.mock('@/lib/reports/promptTemplates', () => ({
  promptTemplates: {
    demographics: {
      system: 'System prompt',
      human: 'Human prompt',
    },
    medical: {
      system: 'Medical system prompt',
      human: 'Medical human prompt',
    },
  },
}));

// Mock the ReportGenerator
jest.mock('@/lib/reports/ReportGenerator');
const MockedReportGenerator = ReportGenerator as jest.MockedClass<typeof ReportGenerator>;

// Mock assessment data
const mockAssessment: Assessment = {
  demographics: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    address: '123 Main St',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Sister',
      phone: '987-654-3210'
    }
  },
  medicalHistory: {
    conditions: [],
    medications: [],
    allergies: [],
    surgeries: '',
    treatments: [],
    currentTreatment: []
  },
  symptoms: {
    physical: [],
    cognitive: [],
    generalNotes: ''
  },
  functionalAssessment: {},
  environmental: {},
  adl: {},
  amaGuides: {}
};

describe('Report Generation Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SectionPreview', () => {
    const defaultProps = {
      sectionKey: 'demographics',
      title: 'Demographics',
      content: 'Test content',
      originalPrompt: {
        system: 'System prompt',
        human: 'Human prompt'
      },
      onRegenerateSection: jest.fn().mockResolvedValue(undefined),
      onLockSection: jest.fn(),
      onUpdateContent: jest.fn(),
      isLocked: false,
      isEditing: false,
      onToggleEdit: jest.fn()
    };

    it('renders correctly with initial content', () => {
      render(<SectionPreview {...defaultProps} />);
      expect(screen.getByText('Demographics')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('handles editing mode correctly', () => {
      render(<SectionPreview {...defaultProps} isEditing={true} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue('Test content');
      
      fireEvent.change(textarea, { target: { value: 'Updated content' } });
      expect(defaultProps.onUpdateContent).toHaveBeenCalledWith('Updated content');
    });

    it('toggles edit mode when edit button is clicked', () => {
      render(<SectionPreview {...defaultProps} />);
      
      const editButton = screen.getByTestId('edit-icon').parentElement;
      fireEvent.click(editButton!);
      
      expect(defaultProps.onToggleEdit).toHaveBeenCalled();
    });

    it('prevents editing when section is locked', () => {
      render(<SectionPreview {...defaultProps} isLocked={true} />);
      
      const editButton = screen.getByTestId('edit-icon').parentElement;
      expect(editButton).toBeDisabled();
    });

    it('handles section locking', () => {
      render(<SectionPreview {...defaultProps} />);
      
      const lockButton = screen.getByRole('button', { name: /toggle lock/i });
      fireEvent.click(lockButton);
      
      expect(defaultProps.onLockSection).toHaveBeenCalled();
    });

    it('preserves unsaved changes on regeneration', async () => {
      const onRegenerateSection = jest.fn().mockResolvedValue('New content');
      render(
        <SectionPreview 
          {...defaultProps} 
          isEditing={true}
          onRegenerateSection={onRegenerateSection}
        />
      );

      // Make changes
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Unsaved changes' } });

      // Trigger regeneration
      const regenerateButton = screen.getByTestId('refresh-icon').parentElement;
      fireEvent.click(regenerateButton!);

      // Should show warning
      expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      expect(onRegenerateSection).not.toHaveBeenCalled();
    });

    it('shows error state correctly', async () => {
      const error = new Error('Generation failed');
      const onRegenerateSection = jest.fn().mockRejectedValue(error);

      render(
        <SectionPreview 
          {...defaultProps} 
          onRegenerateSection={onRegenerateSection}
        />
      );

      const regenerateButton = screen.getByTestId('refresh-icon').parentElement;
      fireEvent.click(regenerateButton!);

      await waitFor(() => {
        expect(screen.getByText(/generation failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('ReportPreview', () => {
    const defaultProps = {
      assessment: mockAssessment,
      onComplete: jest.fn(),
      onClose: jest.fn()
    };

    beforeEach(() => {
      MockedReportGenerator.mockImplementation((assessment: Assessment) => ({
        transformer: {
          transformAssessment: jest.fn().mockResolvedValue({}),
          validateAssessment: jest.fn().mockResolvedValue(true)
        },
        claudeGenerator: {
          generateText: jest.fn().mockResolvedValue('Generated text'),
          validateResponse: jest.fn().mockReturnValue(true)
        },
        validator: {
          validateSection: jest.fn().mockReturnValue(true),
          validatePrompt: jest.fn().mockReturnValue(true)
        },
        sections: [],
        generateSection: jest.fn().mockResolvedValue('Generated section'),
        transformSections: jest.fn().mockResolvedValue({
          demographics: {
            title: 'Demographics',
            content: 'Test demographics',
            order: 1
          },
          medical: {
            title: 'Medical History',
            content: 'Test medical history',
            order: 2
          }
        }),
        generateReport: jest.fn().mockImplementation(({ onProgress }) => {
          onProgress({
            section: 'demographics',
            status: 'processing' as const,
            progress: 50
          });
          return Promise.resolve('Generated report');
        }),
        regenerateSection: jest.fn().mockResolvedValue('New section content')
      }));
    });

    it('renders correctly with initial sections', async () => {
      render(<ReportPreview {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /demographics/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /medical history/i })).toBeInTheDocument();
      });
    });

    it('handles tab switching', async () => {
      render(<ReportPreview {...defaultProps} />);

      await waitFor(() => {
        const tabSelect = screen.getByTestId('tab-select');
        fireEvent.change(tabSelect, { target: { value: 'medical' } });
        expect(screen.getByText('Test medical history')).toBeInTheDocument();
      });
    });

    it('handles saving report', async () => {
      render(<ReportPreview {...defaultProps} />);

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save report/i });
        fireEvent.click(saveButton);
        expect(defaultProps.onComplete).toHaveBeenCalledWith('Generated report');
      });
    });

    it('shows generation progress', async () => {
      render(<ReportPreview {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toHaveAttribute('data-progress', '50');
        expect(screen.getByText(/processing/i)).toBeInTheDocument();
      });
    });

    it('handles errors during generation', async () => {
      MockedReportGenerator.mockImplementation((assessment: Assessment) => ({
        ...MockedReportGenerator.mock.results[0].value,
        generateReport: jest.fn().mockRejectedValue(new Error('Generation failed'))
      }));

      render(<ReportPreview {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/generation failed/i)).toBeInTheDocument();
      });
    });

    it('handles cancellation', async () => {
      render(<ReportPreview {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
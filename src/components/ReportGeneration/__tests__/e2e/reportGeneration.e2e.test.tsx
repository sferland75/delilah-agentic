import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportPreview } from '../../components/ReportPreview';
import { mockAssessment } from '@/lib/reports/__tests__/mockData';
import { ClaudeReportGenerator } from '@/lib/reports/claudeReportGenerator';
import type { Assessment } from '@/types/assessment';
import type { GenerationProgress } from '@/lib/reports/ReportGenerator';

// Mock UI components
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
        <option value="demographics">Demographics & Background</option>
        <option value="medical">Medical History</option>
        <option value="symptoms">Symptoms</option>
        <option value="functional">Functional Assessment</option>
        <option value="typical-day">Typical Day</option>
        <option value="environmental">Environmental Assessment</option>
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

jest.mock('@/components/ui/button', () => ({
  Button: ({ 
    children, 
    onClick, 
    disabled, 
    type = 'button',
    ...props 
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled} 
      {...props}
    >
      {children}
    </button>
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

// Mock the Claude generator
jest.mock('@/lib/reports/claudeReportGenerator', () => ({
  ClaudeReportGenerator: {
    generateNarrative: jest.fn().mockResolvedValue('Generated narrative content'),
    validateResponse: jest.fn().mockReturnValue(true)
  }
}));

describe('Report Generation End-to-End', () => {
  const mockOnComplete = jest.fn();
  const mockOnClose = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Full Report Generation Flow', () => {
    it('completes full report generation cycle', async () => {
      render(
        <ReportPreview
          assessment={mockAssessment}
          onComplete={mockOnComplete}
          onClose={mockOnClose}
        />
      );

      // Initial state
      expect(screen.getByText('Report Generation Progress')).toBeInTheDocument();
      
      // Wait for sections to generate
      await waitFor(() => {
        expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
      });

      // Verify all sections are present
      const expectedSections = [
        'Demographics & Background',
        'Medical History',
        'Symptoms',
        'Functional Assessment',
        'Typical Day',
        'Environmental Assessment'
      ];

      expectedSections.forEach(section => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });

      // Navigate through each section
      for (const section of expectedSections) {
        const tabSelect = screen.getByTestId('tab-select');
        await user.selectOptions(tabSelect, section);
        expect(screen.getByRole('tabpanel')).toHaveAttribute('data-value', section.toLowerCase());
      }

      // Complete generation
      const saveButton = screen.getByRole('button', { name: /save report/i });
      await user.click(saveButton);

      expect(mockOnComplete).toHaveBeenCalledWith('Generated narrative content');
    });

    it('handles section customization and regeneration', async () => {
      render(
        <ReportPreview
          assessment={mockAssessment}
          onComplete={mockOnComplete}
          onClose={mockOnClose}
        />
      );

      // Wait for initial generation
      await waitFor(() => {
        expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
      });

      // Open section editor
      const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
      await user.click(customizeButton);

      // Modify prompt
      const systemPrompt = screen.getByLabelText(/system prompt/i);
      await user.clear(systemPrompt);
      await user.type(systemPrompt, 'New system prompt');

      // Regenerate section
      const regenerateButton = screen.getByRole('button', { name: /regenerate section/i });
      await user.click(regenerateButton);

      // Verify regeneration
      expect(ClaudeReportGenerator.generateNarrative).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          system: 'New system prompt'
        })
      );
    });

    it('manages section locking and editing', async () => {
      render(
        <ReportPreview
          assessment={mockAssessment}
          onComplete={mockOnComplete}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
      });

      // Edit section
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, ' additional content');

      // Save edits
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Lock section
      const lockButton = screen.getByRole('button', { name: /lock/i });
      await user.click(lockButton);

      // Verify edit buttons are disabled
      expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /customize prompt/i })).toBeDisabled();
    });

    it('preserves section state during navigation', async () => {
      render(
        <ReportPreview
          assessment={mockAssessment}
          onComplete={mockOnComplete}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
      });

      // Edit demographics
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, ' edited content');

      // Navigate to another section and back
      const tabSelect = screen.getByTestId('tab-select');
      await user.selectOptions(tabSelect, 'Medical History');
      await user.selectOptions(tabSelect, 'Demographics & Background');

      // Verify edits persisted
      expect(screen.getByRole('textbox')).toHaveValue(expect.stringContaining('edited content'));
    });

    it('handles generation errors and recovery', async () => {
      // Mock an error in generation
      (ClaudeReportGenerator.generateNarrative as jest.Mock)
        .mockRejectedValueOnce(new Error('Generation failed'))
        .mockResolvedValueOnce('Recovered content');

      render(
        <ReportPreview
          assessment={mockAssessment}
          onComplete={mockOnComplete}
          onClose={mockOnClose}
        />
      );

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/generation failed/i)).toBeInTheDocument();
      });

      // Verify error state
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Attempt regeneration
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      // Verify recovery
      await waitFor(() => {
        expect(screen.queryByText(/generation failed/i)).not.toBeInTheDocument();
        expect(screen.getByText('Recovered content')).toBeInTheDocument();
      });
    });

    it('handles concurrent section updates correctly', async () => {
      let resolveFirst: (value: string) => void;
      let resolveSecond: (value: string) => void;

      const firstPromise = new Promise<string>(resolve => {
        resolveFirst = resolve;
      });

      const secondPromise = new Promise<string>(resolve => {
        resolveSecond = resolve;
      });

      (ClaudeReportGenerator.generateNarrative as jest.Mock)
        .mockImplementationOnce(() => firstPromise)
        .mockImplementationOnce(() => secondPromise);

      render(
        <ReportPreview
          assessment={mockAssessment}
          onComplete={mockOnComplete}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
      });

      // Start first generation
      const regenerateButton = screen.getByRole('button', { name: /regenerate/i });
      await user.click(regenerateButton);

      // Attempt second generation while first is in progress
      await user.click(regenerateButton);

      // Only first generation should be in progress
      expect(ClaudeReportGenerator.generateNarrative).toHaveBeenCalledTimes(1);

      // Complete first generation
      resolveFirst('First content');

      await waitFor(() => {
        expect(screen.getByText('First content')).toBeInTheDocument();
      });
    });
  });
});
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportPreview } from '../../components/ReportPreview';
import { mockAssessment } from '@/lib/reports/__tests__/mockData';
import ReportGenerator from '@/lib/reports/ReportGenerator';
import { ClaudeReportGenerator } from '@/lib/reports/claudeReportGenerator';

// Mock the API but maintain real component interactions
jest.mock('@/lib/reports/claudeReportGenerator', () => {
  const original = jest.requireActual('@/lib/reports/claudeReportGenerator');
  return {
    ...original,
    generateNarrative: jest.fn().mockResolvedValue('Generated narrative content')
  };
});

describe('Report Generation End-to-End', () => {
  const mockOnComplete = jest.fn();
  const mockOnClose = jest.fn();

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

      // Check section content
      await waitFor(() => {
        const demoSection = screen.getByText(mockAssessment.initial.demographics.firstName);
        expect(demoSection).toBeInTheDocument();
      });

      // Complete generation
      const saveButton = screen.getByRole('button', { name: /save report/i });
      await userEvent.click(saveButton);

      expect(mockOnComplete).toHaveBeenCalled();
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
      await userEvent.click(customizeButton);

      // Modify prompt
      const systemPrompt = screen.getByLabelText(/system prompt/i);
      await userEvent.clear(systemPrompt);
      await userEvent.type(systemPrompt, 'New system prompt');

      // Regenerate section
      const regenerateButton = screen.getByRole('button', { name: /regenerate section/i });
      await userEvent.click(regenerateButton);

      // Verify regeneration
      await waitFor(() => {
        expect(ClaudeReportGenerator.generateNarrative).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          expect.any(Object),
          expect.objectContaining({
            system: 'New system prompt'
          })
        );
      });
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
      await userEvent.click(editButton);

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, ' additional content');

      // Save edits
      const saveButton = screen.getByRole('button', { name: /check/i });
      await userEvent.click(saveButton);

      // Lock section
      const lockButton = screen.getByRole('button', { name: /unlock/i });
      await userEvent.click(lockButton);

      // Verify edit buttons are disabled
      expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /customize prompt/i })).toBeDisabled();
    });

    it('handles navigation between sections', async () => {
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

      // Navigate to medical history
      const medicalTab = screen.getByRole('tab', { name: /medical history/i });
      await userEvent.click(medicalTab);

      // Verify medical content
      await waitFor(() => {
        expect(screen.getByText(mockAssessment.medical.injury.description)).toBeInTheDocument();
      });

      // Navigate back to demographics
      const demographicsTab = screen.getByRole('tab', { name: /demographics/i });
      await userEvent.click(demographicsTab);

      // Verify demographics content
      await waitFor(() => {
        expect(screen.getByText(mockAssessment.initial.demographics.firstName)).toBeInTheDocument();
      });
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
      await userEvent.click(editButton);

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, ' edited content');

      // Navigate away and back
      const medicalTab = screen.getByRole('tab', { name: /medical history/i });
      await userEvent.click(medicalTab);

      const demographicsTab = screen.getByRole('tab', { name: /demographics/i });
      await userEvent.click(demographicsTab);

      // Verify edits persisted
      expect(screen.getByRole('textbox')).toHaveValue(expect.stringContaining('edited content'));
    });

    it('handles error states', async () => {
      // Mock an error in generation
      jest.spyOn(ClaudeReportGenerator.prototype, 'generateNarrative')
        .mockRejectedValueOnce(new Error('Generation failed'));

      render(
        <ReportPreview
          assessment={mockAssessment}
          onComplete={mockOnComplete}
          onClose={mockOnClose}
        />
      );

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Generation failed')).toBeInTheDocument();
      });

      // Verify error state in progress UI
      expect(screen.getByText(/error/i)).toBeInTheDocument();

      // Attempt regeneration
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await userEvent.click(retryButton);

      // Verify recovery
      await waitFor(() => {
        expect(screen.queryByText('Generation failed')).not.toBeInTheDocument();
      });
    });
  });
});
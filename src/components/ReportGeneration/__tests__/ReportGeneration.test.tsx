import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportPreview } from '../components/ReportPreview';
import { SectionPreview } from '../components/SectionPreview';
import ReportGenerator from '@/lib/reports/ReportGenerator';
import { SectionHistory } from '@/lib/reports/sectionHistory';

// Mock the ReportGenerator
jest.mock('@/lib/reports/ReportGenerator');
const MockedReportGenerator = ReportGenerator as jest.MockedClass<typeof ReportGenerator>;

// Mock assessment data
const mockAssessment = {
  initial: {
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    }
  },
  medical: {
    injury: {
      date: '2024-01-01',
      description: 'Test injury'
    }
  }
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
      onRegenerateSection: jest.fn(),
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

    it('handles editing mode correctly', async () => {
      render(<SectionPreview {...defaultProps} />);
      
      // Click edit button
      const editButton = screen.getByRole('button', { name: /edit/i });
      await userEvent.click(editButton);
      
      expect(defaultProps.onToggleEdit).toHaveBeenCalled();
    });

    it('shows prompt editor when customize prompt is clicked', async () => {
      render(<SectionPreview {...defaultProps} />);
      
      const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
      await userEvent.click(customizeButton);
      
      expect(screen.getByText('System Prompt')).toBeInTheDocument();
      expect(screen.getByText('Human Prompt')).toBeInTheDocument();
    });

    it('prevents editing when section is locked', () => {
      render(<SectionPreview {...defaultProps} isLocked={true} />);
      
      const editButton = screen.getByRole('button', { name: /edit/i });
      expect(editButton).toBeDisabled();
    });

    it('shows version history', async () => {
      const history = new SectionHistory();
      history.addVersion('demographics', 'Version 1');
      history.addVersion('demographics', 'Version 2');

      render(<SectionPreview {...defaultProps} />);
      
      const historyButton = screen.getByRole('button', { name: /history/i });
      await userEvent.click(historyButton);
      
      expect(screen.getByText('Previous Versions')).toBeInTheDocument();
    });
  });

  describe('ReportPreview', () => {
    const defaultProps = {
      assessment: mockAssessment,
      onComplete: jest.fn(),
      onClose: jest.fn()
    };

    beforeEach(() => {
      MockedReportGenerator.prototype.transformSections.mockResolvedValue({
        demographics: {
          title: 'Demographics',
          content: 'Test demographics',
          subsections: {}
        },
        medical: {
          title: 'Medical History',
          content: 'Test medical history',
          subsections: {}
        }
      });

      MockedReportGenerator.prototype.generateReport.mockResolvedValue('Complete report');
    });

    it('renders with initial sections', async () => {
      render(<ReportPreview {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Demographics')).toBeInTheDocument();
        expect(screen.getByText('Medical History')).toBeInTheDocument();
      });
    });

    it('handles section regeneration', async () => {
      render(<ReportPreview {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Demographics')).toBeInTheDocument();
      });

      const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
      await userEvent.click(customizeButton);

      const regenerateButton = screen.getByRole('button', { name: /regenerate/i });
      await userEvent.click(regenerateButton);

      expect(MockedReportGenerator.prototype.regenerateSection).toHaveBeenCalled();
    });

    it('tracks generation progress', async () => {
      render(<ReportPreview {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Report Generation Progress')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
      });
    });

    it('saves final report', async () => {
      render(<ReportPreview {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Save Report')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: /save report/i });
      await userEvent.click(saveButton);

      expect(defaultProps.onComplete).toHaveBeenCalledWith('Complete report');
    });
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportPreview } from '../components/ReportPreview';
import ReportGenerator from '@/lib/reports/ReportGenerator';
import { mockAssessment, mockGeneratedSections } from '@/lib/reports/__tests__/mockData';

// Mock ReportGenerator
jest.mock('@/lib/reports/ReportGenerator');
const MockedReportGenerator = ReportGenerator as jest.MockedClass<typeof ReportGenerator>;

describe('ReportPreview', () => {
  const defaultProps = {
    assessment: mockAssessment,
    onComplete: jest.fn(),
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    MockedReportGenerator.prototype.transformSections.mockResolvedValue(mockGeneratedSections);
    MockedReportGenerator.prototype.generateReport.mockResolvedValue('Complete report');
    MockedReportGenerator.prototype.regenerateSection.mockResolvedValue('Regenerated content');
  });

  it('initializes with assessment data', async () => {
    render(<ReportPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
      expect(screen.getByText('Medical History')).toBeInTheDocument();
    });
  });

  it('handles section navigation', async () => {
    render(<ReportPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
    });

    const medicalTab = screen.getByRole('tab', { name: /medical history/i });
    await userEvent.click(medicalTab);
    
    expect(screen.getByText('Mock medical history content...')).toBeInTheDocument();
  });

  it('tracks generation progress', async () => {
    let progressCallback: any;
    MockedReportGenerator.prototype.generateReport.mockImplementation(({ onProgress }) => {
      progressCallback = onProgress;
      return Promise.resolve('Complete report');
    });

    render(<ReportPreview {...defaultProps} />);

    await waitFor(() => {
      progressCallback({
        section: 'Demographics',
        status: 'complete',
        progress: 100
      });
    });

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('handles section regeneration', async () => {
    render(<ReportPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
    });

    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    await userEvent.click(customizeButton);

    const systemInput = screen.getByLabelText(/system prompt/i);
    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, 'New system prompt');

    const regenerateButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(regenerateButton);

    await waitFor(() => {
      expect(MockedReportGenerator.prototype.regenerateSection).toHaveBeenCalled();
    });
  });

  it('handles section locking', async () => {
    render(<ReportPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
    });

    const lockButton = screen.getByRole('button', { name: /unlock/i });
    await userEvent.click(lockButton);

    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeDisabled();
  });

  it('saves final report', async () => {
    render(<ReportPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
    });

    const saveButton = screen.getByRole('button', { name: /save report/i });
    await userEvent.click(saveButton);

    expect(defaultProps.onComplete).toHaveBeenCalledWith('Complete report');
  });

  it('handles generation errors', async () => {
    MockedReportGenerator.prototype.generateReport.mockRejectedValue(new Error('Generation failed'));
    
    render(<ReportPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Generation failed')).toBeInTheDocument();
    });
  });

  it('preserves section content through navigation', async () => {
    render(<ReportPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
    });

    // Edit demographics section
    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, ' additional text');

    // Navigate away and back
    const medicalTab = screen.getByRole('tab', { name: /medical history/i });
    await userEvent.click(medicalTab);
    
    const demographicsTab = screen.getByRole('tab', { name: /demographics/i });
    await userEvent.click(demographicsTab);

    expect(textarea).toHaveValue('Mock demographics content... additional text');
  });

  it('handles section validation errors', async () => {
    MockedReportGenerator.prototype.regenerateSection.mockRejectedValue(
      new Error('Validation failed')
    );
    
    render(<ReportPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Demographics & Background')).toBeInTheDocument();
    });

    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    await userEvent.click(customizeButton);

    const regenerateButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(regenerateButton);

    await waitFor(() => {
      expect(screen.getByText('Validation failed')).toBeInTheDocument();
    });
  });
});
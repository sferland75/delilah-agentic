import { render, screen } from '@testing-library/react';
import { GenerationProgressUI } from '../components/GenerationProgress';
import { GenerationProgress } from '@/lib/reports/ReportGenerator';

// Mock the Progress component
jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: { value: number; className?: string }) => (
    <div 
      role="progressbar" 
      className={className} 
      data-progress={value || 0} // Default to 0 when undefined
    >
      {value ? Math.round(value) : 0}%
    </div>
  ),
}));

describe('GenerationProgressUI', () => {
  const defaultSections: Record<string, GenerationProgress> = {
    'section1': {
      section: 'Demographics',
      progress: 50,
      status: 'processing'
    },
    'section2': {
      section: 'Medical History',
      progress: 75,
      status: 'complete'
    }
  };

  it('renders overall progress correctly', () => {
    render(<GenerationProgressUI sections={defaultSections} />);
    
    // Check title
    expect(screen.getByText('Report Generation Progress')).toBeInTheDocument();
    
    // Find progress by role and check value
    const progressBars = screen.getAllByRole('progressbar');
    const overallProgress = progressBars[0];
    expect(overallProgress.textContent).toBe('63%');
  });

  it('displays all section progresses', () => {
    render(<GenerationProgressUI sections={defaultSections} />);
    
    expect(screen.getByText('Demographics')).toBeInTheDocument();
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[1].textContent).toBe('50%');
    
    expect(screen.getByText('Medical History')).toBeInTheDocument();
    expect(progressBars[2].textContent).toBe('75%');
  });

  it('shows current section when provided', () => {
    render(
      <GenerationProgressUI 
        sections={defaultSections} 
        currentSection="Demographics"
      />
    );
    
    expect(screen.getByText('Currently processing: Demographics')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const error = 'Test error message';
    render(
      <GenerationProgressUI 
        sections={defaultSections} 
        error={error}
      />
    );
    
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('renders section with error state correctly', () => {
    const sectionsWithError: Record<string, GenerationProgress> = {
      'section1': {
        section: 'Demographics',
        progress: 25,
        status: 'error',
        error: 'Failed to process demographics'
      }
    };
    
    render(<GenerationProgressUI sections={sectionsWithError} />);
    
    expect(screen.getByText('Demographics')).toBeInTheDocument();
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[1].textContent).toBe('25%');
    expect(progressBars[1]).toHaveClass('bg-red-200');
    expect(screen.getByText('Failed to process demographics')).toBeInTheDocument();
  });

  it('handles empty sections object', () => {
    render(<GenerationProgressUI sections={{}} />);
    
    expect(screen.getByText('Report Generation Progress')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.textContent).toBe('0%');
  });

  it('renders completed sections with correct styling', () => {
    const sectionsWithComplete: Record<string, GenerationProgress> = {
      'section1': {
        section: 'Demographics',
        progress: 100,
        status: 'complete'
      }
    };
    
    render(<GenerationProgressUI sections={sectionsWithComplete} />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[1]).toHaveClass('bg-green-200');
  });

  it('renders error sections with correct styling', () => {
    const sectionsWithError: Record<string, GenerationProgress> = {
      'section1': {
        section: 'Demographics',
        progress: 25,
        status: 'error'
      }
    };
    
    render(<GenerationProgressUI sections={sectionsWithError} />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[1]).toHaveClass('bg-red-200');
  });

  it('handles sections with decimal progress values', () => {
    const sectionsWithDecimals: Record<string, GenerationProgress> = {
      'section1': {
        section: 'Demographics',
        progress: 33.33,
        status: 'processing'
      },
      'section2': {
        section: 'Medical History',
        progress: 66.67,
        status: 'processing'
      }
    };
    
    render(<GenerationProgressUI sections={sectionsWithDecimals} />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[1].textContent).toBe('33%');
    expect(progressBars[2].textContent).toBe('67%');
    expect(progressBars[0].textContent).toBe('50%');
  });
});
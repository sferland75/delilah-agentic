import { render, screen, fireEvent } from '@/test/setup/utils/test-utils';
import { ProgressDialog } from '../components/ProgressDialog';
import type { ProgressDialogProps } from '../types';

// Mock the Dialog component
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open?: boolean }) => 
    open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => 
    <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => 
    <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => 
    <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => 
    <div>{children}</div>,
}));

// Mock the Progress component
jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: { value: number }) => (
    <div 
      role="progressbar" 
      aria-valuenow={value} 
      aria-valuemin={0} 
      aria-valuemax={100}
    >
      <div style={{ width: `${value}%` }} />
    </div>
  ),
}));

// Mock the Spinner component
jest.mock('../components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('ProgressDialog', () => {
  const defaultProps: ProgressDialogProps = {
    isOpen: true,
    progress: 50,
    status: 'Processing...',
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ProgressDialog {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders progress dialog with correct progress and status', () => {
    render(<ProgressDialog {...defaultProps} />);
    
    // Check title
    expect(screen.getByText('Generating Report')).toBeInTheDocument();
    
    // Check status and progress
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument();
    
    // Check progress bar
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    
    // Check spinner
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders custom message when provided', () => {
    const customMessage = 'Custom processing message';
    render(<ProgressDialog {...defaultProps} message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders default message when no custom message provided', () => {
    render(<ProgressDialog {...defaultProps} />);
    expect(screen.getByText('Please wait while we generate your report.')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<ProgressDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders error state correctly', () => {
    const error = 'Test error message';
    render(<ProgressDialog {...defaultProps} error={error} />);
    
    // Check error title and messages
    expect(screen.getByText('Error Generating Report')).toBeInTheDocument();
    expect(screen.getByText(error)).toBeInTheDocument();
    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    
    // Error state should not show progress elements
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    
    // Should show close button instead of cancel
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked in error state', () => {
    render(<ProgressDialog {...defaultProps} error="Test error" />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when dialog is closed via Escape key', () => {
    render(<ProgressDialog {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('updates progress bar width based on progress prop', () => {
    const { rerender } = render(<ProgressDialog {...defaultProps} progress={25} />);
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar.firstChild).toHaveStyle({ width: '25%' });

    rerender(<ProgressDialog {...defaultProps} progress={75} />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar.firstChild).toHaveStyle({ width: '75%' });
  });

  it('handles zero progress correctly', () => {
    render(<ProgressDialog {...defaultProps} progress={0} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.firstChild).toHaveStyle({ width: '0%' });
  });

  it('handles 100% progress correctly', () => {
    render(<ProgressDialog {...defaultProps} progress={100} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.firstChild).toHaveStyle({ width: '100%' });
  });

  it('handles invalid progress values gracefully', () => {
    render(<ProgressDialog {...defaultProps} progress={-10} />);
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar.firstChild).toHaveStyle({ width: '0%' });

    const { rerender } = render(<ProgressDialog {...defaultProps} progress={150} />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar.firstChild).toHaveStyle({ width: '100%' });
  });
});
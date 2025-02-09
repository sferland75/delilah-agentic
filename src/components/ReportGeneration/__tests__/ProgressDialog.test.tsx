import { render, screen, fireEvent } from '@test/test-utils';
import ProgressDialog from '../components/ProgressDialog';

describe('ProgressDialog', () => {
  const defaultProps = {
    isOpen: true,
    progress: 0,
    status: 'Processing: Demographics',
    onCancel: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows basic progress information', () => {
    render(<ProgressDialog {...defaultProps} />);
    
    expect(screen.getByText('Generating Report')).toBeInTheDocument();
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we generate your report.')).toBeInTheDocument();
  });

  it('displays custom status message', () => {
    render(<ProgressDialog {...defaultProps} />);
    expect(screen.getByText('Processing: Demographics')).toBeInTheDocument();
  });

  it('shows error state correctly', () => {
    render(
      <ProgressDialog
        {...defaultProps}
        error="Something went wrong"
      />
    );

    expect(screen.getByText('Error Generating Report')).toBeInTheDocument();
    expect(screen.getByText('Failed to generate')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while generating the report.')).toBeInTheDocument();
  });

  it('shows custom message when provided', () => {
    render(
      <ProgressDialog
        {...defaultProps}
        message="Finalizing report..."
      />
    );

    expect(screen.getByText('Finalizing report...')).toBeInTheDocument();
  });

  it('renders cancel button with correct text', () => {
    render(<ProgressDialog {...defaultProps} />);
    const closeButton = screen.getByTestId('cancel-button');
    expect(closeButton).toHaveTextContent('Cancel');
  });

  it('shows spinner when loading', () => {
    render(<ProgressDialog {...defaultProps} />);
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toHaveClass('animate-spin');
  });

  it('hides spinner when error occurs', () => {
    render(
      <ProgressDialog 
        {...defaultProps} 
        error="Error occurred" 
      />
    );
    const spinnerElement = screen.queryByTestId('spinner');
    expect(spinnerElement).not.toBeInTheDocument();
  });

  it('updates progress bar correctly', () => {
    const { rerender } = render(
      <ProgressDialog 
        {...defaultProps} 
        progress={25} 
      />
    );
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');

    rerender(
      <ProgressDialog 
        {...defaultProps} 
        progress={75} 
      />
    );
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ProgressDialog {...defaultProps} />);
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(
      <ProgressDialog 
        {...defaultProps} 
        isOpen={false} 
      />
    );
    expect(screen.queryByText('Generating Report')).not.toBeInTheDocument();
  });
});
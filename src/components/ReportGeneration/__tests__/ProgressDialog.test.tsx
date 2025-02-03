import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressDialog } from '../components/ProgressDialog';

// Mock will be handled by the global mock in src/__mocks__
jest.mock('@/components/ui/dialog', () => require('../../../__mocks__/mockComponents'));
jest.mock('@/components/ui/button', () => require('../../../__mocks__/mockComponents'));
jest.mock('@/components/ui/progress', () => require('../../../__mocks__/mockComponents'));
jest.mock('@/components/ui/alert', () => require('../../../__mocks__/mockComponents'));
jest.mock('lucide-react', () => require('../../../__mocks__/mockComponents'));

describe('ProgressDialog', () => {
  const defaultProps = {
    progress: 0,
    onCancel: jest.fn(),
    isOpen: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(<ProgressDialog {...defaultProps} />);
    expect(screen.getByText('Generating Report')).toBeInTheDocument();
    expect(screen.getByText('Progress: 0%')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we generate your report.')).toBeInTheDocument();
  });

  it('shows current section when provided', () => {
    render(<ProgressDialog {...defaultProps} section="Demographics" />);
    expect(screen.getByText('Processing: Demographics')).toBeInTheDocument();
  });

  it('shows error state when error is provided', () => {
    const error = new Error('Failed to generate');
    render(<ProgressDialog {...defaultProps} error={error} />);
    expect(screen.getByText('Error Generating Report')).toBeInTheDocument();
    expect(screen.getByText('Failed to generate')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while generating the report.')).toBeInTheDocument();
  });

  it('shows finalizing state when progress is near complete', () => {
    render(<ProgressDialog {...defaultProps} progress={96} section="Final Section" />);
    expect(screen.getByText('Finalizing report...')).toBeInTheDocument();
  });

  it('shows close button instead of cancel when complete', () => {
    render(<ProgressDialog {...defaultProps} progress={100} />);
    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toHaveTextContent('Close');
  });

  it('displays loading spinner during active generation', () => {
    render(<ProgressDialog {...defaultProps} progress={50} section="Demographics" />);
    const spinnerElement = screen.getByTestId('mock-loader2');
    expect(spinnerElement).toHaveClass('animate-spin');
  });

  it('hides loading spinner when complete', () => {
    render(<ProgressDialog {...defaultProps} progress={100} section="Complete" />);
    const spinnerElement = screen.queryByTestId('mock-loader2');
    expect(spinnerElement).not.toBeInTheDocument();
  });

  it('updates progress bar value', () => {
    const { rerender } = render(<ProgressDialog {...defaultProps} progress={25} />);
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');

    rerender(<ProgressDialog {...defaultProps} progress={75} />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });
});
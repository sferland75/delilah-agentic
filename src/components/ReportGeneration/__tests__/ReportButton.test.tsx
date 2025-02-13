import { render, screen, fireEvent } from '@testing-library/react';
import { ReportButton } from '../components/ReportButton';
import { useFormContext } from 'react-hook-form';
import { useReportDialog } from '../hooks/useReportDialog';

// Mock the hooks
jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
}));

jest.mock('../hooks/useReportDialog', () => ({
  useReportDialog: jest.fn(),
}));

// Mock icon component
jest.mock('lucide-react', () => ({
  FileText: () => <div data-testid="file-text-icon">File Icon</div>
}));

describe('ReportButton', () => {
  const mockOpenReportDialog = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations with type safety
    (useFormContext as jest.Mock).mockReturnValue({
      formState: { isValid: true }
    });
    
    (useReportDialog as jest.Mock).mockReturnValue({
      openReportDialog: mockOpenReportDialog,
      isOpen: false,
      closeReportDialog: jest.fn()
    });
  });

  it('renders correctly', () => {
    render(<ReportButton />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Generate Draft Report');
    expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<ReportButton className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<ReportButton disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when form is invalid', () => {
    (useFormContext as jest.Mock).mockReturnValue({
      formState: { isValid: false }
    });
    
    render(<ReportButton />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('opens report dialog when clicked and form is valid', () => {
    render(<ReportButton />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOpenReportDialog).toHaveBeenCalled();
  });

  it('does not open report dialog when clicked and form is invalid', () => {
    (useFormContext as jest.Mock).mockReturnValue({
      formState: { isValid: false }
    });
    
    render(<ReportButton />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOpenReportDialog).not.toHaveBeenCalled();
  });

  it('handles both disabled prop and form validity', () => {
    (useFormContext as jest.Mock).mockReturnValue({
      formState: { isValid: true }
    });
    
    render(<ReportButton disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOpenReportDialog).not.toHaveBeenCalled();
  });

  // Additional test cases
  it('shows loading state when isLoading prop is true', () => {
    render(<ReportButton isLoading />);
    expect(screen.getByRole('button')).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('maintains disabled state when both loading and disabled', () => {
    render(<ReportButton isLoading disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('renders with tooltip when form is invalid', () => {
    (useFormContext as jest.Mock).mockReturnValue({
      formState: { isValid: false }
    });
    
    render(<ReportButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Please complete all required fields');
  });

  it('handles variant prop correctly', () => {
    render(<ReportButton variant="outline" />);
    expect(screen.getByRole('button')).toHaveClass('border', 'border-gray-300');
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button', () => {
  // Basic functionality tests
  it('renders children correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Variant tests
  it('renders default variant correctly', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByText('Default Button');
    expect(button).toHaveClass('bg-primary', 'text-white', 'hover:bg-primary-dark');
  });

  it('renders outline variant correctly', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByText('Outline Button');
    expect(button).toHaveClass('border', 'border-primary', 'text-primary', 'hover:bg-primary-light');
  });

  it('renders ghost variant correctly', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByText('Ghost Button');
    expect(button).toHaveClass('text-primary', 'hover:bg-primary-light/10');
  });

  // Class name tests
  it('includes base classes', () => {
    render(<Button>Base Classes Test</Button>);
    const button = screen.getByText('Base Classes Test');
    expect(button).toHaveClass(
      'px-4',
      'py-2',
      'rounded',
      'font-medium',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2'
    );
  });

  it('merges custom className with default classes', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    const button = screen.getByText('Custom Class Button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('px-4', 'py-2'); // Still has base classes
  });

  // Loading state tests
  it('shows loading state correctly', () => {
    const { rerender } = render(<Button>Normal State</Button>);
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();

    rerender(<Button isLoading>Loading State</Button>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // Size variants
  it('renders different size variants correctly', () => {
    const { rerender } = render(<Button size="sm">Small Button</Button>);
    let button = screen.getByText('Small Button');
    expect(button).toHaveClass('px-3', 'py-1', 'text-sm');

    rerender(<Button size="lg">Large Button</Button>);
    button = screen.getByText('Large Button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  // Full width variant
  it('renders full width variant correctly', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    expect(screen.getByText('Full Width Button')).toHaveClass('w-full');
  });

  // Icon support
  it('renders with start and end icons', () => {
    const StartIcon = () => <span data-testid="start-icon">Start</span>;
    const EndIcon = () => <span data-testid="end-icon">End</span>;

    render(
      <Button 
        startIcon={<StartIcon />}
        endIcon={<EndIcon />}
      >
        Icon Button
      </Button>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  // Edge cases
  it('handles undefined className prop', () => {
    render(<Button className={undefined}>Undefined Class</Button>);
    const button = screen.getByText('Undefined Class');
    expect(button).toHaveClass('px-4', 'py-2'); // Base classes still present
  });

  it('renders with empty children', () => {
    render(<Button>{''}</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeEmptyDOMElement();
  });

  it('maintains proper tab order when disabled', () => {
    render(
      <>
        <Button>First</Button>
        <Button disabled>Disabled</Button>
        <Button>Last</Button>
      </>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('tabIndex', '0');
    expect(buttons[1]).toHaveAttribute('tabIndex', '-1');
    expect(buttons[2]).toHaveAttribute('tabIndex', '0');
  });
});
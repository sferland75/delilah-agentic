import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptEditor } from '../components/PromptEditor';

const mockPrompt = {
  system: 'Original system prompt',
  human: 'Original human prompt'
};

describe('PromptEditor', () => {
  const defaultProps = {
    sectionKey: 'demographics',
    originalPrompt: mockPrompt,
    onSubmit: jest.fn(),
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with original prompts', () => {
    render(<PromptEditor {...defaultProps} />);

    expect(screen.getByText('Customize Section Prompt')).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockPrompt.system)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockPrompt.human)).toBeInTheDocument();
  });

  it('handles prompt updates', async () => {
    render(<PromptEditor {...defaultProps} />);

    const systemInput = screen.getByLabelText(/system prompt/i);
    const humanInput = screen.getByLabelText(/human prompt/i);

    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, 'New system prompt');
    await userEvent.clear(humanInput);
    await userEvent.type(humanInput, 'New human prompt');

    expect(systemInput).toHaveValue('New system prompt');
    expect(humanInput).toHaveValue('New human prompt');
  });

  it('submits updated prompts', async () => {
    render(<PromptEditor {...defaultProps} />);

    const systemInput = screen.getByLabelText(/system prompt/i);
    const humanInput = screen.getByLabelText(/human prompt/i);

    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, 'New system prompt');
    await userEvent.clear(humanInput);
    await userEvent.type(humanInput, 'New human prompt');

    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      system: 'New system prompt',
      human: 'New human prompt'
    });
  });

  it('handles reset to original', async () => {
    render(<PromptEditor {...defaultProps} />);

    const systemInput = screen.getByLabelText(/system prompt/i);
    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, 'New system prompt');

    const resetButton = screen.getByRole('button', { name: /reset to original/i });
    await userEvent.click(resetButton);

    expect(systemInput).toHaveValue(mockPrompt.system);
  });

  it('handles close', async () => {
    render(<PromptEditor {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('handles submission errors', async () => {
    const mockError = new Error('Test error');
    const errorProps = {
      ...defaultProps,
      onSubmit: jest.fn().mockRejectedValue(mockError)
    };

    render(<PromptEditor {...errorProps} />);

    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  it('disables buttons during submission', async () => {
    const slowSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<PromptEditor {...defaultProps} onSubmit={slowSubmit} />);

    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /reset to original/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
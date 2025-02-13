  it('maintains prompt state between submissions', async () => {
    render(<PromptEditor {...defaultProps} />);

    const systemInput = screen.getByLabelText(/system prompt/i);
    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, 'Modified system prompt');

    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);

    // After submission, input should maintain its value
    expect(systemInput).toHaveValue('Modified system prompt');
  });

  it('properly handles long prompts', async () => {
    render(<PromptEditor {...defaultProps} />);

    const systemInput = screen.getByLabelText(/system prompt/i);
    const longPrompt = 'A'.repeat(5000); // 5000 character prompt

    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, longPrompt);
    
    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      system: longPrompt
    }));
  });

  it('prevents multiple simultaneous submissions', async () => {
    const slowSubmit = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<PromptEditor {...defaultProps} onSubmit={slowSubmit} />);

    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);
    await userEvent.click(submitButton); // Second click while first is processing

    await waitFor(() => {
      expect(slowSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('cleans up properly when unmounted during submission', async () => {
    const slowSubmit = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    const { unmount } = render(
      <PromptEditor {...defaultProps} onSubmit={slowSubmit} />
    );

    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);
    
    unmount();

    // Verify no errors occur after unmount
    await waitFor(() => {
      expect(slowSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('handles errors with appropriate UI feedback', async () => {
    const mockError = new Error('Network error occurred');
    const errorProps = {
      ...defaultProps,
      onSubmit: jest.fn().mockRejectedValue(mockError)
    };

    render(<PromptEditor {...errorProps} />);

    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });

    // Error should be cleared when making changes
    const systemInput = screen.getByLabelText(/system prompt/i);
    await userEvent.type(systemInput, ' additional text');
    
    expect(screen.queryByText('Network error occurred')).not.toBeInTheDocument();
  });

  it('preserves prompt history when resetting', async () => {
    render(<PromptEditor {...defaultProps} />);

    const systemInput = screen.getByLabelText(/system prompt/i);
    const humanInput = screen.getByLabelText(/human prompt/i);

    // First modification
    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, 'First modification');
    await userEvent.clear(humanInput);
    await userEvent.type(humanInput, 'First human modification');

    // Reset to original
    const resetButton = screen.getByRole('button', { name: /reset to original/i });
    await userEvent.click(resetButton);

    // Verify reset to original values
    expect(systemInput).toHaveValue(mockPrompt.system);
    expect(humanInput).toHaveValue(mockPrompt.human);

    // Make new modifications
    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, 'Second modification');
    await userEvent.clear(humanInput);
    await userEvent.type(humanInput, 'Second human modification');

    // Submit new modifications
    const submitButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(submitButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      system: 'Second modification',
      human: 'Second human modification'
    });
  });

  it('maintains focus appropriately when resetting', async () => {
    render(<PromptEditor {...defaultProps} />);

    const systemInput = screen.getByLabelText(/system prompt/i);
    systemInput.focus();

    const resetButton = screen.getByRole('button', { name: /reset to original/i });
    await userEvent.click(resetButton);

    expect(document.activeElement).toBe(systemInput);
  });
});
    expect(contentDiv).toHaveClass('prose', 'max-w-none', 'whitespace-pre-wrap');
  });

  it('saves edited content correctly', async () => {
    render(<SectionPreview {...defaultProps} isEditing={true} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated content' } });

    const saveButton = screen.getByTestId('check-icon').parentElement;
    fireEvent.click(saveButton!);

    expect(defaultProps.onUpdateContent).toHaveBeenCalledWith('Updated content');
    expect(defaultProps.onToggleEdit).toHaveBeenCalled();
  });

  it('handles prompt editor cancellation', async () => {
    render(<SectionPreview {...defaultProps} />);
    
    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    fireEvent.click(customizeButton);

    await waitFor(() => {
      expect(screen.getByTestId('prompt-editor')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('prompt-editor')).not.toBeInTheDocument();
    });
  });

  it('disables all interactive elements when locked', () => {
    render(<SectionPreview {...defaultProps} isLocked={true} />);
    
    const editButton = screen.getByTestId('edit-icon').parentElement;
    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    const historyButton = screen.getByTestId('history-icon').parentElement;

    expect(editButton).toBeDisabled();
    expect(customizeButton).toBeDisabled();
    expect(historyButton).toBeDisabled();
  });

  it('handles version restoration from history', async () => {
    render(<SectionPreview {...defaultProps} />);
    
    // Open history
    const historyButton = screen.getByTestId('history-icon').parentElement;
    fireEvent.click(historyButton!);

    // Find and click restore button for version 1
    const restoreButton = screen.getByText('Version 1').closest('button');
    fireEvent.click(restoreButton!);

    expect(defaultProps.onUpdateContent).toHaveBeenCalledWith('Version 1');
  });

  it('maintains original prompt when regenerating without customization', async () => {
    const onRegenerateSection = jest.fn().mockResolvedValue(undefined);
    render(<SectionPreview {...defaultProps} onRegenerateSection={onRegenerateSection} />);
    
    const regenerateButton = screen.getByTestId('refresh-icon').parentElement;
    fireEvent.click(regenerateButton!);

    expect(onRegenerateSection).toHaveBeenCalledWith(defaultProps.originalPrompt);
  });

  it('shows loading state during regeneration', async () => {
    const onRegenerateSection = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<SectionPreview {...defaultProps} onRegenerateSection={onRegenerateSection} />);
    
    const regenerateButton = screen.getByTestId('refresh-icon').parentElement;
    fireEvent.click(regenerateButton!);

    expect(regenerateButton).toBeDisabled();
    expect(screen.getByText(/regenerating/i)).toBeInTheDocument();
  });

  it('preserves content on failed regeneration', async () => {
    const mockError = new Error('Regeneration failed');
    const onRegenerateSection = jest.fn().mockRejectedValue(mockError);
    
    render(<SectionPreview {...defaultProps} onRegenerateSection={onRegenerateSection} />);
    
    const regenerateButton = screen.getByTestId('refresh-icon').parentElement;
    fireEvent.click(regenerateButton!);

    await waitFor(() => {
      expect(screen.getByText('Initial content')).toBeInTheDocument();
      expect(screen.getByText(/regeneration failed/i)).toBeInTheDocument();
    });
  });

  it('handles concurrent regeneration attempts correctly', async () => {
    const onRegenerateSection = jest.fn()
      .mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)))
      .mockImplementationOnce(() => Promise.resolve('New content'));

    render(<SectionPreview {...defaultProps} onRegenerateSection={onRegenerateSection} />);
    
    const regenerateButton = screen.getByTestId('refresh-icon').parentElement;
    fireEvent.click(regenerateButton!);
    fireEvent.click(regenerateButton!); // Second click should be ignored

    expect(onRegenerateSection).toHaveBeenCalledTimes(1);
  });

  it('cleans up properly when unmounted during regeneration', async () => {
    const onRegenerateSection = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    const { unmount } = render(
      <SectionPreview {...defaultProps} onRegenerateSection={onRegenerateSection} />
    );
    
    const regenerateButton = screen.getByTestId('refresh-icon').parentElement;
    fireEvent.click(regenerateButton!);
    
    unmount();

    // No errors should occur after unmount
    await waitFor(() => {
      expect(onRegenerateSection).toHaveBeenCalledTimes(1);
    });
  });
});
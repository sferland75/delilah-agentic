  it('shows section progress when available', () => {
    (useReportGeneration as jest.Mock).mockReturnValue({
      ...mockReportGeneration,
      sections: {
        demographics: { 
          progress: 80, 
          status: 'processing',
          section: 'Demographics'
        },
        assessment: {
          progress: 60,
          status: 'processing',
          section: 'Assessment'
        }
      }
    });

    render(<ReportDialog {...defaultProps} />);
    
    expect(screen.getByText('Demographics')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(3); // Overall + 2 sections
  });

  it('displays section errors correctly', () => {
    (useReportGeneration as jest.Mock).mockReturnValue({
      ...mockReportGeneration,
      sections: {
        demographics: {
          progress: 0,
          status: 'error',
          section: 'Demographics',
          error: 'Failed to process demographics'
        }
      }
    });

    render(<ReportDialog {...defaultProps} />);
    
    expect(screen.getByText('Failed to process demographics')).toBeInTheDocument();
    expect(screen.getByTestId('alert')).toBeInTheDocument();
  });

  it('shows pending state for unstarted sections', () => {
    (useReportGeneration as jest.Mock).mockReturnValue({
      ...mockReportGeneration,
      sections: {
        demographics: {
          progress: 0,
          status: 'pending',
          section: 'Demographics'
        }
      }
    });

    render(<ReportDialog {...defaultProps} />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[1]).toHaveAttribute('data-progress', '0');
  });

  it('updates progress display automatically', () => {
    const { rerender } = render(<ReportDialog {...defaultProps} />);
    
    expect(screen.getByTestId('progress')).toHaveAttribute('data-progress', '50');

    (useReportGeneration as jest.Mock).mockReturnValue({
      ...mockReportGeneration,
      progress: 75
    });

    rerender(<ReportDialog {...defaultProps} />);
    expect(screen.getByTestId('progress')).toHaveAttribute('data-progress', '75');
  });

  it('displays appropriate buttons based on status', () => {
    // Test processing state
    render(<ReportDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    
    cleanup();

    // Test complete state
    (useReportGeneration as jest.Mock).mockReturnValue({
      ...mockReportGeneration,
      status: 'complete',
      isGenerating: false
    });
    
    render(<ReportDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    
    cleanup();

    // Test error state
    (useReportGeneration as jest.Mock).mockReturnValue({
      ...mockReportGeneration,
      status: 'error',
      error: 'Generation failed',
      isGenerating: false
    });
    
    render(<ReportDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument();
  });

  it('resets generation state when closed', () => {
    render(<ReportDialog {...defaultProps} />);
    
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
    
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    expect(mockReportGeneration.resetGeneration).toHaveBeenCalled();
  });

  it('handles multiple section updates correctly', () => {
    const { rerender } = render(<ReportDialog {...defaultProps} />);
    
    // Update first section
    (useReportGeneration as jest.Mock).mockReturnValue({
      ...mockReportGeneration,
      sections: {
        demographics: {
          progress: 100,
          status: 'complete',
          section: 'Demographics'
        },
        assessment: {
          progress: 0,
          status: 'pending',
          section: 'Assessment'
        }
      }
    });
    
    rerender(<ReportDialog {...defaultProps} />);
    expect(screen.getByText('Demographics')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    
    // Update second section
    (useReportGeneration as jest.Mock).mockReturnValue({
      ...mockReportGeneration,
      sections: {
        demographics: {
          progress: 100,
          status: 'complete',
          section: 'Demographics'
        },
        assessment: {
          progress: 50,
          status: 'processing',
          section: 'Assessment'
        }
      }
    });
    
    rerender(<ReportDialog {...defaultProps} />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[1]).toHaveAttribute('data-progress', '100');
    expect(progressBars[2]).toHaveAttribute('data-progress', '50');
  });
});
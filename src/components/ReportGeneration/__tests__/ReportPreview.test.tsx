  it('displays error state when initialization fails', async () => {
    const error = new Error('Initialization failed');
    MockReportGenerator.mockImplementation((assessment: Assessment) => ({
      transformer: {
        transformAssessment: jest.fn().mockResolvedValue({}),
        validateAssessment: jest.fn().mockResolvedValue(true)
      },
      claudeGenerator: {
        generateText: jest.fn().mockResolvedValue('Generated text'),
        validateResponse: jest.fn().mockReturnValue(true)
      },
      validator: {
        validateSection: jest.fn().mockReturnValue(true),
        validatePrompt: jest.fn().mockReturnValue(true)
      },
      sections: [],
      generateSection: jest.fn().mockResolvedValue('Generated section'),
      transformSections: jest.fn().mockRejectedValue(error),
      generateReport: jest.fn(),
      regenerateSection: jest.fn()
    }));

    render(<ReportPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Initialization failed')).toBeInTheDocument();
    });
  });

  it('handles section generation progress updates', async () => {
    let progressCallback: (progress: any) => void;
    
    MockReportGenerator.mockImplementation((assessment: Assessment) => ({
      transformer: {
        transformAssessment: jest.fn().mockResolvedValue({}),
        validateAssessment: jest.fn().mockResolvedValue(true)
      },
      claudeGenerator: {
        generateText: jest.fn().mockResolvedValue('Generated text'),
        validateResponse: jest.fn().mockReturnValue(true)
      },
      validator: {
        validateSection: jest.fn().mockReturnValue(true),
        validatePrompt: jest.fn().mockReturnValue(true)
      },
      sections: [],
      generateSection: jest.fn().mockResolvedValue('Generated section'),
      transformSections: jest.fn().mockResolvedValue(mockSections),
      generateReport: jest.fn().mockImplementation(({ onProgress }) => {
        progressCallback = onProgress;
        return Promise.resolve('Generated report');
      }),
      regenerateSection: jest.fn()
    }));

    render(<ReportPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('generation-progress')).toBeInTheDocument();
    });

    act(() => {
      progressCallback({
        section: 'demographics',
        status: 'processing',
        progress: 50
      });
    });

    await waitFor(() => {
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars[0]).toHaveAttribute('data-progress', '50');
    });
  });

  it('handles saving report', async () => {
    render(<ReportPreview {...defaultProps} />);

    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save report/i });
      fireEvent.click(saveButton);
      expect(defaultProps.onComplete).toHaveBeenCalledWith(expect.stringContaining('Demographics'));
    });
  });

  it('handles cancellation', async () => {
    render(<ReportPreview {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import { GenerationProgressUI } from '../components/GenerationProgress';
import { mockProgress } from '../../../lib/reports/__tests__/mockData';

describe('GenerationProgressUI', () => {
  it('renders overall progress correctly', () => {
    render(
      <GenerationProgressUI
        sections={mockProgress}
        currentSection="Demographics"
      />
    );

    // Check for overall progress (75% - average of 100% and 50%)
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays current section', () => {
    render(
      <GenerationProgressUI
        sections={mockProgress}
        currentSection="Demographics"
      />
    );

    expect(screen.getByText(/currently processing: demographics/i)).toBeInTheDocument();
  });

  it('shows error state correctly', () => {
    const progressWithError = {
      ...mockProgress,
      demographics: {
        ...mockProgress.demographics,
        status: 'error',
        error: 'Test error message'
      }
    };

    render(
      <GenerationProgressUI
        sections={progressWithError}
        error="Overall error message"
      />
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Overall error message')).toBeInTheDocument();
  });

  it('shows different states for sections', () => {
    const mixedProgress = {
      demographics: {
        section: 'Demographics',
        progress: 100,
        status: 'complete'
      },
      medical: {
        section: 'Medical History',
        progress: 50,
        status: 'processing'
      },
      symptoms: {
        section: 'Symptoms',
        progress: 0,
        status: 'error',
        error: 'Failed to generate'
      }
    };

    render(
      <GenerationProgressUI
        sections={mixedProgress}
        currentSection="Medical History"
      />
    );

    // Check complete section
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Check processing section
    expect(screen.getByText('50%')).toBeInTheDocument();
    
    // Check error section
    expect(screen.getByText('Failed to generate')).toBeInTheDocument();
  });

  it('handles empty sections gracefully', () => {
    render(
      <GenerationProgressUI
        sections={{}}
        currentSection={undefined}
      />
    );

    expect(screen.getByText('Report Generation Progress')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('formats progress numbers correctly', () => {
    const preciseProgress = {
      test: {
        section: 'Test',
        progress: 33.333333,
        status: 'processing'
      }
    };

    render(
      <GenerationProgressUI
        sections={preciseProgress}
        currentSection="Test"
      />
    );

    expect(screen.getByText('33%')).toBeInTheDocument();
  });
});
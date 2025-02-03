import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FunctionalAssessment } from '../index';
import { AssessmentData } from '@/types/assessment';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm<AssessmentData>({
    defaultValues: {
      functionalAssessment: {
        capacities: [],
        overallNotes: '',
        recommendedAccommodations: [],
        followUpNeeded: false,
      },
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('FunctionalAssessment', () => {
  it('renders all activity sections', () => {
    render(
      <TestWrapper>
        <FunctionalAssessment />
      </TestWrapper>
    );

    expect(screen.getByText('Standing')).toBeInTheDocument();
    expect(screen.getByText('Walking')).toBeInTheDocument();
    expect(screen.getByText('Sitting')).toBeInTheDocument();
    // Add more activity checks as needed
  });

  it('updates difficulty value when slider is changed', async () => {
    render(
      <TestWrapper>
        <FunctionalAssessment />
      </TestWrapper>
    );

    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '5' } });

    expect(slider).toHaveValue('5');
  });

  it('allows entering limitations text', () => {
    render(
      <TestWrapper>
        <FunctionalAssessment />
      </TestWrapper>
    );

    const limitationsInput = screen.getAllByPlaceholderText('Describe any limitations...')[0];
    fireEvent.change(limitationsInput, { target: { value: 'Test limitation' } });

    expect(limitationsInput).toHaveValue('Test limitation');
  });

  it('allows entering adaptations text', () => {
    render(
      <TestWrapper>
        <FunctionalAssessment />
      </TestWrapper>
    );

    const adaptationsInput = screen.getAllByPlaceholderText('Describe any adaptations...')[0];
    fireEvent.change(adaptationsInput, { target: { value: 'Test adaptation' } });

    expect(adaptationsInput).toHaveValue('Test adaptation');
  });

  it('shows follow-up notes field when follow-up is needed', () => {
    render(
      <TestWrapper>
        <FunctionalAssessment />
      </TestWrapper>
    );

    // Open the select
    fireEvent.click(screen.getByRole('combobox'));
    // Select "Yes"
    fireEvent.click(screen.getByText('Yes'));

    expect(screen.getByPlaceholderText('Describe required follow-up...')).toBeInTheDocument();
  });

  it('allows entering overall notes', () => {
    render(
      <TestWrapper>
        <FunctionalAssessment />
      </TestWrapper>
    );

    const overallNotesInput = screen.getByPlaceholderText('Add any overall notes about functional capacity...');
    fireEvent.change(overallNotesInput, { target: { value: 'Test overall notes' } });

    expect(overallNotesInput).toHaveValue('Test overall notes');
  });
});
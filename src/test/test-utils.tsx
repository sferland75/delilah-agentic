import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import '@testing-library/jest-dom';
import { mockAssessmentData } from './mocks/assessment-data';

interface WrapperProps {
  children: React.ReactNode;
  formValues?: typeof mockAssessmentData;
}

const Wrapper = ({ children, formValues = mockAssessmentData }: WrapperProps) => {
  const methods = useForm({
    defaultValues: formValues
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  { formValues, ...options }: Omit<RenderOptions, 'wrapper'> & { 
    formValues?: typeof mockAssessmentData 
  } = {}
) =>
  render(ui, {
    wrapper: (props) => <Wrapper {...props} formValues={formValues} />,
    ...options
  });

export * from '@testing-library/react';
export { customRender as render };
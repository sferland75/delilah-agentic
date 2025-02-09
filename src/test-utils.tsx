import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

interface FormProviderProps {
  children: React.ReactNode;
}

const TestFormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestFormProvider, ...options });

export * from '@testing-library/react';
export { customRender as render };
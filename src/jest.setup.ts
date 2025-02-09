import '@testing-library/jest-dom';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    register: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
    watch: jest.fn()
  })
}));
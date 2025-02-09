import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockMatchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
});

window.matchMedia = window.matchMedia || mockMatchMedia;

// Mock window URL methods
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// Mock form context
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    register: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
    watch: jest.fn(),
    formState: {
      errors: {}
    },
    control: {}
  })
}));
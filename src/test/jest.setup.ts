import '@testing-library/jest-dom';

// Mock window.ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  private readonly observerCallback: IntersectionObserverCallback;
  private elements = new Set<Element>();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.observerCallback = callback;
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? '0px';
    this.thresholds = this.normalizeThresholds(options?.threshold);
  }

  private normalizeThresholds(threshold?: number | number[]): number[] {
    if (!threshold) return [0];
    return Array.isArray(threshold) ? threshold : [threshold];
  }

  disconnect(): void {
    this.elements.clear();
  }

  observe(target: Element): void {
    this.elements.add(target);
    // Simulate initial intersection
    this.notifyIntersection([{
      target,
      isIntersecting: true,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: this.root?.getBoundingClientRect() ?? null,
      time: Date.now()
    }]);
  }

  unobserve(target: Element): void {
    this.elements.delete(target);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  private notifyIntersection(entries: IntersectionObserverEntry[]): void {
    this.observerCallback(entries, this);
  }
}

// @ts-ignore -- TypeScript doesn't like reassigning to global but it's needed for tests
global.IntersectionObserver = MockIntersectionObserver;

// Mock window.URL
Object.defineProperty(window, 'URL', {
  writable: true,
  value: {
    createObjectURL: jest.fn(),
    revokeObjectURL: jest.fn(),
  },
});

// Mock form context with more complete implementation
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    register: (name: string) => ({
      name,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn()
    }),
    setValue: jest.fn(),
    getValues: jest.fn().mockReturnValue({}),
    watch: jest.fn(),
    handleSubmit: (cb: any) => (e: any) => {
      e?.preventDefault?.();
      return cb({});
    },
    formState: {
      errors: {},
      isSubmitting: false,
      isDirty: false,
      isValid: true
    },
    control: {
      register: jest.fn(),
      unregister: jest.fn(),
      getFieldState: jest.fn(),
      _names: {
        array: new Set(),
        mount: new Set(),
        unMount: new Set(),
        watch: new Set(),
        focus: '',
        watchAll: false
      }
    }
  })
}));
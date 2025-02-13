# Testing Reference: Component and Integration Testing

## Radix UI Component Testing
### Dialog Component Pattern
```typescript
// Proper Dialog mock setup
jest.mock('@/components/ui/dialog', () => {
  // Define types first
  type DialogProps = React.PropsWithChildren<{
    open: boolean;
    className?: string;
  }>;

  // Create properly typed components
  function Dialog({ children, open }: DialogProps) {
    if (!open) return null;
    return <>{children}</>;
  }

  function DialogContent({ children, className }: DialogProps) {
    return (
      <div data-testid="dialog-content" className={className}>
        {children}
      </div>
    );
  }

  return {
    Dialog,
    DialogContent,
    // ...other components
  };
});
```

### Testing Guidelines
1. **Component Hierarchy**:
   ```typescript
   // Always test the full hierarchy
   expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
   expect(within(screen.getByTestId('dialog-content')).getByTestId('dialog-header')).toBeInTheDocument();
   ```

2. **Portal Testing**:
   ```typescript
   // Handle portal rendering
   const DialogPortal = ({ children }: React.PropsWithChildren<{}>) => children;
   ```

3. **Event Handling**:
   ```typescript
   // Proper event handling
   fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
   expect(onOpenChange).toHaveBeenCalledWith(false);
   ```

## TypeScript Integration
### Mock Component Types
```typescript
type MockComponent<P = {}> = React.FC<React.PropsWithChildren<P>>;

interface DialogComponents {
  Dialog: MockComponent<{ open: boolean }>;
  DialogContent: MockComponent<{ className?: string }>;
  DialogHeader: MockComponent;
  DialogTitle: MockComponent;
}
```

### Event Handling Types
```typescript
interface CustomEventTarget extends EventTarget {
  value: string;
}

interface CustomEvent extends React.ChangeEvent<HTMLElement> {
  target: CustomEventTarget;
}
```

## Test Infrastructure
### Component Rendering
```typescript
const renderComponent = () => {
  const result = render(<Component {...props} />);
  console.log('Component Tree:', screen.debug());
  return result;
};
```

### Debug Utilities
```typescript
const logRender = (component: string, props: any) => {
  console.log(`Rendering ${component} with:`, {
    props,
    children: props.children
  });
};
```

## Common Patterns
### Mock Setup
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  mockUseReportGeneration.mockReturnValue({
    progress: 50,
    status: 'processing',
    error: null
  });
});
```

### Testing Hierarchy
```typescript
it('renders complete structure', () => {
  renderComponent();
  
  // Test outer structure
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeInTheDocument();
  
  // Test inner components
  const content = within(dialog).getByTestId('dialog-content');
  expect(content).toHaveClass('expected-class');
});
```

## Error Handling
### Common Issues
1. Portal rendering
2. Child component mounting
3. Event propagation
4. State updates

### Solutions
```typescript
// Handle portal content
const PortalRoot = document.createElement('div');
PortalRoot.setAttribute('id', 'portal-root');
document.body.appendChild(PortalRoot);

// Cleanup
afterEach(() => {
  document.body.removeChild(PortalRoot);
});
```

## Test Organization
### File Structure
```
src/
  components/
    __tests__/
      __mocks__/           # Shared mocks
      __utils__/           # Test utilities
      ComponentName.test.tsx
```

### Import Order
```typescript
// 1. React & Testing Library
import { render, screen, within } from '@testing-library/react';

// 2. Component under test
import { ComponentName } from '../ComponentName';

// 3. Mocks & utilities
import { mockFunction } from './__mocks__/mockFunction';
```

## Best Practices
1. Mock at the lowest possible level
2. Use type-safe mocks
3. Test component hierarchies
4. Handle async operations properly
5. Debug component trees thoroughly

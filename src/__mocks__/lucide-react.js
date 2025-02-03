import React from 'react';

// Mock all commonly used icons
const createMockIcon = (name) => {
  const Icon = ({ className, size, ...props }) => (
    <span 
      data-testid={`mock-icon-${name.toLowerCase()}`}
      className={className}
      style={{ width: size, height: size }}
      {...props}
    >
      {name}
    </span>
  );
  return Icon;
};

// Add all icons used in your components
export const Loader2 = createMockIcon('Loader2');
export const X = createMockIcon('X');
export const AlertCircle = createMockIcon('AlertCircle');
export const CheckCircle = createMockIcon('CheckCircle');
export const Circle = createMockIcon('Circle');
export const Download = createMockIcon('Download');
export const FileText = createMockIcon('FileText');

// Export a default object with all icons
const icons = {
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  Circle,
  Download,
  FileText,
};

export default icons;
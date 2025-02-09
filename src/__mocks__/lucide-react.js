const React = require('react');

const createMockIcon = (name) => {
  return ({size = 24, color = 'currentColor', className = '', ...props}) => {
    return React.createElement(
      'svg', 
      {
        width: size,
        height: size,
        className,
        'data-testid': `mock-icon-${name.toLowerCase()}`,
        ...props
      },
      React.createElement('path', {d: 'M0 0h24v24H0z', fill: 'none'}),
      React.createElement('rect', {
        width: '100%',
        height: '100%',
        fill: 'none',
        stroke: color
      })
    );
  };
};

// Add commonly used icons
const icons = {
  Loader2: createMockIcon('Loader2'),
  X: createMockIcon('X'),
  Check: createMockIcon('Check'),
  ChevronDown: createMockIcon('ChevronDown'),
  ChevronUp: createMockIcon('ChevronUp'),
  FileText: createMockIcon('FileText'),
  AlertCircle: createMockIcon('AlertCircle'),
  CheckCircle: createMockIcon('CheckCircle'),
  Info: createMockIcon('Info'),
  Plus: createMockIcon('Plus'),
  Minus: createMockIcon('Minus'),
  Search: createMockIcon('Search'),
  Settings: createMockIcon('Settings'),
  Download: createMockIcon('Download'),
  Upload: createMockIcon('Upload'),
  Calendar: createMockIcon('Calendar'),
  Clock: createMockIcon('Clock'),
  ExternalLink: createMockIcon('ExternalLink')
};

module.exports = {
  ...icons,
  default: icons
};
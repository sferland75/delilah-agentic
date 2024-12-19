// Print preview specific styling
import React from 'react';

const PrintPreview = ({ sections, metadata }) => {
  return `
    @page {
      size: letter;
      margin: 2.54cm;
    }

    @media print {
      .preview-page {
        page-break-after: always;
      }

      .section-break {
        page-break-inside: avoid;
      }
    }
  `;
};
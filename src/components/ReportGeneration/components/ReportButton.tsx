import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useReportDialog } from '../hooks/useReportDialog';

interface ReportButtonProps {
  className?: string;
  disabled?: boolean;
}

export const ReportButton: React.FC<ReportButtonProps> = ({ 
  className = '',
  disabled = false 
}) => {
  const { formState } = useFormContext();
  const { openReportDialog } = useReportDialog();

  const handleGenerateReport = async () => {
    if (formState.isValid) {
      openReportDialog();
    }
  };

  return (
    <Button
      onClick={handleGenerateReport}
      disabled={disabled || !formState.isValid}
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
    >
      <FileText className="w-4 h-4" />
      Generate Draft Report
    </Button>
  );
};

export default ReportButton;
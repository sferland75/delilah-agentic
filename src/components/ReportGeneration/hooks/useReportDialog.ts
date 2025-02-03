import { useState, useCallback } from 'react';

export const useReportDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openReportDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeReportDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openReportDialog,
    closeReportDialog,
  };
};

export default useReportDialog;
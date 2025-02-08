import React from 'react';
import { Check, Save, AlertCircle } from 'lucide-react';

interface AutoSaveStatusProps {
  isDirty: boolean;
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ isDirty }) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {isDirty ? (
        <>
          <Save className="h-4 w-4 text-yellow-500 animate-pulse" />
          <span className="text-yellow-500">Saving...</span>
        </>
      ) : (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-500">All changes saved</span>
        </>
      )}
    </div>
  );
};
import React from 'react';
<<<<<<< HEAD
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
=======
import { useForm } from '../context/FormContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, Download, Trash2 } from 'lucide-react';

export const AutoSaveStatus: React.FC = () => {
  const { lastSaved, saveToJSON, clearDraft } = useForm();

  return (
    <Card className="fixed bottom-4 right-4 flex items-center gap-4 bg-white/90 backdrop-blur shadow-lg p-4 z-50">
      <div className="text-sm text-slate-600">
        {lastSaved ? (
          <>Last saved: {new Date(lastSaved).toLocaleTimeString()}</>
        ) : (
          'No saved draft'
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearDraft}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Clear Draft
        </Button>
      </div>
    </Card>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
};
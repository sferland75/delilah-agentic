import React from 'react';
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
  );
};
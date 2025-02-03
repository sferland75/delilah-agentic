import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, FileX, Bug } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from './dialogs/ConfirmationDialog';

// Utility function for reliable file downloads
const downloadFile = (content: string, filename: string) => {
  try {
    // Create blob with explicit type
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    
    // Create object URL
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create temporary link element
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobUrl;
    tempLink.setAttribute('download', filename);
    
    // Add to document, trigger click, and clean up
    document.body.appendChild(tempLink);
    tempLink.click();
    
    // Small delay before cleanup to ensure download starts
    setTimeout(() => {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
};

export const Header: React.FC = () => {
  const { formData, lastSaved, clearDraft, updateFormData } = useForm();
  const { toast } = useToast();
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  const handleClearForm = () => {
    clearDraft();
    toast({
      title: "Form Cleared",
      description: "Started new assessment"
    });
    setShowClearConfirm(false);
  };

  const saveLocal = () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const metadata = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        lastModified: lastSaved || new Date().toISOString(),
        exportType: 'draft'
      };

      const exportData = {
        metadata,
        assessment: formData
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const filename = `delilah_draft_${timestamp}.json`;
      
      if (downloadFile(dataStr, filename)) {
        toast({
          title: "Draft Saved",
          description: "Your work has been saved successfully."
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your work. Please try again."
      });
    }
  };

  const showDebugState = () => {
    try {
      // Get current localStorage state
      const mainDraft = localStorage.getItem('form_draft');
      const backupDraft = localStorage.getItem('form_draft_backup');

      console.log('=== DEBUG INFO ===');
      console.log('Current Form Data:', formData);
      console.log('Last Saved:', lastSaved);
      console.log('Local Storage - Main Draft:', mainDraft ? JSON.parse(mainDraft) : null);
      console.log('Local Storage - Backup Draft:', backupDraft ? JSON.parse(backupDraft) : null);
      
      toast({
        title: "Debug Info",
        description: "Check browser console for current form state"
      });
    } catch (error) {
      console.error('Error showing debug info:', error);
    }
  };

  const exportFinalJSON = () => {
    try {
      const metadata = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        lastModified: lastSaved || new Date().toISOString(),
        exportType: 'final'
      };

      const finalData = {
        metadata,
        assessment: formData
      };
      
      const dataStr = JSON.stringify(finalData, null, 2);
      const filename = `delilah_assessment_${new Date().toISOString().split('T')[0]}.json`;
      
      if (downloadFile(dataStr, filename)) {
        toast({
          title: "Assessment Exported",
          description: "Assessment has been exported successfully"
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your assessment. Please try again."
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        
        const assessmentData = jsonData.metadata ? jsonData.assessment : jsonData;
        
        updateFormData(assessmentData);
        toast({
          title: "Assessment Loaded",
          description: "Your assessment has been loaded successfully."
        });
      } catch (error) {
        console.error('Error loading file:', error);
        toast({
          variant: "destructive",
          title: "Load Failed",
          description: "The file format is invalid or corrupted."
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="sticky top-0 bg-white border-b z-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInput}
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            onClick={() => fileInput.current?.click()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Load Assessment
          </Button>
          
          <span className="text-sm text-slate-500 ml-4">
            {lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleTimeString()}` : 'No saved draft'}
          </span>

          <Button
            onClick={showDebugState}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            <Bug className="h-4 w-4 mr-1" />
            Show State
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowClearConfirm(true)}
            variant="outline"
            className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            <FileX className="h-4 w-4" />
            New Assessment
          </Button>

          <Button
            onClick={saveLocal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          
          <Button
            onClick={exportFinalJSON}
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="h-4 w-4" />
            Export Assessment
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showClearConfirm}
        onConfirm={handleClearForm}
        onCancel={() => setShowClearConfirm(false)}
        title="Start New Assessment?"
        description="This will clear all current form data. Make sure you've saved any important information before continuing."
        confirmText="Clear & Start New"
        cancelText="Cancel"
      />
    </>
  );
};
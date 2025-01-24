import React from 'react';
import { Button } from '@/components/ui/button';
import { StorageService } from '@/services/storage.service';
import { useToast } from '@/components/ui/use-toast';
import { Save, Download, Upload, RefreshCw, Clock } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface DraftManagerProps {
  currentData: any;
  onLoad: (data: any) => void;
}

export function DraftManager({ currentData, onLoad }: DraftManagerProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [lastSaveTime, setLastSaveTime] = React.useState<Date | null>(null);
  const debouncedData = useDebounce(currentData, 3000); // Debounce for 3 seconds

  // Real-time auto-save during active work
  React.useEffect(() => {
    if (debouncedData) {
      StorageService.saveAutoSave(debouncedData);
      setLastSaveTime(new Date());
    }
  }, [debouncedData]);

  // Backup auto-save every minute
  React.useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      StorageService.saveAutoSave(currentData);
      setLastSaveTime(new Date());
    }, 60000); // Every minute

    return () => clearInterval(autoSaveInterval);
  }, [currentData]);

  // Check for auto-save on mount
  React.useEffect(() => {
    const autoSave = StorageService.getAutoSave();
    if (autoSave) {
      toast({
        title: "Auto-save Found",
        description: `Would you like to restore your work from ${new Date(autoSave.timestamp).toLocaleTimeString()}?`,
        action: (
          <Button 
            variant="outline" 
            onClick={() => {
              onLoad(autoSave.data);
              toast({
                title: "Data Restored",
                description: "Your previous work has been loaded."
              });
            }}
          >
            Restore
          </Button>
        ),
        duration: 10000, // Show for 10 seconds
      });
    }
  }, []);

  const handleSaveDraft = () => {
    const assessmentId = currentData.id || `draft-${Date.now()}`;
    if (StorageService.saveDraft(assessmentId, currentData)) {
      setLastSaveTime(new Date());
      toast({
        title: "Draft Saved",
        description: "Your work has been saved locally."
      });
    }
  };

  const handleExportDrafts = () => {
    StorageService.exportDrafts();
    toast({
      title: "Drafts Exported",
      description: "Your drafts have been downloaded as a JSON file."
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (await StorageService.importDrafts(file)) {
        toast({
          title: "Drafts Imported",
          description: "Your drafts have been imported successfully."
        });
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save Draft
        </Button>

        <Button
          variant="outline"
          onClick={handleExportDrafts}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export All Drafts
        </Button>

        <Button
          variant="outline"
          onClick={handleImportClick}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Import Drafts
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            const autoSave = StorageService.getAutoSave();
            if (autoSave) {
              onLoad(autoSave.data);
              toast({
                title: "Auto-save Restored",
                description: `Work from ${new Date(autoSave.timestamp).toLocaleTimeString()} has been restored.`
              });
            }
          }}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Restore Auto-save
        </Button>
      </div>

      {/* Show last save time */}
      {lastSaveTime && (
        <div className="text-sm text-slate-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Last saved: {lastSaveTime.toLocaleTimeString()}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />
    </div>
  );
}
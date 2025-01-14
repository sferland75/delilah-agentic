import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { loadJSONFile } from '../utils/fileHandlers';
import { useToast } from "@/components/ui/use-toast";

export const LoadFile: React.FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const { setFormData } = useForm();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('Loading file:', file.name);
      const data = await loadJSONFile(file);
      
      console.log('Setting form data:', data);
      setFormData(data);
      
      toast({
        title: "Assessment Loaded",
        description: "The assessment file was loaded successfully."
      });

    } catch (error) {
      console.error('Error loading file:', error);
      toast({
        variant: "destructive",
        title: "Error Loading File",
        description: "Please make sure it's a valid JSON assessment file."
      });
    } finally {
      if (fileInput.current) {
        fileInput.current.value = '';
      }
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileSelect}
        accept=".json"
        className="hidden"
      />
      <Button
        onClick={() => fileInput.current?.click()}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Load Assessment
      </Button>
    </div>
  );
};
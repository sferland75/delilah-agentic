import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, FileDown } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { validateAssessmentData } from '../utils/validation';
import { useToast } from "@/components/ui/use-toast";
import { ClearFormButton } from './ui/ClearFormButton';
import { ReportGenerationButton } from './ReportGeneration/components/ReportGenerationButton';
import { migrateLegacyData } from '../utils/migrateLegacyData';
import { mockAssessment } from '../testData/mockAssessment';

export const SaveControls: React.FC = () => {
  const { formData, setFormData } = useForm();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSave = (data: any, exportType: 'current' | 'final'): boolean => {
    const validation = validateAssessmentData(data);
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Cannot Save Assessment",
        description: "Required data is missing: " + validation.errors.join(', ')
      });
      return false;
    }
    return true;
  };

  const loadMockAssessment = () => {
    try {
      console.log('Loading mock assessment data');
      console.log('Mock data:', JSON.stringify(mockAssessment, null, 2));
      
      if (!mockAssessment.functionalAssessment) {
        console.warn('No functional assessment data in mock data');
      } else {
        console.log('Functional assessment data found:', 
          JSON.stringify(mockAssessment.functionalAssessment, null, 2));
      }

      setFormData(mockAssessment);
      
      // Verify data was set
      setTimeout(() => {
        console.log('Form data after setting:', formData);
        console.log('Functional assessment in form:', formData?.functionalAssessment);
      }, 100);

      toast({
        title: "Test Data Loaded",
        description: "Mock assessment data has been loaded successfully."
      });
    } catch (error) {
      console.error('Error loading mock data:', error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: "Failed to load mock assessment data."
      });
    }
  };

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Migrate legacy data if needed
        const migratedData = migrateLegacyData(data);
        
        // Set the form data
        setFormData(migratedData);
        
        toast({
          title: "Assessment Loaded",
          description: "The assessment has been loaded successfully."
        });
      } catch (error) {
        console.error('Error parsing assessment file:', error);
        toast({
          variant: "destructive",
          title: "Load Failed",
          description: "Failed to load the assessment file. Please check the file format."
        });
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveLocal = () => {
    try {
      if (!validateAndSave(formData, 'current')) return;

      const timestamp = new Date().toISOString().split('T')[0];
      const dataStr = JSON.stringify(formData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `delilah_assessment_${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Assessment Saved",
        description: "Your work has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your work. Please try again."
      });
    }
  };

  const exportFinalJSON = () => {
    try {
      const finalData = {
        ...formData,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      if (!validateAndSave(finalData, 'final')) return;
      
      const dataStr = JSON.stringify(finalData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `delilah_final_assessment.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Final Assessment Exported",
        description: "Your assessment has been exported successfully."
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your assessment. Please try again."
      });
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileLoad}
        accept=".json"
        className="hidden"
      />

      {process.env.NODE_ENV === 'development' && <ClearFormButton />}
      
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        <Upload className="h-4 w-4" />
        Load Assessment
      </Button>

      {process.env.NODE_ENV === 'development' && (
        <Button
          onClick={loadMockAssessment}
          variant="outline"
          className="flex items-center gap-2 border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          <FileDown className="h-4 w-4" />
          Load Test Data
        </Button>
      )}

      <Button
        onClick={saveLocal}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Save className="h-4 w-4" />
        Save Current Work
      </Button>
      
      <Button
        onClick={exportFinalJSON}
        variant="outline"
        className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
      >
        <Download className="h-4 w-4" />
        Export Final JSON
      </Button>

      <ReportGenerationButton />
    </div>
  );
};
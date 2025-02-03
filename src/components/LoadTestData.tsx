import React from 'react';
import { Button } from '@/components/ui/button';
import { useFormContext } from '@/context/FormContext';
import { useToast } from "@/components/ui/use-toast";
import { mockAssessment } from '@/testData/mockAssessment';

export const LoadTestData: React.FC = () => {
  const { setFormData, formData } = useFormContext();
  const { toast } = useToast();

  const loadTestData = () => {
    try {
      // Log current state
      console.log('Current form data before load:', formData);
      console.log('Loading test data:', mockAssessment);
      
      // Set the form data
      setFormData(mockAssessment);

      // Log immediately after setting
      setTimeout(() => {
        console.log('Form data after load:', formData);
      }, 0);

      toast({
        title: "Test Data Loaded",
        description: "Sample assessment data has been loaded successfully."
      });
    } catch (error) {
      console.error('Error loading test data:', error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: "Failed to load test data. Please try again."
      });
    }
  };

  return (
    <Button
      onClick={loadTestData}
      variant="outline"
      className="flex items-center gap-2 text-gray-600"
    >
      Load Test Data
    </Button>
  );
};
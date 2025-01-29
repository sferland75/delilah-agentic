import React, { useState, useEffect } from 'react';
import { useForm as useHookForm, FormProvider } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useForm as useFormContext } from '@/context/FormContext';

import { assessmentSchema, type Assessment } from '../../lib/validation/assessment-schema';
import { BERG_ITEMS } from '@/components/BergBalance/berg-items';

// Import all sections
import { InitialInformationSection } from '@/components/InitialInformation';
import { MedicalHistorySection } from '@/components/MedicalHistory';
import { TypicalDaySection } from '@/components/TypicalDay';
import { AMAGuidesSection } from '@/components/AMAGuides';
import { CareRequirements } from '@/components/forms/sections-next/care';
import { EnvironmentalSectionConsolidated } from '@/components/EnvironmentalSection';
import { ADLSection } from '@/components/ADLSection';
import { FunctionalAssessment } from '@/components/FunctionalAssessment';
import SymptomsSection from '@/components/SymptomsSection'; // Changed to default import

const AssessmentForm = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const { toast } = useToast();
  const { formData, updateFormData } = useFormContext();

  // Initialize react-hook-form
  const methods = useHookForm<Assessment>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: formData || {}
  });

  // Reset form when formData changes
  useEffect(() => {
    console.log('Resetting form with data:', formData);
    if (formData && Object.keys(formData).length > 0) {
      methods.reset(formData);
    }
  }, [formData, methods]);

  const onSubmit = methods.handleSubmit(async (data: Assessment) => {
    try {
      updateFormData(data);
      toast({
        title: "Success",
        description: "Assessment saved successfully."
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment.",
        variant: "destructive"
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-8">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="initial">Initial</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="typical-day">Typical Day</TabsTrigger>
              <TabsTrigger value="functional">Functional</TabsTrigger>
              <TabsTrigger value="environmental">Environmental</TabsTrigger>
              <TabsTrigger value="adl">ADL</TabsTrigger>
              <TabsTrigger value="care">Care</TabsTrigger>
              <TabsTrigger value="ama">AMA</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="initial">
                <InitialInformationSection />
              </TabsContent>
              <TabsContent value="medical">
                <MedicalHistorySection />
              </TabsContent>
              <TabsContent value="symptoms">
                <SymptomsSection />
              </TabsContent>
              <TabsContent value="typical-day">
                <TypicalDaySection />
              </TabsContent>
              <TabsContent value="functional">
                <FunctionalAssessment />
              </TabsContent>
              <TabsContent value="environmental">
                <EnvironmentalSectionConsolidated />
              </TabsContent>
              <TabsContent value="adl">
                <ADLSection />
              </TabsContent>
              <TabsContent value="care">
                <CareRequirements />
              </TabsContent>
              <TabsContent value="ama">
                <AMAGuidesSection />
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
      </form>
    </FormProvider>
  );
};

export default AssessmentForm;
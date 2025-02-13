import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AutoSaveStatus } from '../AutoSaveStatus';
import { useAssessmentForm } from '../../context/FormProvider';

import { InitialSection } from './sections/InitialSection';
import { MedicalSection } from './sections/MedicalSection';
import SymptomsSection from '@/components/SymptomsSection';
import { TypicalDaySection } from './sections/TypicalDaySection';
import { FunctionalSection } from './sections/FunctionalSection';
import { EnvironmentalSection } from './sections/EnvironmentalSection';
import { ADLSection } from './sections/ADLSection';
import { HousekeepingAssessment } from './sections/HousekeepingAssessment';
import { AMAGuidesSection } from '@/components/AMAGuides';
import AttendantCareSection from '@/components/AttendantCare';

export const AssessmentForm = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const { formState: { errors } } = useFormContext();
  const { validationStatus, isDirty } = useAssessmentForm();
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  // Show validation summary when there are errors
  useEffect(() => {
    if (validationStatus && !validationStatus.isValid) {
      setShowValidationSummary(true);
    }
  }, [validationStatus]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-start">
            <AutoSaveStatus isDirty={isDirty} />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger 
              value="initial" 
              className={errors?.initial || validationStatus?.errors?.initial ? "border-red-500" : ""}
            >
              Initial
            </TabsTrigger>
            <TabsTrigger 
              value="medical"
              className={errors?.medical || validationStatus?.errors?.medical ? "border-red-500" : ""}
            >
              Medical
            </TabsTrigger>
            <TabsTrigger 
              value="symptoms"
              className={errors?.symptoms || validationStatus?.errors?.symptoms ? "border-red-500" : ""}
            >
              Symptoms
            </TabsTrigger>
            <TabsTrigger 
              value="typical-day"
              className={errors?.typicalDay || validationStatus?.errors?.typicalDay ? "border-red-500" : ""}
            >
              Typical Day
            </TabsTrigger>
            <TabsTrigger 
              value="functional"
              className={errors?.functional || validationStatus?.errors?.functional ? "border-red-500" : ""}
            >
              Functional
            </TabsTrigger>
            <TabsTrigger 
              value="environmental"
              className={errors?.environmental || validationStatus?.errors?.environmental ? "border-red-500" : ""}
            >
              Environmental
            </TabsTrigger>
            <TabsTrigger 
              value="adl"
              className={errors?.adl || validationStatus?.errors?.adl ? "border-red-500" : ""}
            >
              ADL
            </TabsTrigger>

            {/* Optional Modules */}
            <TabsTrigger 
              value="care"
              className={`bg-slate-50/80 font-medium ${errors?.attendantCare || validationStatus?.errors?.attendantCare ? "border-red-500" : ""}`}
            >
              Form 1
            </TabsTrigger>
            <TabsTrigger 
              value="housekeeping"
              className={`bg-slate-50/80 font-medium ${errors?.housekeeping || validationStatus?.errors?.housekeeping ? "border-red-500" : ""}`}
            >
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="ama"
              className={`bg-slate-50/80 font-medium ${errors?.ama || validationStatus?.errors?.ama ? "border-red-500" : ""}`}
            >
              AMA
            </TabsTrigger>
          </TabsList>

          <CardContent>
            <TabsContent value="initial">
              <InitialSection />
            </TabsContent>

            <TabsContent value="medical">
              <MedicalSection />
            </TabsContent>

            <TabsContent value="symptoms">
              <SymptomsSection />
            </TabsContent>

            <TabsContent value="typical-day">
              <TypicalDaySection />
            </TabsContent>

            <TabsContent value="functional">
              <FunctionalSection />
            </TabsContent>

            <TabsContent value="environmental">
              <EnvironmentalSection />
            </TabsContent>

            <TabsContent value="adl">
              <ADLSection />
            </TabsContent>

            <TabsContent value="housekeeping">
              <HousekeepingAssessment />
            </TabsContent>

            <TabsContent value="care">
              <AttendantCareSection />
            </TabsContent>

            <TabsContent value="ama">
              <AMAGuidesSection />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
=======
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
import { SymptomsSection } from '@/components/SymptomsSection';

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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
};

export default AssessmentForm;
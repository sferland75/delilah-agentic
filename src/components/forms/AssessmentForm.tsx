import React, { useState, useEffect } from 'react';
import { useFormContext as useGlobalFormContext } from '@/context/FormContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

import { InitialSection } from './sections/InitialSection';
import { MedicalSection } from './sections/MedicalSection';
import { SymptomsSection } from './sections/SymptomsSection';
import { TypicalDaySection } from '@/components/TypicalDay';
import { FunctionalAssessment } from '@/components/FunctionalAssessment';
import { EnvironmentalSection } from '@/components/EnvironmentalSection';
import { ADLSection } from '@/components/ADLSection';
import { AMAGuidesSection } from '@/components/AMAGuides';
import AttendantCareSection from '@/components/AttendantCare';
import { assessmentSchema, type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { AutoSaveStatus } from '../AutoSaveStatus';

const AssessmentForm = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const { formData: contextFormData, updateForm } = useGlobalFormContext();

  // Initialize form with validation
  const methods = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: contextFormData,
    mode: 'onChange'
  });

  const { formState: { errors, isValid } } = methods;

  // Update form when context data changes
  useEffect(() => {
    if (contextFormData) {
      methods.reset(contextFormData);
    }
  }, [contextFormData, methods]);

  return (
    <div className="space-y-4">
      <Card>
        <FormProvider {...methods}>
          {/* Progress indicator */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <AutoSaveStatus />
            </div>
          </div>

          {/* Form tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-9">
              <TabsTrigger value="initial" 
                className={errors?.initial ? "border-red-500" : ""}>
                Initial
              </TabsTrigger>
              <TabsTrigger value="medical"
                className={errors?.medical ? "border-red-500" : ""}>
                Medical
              </TabsTrigger>
              <TabsTrigger value="symptoms"
                className={errors?.symptoms ? "border-red-500" : ""}>
                Symptoms
              </TabsTrigger>
              <TabsTrigger value="typical-day"
                className={errors?.typicalDay ? "border-red-500" : ""}>
                Typical Day
              </TabsTrigger>
              <TabsTrigger value="functional"
                className={errors?.functional ? "border-red-500" : ""}>
                Functional
              </TabsTrigger>
              <TabsTrigger value="environmental"
                className={errors?.environmental ? "border-red-500" : ""}>
                Environmental
              </TabsTrigger>
              <TabsTrigger value="adl"
                className={errors?.adl ? "border-red-500" : ""}>
                ADL
              </TabsTrigger>
              <TabsTrigger value="care"
                className={errors?.attendantCare ? "border-red-500" : ""}>
                Care
              </TabsTrigger>
              <TabsTrigger value="ama"
                className={errors?.ama ? "border-red-500" : ""}>
                AMA
              </TabsTrigger>
            </TabsList>

            <CardContent>
              {/* Display validation errors if any */}
              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Please fix the validation errors before proceeding.
                  </AlertDescription>
                </Alert>
              )}

              {/* Form sections */}
              <TabsContent value="initial" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">Initial Information</h3>
                <InitialSection />
              </TabsContent>

              <TabsContent value="medical" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">Medical History</h3>
                <MedicalSection />
              </TabsContent>

              <TabsContent value="symptoms" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">Symptoms Assessment</h3>
                <SymptomsSection />
              </TabsContent>

              <TabsContent value="typical-day" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">Typical Day Assessment</h3>
                <TypicalDaySection />
              </TabsContent>

              <TabsContent value="functional" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">Functional Assessment</h3>
                <FunctionalAssessment />
              </TabsContent>

              <TabsContent value="environmental" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">Environmental Assessment</h3>
                <EnvironmentalSection />
              </TabsContent>

              <TabsContent value="adl" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">ADL Assessment</h3>
                <ADLSection />
              </TabsContent>

              <TabsContent value="care" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">Attendant Care Assessment</h3>
                <AttendantCareSection />
              </TabsContent>

              <TabsContent value="ama" className="mt-4">
                <h3 className="text-xl font-semibold mb-4">AMA Guides Assessment</h3>
                <AMAGuidesSection />
              </TabsContent>
            </CardContent>
          </Tabs>
        </FormProvider>
      </Card>
    </div>
  );
};

export default AssessmentForm;
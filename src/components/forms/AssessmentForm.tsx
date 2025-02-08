import React, { useState, useEffect } from 'react';
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
  );
};

export default AssessmentForm;
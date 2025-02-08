import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AutoSaveStatus } from '../AutoSaveStatus';
import { Button } from '@/components/ui/button';
import { useAssessmentForm } from '../../context/FormProvider'; // Fixed import path

import { InitialSection } from './sections/InitialSection';
import { MedicalSection } from './sections/MedicalSection';
import SymptomsSection from '@/components/SymptomsSection';
import { TypicalDaySection } from './sections/TypicalDaySection';
import { FunctionalSection } from './sections/FunctionalSection';
import { EnvironmentalSection } from './sections/EnvironmentalSection';
import { ADLSection } from './sections/ADLSection';
import { HousekeepingSection } from '@/components/HousekeepingSection';
import { AMAGuidesSection } from '@/components/AMAGuides';
import AttendantCareSection from '@/components/AttendantCare';

const AssessmentForm = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const { formState: { errors } } = useFormContext();
  const { validationStatus, isDirty, hasBackup, loadBackup } = useAssessmentForm();
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  // Show validation summary when there are errors
  useEffect(() => {
    if (validationStatus && !validationStatus.isValid) {
      setShowValidationSummary(true);
    }
  }, [validationStatus]);

  // Automatically switch to tab with errors
  useEffect(() => {
    if (validationStatus && !validationStatus.isValid) {
      const firstErrorSection = Object.keys(validationStatus.errors)[0];
      if (firstErrorSection) {
        setActiveTab(firstErrorSection);
      }
    }
  }, [validationStatus]);

  const hasErrors = Object.keys(errors).length > 0;
  const hasValidationErrors = validationStatus && !validationStatus.isValid;
  const hasWarnings = validationStatus?.warnings && Object.keys(validationStatus.warnings).length > 0;

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <AutoSaveStatus isDirty={isDirty} />
            {hasBackup && (
              <Button 
                variant="outline" 
                onClick={loadBackup}
                className="ml-2"
              >
                Restore from backup
              </Button>
            )}
          </div>
        </div>

        {(hasErrors || hasValidationErrors || hasWarnings) && showValidationSummary && (
          <div className="p-4">
            {hasErrors && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Form Validation Errors</AlertTitle>
                <AlertDescription>
                  Please fix the validation errors before proceeding.
                </AlertDescription>
              </Alert>
            )}

            {hasValidationErrors && (
              <div className="space-y-4">
                {Object.entries(validationStatus.errors).map(([section, sectionErrors]) => (
                  <Alert 
                    key={section}
                    variant="destructive"
                    className="mb-2"
                  >
                    <AlertTitle className="capitalize">{section} Section</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4">
                        {sectionErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {hasWarnings && (
              <div className="space-y-4 mt-4">
                {Object.entries(validationStatus.warnings).map(([section, warnings]) => (
                  <Alert 
                    key={section}
                    variant="warning"
                    className="mb-2"
                  >
                    <AlertTitle className="capitalize">{section} Section - Warnings</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4">
                        {warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              onClick={() => setShowValidationSummary(false)}
              className="mt-2"
            >
              Hide Validation Summary
            </Button>
          </div>
        )}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-10">
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
            <TabsTrigger 
              value="housekeeping"
              className={errors?.housekeeping || validationStatus?.errors?.housekeeping ? "border-red-500" : ""}
            >
              Housekeeping
            </TabsTrigger>
            <TabsTrigger 
              value="care"
              className={errors?.attendantCare || validationStatus?.errors?.attendantCare ? "border-red-500" : ""}
            >
              Care
            </TabsTrigger>
            <TabsTrigger 
              value="ama"
              className={errors?.ama || validationStatus?.errors?.ama ? "border-red-500" : ""}
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
              <HousekeepingSection />
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
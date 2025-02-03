import React, { useState, useEffect } from 'react';
import { useForm as useFormContext } from '@/context/FormContext';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InitialSection } from './sections/InitialSection';
import { MedicalSection } from './sections/MedicalSection';
import { SymptomsSection } from './sections/SymptomsSection';
import { Card, CardContent } from "@/components/ui/card";
import { TypicalDaySection } from '@/components/TypicalDay';
import { FunctionalAssessment } from '@/components/FunctionalAssessment';
import { EnvironmentalSection } from '@/components/EnvironmentalSection';
import { ADLSection } from '@/components/ADLSection';

const AssessmentForm = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const { formData } = useFormContext();

  // Initialize form with data
  const methods = useForm({
    defaultValues: formData
  });

  // Update form when data changes
  useEffect(() => {
    console.log('AssessmentForm - Updating form with data:', formData);
    if (formData) {
      methods.reset(formData);
    }
  }, [formData]);

  return (
    <Card className="mt-4">
      <FormProvider {...methods}>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-9">
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

          <CardContent>
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
              <EnvironmentalSection />
            </TabsContent>

            <TabsContent value="adl" className="mt-4">
              <ADLSection />
            </TabsContent>
          </CardContent>
        </Tabs>
      </FormProvider>
    </Card>
  );
};

export default AssessmentForm;
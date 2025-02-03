import React from 'react';
import { FormProvider, useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyOverview } from '../EnvironmentalSection/property-overview';
import { SafetyAssessment } from '../EnvironmentalSection/safety-assessment';
import { RoomAssessment } from '../EnvironmentalSection/room-assessment';
import { useForm as useDelilahForm } from '@/context/FormContext';

export function EnvironmentalAssessment() {
  // Get the form methods from the parent context
  const methods = useFormContext();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Environmental Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Make sure child components have access to form context */}
          <FormProvider {...methods}>
            <PropertyOverview />
            <RoomAssessment />
            <SafetyAssessment />
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
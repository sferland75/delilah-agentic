import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyOverview } from './PropertyOverview';
import { ExteriorFeatures } from './ExteriorFeatures';
import { AccessibilityAssessment } from './AccessibilityAssessment';
import { SafetyAssessment } from './SafetyAssessment';

export function EnvironmentalSectionConsolidated() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#2C3258]">Environmental Assessment</h2>
        <p className="text-sm text-slate-600">Evaluate home environment and accessibility</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="property" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="property">Property Overview</TabsTrigger>
            <TabsTrigger value="exterior">Exterior Features</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="safety">Safety Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="property">
            <PropertyOverview control={control} />
          </TabsContent>

          <TabsContent value="exterior">
            <ExteriorFeatures control={control} />
          </TabsContent>

          <TabsContent value="accessibility">
            <AccessibilityAssessment control={control} />
          </TabsContent>

          <TabsContent value="safety">
            <SafetyAssessment control={control} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
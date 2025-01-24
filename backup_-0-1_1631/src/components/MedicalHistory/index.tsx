import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreExistingConditions } from './PreExistingConditions';
import { InjuryMechanism } from './InjuryMechanism';
import { Medications } from './Medications';

export function MedicalHistorySection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#2C3258]">Medical History</h2>
        <p className="text-sm text-slate-600">Pre-accident history, injury details, and current medications</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="preExisting" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="preExisting">Pre-Existing Conditions</TabsTrigger>
            <TabsTrigger value="injury">Injury Mechanism</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
          </TabsList>

          <TabsContent value="preExisting">
            <PreExistingConditions control={control} />
          </TabsContent>

          <TabsContent value="injury">
            <InjuryMechanism control={control} />
          </TabsContent>

          <TabsContent value="medications">
            <Medications control={control} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
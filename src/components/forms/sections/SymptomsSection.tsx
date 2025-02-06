import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyMap } from '@/components/BodyMap';
import { PainFindingsTable } from '@/components/SymptomsSection/PainFindingsTable';
import EmotionalSymptoms from '@/components/SymptomsSection/EmotionalSymptoms';
import CognitiveSymptoms from '@/components/SymptomsSection/CognitiveSymptoms';

const PhysicalContent = () => {
  const { watch, setValue } = useFormContext();
  const painData = watch('symptoms.painData') || {};

  const handlePainDataUpdate = (regionId: string, data: any) => {
    const newPainData = {
      ...painData,
      [regionId]: data
    };
    
    console.log('Updating pain data:', newPainData);
    setValue('symptoms.painData', newPainData, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BodyMap 
          painData={painData}
          onPainDataUpdate={handlePainDataUpdate}
        />
      </div>
      <PainFindingsTable />
    </div>
  );
};

export function SymptomsSection() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="physical" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="physical">Physical Symptoms</TabsTrigger>
          <TabsTrigger value="emotional">Emotional/Psychological</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="mt-6">
          <PhysicalContent />
        </TabsContent>

        <TabsContent value="emotional" className="mt-6">
          <EmotionalSymptoms />
        </TabsContent>

        <TabsContent value="cognitive" className="mt-6">
          <CognitiveSymptoms />
        </TabsContent>
      </Tabs>
    </div>
  );
}
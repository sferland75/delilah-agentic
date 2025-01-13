import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DemographicsForm } from './DemographicsForm';
import { DocumentationForm } from './DocumentationForm';
import { LivingSituation } from './LivingSituation';

export function InitialInformationSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#2C3258]">Initial Information</h2>
        <p className="text-sm text-slate-600">Comprehensive collection of personal and situational details</p>
      </div>

      <Card className="p-6">
        <Alert className="mb-6">
          <AlertDescription>
            Document all relevant personal information, living situation, and documentation review details.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="living">Living Situation</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="demographics">
            <DemographicsForm control={control} />
          </TabsContent>

          <TabsContent value="living">
            <LivingSituation control={control} />
          </TabsContent>

          <TabsContent value="documentation">
            <DocumentationForm control={control} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
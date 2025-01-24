import React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ADLAssessment from './ADLAssessment';
import SocialFunction from './SocialFunction';
import ConcentrationAssessment from './ConcentrationAssessment';
import WorkAdaptation from './WorkAdaptation';
import OverallAssessment from './OverallAssessment';
import { amaGuideSchema, type AMAGuideFormData } from './schema';

export const AMAGuidesSection = () => {
  const { toast } = useToast();
  const methods = useFormContext(); // Use the parent form context instead of creating a new one
  
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AMA Guides Mental/Behavioral Assessment</h2>
      </div>
      
      <Tabs defaultValue="adl" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
          <TabsTrigger value="adl">ADL Assessment</TabsTrigger>
          <TabsTrigger value="social">Social Function</TabsTrigger>
          <TabsTrigger value="concentration">Concentration</TabsTrigger>
          <TabsTrigger value="work">Work Adaptation</TabsTrigger>
          <TabsTrigger value="overall">Overall Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="adl">
          <ADLAssessment />
        </TabsContent>
        
        <TabsContent value="social">
          <SocialFunction />
        </TabsContent>
        
        <TabsContent value="concentration">
          <ConcentrationAssessment />
        </TabsContent>
        
        <TabsContent value="work">
          <WorkAdaptation />
        </TabsContent>

        <TabsContent value="overall">
          <OverallAssessment />
        </TabsContent>
      </Tabs>
    </div>
  );
};
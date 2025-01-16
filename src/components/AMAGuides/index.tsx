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
import { Home, Users, Brain, Briefcase, FileSpreadsheet } from 'lucide-react';

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
          <TabsTrigger value="adl" className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>ADL Assessment</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="social" className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Social Function</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="concentration" className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Concentration</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="work" className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Work Adaptation</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="overall" className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Overall Assessment</span>
            </div>
          </TabsTrigger>
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
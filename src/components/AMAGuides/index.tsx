import React from 'react';
<<<<<<< HEAD
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
=======
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
import ADLAssessment from './ADLAssessment';
import SocialFunction from './SocialFunction';
import ConcentrationAssessment from './ConcentrationAssessment';
import WorkAdaptation from './WorkAdaptation';
import OverallAssessment from './OverallAssessment';
<<<<<<< HEAD
import { Home, Users, Brain, Briefcase, FileSpreadsheet } from 'lucide-react';

export const AMAGuidesSection = () => {
  const methods = useFormContext();
  
  return (
    <div className="p-6">
      <Tabs defaultValue="adl" className="w-full">
        <div className="bg-slate-100/80 p-1 rounded-md mb-6">
          <TabsList className="grid w-full grid-cols-5 gap-1">
            <TabsTrigger 
              value="adl"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>ADL</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="social"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Social</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="concentration"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Concentration</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="work"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Work</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="overall"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Overall</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="adl">
          <div className="space-y-4">
            <ADLAssessment />
          </div>
        </TabsContent>
        
        <TabsContent value="social">
          <div className="space-y-4">
            <SocialFunction />
          </div>
        </TabsContent>
        
        <TabsContent value="concentration">
          <div className="space-y-4">
            <ConcentrationAssessment />
          </div>
        </TabsContent>
        
        <TabsContent value="work">
          <div className="space-y-4">
            <WorkAdaptation />
          </div>
        </TabsContent>

        <TabsContent value="overall">
          <div className="space-y-4">
            <OverallAssessment />
          </div>
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
        </TabsContent>
      </Tabs>
    </div>
  );
};
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ADLAssessment from './ADLAssessment';
import SocialFunction from './SocialFunction';
import ConcentrationAssessment from './ConcentrationAssessment';
import WorkAdaptation from './WorkAdaptation';
import OverallAssessment from './OverallAssessment';
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
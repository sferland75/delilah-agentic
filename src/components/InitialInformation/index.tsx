import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DemographicsForm } from './DemographicsForm';
import { DocumentationForm } from './DocumentationForm';
import { LivingSituation } from './LivingSituation';
import { UserCircle, Home, FileText } from 'lucide-react';

export function InitialInformationSection() {
  const { control } = useFormContext();

  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Initial Information</h2>
      <p className="text-sm text-slate-600 mb-6">Comprehensive collection of personal and situational details</p>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document comprehensive initial assessment details including:
          - Personal demographics and contact information
          - Current living situation and support systems
          - Review of provided documentation and reports
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger 
            value="demographics"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Demographics</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="living"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Living Situation</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="documentation"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documentation</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demographics">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <DemographicsForm control={control} />
          </div>
        </TabsContent>

        <TabsContent value="living">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <LivingSituation control={control} />
          </div>
        </TabsContent>

        <TabsContent value="documentation">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <DocumentationForm control={control} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
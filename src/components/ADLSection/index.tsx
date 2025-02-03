'use client';

import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { 
  User, Home, Settings, Briefcase, HeartPulse, 
  Bath, Shirt, Utensils, ArrowUpDown, Printer,
  FileDown, Eye, CheckCircle2
} from 'lucide-react';
import { 
  adlCategories, 
  iadlCategories, 
  healthCategories, 
  workCategories 
} from './constants';
import { ADLField } from './components/ADLField';
import { useFormContext } from 'react-hook-form';
import { Progress } from "@/components/ui/progress";

export function ADLSection() {
  const { watch } = useFormContext();
  const formData = watch();
  
  // Calculate completion percentage for each category
  const calculateCompletion = (categoryPath: string) => {
    const categoryData = formData?.adl?.[categoryPath] || {};
    const totalFields = Object.keys(categoryData).length * 2; // independence + notes for each field
    let completedFields = 0;
    
    Object.keys(categoryData).forEach(field => {
      if (categoryData[field]?.independence) completedFields++;
      if (categoryData[field]?.notes) completedFields++;
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  // Get total completion percentage
  const getTotalCompletion = () => {
    const categories = ['basic', 'iadl', 'health', 'work'];
    const completions = categories.map(calculateCompletion);
    return Math.round(completions.reduce((a, b) => a + b, 0) / categories.length);
  };

  // Function to render a category tab content
  const renderCategoryContent = (
    categories: typeof adlCategories | typeof iadlCategories | typeof healthCategories | typeof workCategories,
    categoryType: string
  ) => (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-slate-800">{categoryType === 'basic' ? 'Basic Activities of Daily Living' : 
          categoryType === 'iadl' ? 'Instrumental Activities of Daily Living' :
          categoryType === 'health' ? 'Health Management Activities' : 'Work Related Activities'}</h3>
        <div className="flex items-center gap-2">
          <Progress value={calculateCompletion(categoryType)} className="w-32" />
          <span className="text-sm font-medium">{calculateCompletion(categoryType)}% Complete</span>
        </div>
      </div>
      <Accordion type="multiple" className="space-y-4">
        {Object.entries(categories).map(([category, { title, icon: Icon, items }]) => (
          <AccordionItem key={category} value={category} className="border rounded-lg">
            <AccordionTrigger className="hover:no-underline py-3 px-4 [&[data-state=open]]:bg-blue-50 rounded-t-lg">
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-blue-600" />
                  <div className="font-medium text-slate-800">{title}</div>
                </div>
                <div className="flex items-center gap-2">
                  {items.every(item => formData?.adl?.[categoryType]?.[category]?.[item.id]?.independence) && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 space-y-4 bg-white rounded-b-lg">
              {items.map((item) => (
                <ADLField
                  key={item.id}
                  basePath={`adl.${categoryType}.${category}.${item.id}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  requiresFrequency={item.requiresFrequency}
                  requiresTimeTaken={item.requiresTimeTaken}
                  requiresAssistiveDevices={item.requiresAssistiveDevices}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );

  return (
    <Card className="p-6 bg-slate-50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Activities of Daily Living</h2>
          <p className="text-sm text-slate-600">Assessment of personal care, daily tasks, and functional independence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          <div className="flex items-center justify-between">
            <div>
              Document ability to perform daily activities including:
              - Basic self-care tasks
              - Instrumental activities
              - Health management
              - Work-related activities
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Completion:</div>
              <Progress value={getTotalCompletion()} className="w-32" />
              <div className="text-sm font-medium">{getTotalCompletion()}%</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
        
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger 
              value="basic"
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Basic ADLs</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="iadl"
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>IADLs</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="health"
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                <span>Health Management</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="work"
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Work Status</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            {renderCategoryContent(adlCategories, 'basic')}
          </TabsContent>

          <TabsContent value="iadl">
            {renderCategoryContent(iadlCategories, 'iadl')}
          </TabsContent>

          <TabsContent value="health">
            {renderCategoryContent(healthCategories, 'health')}
          </TabsContent>

          <TabsContent value="work">
            {renderCategoryContent(workCategories, 'work')}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
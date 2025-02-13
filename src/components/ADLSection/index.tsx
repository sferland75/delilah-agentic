<<<<<<< HEAD
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormContext } from "react-hook-form";
import { HousekeepingAssessment } from './HousekeepingAssessment';
import { ADLAssessment } from './ADLAssessment';

export function ADLSection() {
  const methods = useFormContext();

  if (!methods) {
    throw new Error('ADLSection must be used within a FormProvider');
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activities of Daily Living Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General ADLs</TabsTrigger>
              <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="space-y-4">
                <ADLAssessment />
              </div>
            </TabsContent>

            <TabsContent value="housekeeping">
              <div className="space-y-4">
                <HousekeepingAssessment />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
=======
'use client';

import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Home, Settings, Briefcase, HeartPulse, Bath, Shirt, Utensils, ArrowUpDown } from 'lucide-react';
import { adlCategories, iadlCategories, healthCategories, workCategories } from './constants';
import { ADLField } from './components/ADLField';

export function ADLSection() {
  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Activities of Daily Living</h2>
      <p className="text-sm text-slate-600 mb-6">Assessment of personal care, daily tasks, and functional independence</p>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document ability to perform daily activities including:
          - Basic self-care tasks
          - Instrumental activities
          - Health management
          - Work-related activities
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
            <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(adlCategories).map(([category, { title, icon: Icon, items }]) => (
                  <AccordionItem key={category} value={category} className="border rounded-lg">
                    <AccordionTrigger className="hover:no-underline py-3 px-4 [&[data-state=open]]:bg-blue-50 rounded-t-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-slate-800">{title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4 bg-white rounded-b-lg">
                      {items.map((item) => (
                        <ADLField
                          key={item.id}
                          basePath={`adl.basic.${category}.${item.id}`}
                          title={item.title}
                          subtitle={item.subtitle}
                          icon={item.icon}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="iadl">
            <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(iadlCategories).map(([category, { title, icon: Icon, items }]) => (
                  <AccordionItem key={category} value={category} className="border rounded-lg">
                    <AccordionTrigger className="hover:no-underline py-3 px-4 [&[data-state=open]]:bg-blue-50 rounded-t-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-slate-800">{title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4 bg-white rounded-b-lg">
                      {items.map((item) => (
                        <ADLField
                          key={item.id}
                          basePath={`adl.iadl.${category}.${item.id}`}
                          title={item.title}
                          subtitle={item.subtitle}
                          icon={item.icon}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="health">
            <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(healthCategories).map(([category, { title, icon: Icon, items }]) => (
                  <AccordionItem key={category} value={category} className="border rounded-lg">
                    <AccordionTrigger className="hover:no-underline py-3 px-4 [&[data-state=open]]:bg-blue-50 rounded-t-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-slate-800">{title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4 bg-white rounded-b-lg">
                      {items.map((item) => (
                        <ADLField
                          key={item.id}
                          basePath={`adl.health.${category}.${item.id}`}
                          title={item.title}
                          subtitle={item.subtitle}
                          icon={item.icon}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="work">
            <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(workCategories).map(([category, { title, icon: Icon, items }]) => (
                  <AccordionItem key={category} value={category} className="border rounded-lg">
                    <AccordionTrigger className="hover:no-underline py-3 px-4 [&[data-state=open]]:bg-blue-50 rounded-t-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-slate-800">{title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4 bg-white rounded-b-lg">
                      {items.map((item) => (
                        <ADLField
                          key={item.id}
                          basePath={`adl.work.${category}.${item.id}`}
                          title={item.title}
                          subtitle={item.subtitle}
                          icon={item.icon}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
}
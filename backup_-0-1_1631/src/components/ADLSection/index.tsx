'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { User, Home, Settings, Briefcase, HeartPulse, Bath, Shirt, Utensils, ArrowUpDown } from 'lucide-react';
import { adlCategories, iadlCategories, healthCategories, workCategories } from './constants';
import { ADLField } from './components/ADLField';

export function ADLSection() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-start gap-3">
          <User className="h-5 w-5 text-slate-500 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-[#2C3258]">Activities of Daily Living</h2>
            <p className="text-sm text-[#4556B4]">Personal care, hygiene, and daily tasks assessment</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="basic">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Basic ADLs</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="iadl">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>IADLs</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="health">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4" />
                  <span>Health Management</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="work">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Work Status</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(adlCategories).map(([category, { title, icon: Icon, items }]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="hover:no-underline py-3 px-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4">
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
            </TabsContent>

            <TabsContent value="iadl">
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(iadlCategories).map(([category, { title, icon: Icon, items }]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="hover:no-underline py-3 px-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4">
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
            </TabsContent>

            <TabsContent value="health">
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(healthCategories).map(([category, { title, icon: Icon, items }]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="hover:no-underline py-3 px-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4">
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
            </TabsContent>

            <TabsContent value="work">
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(workCategories).map(([category, { title, icon: Icon, items }]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="hover:no-underline py-3 px-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{title}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 space-y-4">
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
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
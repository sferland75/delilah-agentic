import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalCare } from './PersonalCare';
import { HouseholdManagement } from './HouseholdManagement';
import { CommunityIntegration } from './CommunityIntegration';

export function ADLSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#2C3258]">Activities of Daily Living</h2>
        <p className="text-sm text-slate-600">Assessment of daily activities and independence levels</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal">Personal Care</TabsTrigger>
            <TabsTrigger value="household">Household Management</TabsTrigger>
            <TabsTrigger value="community">Community Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <PersonalCare control={control} />
          </TabsContent>

          <TabsContent value="household">
            <HouseholdManagement control={control} />
          </TabsContent>

          <TabsContent value="community">
            <CommunityIntegration control={control} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
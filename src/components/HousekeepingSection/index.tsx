import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CleaningTasks } from './CleaningTasks';
import { HomeMaintenance } from './HomeMaintenance';
import { ReplacementCalculator } from './ReplacementCalculator';

export function HousekeepingSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Housekeeping & Home Maintenance Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cleaning">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cleaning">Cleaning Tasks</TabsTrigger>
              <TabsTrigger value="maintenance">Home Maintenance</TabsTrigger>
              <TabsTrigger value="calculator">Service Hours & Cost</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cleaning" className="space-y-4">
              <CleaningTasks />
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <HomeMaintenance />
            </TabsContent>

            <TabsContent value="calculator" className="space-y-4">
              <ReplacementCalculator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HousekeepingAssessment } from './HousekeepingAssessment';

export function ADLSection() {
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
                {/* Existing ADL content goes here */}
                <p className="text-muted-foreground">General ADL assessment content...</p>
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
  );
}
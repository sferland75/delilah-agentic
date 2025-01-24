import React from 'react';
import { useFormContext } from "react-hook-form";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

import { Level1Care } from "./sections-next/care/components/Level1Care";
import { Level2Care } from "./sections-next/care/components/Level2Care";
import { Level3Care } from "./sections-next/care/components/Level3Care";
import { CostSummary } from "./sections-next/care/components/CostSummary";

export function CareRequirements() {
  const form = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment of Attendant Care Needs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="level1" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="level1">Level 1</TabsTrigger>
            <TabsTrigger value="level2">Level 2</TabsTrigger>
            <TabsTrigger value="level3">Level 3</TabsTrigger>
            <TabsTrigger value="summary">Cost Summary</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="level1">
              <Level1Care form={form} />
            </TabsContent>

            <TabsContent value="level2">
              <Level2Care form={form} />
            </TabsContent>

            <TabsContent value="level3">
              <Level3Care form={form} />
            </TabsContent>

            <TabsContent value="summary">
              <CostSummary form={form} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default CareRequirements;
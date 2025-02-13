import React from 'react';
import { useFormContext } from "react-hook-form";
<<<<<<< HEAD
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
=======
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
import { Level1Care } from "./components/Level1Care";
import { Level2Care } from "./components/Level2Care";
import { Level3Care } from "./components/Level3Care";
import { CostSummary } from "./components/CostSummary";
<<<<<<< HEAD
=======
import { HeartHandshake, BarChart2, HelpingHand, CircleDollarSign } from 'lucide-react';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

export function CareRequirements() {
  const form = useFormContext();

  return (
<<<<<<< HEAD
    <div className="space-y-6">
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
    </div>
=======
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Care Requirements</h2>
      <p className="text-sm text-slate-600 mb-6">Assessment of care needs and associated costs</p>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document care requirements including:
          - Level 1: Basic care and supervision
          - Level 2: Moderate assistance needs
          - Level 3: Complex care requirements
          - Associated costs and frequency
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="level1" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger 
            value="level1"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" />
              <span>Level 1</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="level2"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Level 2</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="level3"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <HelpingHand className="h-4 w-4" />
              <span>Level 3</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="summary"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4" />
              <span>Cost Summary</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="level1">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <Level1Care form={form} />
          </div>
        </TabsContent>

        <TabsContent value="level2">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <Level2Care form={form} />
          </div>
        </TabsContent>

        <TabsContent value="level3">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <Level3Care form={form} />
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <CostSummary form={form} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
}
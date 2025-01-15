import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { MMTAssessment } from './MMTAssessment';

export function ManualMuscleTest() {
  const form = useFormContext();

  return (
    <Card className="border-2 border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Manual Muscle Testing</CardTitle>
            <CardDescription>Core muscle group strength assessment using MMT scale</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Assessment Guide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <MMTAssessment 
          control={form.control} 
          prefix="functionalAssessment.manualMuscle" 
        />
      </CardContent>
    </Card>
  );
}
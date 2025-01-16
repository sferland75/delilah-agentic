import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { 
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROMAssessment } from './ROMAssessment';

export function RangeOfMotion() {
  const form = useFormContext();

  return (
    <Card className="border-2 border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Range of Motion</CardTitle>
            <CardDescription>Assess joint mobility using percentage of normal range</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Assessment Guide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ROMAssessment 
          control={form.control} 
          prefix="functionalAssessment.rangeOfMotion" 
        />
      </CardContent>
    </Card>
  );
}
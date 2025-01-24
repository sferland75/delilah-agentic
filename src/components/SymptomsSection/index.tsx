import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyMap } from '../BodyMap';
import { CognitiveSymptoms } from './CognitiveSymptoms';
import { generalSymptoms } from './constants';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function SymptomsSection() {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptoms Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Symptoms</TabsTrigger>
            <TabsTrigger value="physical">Physical Symptoms</TabsTrigger>
            <TabsTrigger value="cognitive">Cognitive Symptoms</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generalSymptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={symptom.id} 
                    {...register(`symptoms.general.${symptom.id}`)}
                  />
                  <Label htmlFor={symptom.id}>{symptom.label}</Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="general_notes">Additional Notes</Label>
              <Textarea 
                id="general_notes"
                placeholder="Enter any additional symptoms or notes..."
                {...register('symptoms.general.notes')}
              />
            </div>
          </TabsContent>

          <TabsContent value="physical" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="w-full">
                <BodyMap />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="physical_notes">Physical Symptoms Notes</Label>
                  <Textarea 
                    id="physical_notes"
                    placeholder="Enter any additional physical symptoms or notes..."
                    className="min-h-[200px]"
                    {...register('symptoms.physical.notes')}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cognitive" className="mt-4">
            <CognitiveSymptoms />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
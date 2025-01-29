import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyMap } from '../BodyMap';
import { CognitiveSymptoms } from './CognitiveSymptoms';
import { EmotionalSymptoms } from './EmotionalSymptoms';
import { generalSymptoms } from './constants';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormControl } from '@/components/ui/form';

interface PhysicalSymptomsProps {
  bodyMapData: any;
}

const PhysicalSymptoms: React.FC<PhysicalSymptomsProps> = ({ bodyMapData }) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="w-full">
        <BodyMap 
          onUpdate={(painData) => {
            // Keep track of pain data updates
            console.log("Pain data updated:", painData);
          }}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={control}
            name="symptoms.physical.notes"
            render={({ field }) => (
              <FormItem>
                <Label>Physical Symptoms Notes</Label>
                <FormControl>
                  <Textarea 
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter any additional physical symptoms or notes..."
                    className="min-h-[200px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export function SymptomsSection() {
  const { control } = useFormContext();
  const formContext = useFormContext();
  const painData = formContext.watch('symptoms.pain') || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptoms Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="emotional">Emotional</TabsTrigger>
            <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generalSymptoms.map((symptom) => (
                <FormField
                  key={symptom.id}
                  control={control}
                  name={`symptoms.general.${symptom.id}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          id={symptom.id}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor={symptom.id}>{symptom.label}</Label>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="space-y-2">
              <FormField
                control={control}
                name="symptoms.general.notes"
                render={({ field }) => (
                  <FormItem>
                    <Label>Additional Notes</Label>
                    <FormControl>
                      <Textarea 
                        {...field}
                        value={field.value || ''}
                        placeholder="Enter any additional symptoms or notes..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="physical" className="mt-4">
            <PhysicalSymptoms bodyMapData={painData} />
          </TabsContent>

          <TabsContent value="emotional" className="mt-4">
            <EmotionalSymptoms />
          </TabsContent>

          <TabsContent value="cognitive" className="mt-4">
            <CognitiveSymptoms />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
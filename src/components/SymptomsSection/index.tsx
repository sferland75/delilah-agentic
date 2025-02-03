import React, { useEffect } from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyMap } from '../BodyMap';
import { CognitiveSymptoms } from './CognitiveSymptoms';
import { EmotionalSymptoms } from './EmotionalSymptoms';
import { PainFindingsTable } from './PainFindingsTable';
import { generalSymptoms } from './constants';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm as useDelilahForm } from '@/context/FormContext';

interface PhysicalSymptomsProps {
  bodyMapData: any;
}

const PhysicalSymptoms: React.FC<PhysicalSymptomsProps> = ({ bodyMapData }) => {
  const { control, watch } = useFormContext();
  const { updateFormData } = useDelilahForm();

  // Watch for physical symptom changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.startsWith('symptoms.physical')) {
        console.log('Physical symptoms updated:', value.symptoms?.physical);
        updateFormData({ symptoms: value.symptoms });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="w-full">
            <BodyMap 
              onUpdate={(painData) => {
                console.log("Pain data updated:", painData);
                updateFormData({
                  symptoms: {
                    ...watch('symptoms'),
                    pain: painData
                  }
                });
              }}
            />
          </div>

          <div className="space-y-4">
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

        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium text-slate-800">Pain Assessment Findings</h3>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          <PainFindingsTable />
        </div>
      </div>
    </div>
  );
};

export default function SymptomsSection() {
  const { control, watch } = useFormContext();
  const { updateFormData } = useDelilahForm();
  const painData = watch('symptoms.pain') || {};

  // Watch for general symptom changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.startsWith('symptoms.general')) {
        console.log('General symptoms updated:', value.symptoms?.general);
        updateFormData({ symptoms: value.symptoms });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

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
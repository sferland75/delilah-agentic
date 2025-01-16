import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Activity, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from "@/components/ui/card";
import { Assessment } from '@/lib/validation/assessment-schema';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const PAIN_TYPES = [
  "Aching",
  "Burning",
  "Sharp",
  "Stabbing",
  "Throbbing",
  "Tingling",
  "Numbness",
  "Stiffness",
  "Other"
] as const;

const FREQUENCY_LEVELS = [
  "Rarely",
  "Sometimes",
  "Often",
  "Most of the time",
  "Constantly"
] as const;

const SEVERITY_LEVELS = [
  "None",
  "Mild",
  "Moderate",
  "Severe",
  "Very Severe"
] as const;

const symptomGuidance = {
  location: "Specify exact location and distribution of symptoms",
  painType: "Select the most appropriate description of the sensation",
  severity: "Rate the intensity of the symptom",
  frequency: "Indicate how often the symptom occurs",
  aggravating: "Document factors that worsen the symptom",
  relieving: "Document factors that improve the symptom"
};

export function PhysicalSymptoms() {
  const { control } = useFormContext<Assessment>();
  
  const { 
    fields: physicalSymptoms, 
    append: appendPhysical, 
    remove: removePhysical 
  } = useFieldArray({
    control,
    name: "symptoms.physical"
  });

  return (
    <>
      {physicalSymptoms?.map((field, index) => (
        <AccordionItem key={field.id} value={`item-${index}`}>
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Physical Symptom {index + 1}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-6">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePhysical(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`symptoms.physical.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Lower back, right side" />
                        </FormControl>
                        <FormDescription>{symptomGuidance.location}</FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`symptoms.physical.${index}.painType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Pain/Discomfort</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pain type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PAIN_TYPES.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>{symptomGuidance.painType}</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`symptoms.physical.${index}.severity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              {SEVERITY_LEVELS.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>{symptomGuidance.severity}</FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`symptoms.physical.${index}.frequency`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {FREQUENCY_LEVELS.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>{symptomGuidance.frequency}</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <FormField
                  control={control}
                  name={`symptoms.physical.${index}.aggravating`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aggravating Factors</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="What makes the symptoms worse?"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>{symptomGuidance.aggravating}</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`symptoms.physical.${index}.relieving`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relieving Factors</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="What helps to reduce the symptoms?"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>{symptomGuidance.relieving}</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}

      <div className="p-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => appendPhysical({
            location: '',
            painType: PAIN_TYPES[0],
            severity: SEVERITY_LEVELS[0],
            frequency: FREQUENCY_LEVELS[0],
            aggravating: '',
            relieving: ''
          })}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Physical Symptom
        </Button>
      </div>
    </>
  );
}
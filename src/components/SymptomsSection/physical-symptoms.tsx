import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
<<<<<<< HEAD
import { PlusCircle, Trash2 } from 'lucide-react';
=======
import { Activity, PlusCircle, Trash2 } from 'lucide-react';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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
<<<<<<< HEAD
=======
import { Card, CardContent } from "@/components/ui/card";
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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
<<<<<<< HEAD
    <div className="space-y-4">
      {physicalSymptoms?.map((field, index) => (
        <AccordionItem 
          key={field.id} 
          value={`item-${index}`}
          className="border rounded-md"
        >
          <AccordionTrigger className="px-4 hover:bg-slate-50/50">
            <span className="text-sm text-muted-foreground font-bold">Symptom {index + 1}</span>
          </AccordionTrigger>
          
=======
    <>
      {physicalSymptoms?.map((field, index) => (
        <AccordionItem key={field.id} value={`item-${index}`}>
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Physical Symptom {index + 1}</span>
            </div>
          </AccordionTrigger>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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
<<<<<<< HEAD
                        <FormLabel className="text-xs text-muted-foreground font-bold">Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Lower back, right side" className="text-sm" />
                        </FormControl>
                        <FormDescription className="text-xs">{symptomGuidance.location}</FormDescription>
=======
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Lower back, right side" />
                        </FormControl>
                        <FormDescription>{symptomGuidance.location}</FormDescription>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`symptoms.physical.${index}.painType`}
                    render={({ field }) => (
                      <FormItem>
<<<<<<< HEAD
                        <FormLabel className="text-xs text-muted-foreground font-bold">Type of Pain/Discomfort</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="text-sm">
=======
                        <FormLabel>Type of Pain/Discomfort</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                              <SelectValue placeholder="Select pain type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PAIN_TYPES.map(type => (
<<<<<<< HEAD
                                <SelectItem key={type} value={type} className="text-sm">{type}</SelectItem>
=======
                                <SelectItem key={type} value={type}>{type}</SelectItem>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
<<<<<<< HEAD
                        <FormDescription className="text-xs">{symptomGuidance.painType}</FormDescription>
=======
                        <FormDescription>{symptomGuidance.painType}</FormDescription>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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
<<<<<<< HEAD
                        <FormLabel className="text-xs text-muted-foreground font-bold">Severity</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="text-sm">
=======
                        <FormLabel>Severity</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              {SEVERITY_LEVELS.map(level => (
<<<<<<< HEAD
                                <SelectItem key={level} value={level} className="text-sm">{level}</SelectItem>
=======
                                <SelectItem key={level} value={level}>{level}</SelectItem>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
<<<<<<< HEAD
                        <FormDescription className="text-xs">{symptomGuidance.severity}</FormDescription>
=======
                        <FormDescription>{symptomGuidance.severity}</FormDescription>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`symptoms.physical.${index}.frequency`}
                    render={({ field }) => (
                      <FormItem>
<<<<<<< HEAD
                        <FormLabel className="text-xs text-muted-foreground font-bold">Frequency</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="text-sm">
=======
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {FREQUENCY_LEVELS.map(level => (
<<<<<<< HEAD
                                <SelectItem key={level} value={level} className="text-sm">{level}</SelectItem>
=======
                                <SelectItem key={level} value={level}>{level}</SelectItem>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
<<<<<<< HEAD
                        <FormDescription className="text-xs">{symptomGuidance.frequency}</FormDescription>
=======
                        <FormDescription>{symptomGuidance.frequency}</FormDescription>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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
<<<<<<< HEAD
                      <FormLabel className="text-xs text-muted-foreground font-bold">Aggravating Factors</FormLabel>
=======
                      <FormLabel>Aggravating Factors</FormLabel>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="What makes the symptoms worse?"
<<<<<<< HEAD
                          className="min-h-[100px] resize-none text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">{symptomGuidance.aggravating}</FormDescription>
=======
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>{symptomGuidance.aggravating}</FormDescription>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`symptoms.physical.${index}.relieving`}
                  render={({ field }) => (
                    <FormItem>
<<<<<<< HEAD
                      <FormLabel className="text-xs text-muted-foreground font-bold">Relieving Factors</FormLabel>
=======
                      <FormLabel>Relieving Factors</FormLabel>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="What helps to reduce the symptoms?"
<<<<<<< HEAD
                          className="min-h-[100px] resize-none text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">{symptomGuidance.relieving}</FormDescription>
=======
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>{symptomGuidance.relieving}</FormDescription>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
}
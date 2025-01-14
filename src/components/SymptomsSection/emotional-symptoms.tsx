import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Heart, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Assessment } from '@/lib/validation/assessment-schema';

const SEVERITY_LEVELS = [
  "None",
  "Mild",
  "Moderate",
  "Severe",
  "Very Severe"
] as const;

const FREQUENCY_LEVELS = [
  "Rarely",
  "Sometimes",
  "Often",
  "Most of the time",
  "Constantly"
] as const;

const EMOTIONAL_TYPES = [
  "Anxiety",
  "Depression",
  "Irritability",
  "Mood Swings",
  "Stress",
  "Emotional Regulation",
  "Social Withdrawal",
  "Other"
] as const;

export function EmotionalSymptoms() {
  const { control } = useFormContext<Assessment>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "symptoms.emotional"
  });

  return (
    <>
      {fields?.map((field, index) => (
        <AccordionItem key={field.id} value={`item-${index}`}>
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Emotional Symptom {index + 1}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-6">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-6">
                <FormField
                  control={control}
                  name={`symptoms.emotional.${index}.symptom`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Emotional Symptom</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select symptom type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EMOTIONAL_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`symptoms.emotional.${index}.severity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SEVERITY_LEVELS.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`symptoms.emotional.${index}.frequency`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FREQUENCY_LEVELS.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`symptoms.emotional.${index}.impact`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Functional Impact</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe how this affects daily life and relationships..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`symptoms.emotional.${index}.management`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Management Strategies</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Current coping strategies and support systems..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
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
          onClick={() => append({
            symptom: EMOTIONAL_TYPES[0],
            severity: SEVERITY_LEVELS[1],
            frequency: FREQUENCY_LEVELS[1],
            impact: '',
            management: ''
          })}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Emotional Symptom
        </Button>
      </div>
    </>
  );
}
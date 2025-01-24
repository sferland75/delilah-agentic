import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Heart, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Assessment } from '@/lib/validation/assessment-schema';

const EMOTIONAL_CATEGORIES = [
  "Anxiety",
  "Depression",
  "Mood Changes",
  "Irritability",
  "Emotional Lability",
  "PTSD Symptoms",
  "Social Withdrawal",
  "Aggression",
  "Apathy",
  "Other"
] as const;

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

const emotionalGuidance = {
  category: "Select the type of emotional symptom",
  severity: "Rate the intensity of the emotional experience",
  frequency: "Indicate how often this occurs",
  description: "Describe how the symptom manifests",
  triggers: "Document what situations or factors trigger or worsen the symptom",
  impact: "Note how this affects daily life and relationships"
};

export function EmotionalSymptoms() {
  const { control } = useFormContext<Assessment>();
  
  const { 
    fields: emotionalSymptoms,
    append: appendEmotional,
    remove: removeEmotional
  } = useFieldArray({
    control,
    name: "symptoms.emotional"
  });

  return (
    <div className="space-y-6 p-4">
      {emotionalSymptoms?.map((field, index) => (
        <Card key={field.id}>
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold">Emotional Symptom {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeEmotional(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`symptoms.emotional.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptom Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {EMOTIONAL_CATEGORIES.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>{emotionalGuidance.category}</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`symptoms.emotional.${index}.severity`}
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
                      <FormDescription>{emotionalGuidance.severity}</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`symptoms.emotional.${index}.frequency`}
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
                      <FormDescription>{emotionalGuidance.frequency}</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={control}
                name={`symptoms.emotional.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe the emotional symptoms in detail..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>{emotionalGuidance.description}</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`symptoms.emotional.${index}.triggers`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Triggers & Contributing Factors</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="What triggers or worsens these symptoms?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>{emotionalGuidance.triggers}</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`symptoms.emotional.${index}.impact`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact on Function</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="How do these symptoms affect daily activities and relationships?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>{emotionalGuidance.impact}</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => appendEmotional({
            category: EMOTIONAL_CATEGORIES[0],
            severity: SEVERITY_LEVELS[0],
            frequency: FREQUENCY_LEVELS[0],
            description: '',
            triggers: '',
            impact: ''
          })}
          className="w-full max-w-md"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Emotional Symptom
        </Button>
      </div>
    </div>
  );
}
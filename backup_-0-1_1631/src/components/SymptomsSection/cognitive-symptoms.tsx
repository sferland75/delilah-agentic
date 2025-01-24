import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Brain, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

const COGNITIVE_DOMAINS = [
  "Attention",
  "Concentration",
  "Memory",
  "Processing Speed",
  "Executive Function",
  "Language",
  "Learning",
  "Problem Solving",
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

const cognitiveGuidance = {
  domain: "Select the cognitive function affected",
  description: "Describe the specific difficulties or changes observed",
  severity: "Rate the impact on daily function",
  frequency: "Indicate how often the symptom occurs",
  impact: "Document how this affects daily activities",
  strategies: "Note any compensatory strategies used"
};

export function CognitiveSymptoms() {
  const { control } = useFormContext<Assessment>();
  
  const { 
    fields: cognitiveSymptoms, 
    append: appendCognitive, 
    remove: removeCognitive 
  } = useFieldArray({
    control,
    name: "symptoms.cognitive"
  });

  return (
    <div className="space-y-6 p-4">
      {cognitiveSymptoms?.map((field, index) => (
        <Card key={field.id}>
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold">Cognitive Symptom {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCognitive(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`symptoms.cognitive.${index}.domain`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cognitive Domain</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                          <SelectContent>
                            {COGNITIVE_DOMAINS.map(domain => (
                              <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>{cognitiveGuidance.domain}</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`symptoms.cognitive.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Difficulty maintaining focus on tasks" />
                      </FormControl>
                      <FormDescription>{cognitiveGuidance.description}</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`symptoms.cognitive.${index}.severity`}
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
                      <FormDescription>{cognitiveGuidance.severity}</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`symptoms.cognitive.${index}.frequency`}
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
                      <FormDescription>{cognitiveGuidance.frequency}</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={control}
                name={`symptoms.cognitive.${index}.impact`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Functional Impact</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="How does this affect daily activities and function?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>{cognitiveGuidance.impact}</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`symptoms.cognitive.${index}.strategies`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compensatory Strategies</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="What strategies are used to manage these difficulties?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>{cognitiveGuidance.strategies}</FormDescription>
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
          onClick={() => appendCognitive({
            domain: COGNITIVE_DOMAINS[0],
            description: '',
            severity: SEVERITY_LEVELS[0],
            frequency: FREQUENCY_LEVELS[0],
            impact: '',
            strategies: ''
          })}
          className="w-full max-w-md"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Cognitive Symptom
        </Button>
      </div>
    </div>
  );
}
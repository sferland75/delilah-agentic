import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PlusCircle, Trash2, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const PROVIDER_TYPES = [
  { value: "gp", label: "General Practitioner" },
  { value: "ot", label: "Occupational Therapist" },
  { value: "pt", label: "Physiotherapist" },
  { value: "psych", label: "Psychologist" },
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "chiro", label: "Chiropractor" },
  { value: "neuro", label: "Neurologist" },
  { value: "ortho", label: "Orthopedic Specialist" },
  { value: "pain", label: "Pain Specialist" },
  { value: "rheum", label: "Rheumatologist" },
  { value: "other", label: "Other Specialist" }
] as const;

const FREQUENCY_OPTIONS = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "As needed",
  "One-time consultation",
  "Other"
] as const;

export function CurrentTreatment() {
  const { control } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicalHistory.currentTreatment"
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Current Treatment Providers</h3>
        <p className="text-sm text-slate-600 mb-4">Document all healthcare providers and treatment details</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {fields.map((field, index) => (
          <AccordionItem key={field.id} value={`item-${index}`}>
            <AccordionTrigger className="px-4">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span>Provider {index + 1}: {field.providerType}</span>
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`medicalHistory.currentTreatment.${index}.providerType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Provider Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select provider type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROVIDER_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`medicalHistory.currentTreatment.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Provider Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter provider name" className="bg-white" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`medicalHistory.currentTreatment.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="bg-white" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`medicalHistory.currentTreatment.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Frequency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FREQUENCY_OPTIONS.map((freq) => (
                                <SelectItem key={freq} value={freq}>
                                  {freq}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name={`medicalHistory.currentTreatment.${index}.focus`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Treatment Focus</FormLabel>
                        <FormDescription className="text-slate-600">
                          Main symptoms or conditions being treated
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe the focus of treatment..."
                            className="min-h-[100px] bg-white"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`medicalHistory.currentTreatment.${index}.progress`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Progress Notes</FormLabel>
                        <FormDescription className="text-slate-600">
                          Treatment progress and response
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Document treatment progress and outcomes..."
                            className="min-h-[100px] bg-white"
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
      </Accordion>

      <div className="p-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({
            providerType: "",
            name: "",
            startDate: "",
            frequency: "",
            focus: "",
            progress: ""
          })}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Treatment Provider
        </Button>
      </div>
    </div>
  );
}
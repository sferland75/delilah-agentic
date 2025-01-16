import React from 'react';
import { Control, useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MOBILITY_CATEGORIES, INDEPENDENCE_LEVELS } from './mobility-values';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

interface MobilityAssessmentProps {
  control: Control<any>;
  prefix: string;
}

export function MobilityAssessment({ control, prefix }: MobilityAssessmentProps) {
  const { setValue } = useFormContext();
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [modifiedSections, setModifiedSections] = React.useState<string[]>([]);

  const toggleSection = (category: string) => {
    setOpenSections(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Set initial values to independent
  React.useEffect(() => {
    MOBILITY_CATEGORIES.forEach((category) => {
      category.tasks.forEach((task) => {
        setValue(`${prefix}.${category.category}.${task.name}.level`, "Independent", { shouldDirty: false });
        setValue(`${prefix}.${category.category}.${task.name}.observations`, task.defaultObservation, { shouldDirty: false });
      });
    });
  }, [setValue, prefix]);

  return (
    <Card className="border-2 border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle>Mobility & Transfers</CardTitle>
        <CardDescription>Assess functional mobility, transfers, and ambulation</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {MOBILITY_CATEGORIES.map((category) => (
            <Collapsible 
              key={category.category} 
              open={openSections.includes(category.category)}
              className="bg-white rounded-lg border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between w-full p-4 hover:bg-slate-50">
                <CollapsibleTrigger 
                  className="flex items-center gap-3"
                  onClick={() => toggleSection(category.category)}
                >
                  {openSections.includes(category.category) ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                  <h3 className="text-lg font-medium text-slate-800">{category.category}</h3>
                  {modifiedSections.includes(category.category) && (
                    <Badge variant="secondary">Modified</Badge>
                  )}
                </CollapsibleTrigger>
                
                <FormField
                  control={control}
                  name={`${prefix}.${category.category}.isAffected`}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            setOpenSections(prev => [...prev, category.category]);
                            setModifiedSections(prev => [...prev, category.category]);
                          }
                        }}
                      />
                      <span className="text-sm text-slate-600">Area Requires Assessment</span>
                    </div>
                  )}
                />
              </div>

              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-6">
                  {category.tasks.map((task) => (
                    <div key={task.name} className="space-y-4">
                      <div className="font-medium text-slate-800">{task.name}</div>

                      <FormField
                        control={control}
                        name={`${prefix}.${category.category}.${task.name}.level`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">Independence Level</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  if (value !== "Independent") {
                                    setModifiedSections(prev => 
                                      prev.includes(category.category) ? prev : [...prev, category.category]
                                    );
                                  }
                                }}
                                defaultValue="Independent"
                                value={field.value}
                                className="flex flex-col space-y-1"
                              >
                                {INDEPENDENCE_LEVELS.map((level) => (
                                  <div key={level.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={level.value} id={`${task.name}-${level.value}`} />
                                    <Label htmlFor={`${task.name}-${level.value}`} className="flex flex-col">
                                      <span>{level.label}</span>
                                      <span className="text-sm text-slate-500">{level.description}</span>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`${prefix}.${category.category}.${task.name}.observations`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">Observations</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="min-h-[80px]"
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (e.target.value !== task.defaultObservation) {
                                    setModifiedSections(prev => 
                                      prev.includes(category.category) ? prev : [...prev, category.category]
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* General Notes - Only shown if any sections are modified */}
          {modifiedSections.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
              <FormField
                control={control}
                name={`${prefix}.generalNotes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>General Assessment Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter overall observations about mobility and transfer patterns..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
<<<<<<< HEAD
=======
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
import { CORE_MUSCLE_GROUPS, MMT_GRADES } from './muscle-groups';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Info, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

interface MMTAssessmentProps {
  control: Control<any>;
  prefix: string;
}

export function MMTAssessment({ control, prefix }: MMTAssessmentProps) {
  const { setValue } = useFormContext();
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [modifiedSections, setModifiedSections] = React.useState<string[]>([]);

  const toggleSection = (region: string) => {
    setOpenSections(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  // Set initial values to normal (Grade 5)
  React.useEffect(() => {
    CORE_MUSCLE_GROUPS.forEach((section) => {
      section.groups.forEach((group) => {
        setValue(`${prefix}.${section.region}.${group.name}.left`, "5", { shouldDirty: false });
        setValue(`${prefix}.${section.region}.${group.name}.right`, "5", { shouldDirty: false });
      });
    });
  }, [setValue, prefix]);

  return (
    <div className="space-y-6">
      {CORE_MUSCLE_GROUPS.map((section) => (
        <Collapsible 
          key={section.region} 
          open={openSections.includes(section.region)}
          className="bg-white rounded-lg border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between w-full p-4 hover:bg-slate-50">
            <CollapsibleTrigger 
              className="flex items-center gap-3"
              onClick={() => toggleSection(section.region)}
            >
              {openSections.includes(section.region) ? 
                <ChevronDown className="h-5 w-5" /> : 
                <ChevronRight className="h-5 w-5" />
              }
              <h3 className="text-lg font-medium text-slate-800">{section.region}</h3>
              {modifiedSections.includes(section.region) && (
                <Badge variant="secondary">Modified</Badge>
              )}
            </CollapsibleTrigger>
            <FormField
              control={control}
              name={`${prefix}.${section.region}.isAffected`}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        setOpenSections(prev => [...prev, section.region]);
                        setModifiedSections(prev => [...prev, section.region]);
                      }
                    }}
                  />
                  <span className="text-sm text-slate-600">Area Affected</span>
                </div>
              )}
            />
          </div>

          <CollapsibleContent>
            <div className="p-4 pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Muscle Group</TableHead>
                    <TableHead className="w-[200px]">Left</TableHead>
                    <TableHead className="w-[200px]">Right</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.groups.map((group) => (
                    <TableRow key={group.name}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-slate-500">{group.description}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <FormField
                          control={control}
                          name={`${prefix}.${section.region}.${group.name}.left`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    if (value !== "5") {
                                      setModifiedSections(prev => 
                                        prev.includes(section.region) ? prev : [...prev, section.region]
                                      );
                                    }
                                  }}
                                  defaultValue="5"
                                  value={field.value}
                                >
                                  {MMT_GRADES.map((grade) => (
                                    <div key={grade.value} className="flex items-center space-x-2">
                                      <RadioGroupItem 
                                        value={grade.value.toString()} 
                                        id={`${group.name}-left-${grade.value}`} 
                                      />
                                      <Label htmlFor={`${group.name}-left-${grade.value}`}>
                                        {grade.label}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          control={control}
                          name={`${prefix}.${section.region}.${group.name}.right`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    if (value !== "5") {
                                      setModifiedSections(prev => 
                                        prev.includes(section.region) ? prev : [...prev, section.region]
                                      );
                                    }
                                  }}
                                  defaultValue="5"
                                  value={field.value}
                                >
                                  {MMT_GRADES.map((grade) => (
                                    <div key={grade.value} className="flex items-center space-x-2">
                                      <RadioGroupItem 
                                        value={grade.value.toString()} 
                                        id={`${group.name}-right-${grade.value}`} 
                                      />
                                      <Label htmlFor={`${group.name}-right-${grade.value}`}>
                                        {grade.label}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          control={control}
                          name={`${prefix}.${section.region}.${group.name}.notes`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Note any pain, compensations, or other observations..."
                                  className="min-h-[80px]"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (e.target.value) {
                                      setModifiedSections(prev => 
                                        prev.includes(section.region) ? prev : [...prev, section.region]
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

<<<<<<< HEAD
=======
      {/* General Notes - Only shown if any sections are modified */}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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
                    placeholder="Enter overall observations, patterns, and functional implications..."
                    className="min-h-[100px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}

<<<<<<< HEAD
=======
      {/* MMT Scale Reference - Collapsed by default */}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
      <Collapsible className="bg-slate-50 rounded-lg border border-slate-200">
        <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 hover:bg-slate-100">
          <Info className="h-4 w-4 text-slate-600" />
          <h4 className="font-medium text-slate-800">MMT Grade Reference</h4>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-4">
            {MMT_GRADES.map((grade) => (
              <div key={grade.value} className="flex items-start gap-2">
                <Badge variant="outline">{grade.value}</Badge>
                <div className="text-sm">
                  <div className="font-medium">{grade.label}</div>
                  <div className="text-slate-600">{grade.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MUSCLE_GROUPS, GRADES } from './muscle-groups';
import { DEFAULT_MMT_VALUES } from './default-values';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ManualMuscleTest() {
  const { control, register, setValue, getValues } = useFormContext();

  useEffect(() => {
    const currentValues = getValues('functionalAssessment.manualMuscleTesting');
    if (!currentValues) {
      // Set individual values for each muscle movement
      MUSCLE_GROUPS.upper.concat(MUSCLE_GROUPS.lower, MUSCLE_GROUPS.core).forEach(group => {
        group.muscles.forEach(muscle => {
          muscle.movements.forEach(movement => {
            // Set the entire test object at once
            setValue(
              `functionalAssessment.manualMuscleTesting.grades.${group.region}.${muscle.name}.${movement}`,
              {
                left: 5,  // Normal strength
                right: 5, // Normal strength
                leftPain: false,
                rightPain: false,
                notes: 'No identified limitations.'
              },
              { shouldDirty: false }
            );
          });
        });
      });
      
      setValue(
        'functionalAssessment.manualMuscleTesting.generalNotes',
        '',
        { shouldDirty: false }
      );
    }
  }, [setValue, getValues]);

  const renderMuscleGroup = (region: string, muscles: any[]) => (
    <div key={region} className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">{region}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Muscle/Group</TableHead>
            <TableHead className="w-[120px]">Movement</TableHead>
            <TableHead className="w-[100px]">Left Grade</TableHead>
            <TableHead className="w-[40px]">Pain</TableHead>
            <TableHead className="w-[100px]">Right Grade</TableHead>
            <TableHead className="w-[40px]">Pain</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {muscles.map(muscle => (
            muscle.movements.map((movement, moveIdx) => (
              <TableRow key={`${muscle.name}-${movement}-${moveIdx}`}>
                {moveIdx === 0 && (
                  <TableCell rowSpan={muscle.movements.length} className="font-medium">
                    {muscle.name}
                  </TableCell>
                )}
                <TableCell>{movement}</TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`functionalAssessment.manualMuscleTesting.grades.${region}.${muscle.name}.${movement}.left`}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value?.toString()}
                        defaultValue="5"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map(grade => (
                            <SelectItem key={grade.value} value={grade.value.toString()}>
                              {grade.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`functionalAssessment.manualMuscleTesting.grades.${region}.${muscle.name}.${movement}.leftPain`}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        defaultChecked={false}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`functionalAssessment.manualMuscleTesting.grades.${region}.${muscle.name}.${movement}.right`}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value?.toString()}
                        defaultValue="5"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map(grade => (
                            <SelectItem key={grade.value} value={grade.value.toString()}>
                              {grade.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`functionalAssessment.manualMuscleTesting.grades.${region}.${muscle.name}.${movement}.rightPain`}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        defaultChecked={false}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`functionalAssessment.manualMuscleTesting.grades.${region}.${muscle.name}.${movement}.notes`}
                    render={({ field }) => (
                      <Textarea 
                        {...field} 
                        placeholder="Enter any observations..."
                        defaultValue="No identified limitations."
                      />
                    )}
                  />
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-2 border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Manual Muscle Testing</CardTitle>
              <CardDescription>Assess muscle strength and function</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Assessment Guide
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="upper">
            <TabsList>
              <TabsTrigger value="upper">Upper Extremity</TabsTrigger>
              <TabsTrigger value="lower">Lower Extremity</TabsTrigger>
              <TabsTrigger value="core">Core/Trunk</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="upper" className="space-y-8">
                {MUSCLE_GROUPS.upper.map(group => renderMuscleGroup(group.region, group.muscles))}
              </TabsContent>

              <TabsContent value="lower" className="space-y-8">
                {MUSCLE_GROUPS.lower.map(group => renderMuscleGroup(group.region, group.muscles))}
              </TabsContent>

              <TabsContent value="core" className="space-y-8">
                {MUSCLE_GROUPS.core.map(group => renderMuscleGroup(group.region, group.muscles))}
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-6">
            <FormField
              control={control}
              name="functionalAssessment.manualMuscleTesting.generalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Assessment Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter overall assessment observations and findings..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Document overall patterns, asymmetries, and functional implications
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
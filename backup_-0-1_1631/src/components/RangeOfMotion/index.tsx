import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_ROM_VALUES, type ROMValue } from './rom-values';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export function RangeOfMotion() {
  const form = useFormContext();
  const { register, setValue, getValues, watch } = form;

  // Add debug logging
  console.log('Form Context:', form);
  console.log('Current Values:', getValues('functionalAssessment.rangeOfMotion'));
  
  // Watch values for debugging
  const watchedValues = watch('functionalAssessment.rangeOfMotion');
  console.log('Watched Values:', watchedValues);

  React.useEffect(() => {
    console.log('Setting initial ROM values...');
    DEFAULT_ROM_VALUES.forEach((rom, index) => {
      console.log(`Setting values for ${rom.joint} ${rom.movement}`);
      
      // Create the complete measurement object first
      const measurementValue = {
        joint: rom.joint,
        movement: rom.movement,
        normalROM: rom.normalROM,
        left: {
          active: rom.left.active,
          passive: rom.left.passive
        },
        right: {
          active: rom.right.active,
          passive: rom.right.passive
        },
        painLeft: rom.painLeft,
        painRight: rom.painRight,
        notes: rom.notes
      };

      // Set the entire measurement object at once
      setValue(
        `functionalAssessment.rangeOfMotion.measurements.${index}`,
        measurementValue,
        { shouldValidate: true, shouldDirty: true }
      );

      console.log('Values after setting:', getValues('functionalAssessment.rangeOfMotion'));
    });
  }, [setValue, getValues]);

  return (
    <Card className="border-2 border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Range of Motion</CardTitle>
            <CardDescription>Assess joint mobility and movement restrictions</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Assessment Guide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>Joint/Movement</TableHead>
              <TableHead rowSpan={2}>Normal ROM</TableHead>
              <TableHead colSpan={3} className="text-center">Left</TableHead>
              <TableHead colSpan={3} className="text-center">Right</TableHead>
              <TableHead rowSpan={2}>Notes</TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Active</TableHead>
              <TableHead>Passive</TableHead>
              <TableHead>Pain</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Passive</TableHead>
              <TableHead>Pain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEFAULT_ROM_VALUES.map((rom, index) => {
              const watchedMeasurement = watch(`functionalAssessment.rangeOfMotion.measurements.${index}`);
              console.log(`Watched measurement ${index}:`, watchedMeasurement);
              
              return (
                <TableRow key={`${rom.joint}-${rom.movement}`}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{rom.joint}</div>
                      <div className="text-sm text-muted-foreground">{rom.movement}</div>
                    </div>
                  </TableCell>
                  <TableCell>{rom.normalROM}</TableCell>
                  <TableCell>
                    <Input
                      defaultValue={rom.left.active}
                      {...register(`functionalAssessment.rangeOfMotion.measurements.${index}.left.active`)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={rom.left.passive}
                      {...register(`functionalAssessment.rangeOfMotion.measurements.${index}.left.passive`)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      defaultChecked={rom.painLeft}
                      {...register(`functionalAssessment.rangeOfMotion.measurements.${index}.painLeft`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={rom.right.active}
                      {...register(`functionalAssessment.rangeOfMotion.measurements.${index}.right.active`)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={rom.right.passive}
                      {...register(`functionalAssessment.rangeOfMotion.measurements.${index}.right.passive`)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      defaultChecked={rom.painRight}
                      {...register(`functionalAssessment.rangeOfMotion.measurements.${index}.painRight`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      defaultValue={rom.notes}
                      {...register(`functionalAssessment.rangeOfMotion.measurements.${index}.notes`)}
                      placeholder="Enter observations..."
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-6">
          <div className="space-y-4">
            <div className="font-medium">General Assessment Notes</div>
            <Textarea
              {...register('functionalAssessment.rangeOfMotion.generalNotes')}
              placeholder="Enter overall ROM assessment observations and findings..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
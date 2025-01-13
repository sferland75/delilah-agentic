import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MMT_VALUES } from './mmt-values';

const MMT_GRADES = [
  { value: '0', label: '0 - No contraction' },
  { value: '1', label: '1 - Trace contraction' },
  { value: '2-', label: '2- - Partial movement in horizontal plane' },
  { value: '2', label: '2 - Full movement in horizontal plane' },
  { value: '2+', label: '2+ - Slight anti-gravity movement' },
  { value: '3-', label: '3- - Anti-gravity but < 50% range' },
  { value: '3', label: '3 - Anti-gravity through 50% range' },
  { value: '3+', label: '3+ - Anti-gravity > 50% range' },
  { value: '4-', label: '4- - Anti-gravity, full range, slight resistance' },
  { value: '4', label: '4 - Anti-gravity, full range, moderate resistance' },
  { value: '4+', label: '4+ - Anti-gravity, full range, strong resistance' },
  { value: '5', label: '5 - Normal strength' }
];

export function ManualMuscleTest() {
  const { register } = useFormContext();

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-lg font-semibold">Manual Muscle Testing</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Muscle Group</TableHead>
                <TableHead className="text-center">Left</TableHead>
                <TableHead className="text-center">Right</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MMT_VALUES.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.muscleGroup}</TableCell>
                  <TableCell>
                    <Select {...register(`functionalAssessment.manualMuscleTesting.grades.${index}.left`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {MMT_GRADES.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select {...register(`functionalAssessment.manualMuscleTesting.grades.${index}.right`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {MMT_GRADES.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      {...register(`functionalAssessment.manualMuscleTesting.grades.${index}.notes`)}
                      placeholder="Additional notes..."
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
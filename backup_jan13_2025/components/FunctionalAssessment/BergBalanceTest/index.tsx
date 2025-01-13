import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BERG_TEST_ITEMS } from './berg-values';

const BERG_SCORES = [
  { value: '0', label: '0 - Cannot perform' },
  { value: '1', label: '1 - Significant assistance needed' },
  { value: '2', label: '2 - Moderate assistance needed' },
  { value: '3', label: '3 - Minimal assistance needed' },
  { value: '4', label: '4 - Independent' }
];

export function BergBalanceTest() {
  const { register } = useFormContext();

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-lg font-semibold">Berg Balance Scale</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BERG_TEST_ITEMS.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{item.task}</div>
                    <div className="text-sm text-slate-600">{item.instructions}</div>
                  </TableCell>
                  <TableCell>
                    <Select {...register(`functionalAssessment.bergBalanceTest.items.${index}.score`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Score" />
                      </SelectTrigger>
                      <SelectContent>
                        {BERG_SCORES.map((score) => (
                          <SelectItem key={score.value} value={score.value}>{score.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      {...register(`functionalAssessment.bergBalanceTest.items.${index}.notes`)}
                      placeholder="Observations and notes..."
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="font-medium mb-2">Total Score</h3>
          <Input 
            {...register('functionalAssessment.bergBalanceTest.totalScore')}
            type="number"
            className="w-24"
          />
          <p className="text-sm text-slate-600 mt-1">
            0-20 High fall risk / Wheelchair bound<br />
            21-40 Walking with assistance<br />
            41-56 Independent
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
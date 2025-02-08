import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const preAccidentStatus = [
  "Performed 100% by Client",
  "Shared with Others",
  "Not Responsible for Task"
];

const taskCategories = {
  "Routine Cleaning": [
    "Kitchen cleaning",
    "Bathroom cleaning",
    "Vacuuming/sweeping",
    "Dusting/surfaces",
    "Laundry",
    "Making beds",
    "Garbage/recycling"
  ],
  "Deep Cleaning": [
    "Window cleaning",
    "Carpet deep cleaning",
    "Closet organization",
    "Seasonal cleaning",
    "Appliance deep cleaning"
  ],
  "Outdoor Maintenance": [
    "Lawn care",
    "Snow removal",
    "Garden maintenance",
    "Exterior cleaning"
  ],
  "Indoor Maintenance": [
    "Basic repairs",
    "Filter changes",
    "Painting/touch-ups",
    "Basic plumbing",
    "Basic electrical"
  ]
};

export function ReplacementCalculator() {
  const { watch, setValue } = useFormContext();
  const replacementData = watch('housekeeping.replacementHours') || {};

  React.useEffect(() => {
    if (!replacementData || Object.keys(replacementData).length === 0) {
      const initialData = Object.entries(taskCategories).reduce((acc, [category, tasks]) => {
        tasks.forEach(task => {
          acc[`${category}-${task}`] = {
            preAccidentStatus: '',
            hoursPerWeek: '',
            replacementNeeded: '',
            annualCost: ''
          };
        });
        return acc;
      }, {});
      setValue('housekeeping.replacementHours', initialData);
    }
  }, []);

  const updateField = (taskId: string, field: string, value: string) => {
    setValue(`housekeeping.replacementHours.${taskId}`, {
      ...replacementData[taskId],
      [field]: value
    });
  };

  // Calculate total hours and costs
  const calculateTotals = () => {
    return Object.values(replacementData).reduce((acc: any, task: any) => {
      const hours = parseFloat(task.hoursPerWeek) || 0;
      const cost = parseFloat(task.annualCost) || 0;
      return {
        weeklyHours: acc.weeklyHours + hours,
        annualCost: acc.annualCost + cost
      };
    }, { weeklyHours: 0, annualCost: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {Object.entries(taskCategories).map(([category, tasks]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold">{category}</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Task</TableHead>
                  <TableHead className="w-[200px]">Pre-Accident Status</TableHead>
                  <TableHead className="w-[150px]">Hours/Week</TableHead>
                  <TableHead className="w-[150px]">Annual Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const taskId = `${category}-${task}`;
                  return (
                    <TableRow key={taskId}>
                      <TableCell className="font-medium">{task}</TableCell>
                      <TableCell>
                        <Select
                          value={replacementData[taskId]?.preAccidentStatus || ''}
                          onValueChange={(value) => updateField(taskId, 'preAccidentStatus', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {preAccidentStatus.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={replacementData[taskId]?.hoursPerWeek || ''}
                          onChange={(e) => updateField(taskId, 'hoursPerWeek', e.target.value)}
                          className="w-24"
                          placeholder="Hours"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={replacementData[taskId]?.annualCost || ''}
                          onChange={(e) => updateField(taskId, 'annualCost', e.target.value)}
                          className="w-24"
                          placeholder="$ /year"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Summary of Replacement Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Hours per Week</p>
              <p className="text-2xl font-bold">{totals.weeklyHours.toFixed(1)} hours</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Annual Cost</p>
              <p className="text-2xl font-bold">${totals.annualCost.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
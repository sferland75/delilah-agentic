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
import { Textarea } from "@/components/ui/textarea";

const housekeepingTasks = [
  "Vacuuming/Sweeping",
  "Mopping",
  "Dusting",
  "Making Beds",
  "Changing Bed Linens",
  "Laundry - Sorting",
  "Laundry - Washing/Drying",
  "Laundry - Folding/Putting Away",
  "Cleaning Bathroom - Sink/Counter",
  "Cleaning Bathroom - Toilet",
  "Cleaning Bathroom - Tub/Shower",
  "Kitchen - Wiping Counters",
  "Kitchen - Cleaning Stove/Appliances",
  "Kitchen - Cleaning Floor",
  "Window Cleaning",
  "Organizing/Tidying",
  "Garbage/Recycling Management",
  "Outdoor Sweeping",
  "Seasonal Cleaning Tasks"
];

const preAccidentOptions = [
  "Independent",
  "Independent with Modifications",
  "Partially Independent",
  "Unable to Perform"
];

const postAccidentOptions = [
  "No Involvement Required",
  "Verbal Cuing/Direction Only",
  "Minimal Physical Assistance",
  "Moderate Physical Assistance",
  "Maximum Physical Assistance",
  "Unable - Full Assistance Required"
];

export function HousekeepingAssessment() {
  const { register, watch, setValue } = useFormContext();
  const housekeeping = watch('adl.housekeeping') || {};

  // Initialize housekeeping data if empty
  React.useEffect(() => {
    if (!housekeeping || Object.keys(housekeeping).length === 0) {
      const initialData = housekeepingTasks.reduce((acc, task) => {
        acc[task] = {
          preAccident: '',
          postAccident: '',
          clinicalJustification: ''
        };
        return acc;
      }, {});
      setValue('adl.housekeeping', initialData);
    }
  }, []);

  const updateField = (task: string, field: string, value: string) => {
    setValue(`adl.housekeeping.${task}`, {
      ...housekeeping[task],
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Task</TableHead>
              <TableHead className="min-w-[200px]">Pre-Accident Ability</TableHead>
              <TableHead className="min-w-[200px]">Post-Accident Involvement</TableHead>
              <TableHead className="min-w-[300px]">Clinical Justification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {housekeepingTasks.map((task) => (
              <TableRow key={task}>
                <TableCell className="font-medium">{task}</TableCell>
                <TableCell>
                  <Select
                    value={housekeeping[task]?.preAccident || ''}
                    onValueChange={(value) => updateField(task, 'preAccident', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {preAccidentOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={housekeeping[task]?.postAccident || ''}
                    onValueChange={(value) => updateField(task, 'postAccident', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select involvement" />
                    </SelectTrigger>
                    <SelectContent>
                      {postAccidentOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    value={housekeeping[task]?.clinicalJustification || ''}
                    onChange={(e) => updateField(task, 'clinicalJustification', e.target.value)}
                    placeholder="Enter clinical justification..."
                    className="min-h-[60px]"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
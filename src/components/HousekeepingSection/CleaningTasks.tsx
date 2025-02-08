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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const cleaningTasks = {
  kitchen: [
    "Clean countertops and backsplash",
    "Clean stovetop and oven",
    "Clean microwave interior/exterior",
    "Clean refrigerator interior/exterior",
    "Clean sink and faucets",
    "Sweep/mop floors",
    "Clean small appliances",
    "Clean/organize cabinets",
    "Take out garbage/recycling"
  ],
  bathroom: [
    "Clean toilet",
    "Clean shower/tub",
    "Clean sink and counters",
    "Clean mirrors",
    "Sweep/mop floors",
    "Clean cabinets",
    "Replace towels/supplies"
  ],
  bedroom: [
    "Make bed",
    "Change bed linens",
    "Dust furniture",
    "Vacuum carpet/floors",
    "Clean mirrors",
    "Organize closet/drawers"
  ],
  livingAreas: [
    "Dust furniture/surfaces",
    "Vacuum carpets/rugs",
    "Sweep/mop hard floors",
    "Clean windows/mirrors",
    "Organize common areas",
    "Clean light fixtures",
    "Clean door handles/switches"
  ],
  laundry: [
    "Sort laundry",
    "Wash/dry clothes",
    "Fold laundry",
    "Iron clothes",
    "Put away laundry",
    "Clean washer/dryer"
  ]
};

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

const frequencies = [
  "Daily",
  "2-3 Times per Week",
  "Weekly",
  "Bi-Weekly",
  "Monthly",
  "As Needed"
];

export function CleaningTasks() {
  const { register, watch, setValue } = useFormContext();
  const cleaningData = watch('housekeeping.cleaning') || {};

  // Initialize cleaning data if empty
  React.useEffect(() => {
    if (!cleaningData || Object.keys(cleaningData).length === 0) {
      const initialData = Object.entries(cleaningTasks).reduce((acc, [area, tasks]) => {
        tasks.forEach(task => {
          acc[`${area}-${task}`] = {
            preAccident: '',
            postAccident: '',
            frequency: '',
            timeRequired: '',
            clinicalJustification: ''
          };
        });
        return acc;
      }, {});
      setValue('housekeeping.cleaning', initialData);
    }
  }, []);

  const updateField = (taskId: string, field: string, value: string) => {
    setValue(`housekeeping.cleaning.${taskId}`, {
      ...cleaningData[taskId],
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(cleaningTasks).map(([area, tasks]) => (
        <div key={area} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{area.replace(/([A-Z])/g, ' $1').trim()}</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Task</TableHead>
                  <TableHead className="w-[160px]">Pre-Accident</TableHead>
                  <TableHead className="w-[160px]">Post-Accident</TableHead>
                  <TableHead className="w-[140px]">Frequency</TableHead>
                  <TableHead className="w-[100px]">Time (mins)</TableHead>
                  <TableHead>Clinical Justification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const taskId = `${area}-${task}`;
                  return (
                    <TableRow key={taskId}>
                      <TableCell className="font-medium">{task}</TableCell>
                      <TableCell>
                        <Select
                          value={cleaningData[taskId]?.preAccident || ''}
                          onValueChange={(value) => updateField(taskId, 'preAccident', value)}
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
                          value={cleaningData[taskId]?.postAccident || ''}
                          onValueChange={(value) => updateField(taskId, 'postAccident', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
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
                        <Select
                          value={cleaningData[taskId]?.frequency || ''}
                          onValueChange={(value) => updateField(taskId, 'frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencies.map((freq) => (
                              <SelectItem key={freq} value={freq}>
                                {freq}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={cleaningData[taskId]?.timeRequired || ''}
                          onChange={(e) => updateField(taskId, 'timeRequired', e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={cleaningData[taskId]?.clinicalJustification || ''}
                          onChange={(e) => updateField(taskId, 'clinicalJustification', e.target.value)}
                          placeholder="Enter clinical justification..."
                          className="min-h-[60px]"
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
    </div>
  );
}
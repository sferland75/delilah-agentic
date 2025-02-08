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

const maintenanceTasks = {
  indoor: [
    "Change light bulbs",
    "Replace air filters",
    "Basic plumbing maintenance",
    "Basic electrical maintenance",
    "Wall repairs/painting",
    "Door/window maintenance",
    "Furniture assembly/repair",
    "Replace batteries in alarms",
    "Clean dryer vent",
    "Test smoke/CO detectors"
  ],
  outdoor: [
    "Lawn mowing",
    "Snow removal",
    "Gardening/landscaping",
    "Gutter cleaning",
    "Window washing",
    "Deck/patio maintenance",
    "Exterior painting",
    "Driveway/walkway maintenance",
    "Leaf removal",
    "Outdoor furniture maintenance"
  ],
  seasonal: [
    "Spring yard cleanup",
    "Fall winterization",
    "Holiday decorating",
    "Garden planting/cleanup",
    "Pool opening/closing",
    "Storm preparation",
    "Seasonal equipment maintenance",
    "Weather stripping/caulking",
    "Exterior inspection",
    "HVAC service scheduling"
  ],
  repairs: [
    "Minor carpentry",
    "Basic appliance maintenance",
    "Hardware replacement",
    "Fence repair",
    "Screen repair",
    "Caulking/weatherstripping",
    "Small wall repairs",
    "Door adjustments",
    "Tile/grout repair",
    "Basic equipment repair"
  ]
};

const preAccidentOptions = [
  "Independent",
  "Independent with Modifications",
  "Required Assistance",
  "Hired Service",
  "Not Responsible",
  "Unable to Perform"
];

const postAccidentOptions = [
  "Can Perform Independently",
  "Requires Supervision",
  "Minimal Assistance Needed",
  "Moderate Assistance Needed",
  "Maximum Assistance Needed",
  "Cannot Perform - Service Required"
];

const frequencies = [
  "Weekly",
  "Bi-Weekly",
  "Monthly",
  "Quarterly",
  "Bi-Annually",
  "Annually",
  "Seasonal",
  "As Needed"
];

export function HomeMaintenance() {
  const { register, watch, setValue } = useFormContext();
  const maintenanceData = watch('housekeeping.maintenance') || {};

  React.useEffect(() => {
    if (!maintenanceData || Object.keys(maintenanceData).length === 0) {
      const initialData = Object.entries(maintenanceTasks).reduce((acc, [area, tasks]) => {
        tasks.forEach(task => {
          acc[`${area}-${task}`] = {
            preAccident: '',
            postAccident: '',
            frequency: '',
            timeRequired: '',
            costEstimate: '',
            clinicalJustification: ''
          };
        });
        return acc;
      }, {});
      setValue('housekeeping.maintenance', initialData);
    }
  }, []);

  const updateField = (taskId: string, field: string, value: string) => {
    setValue(`housekeeping.maintenance.${taskId}`, {
      ...maintenanceData[taskId],
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(maintenanceTasks).map(([area, tasks]) => (
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
                  <TableHead className="w-[100px]">Time (hrs)</TableHead>
                  <TableHead className="w-[100px]">Cost/Year</TableHead>
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
                          value={maintenanceData[taskId]?.preAccident || ''}
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
                          value={maintenanceData[taskId]?.postAccident || ''}
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
                          value={maintenanceData[taskId]?.frequency || ''}
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
                          value={maintenanceData[taskId]?.timeRequired || ''}
                          onChange={(e) => updateField(taskId, 'timeRequired', e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={maintenanceData[taskId]?.costEstimate || ''}
                          onChange={(e) => updateField(taskId, 'costEstimate', e.target.value)}
                          className="w-24"
                          placeholder="$ /year"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={maintenanceData[taskId]?.clinicalJustification || ''}
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
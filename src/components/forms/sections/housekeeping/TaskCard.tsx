import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const frequencyOptions = [
  { value: "weekly", label: "Per Week" },
  { value: "monthly", label: "Per Month" },
  { value: "seasonal", label: "Per Season" },
  { value: "annual", label: "Per Year" }
];

interface TaskCardProps {
  task: {
    name: string;
    icon: React.ElementType;
    baseFrequency: string;
    description: string;
  };
  category: string;
}

export function TaskCard({ task, category }: TaskCardProps) {
  const { register, watch, setValue } = useFormContext();
  const housekeeping = watch('housekeeping') || {};
  const taskPath = `housekeeping.${task.name}`;
  const replacementType = watch(`${taskPath}.replacementType`) || 'hours';
  const TaskIcon = task.icon;

  // Initialize replacement type if not set
  React.useEffect(() => {
    if (!housekeeping[task.name]?.replacementType) {
      setValue(`${taskPath}.replacementType`, 'hours');
    }
  }, [task.name, setValue, housekeeping]);

  return (
    <div className="border rounded-lg p-6 space-y-6 bg-white/50">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TaskIcon className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-medium">
            {task.name}
          </Label>
        </div>
        <div className="text-sm text-slate-600 ml-6">
          <span className="font-medium">Typical Frequency:</span> {task.baseFrequency}
        </div>
        <div className="text-sm text-slate-600 ml-6">
          {task.description}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Pre-Accident Hours (per Week)</Label>
          <Input
            type="number"
            step="0.25"
            {...register(`${taskPath}.preAccidentHours`)}
            placeholder="Hours"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Hours (per Week)</Label>
          <Input
            type="number"
            step="0.25"
            {...register(`${taskPath}.currentHours`)}
            placeholder="Hours"
            className="bg-white"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Replacement Services</Label>
          <Select 
            defaultValue="hours"
            value={replacementType}
            onValueChange={(value) => {
              setValue(`${taskPath}.replacementType`, value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hours">Hours per Week</SelectItem>
              <SelectItem value="contract">Contract Cost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {replacementType === 'hours' ? (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recommended Replacement Hours (per Week)</Label>
            <Input
              type="number"
              step="0.25"
              {...register(`${taskPath}.replacementHours`)}
              placeholder="Hours"
              className="bg-white"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Contract Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register(`${taskPath}.contractAmount`)}
                placeholder="Amount"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Frequency</Label>
              <Select 
                defaultValue="weekly"
                value={watch(`${taskPath}.contractFrequency`) || 'weekly'}
                onValueChange={(value) => {
                  setValue(`${taskPath}.contractFrequency`, value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Clinical Observations & Recommendations</Label>
        <Textarea
          {...register(`${taskPath}.notes`)}
          placeholder="Enter clinical observations and recommendations..."
          className="min-h-[80px] bg-white"
        />
      </div>
    </div>
  );
}
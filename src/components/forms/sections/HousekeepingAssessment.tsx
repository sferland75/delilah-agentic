import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    FaBroom,
    FaHandSparkles,
    FaFeatherAlt,
    FaBed,
    FaTshirt,
    FaHouseDamage,
    FaBlender,
    FaWindowMaximize,
    FaBox,
    FaTrashAlt,
    FaLeaf,
    FaSnowflake,
    FaSink,
    FaHome,
    FaCalculator,
    FaClock,
    FaRegClock,
    FaDollarSign
} from 'react-icons/fa';

const housekeepingTasks = [
  {
    category: "Regular Housekeeping",
    icon: FaHome,
    tasks: [
      { name: "Vacuuming/Sweeping", icon: FaBroom, baseFrequency: "Weekly" },
      { name: "Mopping", icon: FaHandSparkles, baseFrequency: "Weekly" },
      { name: "Dusting", icon: FaFeatherAlt, baseFrequency: "Weekly" },
      { name: "Organizing/Tidying", icon: FaBox, baseFrequency: "Weekly" },
      { name: "Window Cleaning", icon: FaWindowMaximize, baseFrequency: "Monthly" }
    ]
  },
  {
    category: "Bedroom",
    icon: FaBed,
    tasks: [
      { name: "Making Beds", icon: FaBed, baseFrequency: "Daily" },
      { name: "Changing Bed Linens", icon: FaBed, baseFrequency: "Weekly" }
    ]
  },
  {
    category: "Laundry",
    icon: FaTshirt,
    tasks: [
      { name: "Laundry - Sorting", icon: FaTshirt, baseFrequency: "Weekly" },
      { name: "Laundry - Washing/Drying", icon: FaTshirt, baseFrequency: "Weekly" },
      { name: "Laundry - Folding/Putting Away", icon: FaTshirt, baseFrequency: "Weekly" }
    ]
  },
  {
    category: "Bathroom",
    icon: FaHouseDamage,
    tasks: [
      { name: "Cleaning Bathroom - Sink/Counter", icon: FaSink, baseFrequency: "Weekly" },
      { name: "Cleaning Bathroom - Toilet", icon: FaHouseDamage, baseFrequency: "Weekly" },
      { name: "Cleaning Bathroom - Tub/Shower", icon: FaHouseDamage, baseFrequency: "Weekly" }
    ]
  },
  {
    category: "Kitchen",
    icon: FaBlender,
    tasks: [
      { name: "Kitchen - Wiping Counters", icon: FaSink, baseFrequency: "Daily" },
      { name: "Kitchen - Cleaning Stove/Appliances", icon: FaBlender, baseFrequency: "Weekly" },
      { name: "Kitchen - Cleaning Floor", icon: FaHandSparkles, baseFrequency: "Weekly" }
    ]
  },
  {
    category: "Outdoor & Seasonal",
    icon: FaLeaf,
    tasks: [
      { name: "Garbage/Recycling Management", icon: FaTrashAlt, baseFrequency: "Weekly" },
      { name: "Outdoor Sweeping", icon: FaBroom, baseFrequency: "Weekly" },
      { name: "Seasonal Cleaning Tasks", icon: FaSnowflake, baseFrequency: "Seasonal" }
    ]
  }
];

const frequencyOptions = [
  { value: "weekly", label: "Per Week" },
  { value: "monthly", label: "Per Month" },
  { value: "seasonal", label: "Per Season" },
  { value: "annual", label: "Per Year" }
];

const ReplacementServicesSummary = () => {
  const { watch } = useFormContext();
  const housekeeping = watch('housekeeping') || {};

  const totals = Object.values(housekeeping).reduce((acc: any, task: any) => {
    if (task.replacementType === 'hours') {
      acc.totalHours += parseFloat(task.replacementHours || 0);
    } else if (task.replacementType === 'contract') {
      // Convert contract amounts to weekly basis
      let weeklyAmount = parseFloat(task.contractAmount || 0);
      switch (task.contractFrequency) {
        case 'monthly':
          weeklyAmount = weeklyAmount / 4;
          break;
        case 'seasonal':
          weeklyAmount = weeklyAmount / 13;
          break;
        case 'annual':
          weeklyAmount = weeklyAmount / 52;
          break;
      }
      acc.totalContractCost += weeklyAmount;
    }
    return acc;
  }, { totalHours: 0, totalContractCost: 0 });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <FaCalculator className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Replacement Services Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaRegClock className="h-4 w-4 text-blue-600" />
              <Label className="text-base font-medium">Total Replacement Hours</Label>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {totals.totalHours.toFixed(2)} hours/week
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaDollarSign className="h-4 w-4 text-blue-600" />
              <Label className="text-base font-medium">Total Contract Costs</Label>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ${totals.totalContractCost.toFixed(2)}/week
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Note: Contract costs have been converted to weekly amounts for comparison purposes.
        </div>
      </CardContent>
    </Card>
  );
};

const TaskCard = ({ task, category }) => {
  const { register, watch, setValue } = useFormContext();
  const housekeeping = watch('housekeeping') || {};
  const taskPath = `housekeeping.${task.name}`;
  const replacementType = watch(`${taskPath}.replacementType`) || 'hours';

  // Initialize replacement type if not set
  React.useEffect(() => {
    if (!housekeeping[task.name]?.replacementType) {
      setValue(`${taskPath}.replacementType`, 'hours');
    }
  }, [task.name, setValue, housekeeping]);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <task.icon className="h-4 w-4 text-blue-600" />
        <Label className="text-base font-medium">
          {task.name}
          <span className="block text-sm text-muted-foreground">
            Typical Frequency: {task.baseFrequency}
          </span>
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Pre-Accident Hours (per Week)</Label>
          <Input
            type="number"
            step="0.25"
            {...register(`${taskPath}.preAccidentHours`)}
            placeholder="Hours"
          />
        </div>

        <div>
          <Label>Current Hours (per Week)</Label>
          <Input
            type="number"
            step="0.25"
            {...register(`${taskPath}.currentHours`)}
            placeholder="Hours"
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
          <div>
            <Label>Recommended Replacement Hours (per Week)</Label>
            <Input
              type="number"
              step="0.25"
              {...register(`${taskPath}.replacementHours`)}
              placeholder="Hours"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contract Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register(`${taskPath}.contractAmount`)}
                placeholder="Amount"
              />
            </div>
            <div>
              <Label>Frequency</Label>
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
        <Label>Clinical Observations & Recommendations</Label>
        <Textarea
          {...register(`${taskPath}.notes`)}
          placeholder="Enter clinical observations and recommendations..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};

export function HousekeepingAssessment() {
  const { register, watch, setValue } = useFormContext();
  
  // Initialize form data
  React.useEffect(() => {
    const housekeeping = watch('housekeeping');
    if (!housekeeping || Object.keys(housekeeping).length === 0) {
      const initialData = housekeepingTasks.reduce((acc, category) => {
        category.tasks.forEach(task => {
          acc[task.name] = {
            preAccidentHours: '',
            currentHours: '',
            replacementType: 'hours',
            replacementHours: '',
            contractAmount: '',
            contractFrequency: 'weekly',
            notes: ''
          };
        });
        return acc;
      }, {});
      setValue('housekeeping', initialData);
    }
  }, [setValue, watch]);

  return (
    <div className="space-y-6">
      <ReplacementServicesSummary />
      {housekeepingTasks.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">{category.category}</h3>
            </div>
            <div className="space-y-6">
              {category.tasks.map((task) => (
                <TaskCard key={task.name} task={task} category={category} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default HousekeepingAssessment;
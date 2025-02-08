import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FaBroom,
  FaMop,
  FaFeather,
  FaBed,
  FaTshirt,
  FaBath,
  FaKitchenSet,
  FaWindowMaximize,
  FaBoxOpen,
  FaTrash,
  FaLeaf,
  FaSnowflake,
  FaSoap
} from 'react-icons/fa6';

const housekeepingTasks = [
  {
    category: "General Cleaning",
    tasks: [
      { name: "Vacuuming/Sweeping", icon: FaBroom },
      { name: "Mopping", icon: FaMop },
      { name: "Dusting", icon: FaFeather },
      { name: "Organizing/Tidying", icon: FaBoxOpen },
      { name: "Window Cleaning", icon: FaWindowMaximize }
    ]
  },
  {
    category: "Bedroom",
    tasks: [
      { name: "Making Beds", icon: FaBed },
      { name: "Changing Bed Linens", icon: FaBed }
    ]
  },
  {
    category: "Laundry",
    tasks: [
      { name: "Laundry - Sorting", icon: FaTshirt },
      { name: "Laundry - Washing/Drying", icon: FaTshirt },
      { name: "Laundry - Folding/Putting Away", icon: FaTshirt }
    ]
  },
  {
    category: "Bathroom",
    tasks: [
      { name: "Cleaning Bathroom - Sink/Counter", icon: FaSoap },
      { name: "Cleaning Bathroom - Toilet", icon: FaBath },
      { name: "Cleaning Bathroom - Tub/Shower", icon: FaBath }
    ]
  },
  {
    category: "Kitchen",
    tasks: [
      { name: "Kitchen - Wiping Counters", icon: FaKitchenSet },
      { name: "Kitchen - Cleaning Stove/Appliances", icon: FaKitchenSet },
      { name: "Kitchen - Cleaning Floor", icon: FaMop }
    ]
  },
  {
    category: "Outdoor & Seasonal",
    tasks: [
      { name: "Garbage/Recycling Management", icon: FaTrash },
      { name: "Outdoor Sweeping", icon: FaBroom },
      { name: "Seasonal Cleaning Tasks", icon: FaSnowflake }
    ]
  }
];

const preAccidentOptions = [
  { value: "independent", label: "Independent" },
  { value: "independent_with_mods", label: "Independent with Modifications" },
  { value: "partially_independent", label: "Partially Independent" },
  { value: "unable", label: "Unable to Perform" }
];

const postAccidentOptions = [
  { value: "no_involvement", label: "No Involvement Required" },
  { value: "verbal_cuing", label: "Verbal Cuing/Direction Only" },
  { value: "minimal_assistance", label: "Minimal Physical Assistance" },
  { value: "moderate_assistance", label: "Moderate Physical Assistance" },
  { value: "maximal_assistance", label: "Maximum Physical Assistance" },
  { value: "unable", label: "Unable - Full Assistance Required" }
];

export function HousekeepingAssessment() {
  const { register, watch, setValue } = useFormContext();
  const housekeeping = watch('adl.housekeeping') || {};

  // Initialize housekeeping data if empty
  React.useEffect(() => {
    if (!housekeeping || Object.keys(housekeeping).length === 0) {
      const initialData = housekeepingTasks.reduce((acc, category) => {
        category.tasks.forEach(task => {
          acc[task.name] = {
            preAccident: '',
            postAccident: '',
            clinicalJustification: ''
          };
        });
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
    <div className="space-y-6">
      {housekeepingTasks.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600">{category.category}</h3>
            </div>
            <div className="space-y-6">
              {category.tasks.map((task) => (
                <div key={task.name} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <task.icon className="h-4 w-4 text-blue-600" />
                    <Label className="text-base font-medium">{task.name}</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pre-Accident Status</Label>
                      <Select
                        value={housekeeping[task.name]?.preAccident || ''}
                        onValueChange={(value) => updateField(task.name, 'preAccident', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {preAccidentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Current Involvement Required</Label>
                      <Select
                        value={housekeeping[task.name]?.postAccident || ''}
                        onValueChange={(value) => updateField(task.name, 'postAccident', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select involvement" />
                        </SelectTrigger>
                        <SelectContent>
                          {postAccidentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Clinical Observations & Justification</Label>
                    <Textarea
                      value={housekeeping[task.name]?.clinicalJustification || ''}
                      onChange={(e) => updateField(task.name, 'clinicalJustification', e.target.value)}
                      placeholder="Enter clinical observations and justification..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
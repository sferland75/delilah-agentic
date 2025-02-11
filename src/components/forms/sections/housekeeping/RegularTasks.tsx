import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCard } from './TaskCard';
import {
  FaBroom,
  FaHandSparkles,
  FaFeatherAlt,
  FaBox,
  FaWindowMaximize,
  FaTrashAlt,
} from 'react-icons/fa';

const regularTasks = [
  { 
    name: "Vacuuming/Sweeping", 
    icon: FaBroom, 
    baseFrequency: "Weekly",
    description: "Regular floor maintenance including carpets and hard surfaces"
  },
  { 
    name: "Mopping", 
    icon: FaHandSparkles, 
    baseFrequency: "Weekly",
    description: "Wet cleaning of hard surface floors"
  },
  { 
    name: "Dusting", 
    icon: FaFeatherAlt, 
    baseFrequency: "Weekly",
    description: "Dusting of surfaces, furniture, and fixtures"
  },
  { 
    name: "General Tidying", 
    icon: FaBox, 
    baseFrequency: "Daily",
    description: "Basic organization and tidying of living spaces"
  },
  { 
    name: "Window Cleaning", 
    icon: FaWindowMaximize, 
    baseFrequency: "Monthly",
    description: "Interior window and glass surface cleaning"
  },
  { 
    name: "Waste Management", 
    icon: FaTrashAlt, 
    baseFrequency: "Weekly",
    description: "Garbage and recycling collection and disposal"
  }
];

export function RegularTasks() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FaBroom className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Regular Maintenance Tasks</h3>
      </div>

      <div className="space-y-6">
        {regularTasks.map((task) => (
          <TaskCard 
            key={task.name} 
            task={task} 
            category="regular"
          />
        ))}
      </div>
    </div>
  );
}
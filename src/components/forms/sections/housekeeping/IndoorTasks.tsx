import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { TaskCard } from './TaskCard';
import {
  FaBed,
  FaTshirt,
  FaHouseDamage,
  FaBlender,
  FaSink,
  FaToilet,
  FaShower,
  FaUtensils,
} from 'react-icons/fa';

const indoorTasks = [
  // Bedroom Tasks
  { 
    name: "Making Beds", 
    icon: FaBed, 
    baseFrequency: "Daily",
    description: "Daily bed making and tidying of bedroom spaces"
  },
  { 
    name: "Changing Linens", 
    icon: FaBed, 
    baseFrequency: "Weekly",
    description: "Changing and laundering bed linens and bedding"
  },
  
  // Laundry Tasks
  { 
    name: "Laundry - Sorting", 
    icon: FaTshirt, 
    baseFrequency: "Weekly",
    description: "Sorting and preparing laundry for washing"
  },
  { 
    name: "Laundry - Washing", 
    icon: FaTshirt, 
    baseFrequency: "Weekly",
    description: "Operating washing machine and dryer"
  },
  { 
    name: "Laundry - Folding", 
    icon: FaTshirt, 
    baseFrequency: "Weekly",
    description: "Folding and organizing clean laundry"
  },

  // Bathroom Tasks
  { 
    name: "Bathroom Sink/Counter", 
    icon: FaSink, 
    baseFrequency: "Weekly",
    description: "Cleaning bathroom surfaces and fixtures"
  },
  { 
    name: "Bathroom Toilet", 
    icon: FaToilet, 
    baseFrequency: "Weekly",
    description: "Cleaning and sanitizing toilet"
  },
  { 
    name: "Bathroom Shower/Tub", 
    icon: FaShower, 
    baseFrequency: "Weekly",
    description: "Cleaning shower and tub areas"
  },

  // Kitchen Tasks
  { 
    name: "Kitchen Counters", 
    icon: FaUtensils, 
    baseFrequency: "Daily",
    description: "Wiping and sanitizing kitchen counters and surfaces"
  },
  { 
    name: "Kitchen Appliances", 
    icon: FaBlender, 
    baseFrequency: "Weekly",
    description: "Cleaning stove, microwave, and other appliances"
  },
  { 
    name: "Kitchen Deep Clean", 
    icon: FaSink, 
    baseFrequency: "Monthly",
    description: "Deep cleaning of kitchen including cabinets and drawers"
  }
];

export function IndoorTasks() {
  return (
    <div className="space-y-6">
      {/* Bedroom Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaBed className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Bedroom Tasks</h3>
        </div>
        <div className="space-y-6">
          {indoorTasks.slice(0, 2).map((task) => (
            <TaskCard 
              key={task.name} 
              task={task} 
              category="bedroom"
            />
          ))}
        </div>
      </div>

      {/* Laundry Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaTshirt className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Laundry Tasks</h3>
        </div>
        <div className="space-y-6">
          {indoorTasks.slice(2, 5).map((task) => (
            <TaskCard 
              key={task.name} 
              task={task} 
              category="laundry"
            />
          ))}
        </div>
      </div>

      {/* Bathroom Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaHouseDamage className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Bathroom Tasks</h3>
        </div>
        <div className="space-y-6">
          {indoorTasks.slice(5, 8).map((task) => (
            <TaskCard 
              key={task.name} 
              task={task} 
              category="bathroom"
            />
          ))}
        </div>
      </div>

      {/* Kitchen Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaBlender className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Kitchen Tasks</h3>
        </div>
        <div className="space-y-6">
          {indoorTasks.slice(8).map((task) => (
            <TaskCard 
              key={task.name} 
              task={task} 
              category="kitchen"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { TaskCard } from './TaskCard';
import {
  FaLeaf,
  FaBroom,
  FaSnowflake,
  FaTrashAlt,
  FaSeedling,
  FaCut,
  FaTree
} from 'react-icons/fa';

const outdoorTasks = [
  // Regular Outdoor Tasks
  { 
    name: "Garbage/Recycling", 
    icon: FaTrashAlt, 
    baseFrequency: "Weekly",
    description: "Regular garbage and recycling management"
  },
  { 
    name: "Outdoor Sweeping", 
    icon: FaBroom, 
    baseFrequency: "Weekly",
    description: "Sweeping of walkways, driveway, and outdoor spaces"
  },
  
  // Seasonal Tasks
  { 
    name: "Lawn Maintenance", 
    icon: FaCut, 
    baseFrequency: "Weekly/Seasonal",
    description: "Mowing lawn and general yard maintenance during growing season"
  },
  { 
    name: "Garden Care", 
    icon: FaSeedling, 
    baseFrequency: "Weekly/Seasonal",
    description: "Garden maintenance, weeding, and plant care"
  },
  { 
    name: "Fall Cleanup", 
    icon: FaLeaf, 
    baseFrequency: "Seasonal",
    description: "Leaf removal and fall yard cleanup"
  },
  { 
    name: "Snow Removal", 
    icon: FaSnowflake, 
    baseFrequency: "Seasonal",
    description: "Snow and ice removal from walkways and driveway"
  }
];

export function OutdoorTasks() {
  return (
    <div className="space-y-6">
      {/* Regular Outdoor */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaBroom className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Regular Outdoor Tasks</h3>
        </div>
        <div className="space-y-6">
          {outdoorTasks.slice(0, 2).map((task) => (
            <TaskCard 
              key={task.name} 
              task={task} 
              category="outdoor-regular"
            />
          ))}
        </div>
      </div>

      {/* Seasonal Tasks */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaTree className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Seasonal Tasks</h3>
        </div>
        <div className="space-y-6">
          {outdoorTasks.slice(2).map((task) => (
            <TaskCard 
              key={task.name} 
              task={task} 
              category="outdoor-seasonal"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
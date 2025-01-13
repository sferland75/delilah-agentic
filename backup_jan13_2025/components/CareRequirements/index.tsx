import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CareRequirements() {
  const { control } = useFormContext();
  
  const LEVELS = [
    { 
      id: 'routine',
      title: 'Level 1: Routine Personal Care',
      description: 'Basic personal care assistance and supervision',
      rate: 14.90,
      hours: {
        weekday: { min: 2, max: 4 },
        weekend: { min: 2, max: 4 }
      },
      tasks: [
        'Basic hygiene assistance',
        'Dressing assistance',
        'Meal preparation supervision',
        'Light housekeeping',
        'Medication reminders'
      ]
    },
    {
      id: 'supervision',
      title: 'Level 2: Basic Supervision',
      description: 'Regular monitoring and assistance with daily activities',
      rate: 14.00,
      hours: {
        weekday: { min: 4, max: 6 },
        weekend: { min: 4, max: 6 }
      },
      tasks: [
        'Safety monitoring',
        'Cognitive support',
        'Emotional support',
        'Activity supervision',
        'Basic care coordination'
      ]
    },
    {
      id: 'complex',
      title: 'Level 3: Complex Care',
      description: 'Specialized care and medical assistance',
      rate: 21.11,
      hours: {
        weekday: { min: 6, max: 8 },
        weekend: { min: 6, max: 8 }
      },
      tasks: [
        'Medical monitoring',
        'Complex transfers',
        'Specialized feeding assistance',
        'Wound care assistance',
        'Advanced mobility support'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#2C3258]">Care Requirements</h2>
        <p className="text-sm text-slate-600">Assessment of care needs and recommendations</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="routine" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {LEVELS.map((level) => (
              <TabsTrigger key={level.id} value={level.id}>
                Level {level.id === 'routine' ? '1' : level.id === 'supervision' ? '2' : '3'}
              </TabsTrigger>
            ))}
          </TabsList>

          {LEVELS.map((level) => (
            <TabsContent key={level.id} value={level.id} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{level.title}</h3>
                <p className="text-slate-600">{level.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium">Rate</p>
                    <p className="text-2xl font-bold">${level.rate.toFixed(2)}/hr</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Recommended Hours</p>
                    <div>
                      <p>Weekday: {level.hours.weekday.min}-{level.hours.weekday.max} hrs</p>
                      <p>Weekend: {level.hours.weekend.min}-{level.hours.weekend.max} hrs</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Tasks Include:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {level.tasks.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
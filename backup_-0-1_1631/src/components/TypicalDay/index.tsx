import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyRoutine } from './DailyRoutine';
import { WeeklySchedule } from './WeeklySchedule';
import { useFormContext } from 'react-hook-form';

export function TypicalDaySection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#2C3258]">Typical Day Assessment</h2>
        <p className="text-sm text-slate-600">Compare pre-accident and current daily activities and routines</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="pre-accident-day" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pre-accident-day">Pre-Accident Day</TabsTrigger>
            <TabsTrigger value="pre-accident-week">Pre-Accident Week</TabsTrigger>
            <TabsTrigger value="current-day">Current Day</TabsTrigger>
            <TabsTrigger value="current-week">Current Week</TabsTrigger>
          </TabsList>

          <TabsContent value="pre-accident-day">
            <DailyRoutine 
              control={control} 
              prefix="typicalDay.preAccident.daily"
              title="Pre-Accident Daily Routine"
              description="Document typical daily activities before the accident"
            />
          </TabsContent>

          <TabsContent value="pre-accident-week">
            <WeeklySchedule 
              control={control} 
              prefix="typicalDay.preAccident.weekly"
              title="Pre-Accident Weekly Schedule"
              description="Document regular weekly activities before the accident"
            />
          </TabsContent>

          <TabsContent value="current-day">
            <DailyRoutine 
              control={control} 
              prefix="typicalDay.current.daily"
              title="Current Daily Routine"
              description="Document current daily activities and any changes or limitations"
            />
          </TabsContent>

          <TabsContent value="current-week">
            <WeeklySchedule 
              control={control} 
              prefix="typicalDay.current.weekly"
              title="Current Weekly Schedule"
              description="Document current weekly activities and any modifications needed"
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
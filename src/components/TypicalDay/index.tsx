import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyRoutine } from './DailyRoutine';
import { WeeklySchedule } from './WeeklySchedule';
import { useFormContext } from '@/context/FormContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, CalendarClock, AlarmClock } from 'lucide-react';

export function TypicalDaySection() {
  const { formData, updateFormData } = useFormContext();

  console.log('TypicalDaySection rendering with formData:', JSON.stringify(formData, null, 2));
  console.log('Pre-accident daily data:', JSON.stringify(formData?.typicalDay?.preAccident?.daily, null, 2));

  // Handler for daily routine updates
  const handleDailyUpdate = (section: string, value: any) => {
    console.log('Handling daily update:', section, value);
    const updatedTypicalDay = {
      ...formData.typicalDay,
      [section]: {
        ...formData.typicalDay?.[section],
        daily: value
      }
    };

    updateFormData({
      ...formData,
      typicalDay: updatedTypicalDay
    });
  };

  // Handler for weekly schedule updates
  const handleWeeklyUpdate = (section: string, value: any) => {
    console.log('Handling weekly update:', section, value);
    const updatedTypicalDay = {
      ...formData.typicalDay,
      [section]: {
        ...formData.typicalDay?.[section],
        weekly: value
      }
    };

    updateFormData({
      ...formData,
      typicalDay: updatedTypicalDay
    });
  };

  // Debug display of current data
  if (process.env.NODE_ENV === 'development') {
    console.log('Current form data structure:', {
      preAccidentDaily: formData?.typicalDay?.preAccident?.daily || {},
      currentDaily: formData?.typicalDay?.current?.daily || {},
      preAccidentWeekly: formData?.typicalDay?.preAccident?.weekly || {},
      currentWeekly: formData?.typicalDay?.current?.weekly || {}
    });
  }

  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Typical Day Assessment</h2>
      <p className="text-sm text-slate-600 mb-6">Compare pre-accident and current daily activities and routines</p>

      {/* Debug display */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
          <pre>{JSON.stringify(formData?.typicalDay, null, 2)}</pre>
        </div>
      )}

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document and compare typical routines before and after the incident. Note changes in:
          - Activity levels and patterns
          - Time management and scheduling
          - Required modifications
          - Impact on daily function
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="pre-accident-day" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger 
            value="pre-accident-day"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Pre-Accident Day</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="pre-accident-week"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Pre-Accident Week</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="current-day"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <AlarmClock className="h-4 w-4" />
              <span>Current Day</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="current-week"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Current Week</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pre-accident-day">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <DailyRoutine 
              data={formData?.typicalDay?.preAccident?.daily || {}}
              onChange={(value) => handleDailyUpdate('preAccident', value)}
              prefix="typicalDay.preAccident.daily"
              title="Pre-Accident Daily Routine"
              description="Document typical daily activities before the accident"
            />
          </div>
        </TabsContent>

        <TabsContent value="pre-accident-week">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <WeeklySchedule 
              data={formData?.typicalDay?.preAccident?.weekly || {}}
              onChange={(value) => handleWeeklyUpdate('preAccident', value)}
              prefix="typicalDay.preAccident.weekly"
              title="Pre-Accident Weekly Schedule"
              description="Document regular weekly activities before the accident"
            />
          </div>
        </TabsContent>

        <TabsContent value="current-day">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <DailyRoutine 
              data={formData?.typicalDay?.current?.daily || {}}
              onChange={(value) => handleDailyUpdate('current', value)}
              prefix="typicalDay.current.daily"
              title="Current Daily Routine"
              description="Document current daily activities and any changes or limitations"
            />
          </div>
        </TabsContent>

        <TabsContent value="current-week">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <WeeklySchedule 
              data={formData?.typicalDay?.current?.weekly || {}}
              onChange={(value) => handleWeeklyUpdate('current', value)}
              prefix="typicalDay.current.weekly"
              title="Current Weekly Schedule"
              description="Document current weekly activities and any modifications needed"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
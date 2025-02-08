import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { Clock } from 'lucide-react';

const timeOptions = {
  morning: ['5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM'],
  evening: ['8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM']
};

export const TypicalDaySection = () => {
  const { register, watch, setValue } = useFormContext<AssessmentFormData>();
  const [activeTab, setActiveTab] = useState('preAccidentDay');
  const typicalDay = watch('typicalDay');

  const handleTimeSelection = (timeType: 'wakeTime' | 'bedTime', time: string) => {
    setValue(`typicalDay.${activeTab === 'preAccidentDay' ? 'preAccident' : 'current'}.${timeType}`, time);
  };

  const tabs = [
    { id: 'preAccidentDay', label: 'Pre-Accident Day' },
    { id: 'preAccidentWeek', label: 'Pre-Accident Week' },
    { id: 'currentDay', label: 'Current Day' },
    { id: 'currentWeek', label: 'Current Week' }
  ];

  const renderDailyRoutine = (isPreAccident: boolean) => {
    const prefix = isPreAccident ? 'preAccident' : 'current';
    const titlePrefix = isPreAccident ? 'Pre-Accident' : 'Current';

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">{titlePrefix} Daily Routine</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Document typical daily activities {isPreAccident ? 'before the accident' : 'after the accident'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`${prefix}IrregularSchedule`}
            {...register(`typicalDay.${prefix}.irregularSchedule`)}
          />
          <Label htmlFor={`${prefix}IrregularSchedule`} className="text-sm">
            Irregular/Variable Schedule
            <span className="block text-muted-foreground">
              Check this if sleep/wake times vary significantly
            </span>
          </Label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <h5 className="font-medium">Sleep Schedule</h5>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-2">Typical Wake Time</Label>
              <div className="flex flex-wrap gap-2">
                {timeOptions.morning.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeSelection('wakeTime', time)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      typicalDay?.[prefix]?.wakeTime === time
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2">Typical Bed Time</Label>
              <div className="flex flex-wrap gap-2">
                {timeOptions.evening.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeSelection('bedTime', time)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      typicalDay?.[prefix]?.bedTime === time
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Morning Routine (Wake up - Noon)</Label>
            <Textarea
              {...register(`typicalDay.${prefix}.morningRoutine`)}
              placeholder="Describe typical morning activities and routines"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Afternoon Routine (Noon - 5pm)</Label>
            <Textarea
              {...register(`typicalDay.${prefix}.afternoonRoutine`)}
              placeholder="Describe typical afternoon activities and routines"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Evening Routine (5pm - Bed)</Label>
            <Textarea
              {...register(`typicalDay.${prefix}.eveningRoutine`)}
              placeholder="Describe typical evening activities and routines"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Compare pre-accident and current daily activities and routines
      </p>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm">
        Document and compare typical routines before and after the incident. Note changes in:
        - Activity levels and patterns
        - Time management and scheduling
        - Required modifications
        - Impact on daily function
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-100/80 p-1 rounded-md">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-sm transition-colors
                ${activeTab === tab.id 
                  ? 'bg-[#2563EB] text-white' 
                  : 'text-slate-600 hover:bg-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pre-Accident Daily Routine */}
      {activeTab === 'preAccidentDay' && renderDailyRoutine(true)}

      {/* Current Daily Routine */}
      {activeTab === 'currentDay' && renderDailyRoutine(false)}

      {/* Weekly Schedule Contents */}
      {(activeTab === 'preAccidentWeek' || activeTab === 'currentWeek') && (
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium mb-2">
              {activeTab === 'preAccidentWeek' ? 'Pre-Accident' : 'Current'} Weekly Schedule
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Describe {activeTab === 'preAccidentWeek' ? 'typical' : 'current'} weekly schedule and variations from the daily routine
            </p>
          </div>

          <Textarea
            {...register(`typicalDay.${activeTab === 'preAccidentWeek' ? 'preAccident' : 'current'}.weeklySchedule`)}
            placeholder="Include regular weekly activities, appointments, work schedules, and any variations from the typical daily routine"
            className="h-48"
          />
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Sun, Sunset, Moon } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';

interface DailyRoutineProps {
  data: any;
  onChange: (value: any) => void;
  prefix: string;
  title: string;
  description: string;
}

const WAKE_TIMES = ['5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00'];

const BED_TIMES = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'];

const TIME_PERIODS = [
  { 
    id: 'morning', 
    label: 'Morning Routine (Wake up - Noon)', 
    description: 'Activities from waking up until noon',
    icon: Sun
  },
  { 
    id: 'afternoon', 
    label: 'Afternoon Activities (Noon - 5pm)', 
    description: 'Activities during afternoon hours',
    icon: Clock
  },
  { 
    id: 'evening', 
    label: 'Evening Routine (5pm - Bedtime)', 
    description: 'Activities from evening until bedtime',
    icon: Sunset
  },
  { 
    id: 'night', 
    label: 'Night (Sleep/Interruptions)', 
    description: 'Sleep patterns and any night-time interruptions',
    icon: Moon
  }
];

const formatTimeDisplay = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export function DailyRoutine({ data = {}, onChange, title, description }: DailyRoutineProps) {
  const updateField = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    const parentParts = parent.split('.');
    let newData = { ...data };
    let current = newData;

    for (let i = 0; i < parentParts.length - 1; i++) {
      if (!current[parentParts[i]]) {
        current[parentParts[i]] = {};
      }
      current = current[parentParts[i]];
    }

    const lastPart = parentParts[parentParts.length - 1];
    current[lastPart] = {
      ...current[lastPart],
      [field]: value
    };

    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox
          checked={data.hasIrregularSchedule}
          onCheckedChange={(checked) => updateField('hasIrregularSchedule', checked)}
        />
        <div className="space-y-1 leading-none">
          <Label className="text-slate-700">
            Irregular/Variable Schedule
          </Label>
          <p className="text-sm text-slate-600">
            Check this if sleep/wake times vary significantly
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-slate-800">Sleep Schedule</h4>
        </div>

        {data.hasIrregularSchedule ? (
          <div className="space-y-4">
            <div>
              <Label className="text-slate-700">Describe Sleep Pattern</Label>
              <Textarea
                value={data.irregularSchedule?.description || ''}
                onChange={(e) => updateNestedField('irregularSchedule', 'description', e.target.value)}
                placeholder="Describe your sleep patterns..."
                className="min-h-[100px] bg-white"
              />
            </div>

            <div>
              <Label className="text-slate-700">Factors Affecting Schedule</Label>
              <Textarea
                value={data.irregularSchedule?.factors || ''}
                onChange={(e) => updateNestedField('irregularSchedule', 'factors', e.target.value)}
                placeholder="What influences your sleep schedule?..."
                className="min-h-[100px] bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <Label className="text-slate-700">Typical Wake Time</Label>
              <div className="space-y-2">
                <Input 
                  type="time" 
                  value={data.sleepSchedule?.wakeTime || ''}
                  onChange={(e) => updateNestedField('sleepSchedule', 'wakeTime', e.target.value)}
                  className="bg-white mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {WAKE_TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => updateNestedField('sleepSchedule', 'wakeTime', time)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        data.sleepSchedule?.wakeTime === time 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {formatTimeDisplay(time)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-slate-700">Typical Bed Time</Label>
              <div className="space-y-2">
                <Input 
                  type="time" 
                  value={data.sleepSchedule?.bedTime || ''}
                  onChange={(e) => updateNestedField('sleepSchedule', 'bedTime', e.target.value)}
                  className="bg-white mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {BED_TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => updateNestedField('sleepSchedule', 'bedTime', time)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        data.sleepSchedule?.bedTime === time 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {formatTimeDisplay(time)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {TIME_PERIODS.map((period) => {
        const Icon = period.icon;
        return (
          <div key={period.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-slate-800">{period.label}</h4>
                <p className="text-sm text-slate-600">{period.description}</p>
              </div>
            </div>

            <div>
              <Label className="text-slate-700">Activities</Label>
              <Textarea 
                value={data.routines?.[period.id]?.activities || ''}
                onChange={(e) => updateNestedField(`routines.${period.id}`, 'activities', e.target.value)}
                placeholder={`Describe ${period.id} activities and routines...`}
                className="min-h-[100px] bg-white"
              />
            </div>

            <div>
              <Label className="text-slate-700">Challenges & Notes</Label>
              <Textarea 
                value={data.routines?.[period.id]?.challenges || ''}
                onChange={(e) => updateNestedField(`routines.${period.id}`, 'challenges', e.target.value)}
                placeholder="Describe any challenges or notes..."
                className="min-h-[100px] bg-white"
              />
            </div>
          </div>
        );
      })}

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
        <div>
          <Label className="text-slate-700">General Notes & Observations</Label>
          <Textarea
            value={data.generalNotes || ''}
            onChange={(e) => updateField('generalNotes', e.target.value)}
            placeholder="Add any additional notes about daily routines..."
            className="min-h-[100px] bg-white"
          />
        </div>
      </div>
    </div>
  );
}
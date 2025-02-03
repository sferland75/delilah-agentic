import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';

interface WeeklyScheduleProps {
  data: any;
  onChange: (value: any) => void;
  prefix: string;
  title: string;
  description: string;
}

export function WeeklySchedule({ data = {}, onChange, title, description }: WeeklyScheduleProps) {
  const updateField = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Describe your typical weekly schedule, including regular activities, appointments, and routines
        </AlertDescription>
      </Alert>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-6">
        <div>
          <Label className="text-slate-700">Weekday Schedule</Label>
          <Textarea
            value={data.weekdaySchedule || ''}
            onChange={(e) => updateField('weekdaySchedule', e.target.value)}
            placeholder="Describe your typical weekday schedule (Monday to Friday)..."
            className="min-h-[120px] bg-white"
          />
        </div>

        <div>
          <Label className="text-slate-700">Weekend Schedule</Label>
          <Textarea
            value={data.weekendSchedule || ''}
            onChange={(e) => updateField('weekendSchedule', e.target.value)}
            placeholder="Describe your typical weekend schedule (Saturday and Sunday)..."
            className="min-h-[120px] bg-white"
          />
        </div>

        <div>
          <Label className="text-slate-700">Regular Activities</Label>
          <Textarea
            value={data.regularActivities || ''}
            onChange={(e) => updateField('regularActivities', e.target.value)}
            placeholder="List regular recurring activities (e.g., exercise, social events, appointments)..."
            className="min-h-[120px] bg-white"
          />
        </div>

        <div>
          <Label className="text-slate-700">Additional Notes</Label>
          <Textarea
            value={data.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Add any additional notes about your weekly schedule..."
            className="min-h-[100px] bg-white"
          />
        </div>
      </div>
    </div>
  );
}
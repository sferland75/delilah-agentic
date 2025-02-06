import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { independenceLevels } from '../constants';

// Helper function for safe date formatting
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'Set date';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString()
      : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

interface ADLFieldProps {
  basePath: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  requiresFrequency?: boolean;
  requiresTimeTaken?: boolean;
  requiresAssistiveDevices?: boolean;
}

export function ADLField({ 
  basePath, 
  title, 
  subtitle, 
  icon: Icon,
  requiresFrequency = false,
  requiresTimeTaken = false,
  requiresAssistiveDevices = false 
}: ADLFieldProps) {
  const { register, setValue, watch } = useFormContext();
  const independenceLevel = watch(`${basePath}.independence`);
  const usesAssistiveDevices = watch(`${basePath}.usesAssistiveDevices`);
  const lastAssessed = watch(`${basePath}.lastAssessed`);

  // Convert string date to Date object for Calendar component
  const getDateValue = (dateStr: string | null | undefined): Date | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date : undefined;
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 mt-1" />
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{title}</h3>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-auto h-8 px-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(lastAssessed)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={getDateValue(lastAssessed)}
                  onSelect={(date) => setValue(`${basePath}.lastAssessed`, date ? date.toISOString().split('T')[0] : null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Independence Level</Label>
              <Select
                value={independenceLevel}
                onValueChange={(value) => setValue(`${basePath}.independence`, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select independence level" />
                </SelectTrigger>
                <SelectContent>
                  {independenceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {requiresAssistiveDevices && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Uses Assistive Devices</Label>
                  <Switch
                    checked={usesAssistiveDevices}
                    onCheckedChange={(checked) => setValue(`${basePath}.usesAssistiveDevices`, checked)}
                  />
                </div>
                {usesAssistiveDevices && (
                  <Textarea
                    {...register(`${basePath}.assistiveDevices`)}
                    placeholder="Describe assistive devices used..."
                    className="mt-2"
                  />
                )}
              </div>
            )}

            {requiresFrequency && (
              <div>
                <Label>Frequency</Label>
                <Select
                  value={watch(`${basePath}.frequency`)}
                  onValueChange={(value) => setValue(`${basePath}.frequency`, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_daily">Multiple times per day</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="rarely">Rarely</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {requiresTimeTaken && (
              <div>
                <Label>Time Taken</Label>
                <Select
                  value={watch(`${basePath}.timeTaken`)}
                  onValueChange={(value) => setValue(`${basePath}.timeTaken`, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time taken" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_5min">Under 5 minutes</SelectItem>
                    <SelectItem value="5_15min">5-15 minutes</SelectItem>
                    <SelectItem value="15_30min">15-30 minutes</SelectItem>
                    <SelectItem value="30_60min">30-60 minutes</SelectItem>
                    <SelectItem value="over_60min">Over 60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Details & Observations</Label>
              <Textarea
                {...register(`${basePath}.notes`)}
                placeholder="Enter details about performance, challenges, and assistance needed..."
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
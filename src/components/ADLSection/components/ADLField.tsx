import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';
import { independenceLevels } from '../constants';

interface ADLFieldProps {
  basePath: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
}

export function ADLField({ basePath, title, subtitle, icon: Icon }: ADLFieldProps) {
  const { register, setValue, watch } = useFormContext();
  const independenceLevel = watch(`${basePath}.independence`);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 text-primary mt-1" />
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-medium">{title}</h3>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
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
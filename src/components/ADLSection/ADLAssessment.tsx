import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adlCategories, independenceLevels } from './constants';

export function ADLAssessment() {
  const { register, watch, setValue } = useFormContext();
  const adlData = watch('adl.assessment') || {};

  const updateField = (category: string, item: string, field: string, value: string) => {
    setValue(`adl.assessment.${category}.${item}`, {
      ...adlData[category]?.[item],
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(adlCategories).map(([categoryKey, category]) => (
        <Card key={categoryKey}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">{category.title}</h3>
            </div>
            <div className="space-y-6">
              {category.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-blue-600" />
                    <Label className="text-base font-medium">
                      {item.title}
                      {item.subtitle && (
                        <span className="block text-sm font-normal text-muted-foreground">
                          {item.subtitle}
                        </span>
                      )}
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Independence Level</Label>
                      <Select
                        value={adlData[categoryKey]?.[item.id]?.independenceLevel || ''}
                        onValueChange={(value) => updateField(categoryKey, item.id, 'independenceLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
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

                    {item.requiresAssistiveDevices && (
                      <div className="space-y-2">
                        <Label>Assistive Devices</Label>
                        <Textarea
                          value={adlData[categoryKey]?.[item.id]?.assistiveDevices || ''}
                          onChange={(e) => updateField(categoryKey, item.id, 'assistiveDevices', e.target.value)}
                          placeholder="List any assistive devices used..."
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Clinical Observations</Label>
                    <Textarea
                      value={adlData[categoryKey]?.[item.id]?.observations || ''}
                      onChange={(e) => updateField(categoryKey, item.id, 'observations', e.target.value)}
                      placeholder="Enter clinical observations..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
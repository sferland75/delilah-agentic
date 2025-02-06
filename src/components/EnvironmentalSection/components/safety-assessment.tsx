import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function SafetyAssessment() {
  const { register, setValue, watch } = useFormContext();
  const prefix = 'environmental.safetyAssessment';

  const handleArrayUpdate = (path: string, value: string) => {
    const currentValues = watch(path) || [];
    setValue(path, [...currentValues, value]);
  };

  const handleArrayRemove = (path: string, index: number) => {
    const currentValues = watch(path) || [];
    setValue(path, currentValues.filter((_, i) => i !== index));
  };

  const renderArrayField = (path: string, label: string, placeholder: string) => {
    const values = watch(path) || [];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>{label}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleArrayUpdate(path, '')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
        {values.map((value: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => {
                const newValues = [...values];
                newValues[index] = e.target.value;
                setValue(path, newValues);
              }}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleArrayRemove(path, index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {values.length === 0 && (
          <p className="text-sm text-muted-foreground">No items added</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Safety Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Lighting</Label>
            <div className="flex items-center gap-2">
              <Checkbox {...register(`${prefix}.general.lighting.adequate`)} />
              <Label>Adequate Lighting</Label>
            </div>
            {renderArrayField(
              `${prefix}.general.lighting.concerns`,
              'Lighting Concerns',
              'Enter lighting concern'
            )}
          </div>

          <div className="space-y-4">
            <Label>Electrical Outlets</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox {...register(`${prefix}.general.electricalOutlets.accessible`)} />
                <Label>Accessible</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox {...register(`${prefix}.general.electricalOutlets.adequate`)} />
                <Label>Adequate</Label>
              </div>
            </div>
            <Textarea
              {...register(`${prefix}.general.electricalOutlets.notes`)}
              placeholder="Notes about electrical outlets"
            />
          </div>

          {renderArrayField(
            `${prefix}.general.flooring.concerns`,
            'Flooring Concerns',
            'Enter flooring concern'
          )}

          <div className="space-y-4">
            <Label>Emergency Access</Label>
            <Input
              {...register(`${prefix}.general.emergencyAccess.exitPlans`)}
              placeholder="Exit plans description"
            />
            {renderArrayField(
              `${prefix}.general.emergencyAccess.concerns`,
              'Emergency Access Concerns',
              'Enter emergency access concern'
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Fall Risks</Label>
            <Select
              onValueChange={(value) => setValue(`${prefix}.risks.falls.level`, value)}
              defaultValue={watch(`${prefix}.risks.falls.level`)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {renderArrayField(
              `${prefix}.risks.falls.factors`,
              'Fall Risk Factors',
              'Enter fall risk factor'
            )}
          </div>

          <div className="space-y-4">
            <Label>Fire Risks</Label>
            <Select
              onValueChange={(value) => setValue(`${prefix}.risks.fire.level`, value)}
              defaultValue={watch(`${prefix}.risks.fire.level`)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {renderArrayField(
              `${prefix}.risks.fire.factors`,
              'Fire Risk Factors',
              'Enter fire risk factor'
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modifications and Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderArrayField(
            `${prefix}.modifications.immediate`,
            'Immediate Modifications',
            'Enter immediate modification needed'
          )}

          {renderArrayField(
            `${prefix}.modifications.shortTerm`,
            'Short-term Modifications',
            'Enter short-term modification needed'
          )}

          {renderArrayField(
            `${prefix}.modifications.longTerm`,
            'Long-term Modifications',
            'Enter long-term modification needed'
          )}

          <div className="space-y-6">
            {renderArrayField(
              `${prefix}.recommendations.equipment`,
              'Recommended Equipment',
              'Enter recommended equipment'
            )}

            {renderArrayField(
              `${prefix}.recommendations.services`,
              'Recommended Services',
              'Enter recommended service'
            )}

            <div className="space-y-2">
              <Label>Monitoring Plan</Label>
              <Textarea
                {...register(`${prefix}.recommendations.monitoring`)}
                placeholder="Describe monitoring recommendations"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
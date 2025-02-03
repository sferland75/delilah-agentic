import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxGroupItem {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  items: CheckboxGroupItem[];
  values: string[];
  onChange: (values: string[]) => void;
  columns?: 1 | 2 | 3 | 4;
}

export function CheckboxGroup({
  items,
  values = [],
  onChange,
  columns = 2
}: CheckboxGroupProps) {
  const handleItemChange = (checked: boolean, item: CheckboxGroupItem) => {
    if (checked) {
      onChange([...values, item.value]);
    } else {
      onChange(values.filter(v => v !== item.value));
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {items.map((item) => (
        <div key={item.value} className="flex items-center space-x-2">
          <Checkbox
            id={item.value}
            checked={values.includes(item.value)}
            onCheckedChange={(checked) => handleItemChange(checked as boolean, item)}
          />
          <Label
            htmlFor={item.value}
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
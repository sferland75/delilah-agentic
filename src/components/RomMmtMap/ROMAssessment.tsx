import React from 'react';
import { Control } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

const ROM_SCORES = [
  { value: 'WFL', label: 'Within Functional Limits' },
  { value: '3/4', label: '75% of normal' },
  { value: '1/2', label: '50% of normal' },
  { value: '1/4', label: '25% of normal' },
  { value: 'nominal', label: 'Nominal/Trace' },
] as const;

interface ROMEntry {
  movement: string;
  score: string;
  notes: string;
}

interface ROMAssessmentProps {
  control: Control<any>;
  prefix: string;
  joint: {
    id: string;
    label: string;
    movements: string[];
  };
  onSave: (data: any) => void;
  initialData?: {
    entries?: ROMEntry[];
    generalNotes?: string;
  };
}

export function ROMAssessment({ control, prefix, joint, onSave, initialData }: ROMAssessmentProps) {
  const [entries, setEntries] = React.useState<ROMEntry[]>(
    initialData?.entries || []
  );
  
  const [currentEntry, setCurrentEntry] = React.useState<ROMEntry>({
    movement: joint.movements?.[0] || '',
    score: 'WFL',
    notes: ''
  });

  const [generalNotes, setGeneralNotes] = React.useState(initialData?.generalNotes || '');

  console.log('ROM Assessment initialized with:', { joint, initialData, entries });

  const handleAddEntry = () => {
    const existingIndex = entries.findIndex(e => e.movement === currentEntry.movement);
    
    if (existingIndex >= 0) {
      const updatedEntries = [...entries];
      updatedEntries[existingIndex] = { ...currentEntry };
      setEntries(updatedEntries);
    } else {
      setEntries([...entries, { ...currentEntry }]);
    }

    setCurrentEntry({
      movement: '',
      score: 'WFL',
      notes: ''
    });
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSaveAll = () => {
    onSave({
      joint: joint.id,
      entries: entries,
      generalNotes,
      label: joint.label
    });
  };

  const handleCancel = () => {
    onSave(null);
  };

  return (
    <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
      <div className="space-y-6">
        {/* Existing Entries */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recorded Movements</h4>
            <div className="max-h-[200px] rounded-md border">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">{entry.movement}</h5>
                            <p className="text-sm text-muted-foreground">Score: {entry.score}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveEntry(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground">Notes: {entry.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* New Entry Form */}
        <div className="space-y-4 border rounded-md p-4">
          <h4 className="text-sm font-medium">Add Movement Assessment</h4>
          
          {/* Movement Selection */}
          {joint.movements && joint.movements.length > 0 && (
            <div className="space-y-2">
              <Label>Movement</Label>
              <Select
                value={currentEntry.movement}
                onValueChange={(value) => setCurrentEntry({ ...currentEntry, movement: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select movement" />
                </SelectTrigger>
                <SelectContent>
                  {joint.movements
                    .filter(movement => !entries.find(e => e.movement === movement))
                    .map((movement) => (
                      <SelectItem key={movement} value={movement}>
                        {movement}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ROM Score */}
          <div>
            <h4 className="text-sm font-medium mb-3">ROM Score</h4>
            <RadioGroup
              value={currentEntry.score}
              onValueChange={(value) => setCurrentEntry({ ...currentEntry, score: value })}
              className="grid grid-cols-1 gap-2"
            >
              {ROM_SCORES.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Movement-specific Notes */}
          <div>
            <Label>Movement Notes</Label>
            <Textarea
              value={currentEntry.notes}
              onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
              placeholder="Enter any observations specific to this movement..."
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={handleAddEntry}
            disabled={!currentEntry.movement}
          >
            Add Movement
          </Button>
        </div>

        {/* General Notes */}
        <div className="space-y-2">
          <Label>General Notes</Label>
          <Textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Enter any general observations about this joint..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSaveAll}>Save Assessment</Button>
        </div>
      </div>
    </ScrollArea>
  );
}
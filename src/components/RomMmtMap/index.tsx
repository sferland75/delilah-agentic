import React from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROMAssessment } from './ROMAssessment';
import { MMTAssessment } from './MMTAssessment';
import { toast } from '@/components/ui/use-toast';
import { BodyMapLegend } from './BodyMapLegend';
import { BodyMap } from './BodyMap';
import { FindingsSummary } from './FindingsSummary';

interface RomMmtMapProps {
  onUpdate?: (data: any) => void;
}

export const RomMmtMap: React.FC<RomMmtMapProps> = ({ onUpdate }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState<any>(null);
  const [selectedType, setSelectedType] = React.useState<'ROM' | 'MMT' | null>(null);
  const [view, setView] = React.useState<'front' | 'back'>('front');
  
  const { getValues, setValue, control } = useFormContext();
  const functionalAssessment = getValues('functionalAssessment') || {};
  const romData = functionalAssessment.rangeOfMotion || {};
  const mmtData = functionalAssessment.manualMuscleTesting || {};

  React.useEffect(() => {
    console.log('Current ROM Data:', romData);
  }, [romData]);

  const handleJointClick = (joint: any) => {
    console.log('Joint clicked:', joint);
    setSelectedArea({
      ...joint,
      label: joint.label
    });
    setSelectedType('ROM');
    setShowDialog(true);
  };

  const handleSegmentClick = (segment: any) => {
    setSelectedArea({
      ...segment,
      label: segment.label
    });
    setSelectedType('MMT');
    setShowDialog(true);
  };

  const handleAssessmentSave = (data: any) => {
    if (!data) {
      setShowDialog(false);
      return;
    }

    console.log('Saving Assessment Data:', { 
      type: selectedType,
      area: selectedArea,
      data: data
    });

    const baseKey = `functionalAssessment.${selectedType === 'ROM' ? 'rangeOfMotion' : 'manualMuscleTesting'}`;
    const label = selectedArea.label.replace(' ', '_');
    const key = `${baseKey}.${label}`;

    if (selectedType === 'ROM') {
      setValue(key, {
        ...data,
        type: selectedType,
        label: selectedArea.label,
        joint: selectedArea.label,
        entries: data.entries.map((entry: any) => ({
          ...entry,
          label: `${selectedArea.label} ${entry.movement}`
        }))
      }, { shouldValidate: true });
    } else {
      // MMT data saving (unchanged)
      setValue(key, {
        ...data,
        type: selectedType,
        label: selectedArea.label,
        segment: selectedArea.label,
        score: data.value || data.score || '5'
      }, { shouldValidate: true });
    }

    const updatedData = getValues('functionalAssessment');
    console.log('Updated Functional Assessment:', updatedData);

    setShowDialog(false);
    toast({
      title: `${selectedType} Assessment Saved`,
      description: `Updated ${selectedType} assessment for ${selectedArea?.label}`,
    });

    if (onUpdate) {
      onUpdate({ 
        type: selectedType, 
        data: selectedType === 'ROM' ? updatedData.rangeOfMotion : updatedData.manualMuscleTesting 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <Button 
            variant={view === 'front' ? 'default' : 'outline'}
            onClick={() => setView('front')}
          >
            Anterior View
          </Button>
          <Button
            variant={view === 'back' ? 'default' : 'outline'}
            onClick={() => setView('back')}
          >
            Posterior View
          </Button>
        </div>

        <BodyMapLegend />
        
        <BodyMap 
          view={view}
          romData={romData}
          mmtData={mmtData}
          onJointClick={handleJointClick}
          onSegmentClick={handleSegmentClick}
        />

        <FindingsSummary 
          romFindings={Object.entries(romData)
            .filter(([key, data]: [string, any]) => {
              if (key === 'generalNotes') return false;
              // Check if any entry has a non-WFL score
              return data.entries?.some((entry: any) => entry.score !== 'WFL');
            })
            .flatMap(([joint, data]: [string, any]) => 
              data.entries
                .filter((entry: any) => entry.score !== 'WFL')
                .map((entry: any) => ({
                  joint,
                  ...entry,
                  label: `${data.label} ${entry.movement}`
                }))
            )}
          mmtFindings={Object.entries(mmtData)
            .filter(([key, data]: [string, any]) => key !== 'generalNotes' && data.score !== '5')
            .map(([muscle, data]: [string, any]) => ({
              muscle,
              ...data,
              label: data.label || muscle.replace('_', ' ')
            }))}
        />
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedType} Assessment - {selectedArea?.label}
            </DialogTitle>
          </DialogHeader>

          {selectedType === 'ROM' && selectedArea && (
            <ROMAssessment
              control={control}
              prefix="functionalAssessment.rangeOfMotion"
              onSave={handleAssessmentSave}
              initialData={romData[selectedArea.label.replace(' ', '_')]}
              joint={selectedArea}
            />
          )}

          {selectedType === 'MMT' && selectedArea && (
            <MMTAssessment
              control={control}
              prefix="functionalAssessment.manualMuscleTesting"
              onSave={handleAssessmentSave}
              initialData={mmtData[selectedArea.label.replace(' ', '_')]}
              segment={selectedArea}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
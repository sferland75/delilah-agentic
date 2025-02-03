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
  
  const { getValues, setValue } = useFormContext();
  const functionalAssessment = getValues('functionalAssessment') || {};
  const romData = functionalAssessment.rangeOfMotion || {};
  const mmtData = functionalAssessment.manualMuscleTesting || {};

  const handleJointClick = (joint: any) => {
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
    const baseKey = `functionalAssessment.${selectedType === 'ROM' ? 'rangeOfMotion' : 'manualMuscleTesting'}`;
    const assessmentKey = `${selectedArea.label.replace(' ', '_')}_${data.movement || ''}`.trim().replace(/_+$/, '');
    const key = `${baseKey}.${assessmentKey}`;
    
    setValue(key, {
      ...data,
      type: selectedType,
      label: `${selectedArea.label} ${data.movement || ''}`.trim()
    }, { shouldValidate: true });

    setShowDialog(false);
    toast({
      title: `${selectedType} Assessment Saved`,
      description: `Updated ${selectedType} assessment for ${selectedArea?.label}`,
    });

    if (onUpdate) {
      const updatedData = getValues('functionalAssessment');
      onUpdate({ 
        type: selectedType, 
        data: selectedType === 'ROM' ? updatedData.rangeOfMotion : updatedData.manualMuscleTesting 
      });
    }
  };

  // ROM/MMT Findings for summary
  const romFindings = Object.entries(romData)
    .filter(([key, data]: [string, any]) => key !== 'generalNotes' && data.score !== 'WFL')
    .map(([joint, data]: [string, any]) => ({
      joint,
      ...data,
      label: data.label || joint.replace('_', ' ')
    }));

  const mmtFindings = Object.entries(mmtData)
    .filter(([key, data]: [string, any]) => key !== 'generalNotes' && data.score !== '5')
    .map(([muscle, data]: [string, any]) => ({
      muscle,
      ...data,
      label: data.label || muscle.replace('_', ' ')
    }));

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
          romFindings={romFindings}
          mmtFindings={mmtFindings}
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
              joint={selectedArea}
              onSave={handleAssessmentSave}
              onCancel={() => setShowDialog(false)}
              initialData={romData[`${selectedArea.label.replace(' ', '_')}`]}
            />
          )}

          {selectedType === 'MMT' && selectedArea && (
            <MMTAssessment
              segment={selectedArea}
              onSave={handleAssessmentSave}
              onCancel={() => setShowDialog(false)}
              initialData={mmtData[`${selectedArea.label.replace(' ', '_')}`]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { anteriorSegments, posteriorSegments } from './segments';
import { PainAssessment } from './PainAssessment';

interface BodyMapProps {
  onUpdate?: (data: any) => void;
}

export const BodyMap: React.FC<BodyMapProps> = ({ onUpdate }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [view, setView] = useState<'front' | 'back'>('front');
  const { watch, setValue } = useFormContext();
  
  const painData = watch('symptoms.pain') || {};

  const handleClick = (area: any) => {
    setSelectedArea(area);
    setShowDialog(true);
  };

  const handlePainAssessmentSave = (data: any) => {
    const newPainData = {
      ...painData,
      [data.region]: {
        painLevel: data.painLevel,
        qualifiers: data.qualifiers,
        notes: data.notes,
        timestamp: new Date().toISOString()
      }
    };
    
    setValue('symptoms.pain', newPainData, { shouldDirty: true });
    if (onUpdate) {
      onUpdate(newPainData);
    }
    setShowDialog(false);
  };

  const getRegionColor = (regionId: string) => {
    const regionPain = painData[regionId]?.painLevel || 0;
    if (regionPain === 0) return "fill-gray-100";
    if (regionPain <= 3) return "fill-yellow-100";
    if (regionPain <= 6) return "fill-orange-100";
    if (regionPain <= 8) return "fill-red-100";
    return "fill-red-200";
  };

  return (
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

      <div className="relative w-[400px] h-[500px] border rounded-lg bg-white">
        <svg viewBox="0 0 400 500" className="w-full h-full">
          {Object.entries(view === 'front' ? anteriorSegments : posteriorSegments)
            .map(([id, segment]) => (
              <path
                key={id}
                d={segment.path}
                className={`
                  ${getRegionColor(id)}
                  stroke-gray-400
                  hover:brightness-95
                  cursor-pointer
                  transition-colors
                `}
                onClick={() => handleClick({ id, ...segment })}
              >
                <title>{segment.label}</title>
              </path>
          ))}
        </svg>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Pain Assessment - {selectedArea?.label}
            </DialogTitle>
          </DialogHeader>

          {selectedArea && (
            <PainAssessment
              region={selectedArea}
              onSave={handlePainAssessmentSave}
              initialData={painData[selectedArea.id]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
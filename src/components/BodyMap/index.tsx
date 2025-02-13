<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { anteriorSegments, posteriorSegments } from './segments';
import { PainAssessment } from './PainAssessment';

interface BodyMapProps {
<<<<<<< HEAD
  onRegionSelect?: (region: any) => void;
  onPainDataUpdate?: (regionId: string, data: any) => void;
  painData?: Record<string, any>;
  view: 'anterior' | 'posterior';
}

export const BodyMap: React.FC<BodyMapProps> = ({ 
  onRegionSelect, 
  onPainDataUpdate,
  painData = {},
  view
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  // Debug pain data updates
  useEffect(() => {
    console.log('Pain data updated:', painData);
  }, [painData]);

  const handleClick = (area: any) => {
    console.log('Clicked area:', area);
    console.log('Current pain data:', painData);
    console.log('Pain data for region:', area.id, painData[area.id]);
    setSelectedArea(area);
    if (onRegionSelect) {
      onRegionSelect(area);
    }
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    setShowDialog(true);
  };

  const handlePainAssessmentSave = (data: any) => {
<<<<<<< HEAD
    console.log('Saving pain data for region:', selectedArea?.id, data);
    if (onPainDataUpdate && selectedArea) {
      onPainDataUpdate(selectedArea.id, data);
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    }
    setShowDialog(false);
  };

  const getRegionColor = (regionId: string) => {
<<<<<<< HEAD
    const regionPain = painData[regionId]?.severity || 0;
    console.log('Getting color for region:', regionId, 'pain level:', regionPain);
    
    if (regionPain === 0) return "fill-gray-100 hover:fill-gray-200";
    if (regionPain <= 3) return "fill-yellow-200 hover:fill-yellow-300";
    if (regionPain <= 6) return "fill-orange-200 hover:fill-orange-300";
    if (regionPain <= 8) return "fill-red-200 hover:fill-red-300";
    return "fill-red-300 hover:fill-red-400";
  };

  const segments = view === 'anterior' ? anteriorSegments : posteriorSegments;

  return (
    <div>
      <div className="relative w-[300px] h-[600px] border rounded-lg bg-white">
        <svg 
          viewBox="0 0 400 600" 
          className="w-full h-full" 
          preserveAspectRatio="xMidYMid meet"
        >
          {Object.entries(segments).map(([id, segment]) => {
            const color = getRegionColor(id);
            return (
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
              <path
                key={id}
                d={segment.path}
                className={`
<<<<<<< HEAD
                  ${color}
                  stroke-gray-400
                  cursor-pointer
                  transition-colors
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick({ id, ...segment });
                }}
              >
                <title>{segment.label}</title>
              </path>
            );
          })}
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
        </svg>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
<<<<<<< HEAD
        <DialogContent>
=======
        <DialogContent className="max-w-2xl">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          <DialogHeader>
            <DialogTitle>
              Pain Assessment - {selectedArea?.label}
            </DialogTitle>
          </DialogHeader>
<<<<<<< HEAD
=======

>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { anteriorSegments, posteriorSegments } from './segments';
import { PainAssessment } from './PainAssessment';

interface BodyMapProps {
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
    setShowDialog(true);
  };

  const handlePainAssessmentSave = (data: any) => {
    console.log('Saving pain data for region:', selectedArea?.id, data);
    if (onPainDataUpdate && selectedArea) {
      onPainDataUpdate(selectedArea.id, data);
    }
    setShowDialog(false);
  };

  const getRegionColor = (regionId: string) => {
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
              <path
                key={id}
                d={segment.path}
                className={`
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
        </svg>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
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
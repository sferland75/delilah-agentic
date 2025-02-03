import React, { useState } from 'react';
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
  painData?: Record<string, any>;
}

export const BodyMap: React.FC<BodyMapProps> = ({ onRegionSelect, painData = {} }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const handleClick = (area: any) => {
    setSelectedArea(area);
    if (onRegionSelect) {
      onRegionSelect(area);
    }
    setShowDialog(true);
  };

  const handlePainAssessmentSave = (data: any) => {
    setShowDialog(false);
  };

  const getRegionColor = (regionId: string) => {
    const regionPain = painData[regionId]?.severity || 0;
    
    if (regionPain === 0) return "fill-gray-100";
    if (regionPain <= 3) return "fill-yellow-200";
    if (regionPain <= 6) return "fill-orange-200";
    if (regionPain <= 8) return "fill-red-200";
    return "fill-red-300";
  };

  const renderBody = (segments: typeof anteriorSegments, label: string) => (
    <div className="flex flex-col items-center">
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="relative w-[300px] h-[500px] border rounded-lg bg-white">
        <svg viewBox="0 0 400 500" className="w-full h-full">
          {Object.entries(segments)
            .map(([id, segment]) => {
              const color = getRegionColor(id);
              return (
                <path
                  key={id}
                  d={segment.path}
                  className={`
                    ${color}
                    stroke-gray-400
                    hover:brightness-95
                    cursor-pointer
                    transition-colors
                  `}
                  onClick={() => handleClick({ id, ...segment })}
                >
                  <title>{segment.label}</title>
                </path>
              );
            })}
        </svg>
      </div>
    </div>
  );

  return (
    <div>
      {/* Legend */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-400"></div>
          <span className="text-sm">No Pain</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 border border-gray-400"></div>
          <span className="text-sm">Mild (1-3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-200 border border-gray-400"></div>
          <span className="text-sm">Moderate (4-6)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border border-gray-400"></div>
          <span className="text-sm">Severe (7-8)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 border border-gray-400"></div>
          <span className="text-sm">Very Severe (9-10)</span>
        </div>
      </div>

      {/* Body Maps */}
      <div className="flex justify-center gap-8">
        {renderBody(anteriorSegments, 'Anterior View')}
        {renderBody(posteriorSegments, 'Posterior View')}
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
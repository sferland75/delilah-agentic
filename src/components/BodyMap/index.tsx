import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { anteriorSegments, posteriorSegments } from './segments';
import { anteriorHeadSegments, posteriorHeadSegments } from './headSegments';
import { PainAssessment } from './PainAssessment';
import { HeadPainAssessment } from './HeadPainAssessment';
import { HandPainAssessment } from './HandPainAssessment';

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

  const handleClick = (area: any) => {
    console.log('Selected area:', area);
    setSelectedArea(area);
    if (onRegionSelect) {
      onRegionSelect(area);
    }
    setShowDialog(true);
  };

  const handlePainAssessmentSave = (data: any) => {
    console.log('Saving pain assessment:', selectedArea?.id, data);
    
    if (onPainDataUpdate && selectedArea) {
      onPainDataUpdate(selectedArea.id, data);
    }

    setShowDialog(false);
  };

  const getRegionColor = (regionId: string) => {
    const regionPain = painData[regionId]?.severity || 0;
    console.log('Getting color for region:', regionId, 'severity:', regionPain);
    
    if (regionPain === 0) return "fill-gray-100";
    if (regionPain <= 3) return "fill-yellow-200";
    if (regionPain <= 6) return "fill-orange-200";
    if (regionPain <= 8) return "fill-red-200";
    return "fill-red-300";
  };

  const isHeadRegion = (id: string) => {
    return id.includes('head');
  };

  const isHandRegion = (id: string) => {
    return id.includes('Hand') || id.includes('hand');
  };

  // Select appropriate segments based on view
  const currentHeadSegments = view === 'anterior' ? anteriorHeadSegments : posteriorHeadSegments;
  const currentBodySegments = view === 'anterior' ? anteriorSegments : posteriorSegments;

  return (
    <div>
      <div className="relative w-[300px] h-[600px] border rounded-lg bg-white">
        <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Render body segments */}
          {Object.entries(currentBodySegments)
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

          {/* Render head segments */}
          {Object.entries(currentHeadSegments)
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="pain-assessment-description">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
            <DialogTitle>
              Pain Assessment - {selectedArea?.label}
            </DialogTitle>
          </DialogHeader>
          <div id="pain-assessment-description" className="sr-only">
            Pain assessment form for {selectedArea?.label}
          </div>

          <div className="overflow-y-auto pr-2">
            {selectedArea && (
              isHeadRegion(selectedArea.id) ? (
                <HeadPainAssessment
                  region={selectedArea}
                  onSave={handlePainAssessmentSave}
                  initialData={painData[selectedArea.id]}
                />
              ) : isHandRegion(selectedArea.id) ? (
                <HandPainAssessment
                  region={selectedArea}
                  onSave={handlePainAssessmentSave}
                  initialData={painData[selectedArea.id]}
                />
              ) : (
                <PainAssessment
                  region={selectedArea}
                  onSave={handlePainAssessmentSave}
                  initialData={painData[selectedArea.id]}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
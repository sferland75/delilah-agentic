import React, { useState, useEffect } from 'react';
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
import { Card, CardContent } from "@/components/ui/card";

interface BodyMapProps {
  onRegionSelect?: (region: any) => void;
  onPainDataUpdate?: (regionId: string, data: any) => void;
  painData?: Record<string, any>;
}

export const BodyMap: React.FC<BodyMapProps> = ({ 
  onRegionSelect, 
  onPainDataUpdate,
  painData: externalPainData = {} 
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [localPainData, setLocalPainData] = useState(externalPainData);

  // Keep local state in sync with external data
  useEffect(() => {
    setLocalPainData(externalPainData);
  }, [externalPainData]);

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
    
    // Update local state
    const newPainData = {
      ...localPainData,
      [selectedArea.id]: data
    };
    setLocalPainData(newPainData);

    // Notify parent component
    if (onPainDataUpdate) {
      onPainDataUpdate(selectedArea.id, data);
    }

    setShowDialog(false);
  };

  const getRegionColor = (regionId: string) => {
    const regionPain = localPainData[regionId]?.severity || 0;
    
    if (regionPain === 0) return "fill-gray-100";
    if (regionPain <= 3) return "fill-yellow-200";
    if (regionPain <= 6) return "fill-orange-200";
    if (regionPain <= 8) return "fill-red-200";
    return "fill-red-300";
  };

  const isHeadRegion = (id: string) => {
    return id.includes('head') || id.includes('Head');
  };

  const isHandRegion = (id: string) => {
    return id.includes('Hand') || id.includes('hand');
  };

  const renderBody = (segments: typeof anteriorSegments, headSegments: typeof anteriorHeadSegments, label: string) => (
    <div className="flex flex-col items-center">
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="relative w-[300px] h-[600px] border rounded-lg bg-white">
        <svg viewBox="0 0 400 600" className="w-full h-full">
          {/* Head segments */}
          {Object.entries(headSegments)
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

          {/* Body segments */}
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

  const renderSymptomsSummary = () => {
    const regionsWithPain = Object.entries(localPainData).filter(([_, data]) => data?.severity > 0);
    
    if (regionsWithPain.length === 0) return null;

    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Recorded Symptoms</h3>
          <div className="space-y-4">
            {regionsWithPain.map(([regionId, data]) => {
              // Find the segment definition from any of the segment maps
              const segment = {
                ...anteriorSegments[regionId],
                ...posteriorSegments[regionId],
                ...anteriorHeadSegments[regionId],
                ...posteriorHeadSegments[regionId]
              };
              
              return (
                <div key={regionId} className="border-b pb-3">
                  <h4 className="font-medium">{segment.label}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Pain Level: {data.severity}/10</div>
                    {data.symptoms?.length > 0 && (
                      <div className="mt-1">
                        Symptoms: {data.symptoms.join(', ')}
                      </div>
                    )}
                    {data.pattern && (
                      <div className="mt-1">Pattern: {data.pattern}</div>
                    )}
                    {data.impact && (
                      <div className="mt-1">Impact: {data.impact}</div>
                    )}
                    {data.notes && (
                      <div className="mt-1">Notes: {data.notes}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

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
        {renderBody(anteriorSegments, anteriorHeadSegments, 'Anterior View')}
        {renderBody(posteriorSegments, posteriorHeadSegments, 'Posterior View')}
      </div>

      {/* Symptoms Summary */}
      {renderSymptomsSummary()}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
            <DialogTitle>
              Pain Assessment - {selectedArea?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto pr-2">
            {selectedArea && (
              isHeadRegion(selectedArea.id) ? (
                <HeadPainAssessment
                  region={selectedArea}
                  onSave={handlePainAssessmentSave}
                  initialData={localPainData[selectedArea.id]}
                />
              ) : isHandRegion(selectedArea.id) ? (
                <HandPainAssessment
                  region={selectedArea}
                  onSave={handlePainAssessmentSave}
                  initialData={localPainData[selectedArea.id]}
                />
              ) : (
                <PainAssessment
                  region={selectedArea}
                  onSave={handlePainAssessmentSave}
                  initialData={localPainData[selectedArea.id]}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
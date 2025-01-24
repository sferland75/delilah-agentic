import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { anteriorSegments, posteriorSegments } from '../BodyMap/segments';
import { joints } from '../BodyMap/joints';
import { ROMAssessment } from './ROMAssessment';
import { MMTAssessment } from './MMTAssessment';
import { toast } from '@/components/ui/use-toast';

type ROMScore = 'WFL' | '3/4' | '1/2' | '1/4' | 'nominal';
type MMTScore = '0' | '1' | '2' | '3' | '4' | '5';

interface RomMmtMapProps {
  onUpdate?: (data: any) => void;
}

export const RomMmtMap: React.FC<RomMmtMapProps> = ({ onUpdate }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState<any>(null);
  const [selectedType, setSelectedType] = React.useState<'ROM' | 'MMT' | null>(null);
  const [view, setView] = React.useState<'front' | 'back'>('front');
  const { watch, setValue } = useFormContext();
  
  const romData = watch('assessment.rom') || {};
  const mmtData = watch('assessment.mmt') || {};

  const handleJointClick = (joint: any) => {
    setSelectedArea(joint);
    setSelectedType('ROM');
    setShowDialog(true);
  };

  const handleSegmentClick = (segment: any) => {
    setSelectedArea(segment);
    setSelectedType('MMT');
    setShowDialog(true);
  };

  const getJointColor = (jointId: string) => {
    const jointRom = romData[jointId]?.score || 'WFL'; // Set default to 'WFL'
    
    switch (jointRom) {
      case 'WFL': 
        return "fill-green-200 stroke-green-600 stroke-2";
      case '3/4':
        return "fill-blue-200 stroke-blue-600 stroke-2";
      case '1/2':
        return "fill-yellow-200 stroke-yellow-600 stroke-2";
      case '1/4':
        return "fill-orange-200 stroke-orange-600 stroke-2";
      case 'nominal':
        return "fill-red-200 stroke-red-600 stroke-2";
      default:
        return "fill-green-200 stroke-green-600 stroke-2"; // Default to WFL
    }
  };

  const getSegmentColor = (segmentId: string) => {
    const mmt = mmtData[segmentId]?.score || '5'; // Default to '5'
    
    switch (mmt) {
      case '5': return "fill-green-200 hover:fill-green-300";
      case '4': return "fill-blue-200 hover:fill-blue-300";
      case '3': return "fill-yellow-200 hover:fill-yellow-300";
      case '2': return "fill-orange-200 hover:fill-orange-300";
      case '1': return "fill-red-200 hover:fill-red-300";
      case '0': return "fill-red-400 hover:fill-red-500";
      default: return "fill-green-200 hover:fill-green-300"; // Default to 5
    }
  };

  const handleAssessmentSave = (data: any) => {
    console.log('Saving assessment data:', data);
    
    if (selectedType === 'ROM') {
      const newRomData = {
        ...romData,
        [data.joint]: {
          ...data,
          label: selectedArea?.label
        }
      };
      console.log('New ROM data:', newRomData);
      setValue('assessment.rom', newRomData);
      if (onUpdate) onUpdate({ type: 'ROM', data: newRomData });
    } else {
      const newMmtData = {
        ...mmtData,
        [data.segment]: {
          ...data,
          label: selectedArea?.label
        }
      };
      setValue('assessment.mmt', newMmtData);
      if (onUpdate) onUpdate({ type: 'MMT', data: newMmtData });
    }

    setShowDialog(false);
    toast({
      title: `${selectedType} Assessment Saved`,
      description: `Updated ${selectedType} assessment for ${selectedArea?.label}`,
    });
  };

  const getVisibleJoints = () => {
    return Object.entries(joints).filter(([_, joint]) => {
      return joint.view === 'both' || joint.view === view;
    });
  };

  const SpineLine = () => {
    if (view !== 'back') return null;
    return (
      <line
        x1="200"
        y1="75"
        x2="200"
        y2="195"
        stroke="gray"
        strokeWidth="2"
        className="pointer-events-none"
      />
    );
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

        <div className="grid grid-cols-5 gap-2 w-full text-sm text-center mb-2">
          <div>WFL</div>
          <div>3/4</div>
          <div>1/2</div>
          <div>1/4</div>
          <div>Nominal</div>
          <div className="w-4 h-4 mx-auto rounded-full bg-green-200 border border-green-600"></div>
          <div className="w-4 h-4 mx-auto rounded-full bg-blue-200 border border-blue-600"></div>
          <div className="w-4 h-4 mx-auto rounded-full bg-yellow-200 border border-yellow-600"></div>
          <div className="w-4 h-4 mx-auto rounded-full bg-orange-200 border border-orange-600"></div>
          <div className="w-4 h-4 mx-auto rounded-full bg-red-200 border border-red-600"></div>
        </div>

        <Card className="w-full max-w-[400px]">
          <CardContent className="p-4">
            <div className="relative w-full h-[500px]">
              <svg viewBox="0 0 400 500" className="w-full h-full">
                {/* Body Segments for MMT */}
                {Object.entries(view === 'front' ? anteriorSegments : posteriorSegments)
                  .map(([id, segment]) => (
                    <path
                      key={id}
                      d={segment.path}
                      className={`
                        ${getSegmentColor(id)}
                        stroke-gray-400
                        cursor-pointer
                        transition-all duration-200
                      `}
                      onClick={() => handleSegmentClick({ id, ...segment })}
                    >
                      <title>{segment.label}</title>
                    </path>
                ))}
                
                {/* Spine line in posterior view */}
                <SpineLine />
                
                {/* Joint Circles for ROM */}
                {getVisibleJoints().map(([id, joint]) => {
                  const colorClass = getJointColor(id);
                  console.log(`Joint ${id} color class:`, colorClass);
                  return (
                    <circle
                      key={id}
                      cx={joint.cx}
                      cy={joint.cy}
                      r={joint.r}
                      className={`
                        ${colorClass}
                        cursor-pointer
                        transition-all duration-200
                      `}
                      onClick={() => handleJointClick({ id, ...joint })}
                    >
                      <title>{joint.label}</title>
                    </circle>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Dialog */}
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
              initialData={romData[selectedArea.id]}
            />
          )}

          {selectedType === 'MMT' && selectedArea && (
            <MMTAssessment
              segment={selectedArea}
              onSave={handleAssessmentSave}
              onCancel={() => setShowDialog(false)}
              initialData={mmtData[selectedArea.id]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
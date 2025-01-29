import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { ASSESSMENT_AREAS, BODY_OUTLINE, JOINT_CIRCLES } from './assessment-areas';
import { ROMDialog, MMTDialog } from './AssessmentDialogs';
import type { AssessmentArea, AssessmentType } from './types';

interface AssessmentMapProps {
  onSelect?: (area: AssessmentArea, assessmentType: AssessmentType) => void;
}

export const AssessmentMap: React.FC<AssessmentMapProps> = ({ onSelect }) => {
  const { setValue, watch } = useFormContext();
  const [selectedArea, setSelectedArea] = useState<AssessmentArea | null>(null);
  const [showROMDialog, setShowROMDialog] = useState(false);
  const [showMMTDialog, setShowMMTDialog] = useState(false);

  const handleAreaClick = (area: AssessmentArea) => {
    if (area.type === 'visual') return;
    
    setSelectedArea(area);
    if (area.assessments.includes('MMT')) {
      setShowMMTDialog(true);
    } else if (area.assessments.includes('ROM')) {
      setShowROMDialog(true);
    }
  };

  const handleJointClick = (jointId: string) => {
    const joint = JOINT_CIRCLES.find(j => j.id === jointId);
    if (joint) {
      setSelectedArea({
        id: jointId,
        type: 'joint',
        label: joint.label,
        assessments: ['ROM'],
        path: '' // Not needed for dialogs
      });
      setShowROMDialog(true);
    }
  };

  const getMMTColor = (areaId: string) => {
    const mmtData = watch(`mmt.${areaId}`);
    if (!mmtData?.affected) return "fill-transparent stroke-slate-300 hover:fill-slate-50";

    const grade = parseInt(mmtData.grade);
    switch (true) {
      case grade >= 4: // Normal to Good
        return "fill-green-100 stroke-green-500";
      case grade === 3: // Fair
        return "fill-yellow-100 stroke-yellow-500";
      case grade === 2: // Poor
        return "fill-orange-100 stroke-orange-500";
      case grade <= 1: // Trace or No movement
        return "fill-red-100 stroke-red-500";
      default:
        return "fill-transparent stroke-slate-300";
    }
  };

  const getROMColor = (jointId: string) => {
    const romData = watch(`rom.${jointId}`);
    if (!romData?.affected) return "fill-transparent stroke-slate-300 hover:fill-slate-50";

    const percentage = parseInt(romData.percentage);
    switch (true) {
      case percentage >= 90: // Normal
        return "fill-green-100 stroke-green-500";
      case percentage >= 75: // Mild restriction
        return "fill-yellow-100 stroke-yellow-500";
      case percentage >= 50: // Moderate restriction
        return "fill-orange-100 stroke-orange-500";
      case percentage < 50: // Severe restriction
        return "fill-red-100 stroke-red-500";
      default:
        return "fill-transparent stroke-slate-300";
    }
  };

  const getAreaColor = (area: AssessmentArea) => {
    if (area.type === 'visual') return "fill-gray-200 stroke-gray-300";
    return area.type === 'joint' ? getROMColor(area.id) : getMMTColor(area.id);
  };

  const handleROMSave = (data: any) => {
    if (!selectedArea) return;
    
    setValue(`rom.${selectedArea.id}`, {
      affected: true,
      ...data
    }, { shouldDirty: true });

    if (onSelect) {
      onSelect(selectedArea, 'ROM');
    }
  };

  const handleMMTSave = (data: any) => {
    if (!selectedArea) return;

    setValue(`mmt.${selectedArea.id}`, {
      affected: true,
      ...data
    }, { shouldDirty: true });

    if (onSelect) {
      onSelect(selectedArea, 'MMT');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white rounded-lg border p-8">
      <div className="flex gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-500"></div>
          <span>Normal/Good (MMT 4-5, ROM ≥90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-500"></div>
          <span>Fair (MMT 3, ROM 75-89%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100 border border-orange-500"></div>
          <span>Poor (MMT 2, ROM 50-74%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-500"></div>
          <span>Severe (MMT 0-1, ROM &lt;50%)</span>
        </div>
      </div>

      <svg 
        width="300" 
        height="450" 
        viewBox="140 0 120 420"
        className="bg-white"
      >
        {/* Base body outline */}
        <path
          d={BODY_OUTLINE}
          className="fill-transparent stroke-slate-300"
          strokeWidth="1"
        />
        
        {/* Visual elements (head) first */}
        {ASSESSMENT_AREAS.filter(area => area.type === 'visual').map((area) => (
          <path
            key={area.id}
            d={area.path}
            className={getAreaColor(area)}
            strokeWidth="1"
          >
            <title>{area.label}</title>
          </path>
        ))}

        {/* Muscle segments */}
        {ASSESSMENT_AREAS.filter(area => area.type === 'muscle').map((area) => (
          <path
            key={area.id}
            d={area.path}
            className={`
              ${getAreaColor(area)}
              cursor-pointer
              transition-colors
              duration-200
            `}
            strokeWidth="1"
            onClick={() => handleAreaClick(area)}
          >
            <title>{`${area.label} (MMT)`}</title>
          </path>
        ))}

        {/* Joint circles */}
        {JOINT_CIRCLES.map((joint) => (
          <circle
            key={joint.id}
            cx={joint.cx}
            cy={joint.cy}
            r={joint.r}
            className={`
              ${getAreaColor({
                id: joint.id,
                type: 'joint',
                label: joint.label,
                assessments: ['ROM'],
                path: ''
              })}
              cursor-pointer
              transition-colors
              duration-200
            `}
            onClick={() => handleJointClick(joint.id)}
          >
            <title>{`${joint.label} (ROM)`}</title>
          </circle>
        ))}
      </svg>

      {/* Assessment Dialogs */}
      {selectedArea && (
        <>
          <ROMDialog
            isOpen={showROMDialog}
            onClose={() => setShowROMDialog(false)}
            joint={selectedArea.label}
            onSave={handleROMSave}
          />
          <MMTDialog
            isOpen={showMMTDialog}
            onClose={() => setShowMMTDialog(false)}
            muscleGroup={selectedArea.label}
            onSave={handleMMTSave}
          />
        </>
      )}
    </div>
  );
};
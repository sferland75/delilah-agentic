import React, { useState, useCallback } from 'react';
import { useFormContext } from "react-hook-form";
import { ASSESSMENT_AREAS, BODY_OUTLINE, JOINT_CIRCLES } from './assessment-areas';
import { ROMDialog, MMTDialog } from './AssessmentDialogs';
import type { AssessmentArea, AssessmentType, ROMAssessment, MMTAssessment } from './types';

interface AssessmentMapProps {
  onSelect?: (area: AssessmentArea, assessmentType: AssessmentType) => void;
}

export const AssessmentMapIntegration: React.FC<AssessmentMapProps> = ({ onSelect }) => {
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
        path: ''
      });
      setShowROMDialog(true);
    }
  };

  const getMMTColor = useCallback((areaId: string) => {
    const mmtData = watch(`mmt.${areaId}`);
    console.log('Getting MMT color for area', areaId, 'with data:', mmtData);

    if (!mmtData?.affected || !mmtData?.grade) {
      console.log('No valid MMT data for area', areaId);
      return "fill-transparent stroke-slate-300 hover:fill-slate-50";
    }

    const grade = typeof mmtData.grade === 'string' ? 
      parseInt(mmtData.grade) : mmtData.grade;
    
    console.log('Parsed MMT grade:', grade, typeof grade);

    if (grade === 5) {
      console.log('MMT Grade 5: Normal');
      return "fill-green-100 stroke-green-500";
    }
    if (grade === 4) {
      console.log('MMT Grade 4: Good');
      return "fill-yellow-100 stroke-yellow-500";
    }
    if (grade === 3) {
      console.log('MMT Grade 3: Fair');
      return "fill-orange-100 stroke-orange-500";
    }
    if (grade <= 2) {
      console.log('MMT Grade ≤2: Poor');
      return "fill-red-100 stroke-red-500";
    }

    console.log('Unexpected MMT grade:', grade);
    return "fill-transparent stroke-slate-300";
  }, [watch]);

  const getROMColor = useCallback((jointId: string) => {
    const romData = watch(`rom.${jointId}`);
    console.log('ROM Data for joint', jointId, ':', romData);

    if (!romData?.affected || !romData?.percentage) {
      return "fill-transparent stroke-slate-300 hover:fill-slate-50";
    }

    const percentage = Number(romData.percentage);
    console.log('ROM percentage after parsing:', percentage);

    if (percentage >= 90) {
      return "fill-green-100 stroke-green-500"; // Normal (≥90%)
    }
    if (percentage >= 75) {
      return "fill-yellow-100 stroke-yellow-500"; // Mild (75-89%)
    }
    if (percentage >= 50) {
      return "fill-orange-100 stroke-orange-500"; // Moderate (50-74%)
    }
    return "fill-red-100 stroke-red-500"; // Severe (<50%)
  }, [watch]);

  const getAreaColor = useCallback((area: AssessmentArea) => {
    if (area.type === 'visual') return "fill-gray-200 stroke-gray-300";
    return area.type === 'joint' ? getROMColor(area.id) : getMMTColor(area.id);
  }, [getROMColor, getMMTColor]);

  const handleMMTSave = (data: MMTAssessment) => {
    if (!selectedArea) return;
    
    // Create the MMT data object with all fields
    const mmtData = {
      grade: data.grade,
      painLevel: data.painLevel,
      observations: data.observations,
      affected: true,
      label: selectedArea.label,
      timestamp: new Date().toISOString()
    };
    
    console.log('Saving MMT data:', {
      areaId: selectedArea.id,
      data: mmtData
    });

    // Save complete data to form
    setValue(`mmt.${selectedArea.id}`, mmtData, { 
      shouldDirty: true, 
      shouldTouch: true,
      shouldValidate: true 
    });

    // Verify the save
    const savedData = watch(`mmt.${selectedArea.id}`);
    console.log('Verified saved MMT data:', savedData);

    if (onSelect) {
      onSelect(selectedArea, 'MMT');
    }

    setShowMMTDialog(false);
  };

  const handleROMSave = (data: ROMAssessment) => {
    if (!selectedArea) return;
    
    console.log('Saving ROM data:', {
      jointId: selectedArea.id,
      data: data
    });

    setValue(`rom.${selectedArea.id}`, {
      affected: true,
      ...data,
      label: selectedArea.label,
      timestamp: new Date().toISOString()
    }, { 
      shouldDirty: true, 
      shouldTouch: true,
      shouldValidate: true 
    });

    // Log the current value after setting
    const currentValue = watch(`rom.${selectedArea.id}`);
    console.log('Current ROM value after save:', currentValue);

    if (onSelect) {
      onSelect(selectedArea, 'ROM');
    }

    setShowROMDialog(false);
  };

  // Effect to log form data changes
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name?.includes('mmt') || name?.includes('rom')) {
        console.log('Form data changed:', { name, type, value });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="flex flex-col items-center gap-4 bg-white rounded-lg border p-8">
      <div className="flex gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-500"></div>
          <span>Normal (MMT 5/5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-500"></div>
          <span>Good (MMT 4/5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100 border border-orange-500"></div>
          <span>Fair (MMT 3/5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-500"></div>
          <span>Poor or less (MMT ≤2/5)</span>
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
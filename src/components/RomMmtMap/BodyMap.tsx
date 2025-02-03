import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { anteriorSegments, posteriorSegments } from '../BodyMap/segments';
import { joints } from '../BodyMap/joints';
import { getJointROMScore, getSegmentMMTGrade, getJointColor, getSegmentColor } from './utils';

interface BodyMapProps {
  view: 'front' | 'back';
  romData: any;
  mmtData: any;
  onJointClick: (joint: any) => void;
  onSegmentClick: (segment: any) => void;
}

export const BodyMap = ({ view, romData, mmtData, onJointClick, onSegmentClick }: BodyMapProps) => (
  <Card className="w-full max-w-md">
    <CardContent className="p-4">
      <div className="relative aspect-[2/3] max-h-[600px]">
        <svg 
          viewBox="0 0 400 600" 
          className="w-full h-full"
          style={{ 
            transform: 'scale(0.9)',
            transformOrigin: 'center center'
          }}
        >
          {/* Body Segments for MMT */}
          {Object.entries(view === 'front' ? anteriorSegments : posteriorSegments)
            .map(([id, segment]) => (
              <path
                key={id}
                d={segment.path}
                className={`
                  ${getSegmentColor(getSegmentMMTGrade(id, mmtData, view === 'front' ? anteriorSegments : posteriorSegments))}
                  stroke-gray-400
                  cursor-pointer
                  transition-all duration-200
                `}
                onClick={() => onSegmentClick({ id, ...segment })}
              >
                <title>{segment.label}</title>
              </path>
            ))}
          
          {/* Joint Circles for ROM */}
          {Object.entries(joints)
            .filter(([_, joint]) => joint.view === 'both' || joint.view === view)
            .map(([id, joint]) => (
              <circle
                key={id}
                cx={joint.cx}
                cy={joint.cy}
                r={joint.r}
                className={`
                  ${getJointColor(getJointROMScore(id, romData, joints))}
                  cursor-pointer
                  transition-all duration-200
                  hover:stroke-width-3
                `}
                onClick={() => onJointClick({ id, ...joint })}
              >
                <title>{joint.label}</title>
              </circle>
            ))}
        </svg>
      </div>
    </CardContent>
  </Card>
);
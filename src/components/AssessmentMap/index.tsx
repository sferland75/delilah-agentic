import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AssessmentMap } from './AssessmentMap';
import type { AssessmentType, AssessmentArea } from './types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssessmentMapIntegrationProps {
  onROMSelect: (areaId: string) => void;
  onMMTSelect: (areaId: string) => void;
}

export function AssessmentMapIntegration({ 
  onROMSelect, 
  onMMTSelect 
}: AssessmentMapIntegrationProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { watch } = useFormContext();

  const romAreas = watch('rom') || {};
  const mmtAreas = watch('mmt') || {};

  const handleAssessmentSelect = (area: AssessmentArea, type: AssessmentType) => {
    if (type === 'ROM') {
      onROMSelect(area.id);
    } else {
      onMMTSelect(area.id);
    }
  };

  const getAssessmentCount = () => {
    const romCount = Object.keys(romAreas).filter(key => 
      romAreas[key]?.affected
    ).length;
    
    const mmtCount = Object.keys(mmtAreas).filter(key => 
      mmtAreas[key]?.affected
    ).length;

    return { romCount, mmtCount };
  };

  const { romCount, mmtCount } = getAssessmentCount();

  return (
    <div className="mb-6">
      <Collapsible 
        open={isExpanded} 
        onOpenChange={setIsExpanded}
        className="bg-white rounded-lg border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between w-full p-4">
          <CollapsibleTrigger className="flex items-center gap-3">
            {isExpanded ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
            <h3 className="text-lg font-medium">Assessment Areas</h3>
          </CollapsibleTrigger>

          <div className="flex gap-2">
            {romCount > 0 && (
              <Badge variant="secondary">
                {romCount} ROM Areas
              </Badge>
            )}
            {mmtCount > 0 && (
              <Badge variant="secondary">
                {mmtCount} MMT Areas
              </Badge>
            )}
          </div>
        </div>

        <CollapsibleContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="flex gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-gray-400"></div>
                <span>ROM Assessment Areas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border border-gray-400"></div>
                <span>MMT Assessment Areas</span>
              </div>
            </div>

            <AssessmentMap onSelect={handleAssessmentSelect} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export type { AssessmentType, AssessmentArea };
export { ASSESSMENT_AREAS } from './assessment-areas';
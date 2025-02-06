import React, { memo } from 'react';
import { Card, CardContent } from '../ui/card';
import useEnvironmentalForm from '../../hooks/useEnvironmentalForm';
import PropertyOverview from './property-overview';
import RoomAssessment from './room-assessment';
import SafetyAssessment from './safety-assessment';

export const EnvironmentalSection: React.FC = () => {
  // Don't watch at this level since child components will watch their specific fields
  const { data } = useEnvironmentalForm({ shouldWatch: false });

  return (
    <Card className="w-full mt-4">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Environmental Assessment</h2>
        
        <div className="space-y-8">
          <PropertyOverview />
          <RoomAssessment />
          <SafetyAssessment />
        </div>
      </CardContent>
    </Card>
  );
};

// Memoize the component
export default memo(EnvironmentalSection);
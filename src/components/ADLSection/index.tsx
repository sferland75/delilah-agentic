import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { debugLog } from '../../utils/debug-utils';
import useADLForm from '../../hooks/useADLForm';
import BasicADL from './components/BasicADL';
import InstrumentalADL from './components/InstrumentalADL';
import HealthManagement from './components/HealthManagement';
import WorkStatus from './components/WorkStatus';

export const ADLSection: React.FC = () => {
  const { data } = useADLForm();

  React.useEffect(() => {
    debugLog('ADLSection', 'Component mounted');
    debugLog('ADLSection', 'Initial ADL data', data);
    
    return () => {
      debugLog('ADLSection', 'Component unmounted');
    };
  }, [data]);

  return (
    <Card className="w-full mt-4">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Activities of Daily Living</h2>
        
        <div className="space-y-8">
          <BasicADL />
          <InstrumentalADL />
          <HealthManagement />
          <WorkStatus />
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(ADLSection);
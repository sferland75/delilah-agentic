import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { debugLog } from '../../../utils/debug-utils';
import { mockEnvironmentalData } from '../../../testData/mockEnvironmentalData';

export const DebugPanel: React.FC = () => {
  const { reset, getValues } = useFormContext();

  const handleLoadTestData = () => {
    debugLog('DebugPanel', 'Loading test data');
    reset({
      ...getValues(),
      environmental: mockEnvironmentalData
    });
  };

  const handleLogCurrentData = () => {
    const currentData = getValues();
    debugLog('DebugPanel', 'Current form data', currentData);
  };

  const handleValidateStructure = () => {
    const currentData = getValues().environmental;
    debugLog('DebugPanel', 'Validating structure', currentData);
  };

  return (
    <Card className="mt-4 bg-gray-50">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Environmental Debug Panel</h3>
        <div className="space-y-2">
          <Button
            onClick={handleLoadTestData}
            className="w-full mb-2"
            variant="outline"
          >
            Load Test Data
          </Button>
          <Button
            onClick={handleLogCurrentData}
            className="w-full mb-2"
            variant="outline"
          >
            Log Current Data
          </Button>
          <Button
            onClick={handleValidateStructure}
            className="w-full"
            variant="outline"
          >
            Validate Structure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
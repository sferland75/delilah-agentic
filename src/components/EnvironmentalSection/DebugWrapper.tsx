import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { debugLog, validateEnvironmentalData, measureRenderTime } from '../../utils/debug-utils';

interface DebugWrapperProps {
  children: React.ReactNode;
  sectionName: string;
}

export const DebugWrapper: React.FC<DebugWrapperProps> = ({ children, sectionName }) => {
  const { watch } = useFormContext();
  
  useEffect(() => {
    debugLog(sectionName, 'Component mounted');
    const stopMeasure = measureRenderTime(sectionName);

    // Watch for environmental data changes
    const subscription = watch((value, { name, type }) => {
      if (name?.startsWith('environmental')) {
        debugLog(sectionName, `Form update detected: ${name}`, {
          type,
          value: value.environmental,
        });
      }
    });

    return () => {
      debugLog(sectionName, 'Component unmounted');
      stopMeasure();
      subscription.unsubscribe();
    };
  }, [sectionName, watch]);

  useEffect(() => {
    const environmentalData = watch('environmental');
    if (environmentalData) {
      const isValid = validateEnvironmentalData(environmentalData);
      debugLog(sectionName, `Data validation result: ${isValid}`, environmentalData);
    }
  }, [watch, sectionName]);

  return <div data-testid={`debug-wrapper-${sectionName}`}>{children}</div>;
};

export default DebugWrapper;
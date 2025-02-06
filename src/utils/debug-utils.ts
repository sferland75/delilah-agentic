import { EnvironmentalSection, PropertyAccess, RoomBase } from '../types/environmental';

export const DEBUG_MODE = process.env.NODE_ENV === 'development';

export const debugLog = (component: string, message: string, data?: any) => {
  if (DEBUG_MODE) {
    console.group(`[${component}]`);
    console.log(message);
    if (data) {
      console.log('Data:', data);
    }
    console.groupEnd();
  }
};

export const validateEnvironmentalData = (data: any): data is EnvironmentalSection => {
  if (!data || typeof data !== 'object') {
    debugLog('Validation', 'Invalid environmental data structure', data);
    return false;
  }

  const { propertyOverview, roomAssessment, safetyAssessment } = data;

  if (!propertyOverview || !roomAssessment || !safetyAssessment) {
    debugLog('Validation', 'Missing required sections', {
      hasPropertyOverview: !!propertyOverview,
      hasRoomAssessment: !!roomAssessment,
      hasSafetyAssessment: !!safetyAssessment,
    });
    return false;
  }

  return true;
};

export const validatePropertyAccess = (data: any): data is PropertyAccess => {
  if (!data || typeof data !== 'object') {
    debugLog('Validation', 'Invalid property access structure', data);
    return false;
  }

  const { exterior, interior } = data;
  
  if (!exterior || !interior) {
    debugLog('Validation', 'Missing access details', {
      hasExterior: !!exterior,
      hasInterior: !!interior,
    });
    return false;
  }

  return true;
};

export const validateRoomBase = (data: any): data is RoomBase => {
  if (!data || typeof data !== 'object') {
    debugLog('Validation', 'Invalid room base structure', data);
    return false;
  }

  const requiredFields = ['condition', 'lighting', 'flooring', 'concerns'];
  const missingFields = requiredFields.filter(field => !(field in data));

  if (missingFields.length > 0) {
    debugLog('Validation', 'Missing room base fields', { missingFields });
    return false;
  }

  return true;
};

export const logFormContext = (formData: any, path: string) => {
  if (DEBUG_MODE) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], formData);
    debugLog('FormContext', `Form data at path: ${path}`, value);
  }
};

export const measureRenderTime = (componentName: string) => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    debugLog('Performance', `${componentName} render time: ${endTime - startTime}ms`);
  };
};

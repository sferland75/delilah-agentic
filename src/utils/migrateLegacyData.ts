import { Assessment } from '../lib/validation/assessment-schema';

export function migrateLegacyData(data: any): Assessment {
  // Check if it's a legacy format
  if (data.assessment) {
    // Handle legacy format
    const legacy = data.assessment;
    return {
      personal: {
        firstName: legacy.demographics?.firstName || '',
        lastName: legacy.demographics?.lastName || '',
        dateOfBirth: legacy.demographics?.dateOfBirth || '',
        phone: legacy.demographics?.phone || '',
        email: legacy.demographics?.email || ''
      },
      medical: {
        injury: {
          circumstance: legacy.medicalHistory?.injury?.circumstance || '',
          date: legacy.medicalHistory?.injury?.dateOfLoss || '',
          description: legacy.medicalHistory?.injury?.subsequentCare || ''
        },
        symptoms: (legacy.symptoms?.physical || []).map((s: any) => ({
          location: s.location || '',
          type: s.painType || '',
          severity: s.severity || '',
          frequency: s.frequency || '',
          aggravating: s.aggravating ? [s.aggravating] : [],
          relieving: s.relieving ? [s.relieving] : []
        })),
        treatments: legacy.medicalHistory?.treatments || []
      },
      functional: {
        adl: Object.entries(legacy.adl?.basic || {})
          .map(([key, value]: [string, any]) => 
            `${key}: ${value?.independence || value?.notes || ''}`
          ).filter(s => s),
        iadl: Object.entries(legacy.adl?.iadl || {})
          .map(([key, value]: [string, any]) => 
            `${key}: ${value?.independence || value?.notes || ''}`
          ).filter(s => s),
        mobility: [],
        restrictions: []
      },
      environmental: {
        propertyOverview: {
          recommendedModifications: legacy.environmental?.propertyOverview?.recommendedModifications || [],
          identifiedHazards: legacy.environmental?.propertyOverview?.identifiedHazards || []
        },
        rooms: (legacy.environmental?.propertyOverview?.rooms || [])
          .map((room: any) => ({
            id: room.id || '',
            name: room.name || '',
            type: room.type || '',
            measurements: room.measurements || '',
            accessibility: room.accessibility || '',
            safety: room.safety || '',
            hazards: room.hazards || [],
            recommendations: room.recommendations || []
          })),
        exterior: legacy.environmental?.exterior || [],
        safety: legacy.environmental?.safety || {
          hazards: [],
          recommendations: []
        }
      }
    };
  }

  // If it's already in the new format, return as is
  return data;
}

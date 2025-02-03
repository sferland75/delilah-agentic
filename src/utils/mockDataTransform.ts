export const transformMockData = (mockData: any) => {
  const transformROMData = (romData: any) => {
    if (!romData) return {};
    
    const transformed: any = {};
    
    // Transform ROM data to match component expectations
    Object.entries(romData || {}).forEach(([joint, data]: [string, any]) => {
      if (joint === 'generalNotes') {
        transformed.generalNotes = data;
        return;
      }

      // Skip properties that aren't joint data
      if (typeof data !== 'object') return;

      Object.entries(data).forEach(([movement, values]: [string, any]) => {
        if (movement === 'isAffected') return;
        
        const key = `${joint}_${movement}`;
        transformed[key] = {
          score: {
            left: values.left,
            right: values.right
          },
          notes: values.observations || '',
          label: `${joint} ${movement}`
        };
      });
    });

    return transformed;
  };

  const transformMMTData = (mmtData: any) => {
    if (!mmtData) return {};
    
    const transformed: any = {};
    
    // Transform MMT data to match component expectations
    Object.entries(mmtData || {}).forEach(([muscle, data]: [string, any]) => {
      Object.entries(data).forEach(([movement, values]: [string, any]) => {
        const key = `${muscle}_${movement}`;
        transformed[key] = {
          score: values.left, // Use left score as primary
          pain: values.pain || false,
          notes: values.observations || '',
          label: `${muscle} ${movement}`
        };
      });
    });

    return transformed;
  };

  const transformFunctionalData = (functionalData: any) => {
    if (!functionalData) return {
      tolerances: {},
      recommendations: [],
      generalNotes: '',
      followUp: {
        required: false,
        timeframe: '',
        reason: ''
      }
    };

    return {
      tolerances: functionalData.tolerances || {},
      recommendations: functionalData.recommendations || [],
      generalNotes: functionalData.generalNotes || '',
      followUp: functionalData.followUp || {
        required: false,
        timeframe: '',
        reason: ''
      }
    };
  };

  return {
    personal: mockData.personal || {},
    medical: mockData.medical || {},
    typicalDay: {
      preAccident: mockData.typicalDay?.preAccident || {
        daily: { sleepSchedule: {}, routines: {} },
        weekly: {}
      },
      current: mockData.typicalDay?.current || {
        daily: { sleepSchedule: {}, routines: {} },
        weekly: {}
      }
    },
    assessment: {
      functional: transformFunctionalData(mockData.assessment?.functional),
      rom: transformROMData(mockData.assessment?.rom),
      mmt: transformMMTData(mockData.assessment?.mmt)
    }
  };
};
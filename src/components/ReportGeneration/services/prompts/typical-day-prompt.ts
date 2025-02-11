export const generateTypicalDayPrompt = (data: any) => {
  const formatTimeSchedule = (schedule: any) => {
    if (!schedule?.wakeTime && !schedule?.bedTime) return 'Not reported';
    return `Wake time: ${schedule?.wakeTime || 'Not reported'}, Bed time: ${schedule?.bedTime || 'Not reported'}`;
  };

  const formatActivities = (routine: any, period: string) => {
    const activities = routine?.routines?.[period]?.activities;
    return activities?.trim() || 'No activities reported';
  };

  return `Generate a professional medico-legal analysis of this client's typical daily routines, comparing pre-accident and current patterns. Consider how changes reflect functional limitations and impact on independence.

PRE-ACCIDENT DAILY ROUTINE:
Sleep/Wake Schedule: ${formatTimeSchedule(data.preAccident?.daily?.sleepSchedule)}

Morning:
${formatActivities(data.preAccident?.daily, 'morning')}

Afternoon:
${formatActivities(data.preAccident?.daily, 'afternoon')}

Evening:
${formatActivities(data.preAccident?.daily, 'evening')}

Night:
${formatActivities(data.preAccident?.daily, 'night')}

CURRENT DAILY ROUTINE:
Sleep/Wake Schedule: ${formatTimeSchedule(data.current?.daily?.sleepSchedule)}

Morning:
${formatActivities(data.current?.daily, 'morning')}

Afternoon:
${formatActivities(data.current?.daily, 'afternoon')}

Evening:
${formatActivities(data.current?.daily, 'evening')}

Night:
${formatActivities(data.current?.daily, 'night')}

Please analyze:
1. Impact of symptom patterns on daily function
2. Required rest periods and activity modifications
3. Changes in roles and responsibilities
4. Family assistance and adaptations needed
5. Specific functional limitations demonstrated
6. Overall activity level and participation changes
7. Sleep pattern disruptions and impacts

Structure the narrative as:
1. Description of pre-accident routine and function level
2. Detailed current routine with specific limitations
3. Analysis of changes and functional impacts

Use objective, professional language while clearly documenting functional changes.`;
};
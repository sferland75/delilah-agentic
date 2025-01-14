import { CARE_RATES, WEEKLY_TO_MONTHLY } from "../constants";

export const getAllSectionTotals = (data: any, sectionPrefix: string): number => {
  if (!data) return 0;
  
  let total = 0;
  const processObject = (obj: any) => {
    if (!obj) return;

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value && typeof value === 'object') {
        if ('totalMinutes' in value) {
          total += Number(value.totalMinutes) || 0;
        } else {
          processObject(value);
        }
      }
    });
  };

  // Get the section data based on prefix (level1, level2, level3)
  const sectionData = data[sectionPrefix];
  if (sectionData) {
    processObject(sectionData);
  }

  return total;
};

export const calculateForm1Part4 = (formData: any) => {
  // Calculate total minutes for each part
  const part1Minutes = getAllSectionTotals(formData, 'level1');
  const part2Minutes = getAllSectionTotals(formData, 'level2');
  const part3Minutes = getAllSectionTotals(formData, 'level3');

  // Calculate weekly hours (÷ 60)
  const part1Weekly = part1Minutes / 60;
  const part2Weekly = part2Minutes / 60;
  const part3Weekly = part3Minutes / 60;

  // Calculate monthly hours (× 4.3)
  const part1Monthly = part1Weekly * WEEKLY_TO_MONTHLY;
  const part2Monthly = part2Weekly * WEEKLY_TO_MONTHLY;
  const part3Monthly = part3Weekly * WEEKLY_TO_MONTHLY;

  // Calculate monthly costs (× rate)
  const part1Cost = part1Monthly * CARE_RATES.LEVEL_1;
  const part2Cost = part2Monthly * CARE_RATES.LEVEL_2;
  const part3Cost = part3Monthly * CARE_RATES.LEVEL_3;

  // Calculate total monthly cost
  const totalAssessedMonthlyCost = part1Cost + part2Cost + part3Cost;

  return {
    part1: {
      totalMinutesPerWeek: part1Minutes,
      weeklyHours: part1Weekly,
      monthlyHours: part1Monthly,
      monthlyCost: part1Cost
    },
    part2: {
      totalMinutesPerWeek: part2Minutes,
      weeklyHours: part2Weekly,
      monthlyHours: part2Monthly,
      monthlyCost: part2Cost
    },
    part3: {
      totalMinutesPerWeek: part3Minutes,
      weeklyHours: part3Weekly,
      monthlyHours: part3Monthly,
      monthlyCost: part3Cost
    },
    totalAssessedMonthlyCost
  };
};
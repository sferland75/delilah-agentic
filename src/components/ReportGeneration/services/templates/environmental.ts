import { AssessmentData } from '../../../../types/assessment';
import { ReportSection } from '../reportTemplateSystem';

export const environmentalSection: ReportSection = {
  id: 'environmental',
  title: 'ENVIRONMENTAL ASSESSMENT',
  order: 5,
  generate: async (data: AssessmentData): Promise<string> => {
    const { environmental } = data.assessment;
    let content = '# ENVIRONMENTAL ASSESSMENT\n\n';

    // Property Overview
    content += '## PROPERTY OVERVIEW\n';
    const { propertyOverview } = environmental;

    if (propertyOverview.recommendedModifications?.length) {
      content += '\nRecommended Modifications:\n';
      propertyOverview.recommendedModifications.forEach(mod => {
        content += `• ${mod}\n`;
      });
    }

    if (propertyOverview.identifiedHazards?.length) {
      content += '\nIdentified Hazards:\n';
      propertyOverview.identifiedHazards.forEach(hazard => {
        content += `• ${hazard}\n`;
      });
    }

    // Room Details
    if (Object.keys(propertyOverview.rooms).length > 0) {
      content += '\nRoom Assessment:\n';
      Object.entries(propertyOverview.rooms).forEach(([room, details]) => {
        content += `\n${room.charAt(0).toUpperCase() + room.slice(1)}:\n`;
        Object.entries(details).forEach(([feature, description]) => {
          content += `• ${feature}: ${description}\n`;
        });
      });
    }

    // Safety Considerations
    if (environmental.safety) {
      content += '\n## SAFETY CONSIDERATIONS\n';
      if (environmental.safety.hazards?.length) {
        content += '\nIdentified Safety Hazards:\n';
        environmental.safety.hazards.forEach(hazard => {
          content += `• ${hazard}\n`;
        });
      }

      if (environmental.safety.recommendations?.length) {
        content += '\nSafety Recommendations:\n';
        environmental.safety.recommendations.forEach(rec => {
          content += `• ${rec}\n`;
        });
      }
    }

    return content;
  }
};

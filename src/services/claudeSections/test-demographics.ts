import { generateDemographicsSection } from './demographics';
import { AssessmentData } from '../../types/assessment';

const sampleData: AssessmentData = {
  clientInfo: {
    name: "Patrick Anderson",
    dob: "1962-01-02",
    dol: "2024-01-15",
    address: "3651 Maple Avenue, Prescott ON K0E 1T0",
    phone: "(613) 925-2216",
    lawyer: {
      name: "Sarah Johnson",
      firm: "Johnson & Associates"
    },
    insurance: {
      adjuster: "Michael Brown",
      company: "Reliable Insurance Co.",
      claimNumber: "CLM123456"
    }
  }
} as AssessmentData;  // Type assertion since we're only providing clientInfo

async function testDemographicsGeneration() {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable not set');
    }

    console.log('Generating demographics section...');
    const section = await generateDemographicsSection(apiKey, sampleData);
    console.log('\nGenerated Section:\n');
    console.log(section);
  } catch (error) {
    console.error('Error testing demographics generation:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDemographicsGeneration();
}

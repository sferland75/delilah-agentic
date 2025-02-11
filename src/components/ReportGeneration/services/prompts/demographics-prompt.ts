export const generateDemographicsPrompt = (data: any) => {
  return `Generate a professional opening paragraph introducing the client and assessment context. Use these details:

Client: ${data.firstName} ${data.lastName}
Date of Birth: ${data.dateOfBirth}
${data.interpreter ? `Interpreter: ${data.interpreter}` : ''}
${data.language ? `Language: ${data.language}` : ''}

Assessments Conducted:
1. Situational Evaluation
   Location: ${data.assessmentInfo.situational.location}
   Date: ${data.assessmentInfo.situational.date}

2. In-Home Evaluation
   Location: ${data.assessmentInfo.inHome.location}
   Date: ${data.assessmentInfo.inHome.date}

Generate a professional medical-legal introduction paragraph that:
1. Introduces the client by full name
2. States they were referred for OT evaluation
3. Notes both evaluations being conducted
4. Mentions if interpreter services were used
5. States these assessments are part of a multidisciplinary CAT determination
6. Notes what domains will be assessed (Activities of Daily Living, Social Functioning, etc.)
7. References that symptoms were identified during assessments
8. Notes functional testing was aligned with pre-accident abilities/demands
9. States client was informed about breaks/withdrawal options

Keep the tone professional and objective while maintaining clarity.`;
};
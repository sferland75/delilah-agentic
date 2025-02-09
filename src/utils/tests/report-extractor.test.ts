import { ReportExtractor } from '../report-extractor';

describe('ReportExtractor - Ledoux Case', () => {
    // Load test data
    const ledouxReport = `**OCCUPATIONAL THERAPY IN-HOME ASSESSMENT**

  -----------------------------------------------------------------------------
  **Client Name:** [Jean-Marc              **Date of       September 9, 1960
                   Ledoux]{.mark}          Birth:**        
  ---------------- ----------------------- --------------- --------------------
  **Address:**     905 Main St E,          **Date of       December 1, 2022
                   Hawkesbury, ON K6A 1A6  Loss:**         

  **Telephone #:** \(613\) 676-2300                        

  **Lawyer:**      Elaine Lachaîne         **Firm:**       Burn Tucker Lachaîne

  **Adjuster:**    Karen Jenkins           **Insurer:**    Intact Insurance

                                           **Claim No.:**  4034385449

  **Therapist:**   Sébastien Ferland OT    **Date of       November 2, 2023
                   Reg.(Ont.)              Assessment:**   

                                           **Date of       November 3, 2023
                                           Report:**       
  -----------------------------------------------------------------------------`;

    test('extracts demographics correctly', () => {
        const extractor = new ReportExtractor(ledouxReport);
        const result = extractor.extract();

        expect(result.success).toBe(true);
        expect(result.data?.demographics).toEqual({
            name: 'Jean-Marc Ledoux',
            dateOfBirth: 'September 9, 1960',
            dateOfLoss: 'December 1, 2022',
            address: '905 Main St E, Hawkesbury, ON K6A 1A6',
            phone: '(613) 676-2300',
            lawyer: {
                name: 'Elaine Lachaîne',
                firm: 'Burn Tucker Lachaîne'
            },
            insurance: {
                adjuster: 'Karen Jenkins',
                company: 'Intact Insurance',
                claimNumber: '4034385449'
            },
            dateOfAssessment: 'November 2, 2023'
        });
    });

    // Add more sections of the Ledoux report for testing
    const medicalHistorySection = `**PRE-ACCIDENT MEDICAL HISTORY:**

Based on the Admission Record from B2 - The Ottawa Hospital, Mr. LEdoux
presents with the following pre-accident medical and social history:

-   Isolation (social)
-   Anxiety disorder, unspecified
-   Borderline personality disorder
-   Adjustment disorder
-   Essential tremor
-   Chronic pain
-   Diabetes mellitus, type 2
-   GERD (gastroesophageal reflux disease)
-   HTN (hypertension)
-   Smoker
-   COPD (chronic obstructive pulmonary disease)
-   Bipolar disorder
-   Family history of DVT
-   Epistaxis
-   Parkinsons
-   Sleep apnea
-   Asthma
-   Dyslipidemia
-   Sleep apnea`;

    test('extracts medical history correctly', () => {
        const extractor = new ReportExtractor(medicalHistorySection);
        const result = extractor.extract();

        expect(result.success).toBe(true);
        expect(result.data?.medicalHistory.preAccidentConditions).toEqual([
            'Isolation (social)',
            'Anxiety disorder, unspecified',
            'Borderline personality disorder',
            'Adjustment disorder',
            'Essential tremor',
            'Chronic pain',
            'Diabetes mellitus, type 2',
            'GERD (gastroesophageal reflux disease)',
            'HTN (hypertension)',
            'Smoker',
            'COPD (chronic obstructive pulmonary disease)',
            'Bipolar disorder',
            'Family history of DVT',
            'Epistaxis',
            'Parkinsons',
            'Sleep apnea',
            'Asthma',
            'Dyslipidemia',
            'Sleep apnea'
        ]);
    });

    // Add more test sections for physical symptoms
    const physicalSymptomsSection = `**Physical Symptoms:**

Pain symptoms are rated on an analog pain scale where 0 = no pain and 10 = intolerable pain*.*

  --------------------------------------------------------------------------
  **Symptom/Complaint**    **Details**                         **Pain Rating
                                                               if
                                                               Necessary**
  ------------------------ ----------------------------------- -------------
  Left ankle               Broken in two places, 6 surgeries.  8/10 - 10/10
                           Constant pain. He reports a         
                           "crunching noise" when he           
                           weight-bears on his left ankle.`;

    test('extracts physical symptoms correctly', () => {
        const extractor = new ReportExtractor(physicalSymptomsSection);
        const result = extractor.extract();

        expect(result.success).toBe(true);
        expect(result.data?.symptoms.physical[0]).toEqual({
            complaint: 'Left ankle',
            details: 'Broken in two places, 6 surgeries. Constant pain. He reports a "crunching noise" when he weight-bears on his left ankle.',
            painRating: '8/10 - 10/10'
        });
    });

    // Continue with more test cases...
});

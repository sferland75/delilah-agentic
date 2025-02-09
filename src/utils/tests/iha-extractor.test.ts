import { IHAExtractor } from '../iha-extractor';

describe('IHAExtractor', () => {
    const sampleReport = `
        **OCCUPATIONAL THERAPY IN-HOME ASSESSMENT**

        Client Name: John Smith          Date of Birth: 1960-01-15
        Address: 123 Main St            Date of Loss: 2023-06-01
        Telephone #: (613) 555-1234     
        Lawyer: Jane Doe               Firm: Legal & Associates
        Adjuster: Bob Wilson           Insurer: Sample Insurance
                                      Claim No.: ABC123456

        **PRE-ACCIDENT MEDICAL HISTORY:**
        - Chronic lower back pain
        - Left knee replacement (2015)
        - Hypertension

        **MECHANISM OF INJURY:**
        Client was involved in a motor vehicle accident on June 1, 2023, when his vehicle was struck from behind while stopped at a red light.

        **NATURE OF INJURY:**
        Based on medical documentation review, client sustained:
        - Whiplash Associated Disorder (WAD II)
        - Lower back strain
        - Left shoulder impingement

        **CURRENT MEDICAL/REHABILITATION TEAM:**
        Health Professional | Specialty | Last Appointment | Frequency | Next Appointment
        Dr. Smith | Family Doctor | 2023-12-15 | Monthly | 2024-01-15
        John Physio | Physiotherapist | 2023-12-20 | Weekly | 2024-01-03

        **MEDICATION:**
        Medication | Dosage | Frequency | Purpose
        Tylenol 3 | 300mg | BID | Pain management
        Naproxen | 500mg | BID | Anti-inflammatory
    `;

    describe('Client Info Extraction', () => {
        test('extracts basic client information correctly', () => {
            const extractor = new IHAExtractor(sampleReport);
            const result = extractor.extract();

            expect(result.success).toBe(true);
            expect(result.data?.clientInfo).toEqual({
                name: 'John Smith',
                dob: '1960-01-15',
                dol: '2023-06-01',
                address: '123 Main St',
                phone: '(613) 555-1234',
                lawyer: {
                    name: 'Jane Doe',
                    firm: 'Legal & Associates'
                },
                insurance: {
                    adjuster: 'Bob Wilson',
                    company: 'Sample Insurance',
                    claimNumber: 'ABC123456'
                }
            });
        });

        test('handles missing client information', () => {
            const incompleteReport = sampleReport.replace(/Client Name:.*\\n/, '');
            const extractor = new IHAExtractor(incompleteReport);
            const result = extractor.extract();

            expect(result.success).toBe(false);
            expect(result.errors).toContainEqual(
                expect.objectContaining({
                    field: 'name',
                    section: 'Client Info',
                    error: 'Missing client name'
                })
            );
        });
    });

    describe('Medical History Extraction', () => {
        test('extracts pre-accident medical history correctly', () => {
            const extractor = new IHAExtractor(sampleReport);
            const result = extractor.extract();

            expect(result.data?.medicalHistory.preAccident).toContain('Chronic lower back pain');
            expect(result.data?.medicalHistory.preAccident).toContain('Left knee replacement (2015)');
            expect(result.data?.medicalHistory.preAccident).toContain('Hypertension');
        });

        test('extracts injury information correctly', () => {
            const extractor = new IHAExtractor(sampleReport);
            const result = extractor.extract();

            expect(result.data?.medicalHistory.injury).toEqual({
                mechanism: expect.stringContaining('motor vehicle accident on June 1, 2023'),
                nature: expect.arrayContaining([
                    'Whiplash Associated Disorder (WAD II)',
                    'Lower back strain',
                    'Left shoulder impingement'
                ]),
                recovery: expect.any(String)
            });
        });

        test('extracts current medical team correctly', () => {
            const extractor = new IHAExtractor(sampleReport);
            const result = extractor.extract();

            expect(result.data?.medicalHistory.currentTeam).toEqual([
                {
                    provider: 'Dr. Smith',
                    specialty: 'Family Doctor',
                    lastAppointment: '2023-12-15',
                    frequency: 'Monthly',
                    nextAppointment: '2024-01-15'
                },
                {
                    provider: 'John Physio',
                    specialty: 'Physiotherapist',
                    lastAppointment: '2023-12-20',
                    frequency: 'Weekly',
                    nextAppointment: '2024-01-03'
                }
            ]);
        });

        test('extracts medications correctly', () => {
            const extractor = new IHAExtractor(sampleReport);
            const result = extractor.extract();

            expect(result.data?.medicalHistory.medications).toEqual([
                {
                    name: 'Tylenol 3',
                    dosage: '300mg',
                    frequency: 'BID',
                    purpose: 'Pain management'
                },
                {
                    name: 'Naproxen',
                    dosage: '500mg',
                    frequency: 'BID',
                    purpose: 'Anti-inflammatory'
                }
            ]);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('handles empty report content', () => {
            const extractor = new IHAExtractor('');
            const result = extractor.extract();

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.data).toBeUndefined();
        });

        test('handles malformed table data', () => {
            const badReport = sampleReport.replace(/\|/g, ' ');
            const extractor = new IHAExtractor(badReport);
            const result = extractor.extract();

            expect(result.success).toBe(false);
            expect(result.errors).toContainEqual(
                expect.objectContaining({
                    section: 'Medical History',
                    error: expect.stringContaining('table')
                })
            );
        });
    });
});

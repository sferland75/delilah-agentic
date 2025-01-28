import { ADLAnalyzer } from '../ADLAnalyzer';

describe('ADLAnalyzer', () => {
    let analyzer: ADLAnalyzer;

    beforeEach(() => {
        analyzer = new ADLAnalyzer();
    });

    describe('Basic ADL Analysis', () => {
        it('analyzes basic ADL performance levels', async () => {
            const adlData = {
                basic: {
                    bathing: {
                        shower: {
                            independence: 'modified_independent',
                            notes: 'Uses grab bars'
                        },
                        grooming: {
                            independence: 'independent'
                        }
                    },
                    dressing: {
                        upper_body: {
                            independence: 'independent'
                        },
                        lower_body: {
                            independence: 'modified_independent',
                            notes: 'Uses long-handled devices'
                        }
                    }
                }
            };

            const result = await analyzer.analyzeADLPerformance(adlData);
            expect(result.patterns).toBeDefined();
            expect(result.patterns.length).toBeGreaterThan(0);

            // Check bathing pattern
            const bathingPattern = result.patterns.find(p => p.category === 'bathing');
            expect(bathingPattern).toBeDefined();
            expect(bathingPattern?.activities).toContain('shower');
            expect(bathingPattern?.activities).toContain('grooming');
            expect(bathingPattern?.modifications).toContainEqual('Uses grab bars');

            // Check dressing pattern
            const dressingPattern = result.patterns.find(p => p.category === 'dressing');
            expect(dressingPattern).toBeDefined();
            expect(dressingPattern?.activities).toContain('upper_body');
            expect(dressingPattern?.activities).toContain('lower_body');
            expect(dressingPattern?.modifications).toContainEqual('Uses long-handled devices');
        });

        it('handles empty or missing ADL data', async () => {
            const result = await analyzer.analyzeADLPerformance({});
            expect(result.patterns).toEqual([]);
        });

        it('identifies common independence levels', async () => {
            const adlData = {
                basic: {
                    bathing: {
                        shower: { independence: 'modified_independent' },
                        grooming: { independence: 'modified_independent' }
                    }
                }
            };

            const result = await analyzer.analyzeADLPerformance(adlData);
            const bathingPattern = result.patterns.find(p => p.category === 'bathing');
            expect(bathingPattern?.level).toBe('modified_independent');
        });
    });

    describe('ADL Modifications Analysis', () => {
        it('extracts equipment and modifications from notes', async () => {
            const adlData = {
                basic: {
                    bathing: {
                        shower: {
                            independence: 'modified_independent',
                            notes: 'Uses grab bars and shower chair'
                        }
                    }
                }
            };

            const result = await analyzer.analyzeADLPerformance(adlData);
            const bathingPattern = result.patterns.find(p => p.category === 'bathing');
            const mods = bathingPattern?.modifications || [];
            expect(mods.join(' ')).toContain('grab bars');
            expect(mods.join(' ')).toContain('shower chair');
        });

        it('handles multiple modifications across activities', async () => {
            const adlData = {
                basic: {
                    bathing: {
                        shower: { 
                            independence: 'modified_independent',
                            notes: 'Uses grab bars'
                        },
                        grooming: {
                            independence: 'modified_independent',
                            notes: 'Uses long-handled sponge'
                        }
                    }
                }
            };

            const result = await analyzer.analyzeADLPerformance(adlData);
            const bathingPattern = result.patterns.find(p => p.category === 'bathing');
            const mods = bathingPattern?.modifications || [];
            expect(mods.some(m => m.includes('grab bars'))).toBe(true);
            expect(mods.some(m => m.includes('long-handled'))).toBe(true);
        });
    });

    describe('Symptom Impact Analysis', () => {
        it('analyzes symptom impact on ADLs', async () => {
            const adlData = {
                basic: {
                    bathing: {
                        shower: {
                            independence: 'modified_independent',
                            notes: 'Limited by back pain'
                        }
                    }
                }
            };

            const symptoms = [
                {
                    location: 'Lower back',
                    severity: 'Moderate',
                    impact: 'Difficulty with bathing'
                }
            ];

            const result = await analyzer.analyzeADLPerformance(adlData, symptoms);
            expect(result.symptoms).toBeDefined();
            expect(result.symptoms[0].location).toBe('Lower back');
            expect(result.symptoms[0].impact).toContain('Difficulty with bathing');
        });

        it('correlates symptoms with ADL modifications', async () => {
            const adlData = {
                basic: {
                    transfers: {
                        bed_transfer: {
                            independence: 'modified_independent',
                            notes: 'Uses bed rail due to back pain'
                        }
                    }
                }
            };

            const symptoms = [
                {
                    location: 'Lower back',
                    severity: 'Moderate',
                    aggravating: 'Bed mobility'
                }
            ];

            const result = await analyzer.analyzeADLPerformance(adlData, symptoms);
            const transferPattern = result.patterns.find(p => p.category === 'transfers');
            expect(transferPattern?.modifications).toBeDefined();
            expect(result.symptoms[0].impact).toBeDefined();
        });
    });

    describe('Temporal ADL Patterns', () => {
        it('analyzes daily routine patterns', async () => {
            const adlData = {
                typicalDay: {
                    current: {
                        daily: {
                            routines: {
                                morning: {
                                    activities: 'Shower, dressing with difficulty due to stiffness'
                                },
                                evening: {
                                    activities: 'Limited by fatigue'
                                }
                            }
                        }
                    }
                }
            };

            const result = await analyzer.analyzeADLPerformance(adlData);
            expect(result.temporal).toBeDefined();
            expect(result.temporal.length).toBeGreaterThan(0);
            
            const morningPattern = result.temporal.find(p => p.period === 'morning');
            expect(morningPattern?.activities).toContain('Shower');
            expect(morningPattern?.limitations.some(l => l.includes('difficulty'))).toBe(true);
        });

        it('handles missing temporal data', async () => {
            const adlData = {
                typicalDay: {}
            };

            const result = await analyzer.analyzeADLPerformance(adlData);
            expect(result.temporal).toEqual([]);
        });
    });
});
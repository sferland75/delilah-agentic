import { mockAssessmentData } from './mockData';

export interface NarrativeTestData {
    symptoms: {
        physical: Array<{
            location: string;
            severity: 'mild' | 'moderate' | 'severe';
            frequency: 'occasional' | 'frequent' | 'constant';
            temporalPattern: string;
            impact: string[];
            painType: 'sharp' | 'dull' | 'aching' | 'stabbing';
            aggravating?: string;
            relieving?: string;
        }>;
        cognitive?: Array<{
            type: string;
            severity: string;
            frequency: string;
            impact: string[];
        }>;
        emotional?: Array<{
            type: string;
            severity: string;
            frequency: string;
            impact: string[];
        }>;
    };
    medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        purpose: string;
        response: string;
    }>;
    timeline: {
        events: Array<{
            date: string;
            type: string;
            description: string;
        }>;
        patterns: Array<{
            period: string;
            pattern: string;
            significance: string;
        }>;
    };
    adl: {
        activities: Array<{
            type: string;
            independence: string;
            modifications: string[];
            barriers: string[];
        }>;
    };
}

export interface NarrativeExpectations {
    content: {
        includes: string[];
        excludes?: string[];
        patterns?: RegExp[];
    };
    structure: {
        hasTimeframe?: boolean;
        hasContext?: boolean;
        hasRecommendations?: boolean;
    };
    clinical: {
        terminology?: string[];
        relationships?: string[];
        severity?: string[];
    };
}

export const createNarrativeTestData = (overrides: Partial<NarrativeTestData> = {}): NarrativeTestData => ({
    symptoms: {
        physical: [
            {
                location: 'lower back',
                severity: 'moderate',
                frequency: 'frequent',
                painType: 'aching',
                temporalPattern: 'worse in mornings',
                impact: ['difficulty with prolonged sitting', 'limits bending'],
                aggravating: 'prolonged sitting',
                relieving: 'position changes and movement'
            }
        ],
        cognitive: [],
        emotional: []
    },
    medications: [
        {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'as needed',
            purpose: 'pain management',
            response: 'partial relief'
        }
    ],
    timeline: {
        events: [
            {
                date: '2025-01-01',
                type: 'onset',
                description: 'Initial injury during work activities'
            }
        ],
        patterns: [
            {
                period: 'morning',
                pattern: 'increased stiffness',
                significance: 'impacts early day activities'
            }
        ]
    },
    adl: {
        activities: [
            {
                type: 'self care',
                independence: 'modified independent',
                modifications: ['uses long-handled devices'],
                barriers: ['limited trunk flexion']
            }
        ]
    },
    ...overrides
});

export const validateNarrativeOutput = (
    content: string,
    expectations: NarrativeExpectations
): void => {
    if (!content) {
        throw new Error('No content provided for validation');
    }

    // Content validation
    expectations.content.includes.forEach(text => {
        if (!content.includes(text)) {
            throw new Error(`Expected content to include "${text}" but it did not`);
        }
    });

    expectations.content.excludes?.forEach(text => {
        if (content.includes(text)) {
            throw new Error(`Expected content to exclude "${text}" but it was found`);
        }
    });

    expectations.content.patterns?.forEach(pattern => {
        if (!pattern.test(content)) {
            throw new Error(`Expected content to match pattern ${pattern} but it did not`);
        }
    });

    // Structure validation
    if (expectations.structure.hasTimeframe) {
        const hasTimeframe = /\b(initially|subsequently|currently|now)\b/i.test(content);
        if (!hasTimeframe) {
            throw new Error('Expected content to include timeframe indicators');
        }
    }

    if (expectations.structure.hasContext) {
        const hasContext = /\b(due to|because of|related to|in context of)\b/i.test(content);
        if (!hasContext) {
            throw new Error('Expected content to include context indicators');
        }
    }

    if (expectations.structure.hasRecommendations) {
        const hasRecommendations = /\b(recommend|suggest|advise|consider)\b/i.test(content);
        if (!hasRecommendations) {
            throw new Error('Expected content to include recommendations');
        }
    }

    // Clinical validation
    expectations.clinical.terminology?.forEach(term => {
        if (!content.toLowerCase().includes(term.toLowerCase())) {
            throw new Error(`Expected content to include clinical term "${term}"`);
        }
    });

    expectations.clinical.relationships?.forEach(rel => {
        if (!content.toLowerCase().includes(rel.toLowerCase())) {
            throw new Error(`Expected content to include relationship "${rel}"`);
        }
    });

    expectations.clinical.severity?.forEach(sev => {
        if (!content.toLowerCase().includes(sev.toLowerCase())) {
            throw new Error(`Expected content to include severity "${sev}"`);
        }
    });
};

export const commonNarrativeExpectations: NarrativeExpectations = {
    content: {
        includes: [],
        patterns: [
            /\b(presents with|demonstrates|exhibits)\b/i,
            /\b(impacts|affects|influences)\b/i,
            /\b(reports|indicates|notes)\b/i
        ]
    },
    structure: {
        hasTimeframe: true,
        hasContext: true,
        hasRecommendations: false
    },
    clinical: {
        terminology: [
            'independent',
            'modified',
            'assistance',
            'symptoms',
            'function'
        ],
        relationships: [
            'due to',
            'results in',
            'leads to',
            'associated with'
        ],
        severity: [
            'mild',
            'moderate',
            'severe',
            'significant'
        ]
    }
};
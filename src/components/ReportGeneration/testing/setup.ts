import { AgentContext, AgentMetadata, Assessment, AssessmentData } from '../../types/report';
import { mockAssessmentData } from './mockData';
import { TestableAgent } from './TestableAgent';

interface TestSuiteOptions {
    metadata?: Partial<AgentMetadata>;
    data?: Partial<Assessment>;
    context?: Partial<AgentContext>;
}

export function createTestSuite(options: TestSuiteOptions = {}) {
    // Create test context
    const context: AgentContext = {
        config: {
            detailLevel: 'standard',
            validateData: true,
            formatPreference: 'clinical',
            includeMetrics: true,
            ...options.context?.config
        },
        features: {
            enableNarrative: true,
            enableContextualAnalysis: true,
            enableDetailedFormatting: true,
            ...options.context?.features
        }
    };

    // Create test metadata
    const metadata: AgentMetadata = {
        name: 'Test Section',
        description: 'Test description',
        orderNumber: 1.0,
        dataPath: ['test'],
        ...options.metadata
    };

    // Create test data
    const testData: AssessmentData = {
        raw: {
            ...mockAssessmentData,
            ...options.data
        }
    };

    return { context, metadata, testData };
}

export function validateSectionOutput(section: any, options: {
    name?: string;
    orderNumber?: number;
    content?: string[];
    excludeContent?: string[];
} = {}) {
    // Validate section structure
    expect(section).toBeDefined();
    expect(section.valid).toBe(true);

    // Validate section metadata if provided
    if (options.name) {
        expect(section.name).toBe(options.name);
    }
    if (typeof options.orderNumber === 'number') {
        expect(section.orderNumber).toBe(options.orderNumber);
    }

    // Validate content if provided
    if (options.content) {
        options.content.forEach(text => {
            expect(section.content).toContain(text);
        });
    }

    // Validate excluded content if provided
    if (options.excludeContent) {
        options.excludeContent.forEach(text => {
            expect(section.content).not.toContain(text);
        });
    }
}
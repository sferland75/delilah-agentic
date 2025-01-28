export type OutputFormat = 'narrative' | 'table' | 'list' | 'structured';

export interface SectionConfig {
    format: OutputFormat;
    includeHeading: boolean;
    defaultDetailLevel: 'brief' | 'standard' | 'detailed';
}

export const sectionConfigs: Record<string, SectionConfig> = {
    overview: {
        format: 'narrative',
        includeHeading: false,
        defaultDetailLevel: 'standard'
    },
    demographics: {
        format: 'structured',
        includeHeading: true,
        defaultDetailLevel: 'standard'
    },
    medications: {
        format: 'table',
        includeHeading: true,
        defaultDetailLevel: 'standard'
    },
    symptoms: {
        format: 'narrative',
        includeHeading: true,
        defaultDetailLevel: 'standard'
    },
    adl: {
        format: 'table',
        includeHeading: true,
        defaultDetailLevel: 'standard'
    },
    mobility: {
        format: 'structured',
        includeHeading: true,
        defaultDetailLevel: 'standard'
    },
    rangeOfMotion: {
        format: 'table',
        includeHeading: true,
        defaultDetailLevel: 'standard'
    }
};
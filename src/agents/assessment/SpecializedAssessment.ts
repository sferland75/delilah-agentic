import { BaseAssessment } from './BaseAssessment';
import { AssessmentResult, AssessmentConfig, Confidence } from '../../types';

export interface SpecializedAssessmentConfig extends AssessmentConfig {
    domainRules?: Map<string, RuleSet>;
    customValidators?: Map<string, ValidatorFunction>;
    confidenceWeights?: ConfidenceWeights;
}

interface RuleSet {
    patterns: RegExp[];
    thresholds: Map<string, number>;
    validations: ValidationRule[];
}

type ValidatorFunction = (data: any) => Promise<ValidationResult>;

interface ValidationRule {
    condition: (data: any) => boolean;
    impact: number;
    message: string;
}

interface ValidationResult {
    valid: boolean;
    score: number;
    findings: string[];
}

interface ConfidenceWeights {
    domainRules: number;
    customValidation: number;
    patternMatch: number;
}

export class SpecializedAssessment extends BaseAssessment {
    private domainRules: Map<string, RuleSet>;
    private customValidators: Map<string, ValidatorFunction>;
    private confidenceWeights: ConfidenceWeights;

    constructor(config: SpecializedAssessmentConfig) {
        super(config);
        this.domainRules = config.domainRules ?? new Map();
        this.customValidators = config.customValidators ?? new Map();
        this.confidenceWeights = config.confidenceWeights ?? {
            domainRules: 0.4,
            customValidation: 0.3,
            patternMatch: 0.3
        };
    }

    public async assess(data: any): Promise<AssessmentResult> {
        const domainResults = await this.applyDomainRules(data);
        const validationResults = await this.runCustomValidations(data);
        const patternResults = await this.matchPatterns(data);

        const confidence = this.calculateConfidence(
            domainResults,
            validationResults,
            patternResults
        );

        const findings = [
            ...domainResults.findings,
            ...validationResults.findings,
            ...patternResults.findings
        ];

        return {
            id: data.id,
            timestamp: Date.now(),
            confidence,
            findings,
            metadata: {
                domainRulesApplied: Array.from(this.domainRules.keys()),
                validatorsUsed: Array.from(this.customValidators.keys())
            }
        };
    }

    private async applyDomainRules(data: any): Promise<ValidationResult> {
        const findings: string[] = [];
        let totalScore = 0;
        let rulesApplied = 0;

        for (const [domain, ruleSet] of this.domainRules) {
            if (this.isDomainApplicable(data, ruleSet.patterns)) {
                const result = await this.evaluateRuleSet(data, ruleSet);
                findings.push(...result.findings);
                totalScore += result.score;
                rulesApplied++;
            }
        }

        return {
            valid: findings.length === 0,
            score: rulesApplied > 0 ? totalScore / rulesApplied : 1,
            findings
        };
    }

    private isDomainApplicable(data: any, patterns: RegExp[]): boolean {
        return patterns.some(pattern => 
            pattern.test(data.content) || 
            pattern.test(data.type) ||
            pattern.test(data.source)
        );
    }

    private async evaluateRuleSet(data: any, ruleSet: RuleSet): Promise<ValidationResult> {
        const findings: string[] = [];
        let totalImpact = 0;

        for (const rule of ruleSet.validations) {
            if (rule.condition(data)) {
                findings.push(rule.message);
                totalImpact += rule.impact;
            }
        }

        // Check thresholds
        for (const [metric, threshold] of ruleSet.thresholds) {
            const value = this.extractMetric(data, metric);
            if (value !== null && value < threshold) {
                findings.push(`${metric} below threshold: ${value} < ${threshold}`);
                totalImpact += 0.1; // Default impact for threshold violations
            }
        }

        return {
            valid: findings.length === 0,
            score: Math.max(0, 1 - totalImpact),
            findings
        };
    }

    private async runCustomValidations(data: any): Promise<ValidationResult> {
        const results = await Promise.all(
            Array.from(this.customValidators.values())
                .map(validator => validator(data))
        );

        return {
            valid: results.every(r => r.valid),
            score: results.reduce((acc, r) => acc + r.score, 0) / results.length,
            findings: results.flatMap(r => r.findings)
        };
    }

    private async matchPatterns(data: any): Promise<ValidationResult> {
        // Implement pattern matching logic or integrate with pattern matching service
        return {
            valid: true,
            score: 1,
            findings: []
        };
    }

    private calculateConfidence(
        domainResults: ValidationResult,
        validationResults: ValidationResult,
        patternResults: ValidationResult
    ): Confidence {
        const score =
            domainResults.score * this.confidenceWeights.domainRules +
            validationResults.score * this.confidenceWeights.customValidation +
            patternResults.score * this.confidenceWeights.patternMatch;

        return {
            score,
            factors: {
                domainRules: domainResults.score,
                customValidation: validationResults.score,
                patternMatch: patternResults.score
            }
        };
    }

    private extractMetric(data: any, metricPath: string): number | null {
        try {
            return metricPath.split('.')
                .reduce((obj, key) => obj[key], data);
        } catch {
            return null;
        }
    }
}
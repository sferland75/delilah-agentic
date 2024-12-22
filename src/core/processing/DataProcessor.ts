import { SystemCoordinator } from '../coordinator/SystemCoordinator';
import { DataTransformer } from './DataTransformer';
import { DataValidator } from './DataValidator';
import { DataLineage } from './DataLineage';
import { ProcessingError, DataFormat, ProcessingContext, ValidationResult } from '../../types';

export interface DataProcessorConfig {
    validateInput?: boolean;
    trackLineage?: boolean;
    transformations?: Map<string, DataTransformation>;
    maxBatchSize?: number;
}

export interface DataTransformation {
    name: string;
    transform: (data: any) => Promise<any>;
    validation?: (data: any) => Promise<ValidationResult>;
    priority: number;
}

export class DataProcessor {
    private coordinator: SystemCoordinator;
    private transformer: DataTransformer;
    private validator: DataValidator;
    private lineage: DataLineage;
    private config: Required<DataProcessorConfig>;

    constructor(
        coordinator: SystemCoordinator,
        config: DataProcessorConfig = {}
    ) {
        this.coordinator = coordinator;
        this.config = {
            validateInput: config.validateInput ?? true,
            trackLineage: config.trackLineage ?? true,
            transformations: config.transformations ?? new Map(),
            maxBatchSize: config.maxBatchSize ?? 100
        };

        this.initializeComponents();
    }

    private initializeComponents(): void {
        this.transformer = new DataTransformer(this.config.transformations);
        this.validator = new DataValidator();
        this.lineage = new DataLineage();
    }

    public async processData(
        data: any,
        format: DataFormat,
        context?: ProcessingContext
    ): Promise<any> {
        const processingId = this.generateProcessingId();
        
        try {
            // Start lineage tracking
            if (this.config.trackLineage) {
                this.lineage.startProcessing(processingId, data, format);
            }

            // Validate input if enabled
            if (this.config.validateInput) {
                const validationResult = await this.validator.validate(data, format);
                if (!validationResult.valid) {
                    throw new ProcessingError(
                        'Data validation failed',
                        'validation',
                        validationResult.errors
                    );
                }
            }

            // Transform data based on format
            const transformedData = await this.transformer.transform(data, format);

            // Track transformation in lineage
            if (this.config.trackLineage) {
                this.lineage.addTransformation(processingId, 'transform', transformedData);
            }

            // Process through system coordinator
            const result = await this.coordinator.processData(transformedData);

            // Track final result in lineage
            if (this.config.trackLineage) {
                this.lineage.completeProcessing(processingId, result);
            }

            return result;
        } catch (error) {
            if (this.config.trackLineage) {
                this.lineage.recordError(processingId, error);
            }
            throw error;
        }
    }

    public async processBatch(
        dataItems: any[],
        format: DataFormat,
        context?: ProcessingContext
    ): Promise<any[]> {
        if (dataItems.length > this.config.maxBatchSize) {
            throw new ProcessingError(
                `Batch size exceeds maximum (${this.config.maxBatchSize})`,
                'batch_size'
            );
        }

        const results = [];
        const errors = [];

        for (const item of dataItems) {
            try {
                const result = await this.processData(item, format, context);
                results.push(result);
            } catch (error) {
                errors.push({
                    data: item,
                    error: error
                });
            }
        }

        if (errors.length > 0) {
            throw new ProcessingError(
                `Batch processing completed with ${errors.length} errors`,
                'batch_processing',
                errors
            );
        }

        return results;
    }

    public getLineage(processingId: string): any {
        if (!this.config.trackLineage) {
            throw new Error('Lineage tracking is not enabled');
        }
        return this.lineage.getLineage(processingId);
    }

    public getTransformationStats(): any {
        return this.transformer.getStats();
    }

    public async registerTransformation(
        name: string,
        transformation: DataTransformation
    ): Promise<void> {
        await this.validateTransformation(transformation);
        this.config.transformations.set(name, transformation);
        this.transformer.updateTransformations(this.config.transformations);
    }

    private async validateTransformation(
        transformation: DataTransformation
    ): Promise<void> {
        // Validate transformation function
        if (typeof transformation.transform !== 'function') {
            throw new Error('Transform must be a function');
        }

        // Validate optional validation function
        if (transformation.validation && 
            typeof transformation.validation !== 'function') {
            throw new Error('Validation must be a function if provided');
        }

        // Test transformation with sample data
        try {
            const sampleData = { test: true };
            await transformation.transform(sampleData);
        } catch (error) {
            throw new Error(`Transformation test failed: ${error.message}`);
        }
    }

    private generateProcessingId(): string {
        return `proc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
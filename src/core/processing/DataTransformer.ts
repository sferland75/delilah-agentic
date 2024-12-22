import { DataTransformation } from './DataProcessor';
import { DataFormat, TransformationError } from '../../types';

interface TransformationStats {
    totalTransformations: number;
    successCount: number;
    failureCount: number;
    averageProcessingTime: number;
}

export class DataTransformer {
    private transformations: Map<string, DataTransformation>;
    private stats: TransformationStats;

    constructor(transformations: Map<string, DataTransformation>) {
        this.transformations = new Map(transformations);
        this.stats = {
            totalTransformations: 0,
            successCount: 0,
            failureCount: 0,
            averageProcessingTime: 0
        };
    }

    public async transform(data: any, format: DataFormat): Promise<any> {
        const startTime = Date.now();

        try {
            // Get sorted transformations based on priority
            const sortedTransformations = Array.from(this.transformations.values())
                .sort((a, b) => b.priority - a.priority);

            let transformedData = { ...data };

            // Apply each transformation in order
            for (const transformation of sortedTransformations) {
                try {
                    // Run validation if provided
                    if (transformation.validation) {
                        const validationResult = await transformation.validation(transformedData);
                        if (!validationResult.valid) {
                            throw new TransformationError(
                                `Validation failed for transformation ${transformation.name}`,
                                validationResult.errors
                            );
                        }
                    }

                    // Apply transformation
                    transformedData = await transformation.transform(transformedData);

                } catch (error) {
                    this.updateStats(false, startTime);
                    throw new TransformationError(
                        `Transformation ${transformation.name} failed: ${error.message}`,
                        error
                    );
                }
            }

            this.updateStats(true, startTime);
            return transformedData;

        } catch (error) {
            this.updateStats(false, startTime);
            throw error;
        }
    }

    public updateTransformations(transformations: Map<string, DataTransformation>): void {
        this.transformations = new Map(transformations);
    }

    public getStats(): TransformationStats {
        return { ...this.stats };
    }

    private updateStats(success: boolean, startTime: number): void {
        const processingTime = Date.now() - startTime;

        this.stats.totalTransformations++;
        if (success) {
            this.stats.successCount++;
        } else {
            this.stats.failureCount++;
        }

        // Update average processing time
        this.stats.averageProcessingTime = (
            (this.stats.averageProcessingTime * (this.stats.totalTransformations - 1) +
            processingTime) / this.stats.totalTransformations
        );
    }
}
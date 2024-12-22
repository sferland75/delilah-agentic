import { DataFormat } from '../../types';

interface LineageNode {
    id: string;
    type: 'data' | 'transformation' | 'error';
    timestamp: number;
    data?: any;
    metadata?: any;
    parentId?: string;
}

interface LineageTrace {
    nodes: LineageNode[];
    startTime: number;
    endTime?: number;
    status: 'processing' | 'completed' | 'error';
    format: DataFormat;
}

export class DataLineage {
    private traces: Map<string, LineageTrace>;

    constructor() {
        this.traces = new Map();
    }

    public startProcessing(
        processingId: string,
        data: any,
        format: DataFormat
    ): void {
        this.traces.set(processingId, {
            nodes: [
                {
                    id: this.generateNodeId(),
                    type: 'data',
                    timestamp: Date.now(),
                    data,
                    metadata: { format }
                }
            ],
            startTime: Date.now(),
            status: 'processing',
            format
        });
    }

    public addTransformation(
        processingId: string,
        transformationType: string,
        resultData: any
    ): void {
        const trace = this.traces.get(processingId);
        if (!trace) {
            throw new Error(`No active trace for processing ID: ${processingId}`);
        }

        const parentNode = trace.nodes[trace.nodes.length - 1];
        const transformationNode: LineageNode = {
            id: this.generateNodeId(),
            type: 'transformation',
            timestamp: Date.now(),
            metadata: { transformationType },
            parentId: parentNode.id
        };

        const resultNode: LineageNode = {
            id: this.generateNodeId(),
            type: 'data',
            timestamp: Date.now(),
            data: resultData,
            parentId: transformationNode.id
        };

        trace.nodes.push(transformationNode, resultNode);
    }

    public completeProcessing(
        processingId: string,
        finalResult: any
    ): void {
        const trace = this.traces.get(processingId);
        if (!trace) {
            throw new Error(`No active trace for processing ID: ${processingId}`);
        }

        const resultNode: LineageNode = {
            id: this.generateNodeId(),
            type: 'data',
            timestamp: Date.now(),
            data: finalResult,
            parentId: trace.nodes[trace.nodes.length - 1].id,
            metadata: { final: true }
        };

        trace.nodes.push(resultNode);
        trace.endTime = Date.now();
        trace.status = 'completed';
    }

    public recordError(
        processingId: string,
        error: Error
    ): void {
        const trace = this.traces.get(processingId);
        if (!trace) {
            throw new Error(`No active trace for processing ID: ${processingId}`);
        }

        const errorNode: LineageNode = {
            id: this.generateNodeId(),
            type: 'error',
            timestamp: Date.now(),
            data: {
                message: error.message,
                stack: error.stack
            },
            parentId: trace.nodes[trace.nodes.length - 1].id
        };

        trace.nodes.push(errorNode);
        trace.endTime = Date.now();
        trace.status = 'error';
    }

    public getLineage(processingId: string): LineageTrace {
        const trace = this.traces.get(processingId);
        if (!trace) {
            throw new Error(`No trace found for processing ID: ${processingId}`);
        }
        return { ...trace };
    }

    public getLineageGraph(processingId: string): any {
        const trace = this.traces.get(processingId);
        if (!trace) {
            throw new Error(`No trace found for processing ID: ${processingId}`);
        }

        // Convert to graph structure
        const nodes = trace.nodes.map(node => ({
            id: node.id,
            type: node.type,
            timestamp: node.timestamp,
            metadata: node.metadata
        }));

        const edges = trace.nodes
            .filter(node => node.parentId)
            .map(node => ({
                from: node.parentId,
                to: node.id
            }));

        return { nodes, edges };
    }

    public clearLineage(processingId?: string): void {
        if (processingId) {
            this.traces.delete(processingId);
        } else {
            this.traces.clear();
        }
    }

    private generateNodeId(): string {
        return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
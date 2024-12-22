import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';

export abstract class BaseCommand {
    protected static program: Command;

    public static register(program: Command): void {
        this.program = program;
        this.configure();
    }

    protected static configure(): void {
        throw new Error('Command must implement configure method');
    }

    protected static createSpinner(text: string) {
        return ora({
            text,
            spinner: 'dots',
            color: 'cyan'
        });
    }

    protected static logSuccess(message: string): void {
        console.log(chalk.green('✓'), message);
    }

    protected static logError(message: string): void {
        console.error(chalk.red('✗'), message);
    }

    protected static logWarning(message: string): void {
        console.warn(chalk.yellow('⚠'), message);
    }

    protected static logInfo(message: string): void {
        console.info(chalk.blue('ℹ'), message);
    }

    protected static formatTable(data: any[]): string {
        if (data.length === 0) return '';

        // Get all unique keys
        const keys = Array.from(new Set(
            data.flatMap(obj => Object.keys(obj))
        ));

        // Calculate column widths
        const widths = keys.map(key => {
            const maxLength = Math.max(
                key.length,
                ...data.map(obj => String(obj[key] || '').length)
            );
            return Math.min(maxLength, 40); // Cap width at 40 chars
        });

        // Create header
        const header = keys.map((key, i) => 
            key.padEnd(widths[i])
        ).join(' | ');

        // Create separator
        const separator = widths.map(w => 
            '-'.repeat(w)
        ).join('-+-');

        // Create rows
        const rows = data.map(obj =>
            keys.map((key, i) => 
                String(obj[key] || '').padEnd(widths[i])
            ).join(' | ')
        );

        // Combine all parts
        return [
            header,
            separator,
            ...rows
        ].join('\n');
    }

    protected static formatDuration(ms: number): string {
        if (ms < 1000) return `${ms}ms`;
        const seconds = Math.floor(ms / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }

    protected static formatBytes(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let value = bytes;
        let unit = 0;
        while (value >= 1024 && unit < units.length - 1) {
            value /= 1024;
            unit++;
        }
        return `${value.toFixed(1)}${units[unit]}`;
    }

    protected static formatNumber(num: number): string {
        return new Intl.NumberFormat().format(num);
    }

    protected static async handleError(error: any): Promise<void> {
        if (error?.code === 'VALIDATION_ERROR') {
            this.logError(`Validation Error: ${error.message}`);
        } else if (error?.code === 'SYSTEM_ERROR') {
            this.logError(`System Error: ${error.message}`);
            if (error.details) {
                console.error(chalk.red('Details:'), error.details);
            }
        } else {
            this.logError(`Unexpected Error: ${error?.message || error}`);
            if (error?.stack) {
                console.error(chalk.gray(error.stack));
            }
        }
        process.exit(1);
    }
}
import { Command } from 'commander';
import { BaseCommand } from './BaseCommand';
import { SystemCoordinator } from '../../core/coordinator/SystemCoordinator';
import { ReportGenerator } from '../../services/ReportGenerator';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import chalk from 'chalk';

export class ReportCommand extends BaseCommand {
    protected static configure(): void {
        const report = this.program
            .command('report')
            .description('Generate and manage reports');

        // Generate report
        report
            .command('generate')
            .description('Generate a new report')
            .argument('<source>', 'Source data or ID')
            .option('-t, --template <name>', 'Report template to use')
            .option('-o, --output <file>', 'Output file for report')
            .option('--format <format>', 'Output format (pdf, html, md)', 'pdf')
            .option('--include-metrics', 'Include system metrics')
            .action(this.handleGenerate.bind(this));

        // List templates
        report
            .command('templates')
            .description('List available report templates')
            .option('--show-details', 'Show template details')
            .action(this.handleListTemplates.bind(this));

        // List reports
        report
            .command('list')
            .description('List generated reports')
            .option('--from <date>', 'Start date for listing')
            .option('--to <date>', 'End date for listing')
            .option('--source <source>', 'Filter by source')
            .action(this.handleList.bind(this));
    }

    private static async handleGenerate(
        source: string,
        options: any
    ): Promise<void> {
        const spinner = this.createSpinner('Generating report...');

        try {
            // Initialize system
            const coordinator = new SystemCoordinator();
            const generator = new ReportGenerator(coordinator);

            spinner.start();

            // Load template if specified
            let template;
            if (options.template) {
                template = await generator.loadTemplate(options.template);
            }

            // Generate report
            const report = await generator.generateReport(
                source,
                template,
                {
                    includeMetrics: options.includeMetrics
                }
            );

            // Format report
            const formatted = await this.formatReport(report, options.format);

            spinner.stop();

            // Handle output
            if (options.output) {
                await this.writeOutput(options.output, formatted);
                this.logSuccess(`Report written to ${options.output}`);
            } else {
                console.log(formatted);
            }

            await coordinator.shutdown();

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        }
    }

    private static async handleListTemplates(options: any): Promise<void> {
        const spinner = this.createSpinner('Loading templates...');

        try {
            // Initialize system
            const coordinator = new SystemCoordinator();
            const generator = new ReportGenerator(coordinator);

            spinner.start();

            // Get templates
            const templates = await generator.listTemplates();

            spinner.stop();

            if (options.showDetails) {
                this.displayTemplateDetails(templates);
            } else {
                this.displayTemplateList(templates);
            }

            await coordinator.shutdown();

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        }
    }

    private static async handleList(options: any): Promise<void> {
        const spinner = this.createSpinner('Loading reports...');

        try {
            // Initialize system
            const coordinator = new SystemCoordinator();
            const generator = new ReportGenerator(coordinator);

            spinner.start();

            // Convert date strings to timestamps
            const startTime = options.from ? new Date(options.from).getTime() : undefined;
            const endTime = options.to ? new Date(options.to).getTime() : undefined;

            // Get reports
            const reports = await generator.listReports({
                startTime,
                endTime,
                source: options.source
            });

            spinner.stop();

            this.displayReportList(reports);

            await coordinator.shutdown();

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        }
    }

    private static async formatReport(report: any, format: string): Promise<string> {
        switch (format.toLowerCase()) {
            case 'pdf':
                return this.formatPDF(report);
            case 'html':
                return this.formatHTML(report);
            case 'md':
                return this.formatMarkdown(report);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    private static async writeOutput(file: string, content: string): Promise<void> {
        const path = resolve(file);
        await writeFile(path, content);
    }

    private static formatPDF(report: any): string {
        // For now, returning JSON as PDF generation requires additional dependencies
        return JSON.stringify(report, null, 2);
    }

    private static formatHTML(report: any): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Report: ${report.id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2em; }
        .section { margin: 1em 0; }
        .title { color: #333; }
        .metric { margin: 0.5em 0; }
    </style>
</head>
<body>
    <h1>Analysis Report</h1>
    ${this.formatHTMLSections(report)}
</body>
</html>`;
    }

    private static formatHTMLSections(report: any): string {
        let html = '';
        
        if (report.analysis) {
            html += `
            <div class="section">
                <h2 class="title">Analysis Results</h2>
                ${this.formatHTMLAnalysis(report.analysis)}
            </div>`;
        }

        if (report.assessment) {
            html += `
            <div class="section">
                <h2 class="title">Assessment Results</h2>
                ${this.formatHTMLAssessment(report.assessment)}
            </div>`;
        }

        return html;
    }

    private static formatHTMLAnalysis(analysis: any): string {
        return `
        <div class="analysis">
            <div class="metric">Confidence: ${(analysis.confidence.score * 100).toFixed(1)}%</div>
            <div class="patterns">
                <h3>Identified Patterns</h3>
                ${this.formatHTMLPatterns(analysis.patterns)}
            </div>
        </div>`;
    }

    private static formatHTMLPatterns(patterns: any[]): string {
        return patterns.map(pattern => `
            <div class="pattern">
                <h4>${pattern.name}</h4>
                <div>Type: ${pattern.type}</div>
                <div>Confidence: ${(pattern.confidence * 100).toFixed(1)}%</div>
            </div>
        `).join('');
    }

    private static formatHTMLAssessment(assessment: any): string {
        return `
        <div class="assessment">
            ${assessment.findings.map((finding: string) => 
                `<div class="finding">${finding}</div>`
            ).join('')}
        </div>`;
    }

    private static formatMarkdown(report: any): string {
        let md = `# Analysis Report\n\n`;

        // Add metadata
        md += `Generated: ${new Date(report.timestamp).toLocaleString()}\n`;
        md += `ID: ${report.id}\n\n`;

        // Add analysis section
        if (report.analysis) {
            md += `## Analysis Results\n\n`;
            md += `Confidence: ${(report.analysis.confidence.score * 100).toFixed(1)}%\n\n`;
            
            md += `### Identified Patterns\n\n`;
            report.analysis.patterns.forEach((pattern: any) => {
                md += `#### ${pattern.name}\n`;
                md += `- Type: ${pattern.type}\n`;
                md += `- Confidence: ${(pattern.confidence * 100).toFixed(1)}%\n\n`;
            });
        }

        // Add assessment section
        if (report.assessment) {
            md += `## Assessment Results\n\n`;
            report.assessment.findings.forEach((finding: string) => {
                md += `- ${finding}\n`;
            });
        }

        return md;
    }

    private static displayTemplateList(templates: any[]): void {
        console.log(chalk.bold('\nAvailable Templates:'));
        templates.forEach(template => {
            console.log(`${chalk.cyan(template.name)} - ${template.description || 'No description'}`);
        });
    }

    private static displayTemplateDetails(templates: any[]): void {
        templates.forEach(template => {
            console.log(chalk.bold(`\n${template.name}`));
            console.log(chalk.gray('ID: ') + template.id);
            if (template.description) {
                console.log(chalk.gray('Description: ') + template.description);
            }
            console.log(chalk.gray('Sections:'));
            template.sections.forEach((section: any) => {
                console.log(`  - ${section.title} (${section.type})`);
            });
        });
    }

    private static displayReportList(reports: any[]): void {
        if (reports.length === 0) {
            console.log('No reports found.');
            return;
        }

        const tableData = reports.map(report => ({
            ID: report.id,
            Source: report.source,
            Date: new Date(report.timestamp).toLocaleString(),
            Status: this.getReportStatusIndicator(report.status),
            Confidence: `${(report.confidence * 100).toFixed(1)}%`
        }));

        console.log(this.formatTable(tableData));
    }

    private static getReportStatusIndicator(status: string): string {
        switch (status) {
            case 'complete': return chalk.green('✓');
            case 'processing': return chalk.yellow('⋯');
            case 'error': return chalk.red('✗');
            default: return chalk.gray('?');
        }
    }
}
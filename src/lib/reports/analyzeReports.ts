import { SummaryAnalyzer } from './summaryAnalyzer.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    try {
        const reportsDir = resolve(__dirname, '../../../IHAs');
        console.log('\nStarting detailed summary analysis...');
        console.log('Reports directory:', reportsDir);
        console.log('Analysis results will be saved to: d:\\delilah\\analysis\\summaries');

        // Set up interrupt handler
        process.on('SIGINT', async () => {
            console.log('\n\nInterrupt received. Saving current state...');
            process.exit(0);
        });

        const analyzer = new SummaryAnalyzer();
        await analyzer.analyzeSummaries(reportsDir);
        
        console.log('\nAnalysis complete! Check the analysis directory for:');
        console.log('1. Individual report analyses');
        console.log('2. Combined pattern analysis');
        console.log('3. Statistical summary');
        console.log('\nResults can be found in: d:\\delilah\\analysis\\summaries');
    } catch (error) {
        console.error('Error during analysis:', error);
        process.exit(1);
    }
}

// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
    process.exit(1);
});

main().catch(console.error);
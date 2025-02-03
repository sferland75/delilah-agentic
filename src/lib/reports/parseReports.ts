import { ReportParser } from './reportParser.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    try {
        const reportsDir = resolve(__dirname, '../../../IHAs');
        console.log('Starting report analysis...');
        console.log('Reports directory:', reportsDir);

        const parser = new ReportParser();
        await parser.parseReports(reportsDir);
        
        console.log('Analysis complete!');
    } catch (error) {
        console.error('Error during analysis:', error);
        process.exit(1);
    }
}

main().catch(console.error);
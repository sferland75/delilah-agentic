import { ReportExtractor } from '../report-extractor';

async function runLedouxTest() {
    try {
        // Load the full Ledoux report
        const report = await window.fs.readFile('d:\\delilah\\IHAs\\Copy of Ledoux, Jean-Marc IHA_FINAL.docx', { encoding: 'utf8' });
        
        console.log('Testing Ledoux report extraction...');
        
        const extractor = new ReportExtractor(report);
        const result = extractor.extract();

        if (result.success) {
            console.log('Successfully extracted data:');
            console.log(JSON.stringify(result.data, null, 2));
        } else {
            console.error('Extraction failed with errors:', result.errors);
        }
    } catch (error) {
        console.error('Test execution failed:', error);
    }
}

runLedouxTest();
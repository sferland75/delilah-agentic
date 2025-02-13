import { NarrativeEngine } from '../narrative/NarrativeEngine';
import { SymptomAnalyzer } from '../narrative/SymptomAnalyzer';
import { sampleAssessment } from '../narrative/__tests__/testData';

export async function runTests() {
    console.log('Starting narrative component tests...\n');

    // Test SymptomAnalyzer
    console.log('Testing SymptomAnalyzer:');
    const analyzer = new SymptomAnalyzer();
    const symptoms = sampleAssessment.assessment.symptoms.physical;
    
    try {
        const analyzed = await analyzer.analyzeSymptoms(symptoms, true);
        console.log('Analyzed symptoms:', JSON.stringify(analyzed, null, 2));
        
        // Basic assertions
        console.assert(analyzed.length === 2, 'Should analyze two symptoms');
        console.assert(analyzed[0].location === 'Lower back', 'First symptom should be lower back');
        console.assert(analyzed[1].location === 'Right shoulder', 'Second symptom should be right shoulder');
        
        console.log('✓ SymptomAnalyzer tests passed\n');
    } catch (error) {
        console.error('✗ SymptomAnalyzer tests failed:', error);
    }

    // Test NarrativeEngine
    console.log('Testing NarrativeEngine:');
    const engine = new NarrativeEngine({
        enableContextualAnalysis: true
    });

    try {
        // Test overview narrative
        const overview = await engine.generateNarrative(sampleAssessment, 'overview');
        console.log('\nOverview narrative:', overview);
        console.assert(overview.includes('John Doe'), 'Should include patient name');
        console.assert(overview.includes('lower back'), 'Should include symptom location');
        
        // Test symptom narrative
        const symptoms = await engine.generateNarrative(sampleAssessment, 'symptoms');
        console.log('\nSymptom narrative:', symptoms);
        console.assert(symptoms.includes('Moderate'), 'Should include symptom severity');
        console.assert(symptoms.includes('Sharp'), 'Should include pain type');
        
        // Test functional narrative
        const functional = await engine.generateNarrative(sampleAssessment, 'functional');
        console.log('\nFunctional narrative:', functional);
        console.assert(functional.includes('Modified Independent'), 'Should include independence level');
        
        console.log('✓ NarrativeEngine tests passed\n');
    } catch (error) {
        console.error('✗ NarrativeEngine tests failed:', error);
    }

    console.log('Narrative component tests complete.');
}

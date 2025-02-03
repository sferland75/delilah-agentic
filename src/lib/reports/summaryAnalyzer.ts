import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AnalysisState {
    processedFiles: string[];
    patterns: SummaryPattern[];
    transitions: [string, TransitionPhrase][];
    terminology: string[];
}

interface SummaryPattern {
    type: 'introduction' | 'baseline' | 'impact' | 'current' | 'conclusion';
    pattern: string;
    examples: string[];
}

interface TransitionPhrase {
    phrase: string;
    frequency: number;
    context: string[];
}

export class SummaryAnalyzer {
    private state: {
        processedFiles: string[];
        patterns: SummaryPattern[];
        transitions: Map<string, TransitionPhrase>;
        terminology: Set<string>;
    };
    private outputDir: string;
    private stateFile: string;

    constructor() {
        this.outputDir = path.resolve(__dirname, '../../../analysis/summaries');
        this.stateFile = path.join(this.outputDir, 'analysis_state.json');
        this.state = this.loadState();
    }

    private loadState() {
        if (fs.existsSync(this.stateFile)) {
            console.log('Resuming previous analysis...');
            const savedState = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
            return {
                processedFiles: savedState.processedFiles || [],
                patterns: savedState.patterns || [],
                transitions: new Map(savedState.transitions || []),
                terminology: new Set(savedState.terminology || [])
            };
        }

        return {
            processedFiles: [],
            patterns: [],
            transitions: new Map<string, TransitionPhrase>(),
            terminology: new Set<string>()
        };
    }

    private async saveState() {
        const stateToSave = {
            processedFiles: this.state.processedFiles,
            patterns: this.state.patterns,
            transitions: Array.from(this.state.transitions.entries()),
            terminology: Array.from(this.state.terminology)
        };

        await fsPromises.writeFile(
            this.stateFile,
            JSON.stringify(stateToSave, null, 2)
        );
    }

    async analyzeSummaries(directoryPath: string) {
        try {
            console.log('\nStarting summary analysis...');
            console.log('Input directory:', directoryPath);

            // Ensure output directory exists
            await fsPromises.mkdir(this.outputDir, { recursive: true });

            // Get list of files to process
            const files = await fsPromises.readdir(directoryPath);
            const reports = files.filter(file => 
                file.endsWith('.docx') && 
                !file.startsWith('~$') &&
                !this.state.processedFiles.includes(file)
            );

            console.log(`Found ${reports.length} new reports to analyze`);

            // Process each report
            for (const report of reports) {
                try {
                    const filePath = path.join(directoryPath, report);
                    console.log(`\nAnalyzing: ${report}`);
                    await this.analyzeSummary(filePath);
                    
                    // Save progress
                    this.state.processedFiles.push(report);
                    await this.saveState();
                    
                    // Save individual analysis
                    await this.saveSummaryAnalysis(report);
                } catch (error) {
                    console.error(`Error processing ${report}:`, error);
                }
            }

            // Save final analysis
            await this.saveFinalAnalysis();
            
            console.log('\nAnalysis complete!');
            console.log('- Total files processed:', this.state.processedFiles.length);
            console.log('- Patterns found:', this.state.patterns.length);
            console.log('- Transitions identified:', this.state.transitions.size);
            console.log('- Medical terms collected:', this.state.terminology.size);
        } catch (error) {
            console.error('Analysis failed:', error);
            await this.saveState(); // Save state on error
            throw error;
        }
    }

    private async analyzeSummary(filePath: string) {
        const buffer = await fsPromises.readFile(filePath);
        const result = await mammoth.extractRawText({ buffer });
        const text = result.value;

        // Extract Summary of Findings section
        const summaryMatch = text.match(/SUMMARY OF FINDINGS(.*?)(?=\n[A-Z\s]{5,}:|$)/si);
        if (!summaryMatch) {
            console.log('  No summary section found');
            return;
        }

        const summary = summaryMatch[1].trim();
        console.log(`  Found summary section (${summary.length} chars)`);
        
        this.analyzeSummaryContent(summary);
    }

    private analyzeSummaryContent(summary: string) {
        // Split into paragraphs
        const paragraphs = summary.split(/\n\n+/).filter(p => p.trim().length > 0);
        console.log(`  Analyzing ${paragraphs.length} paragraphs`);

        paragraphs.forEach((paragraph, index) => {
            const pattern = this.createPattern(paragraph, index, paragraphs.length);
            this.findTransitions(paragraph);
            this.extractTerminology(paragraph);
        });
    }

    private createPattern(text: string, index: number, total: number) {
        const type = this.getPatternType(text, index, total);
        const pattern = this.extractPattern(text);
        
        this.state.patterns.push({
            type,
            pattern,
            examples: [text]
        });
    }

    private getPatternType(text: string, index: number, total: number): 'introduction' | 'baseline' | 'impact' | 'current' | 'conclusion' {
        if (index === 0) return 'introduction';
        if (index === total - 1) return 'conclusion';
        
        if (text.match(/prior to|before|previously|historically/i)) return 'baseline';
        if (text.match(/impact|affect|limit|restrict|change/i)) return 'impact';
        return 'current';
    }

    private extractPattern(text: string): string {
        return text
            .replace(/\b\d+\b/g, '[NUMBER]')
            .replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[NAME]')
            .replace(/(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}/g, '[DATE]')
            .replace(/\d{1,3}(?:\.\d)?°/g, '[ANGLE]')
            .replace(/\d+\/10/g, '[PAIN_SCALE]')
            .replace(/\d+ (?:minutes?|hours?|days?|weeks?|months?|years?)/g, '[DURATION]')
            .replace(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g, '[AMOUNT]');
    }

    private findTransitions(text: string) {
        const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        
        sentences.forEach((sentence, i) => {
            if (i === 0) return;
            
            const words = sentence.split(' ').slice(0, 3).join(' ').toLowerCase();
            if (this.isTransitionPhrase(words)) {
                const transition = this.state.transitions.get(words) || {
                    phrase: words,
                    frequency: 0,
                    context: []
                };
                
                transition.frequency++;
                transition.context.push(sentence);
                this.state.transitions.set(words, transition);
            }
        });
    }

    private isTransitionPhrase(words: string): boolean {
        const transitionStarters = [
            'additionally', 'furthermore', 'moreover',
            'however', 'consequently', 'as a result',
            'in terms of', 'with regard to', 'notably',
            'in addition', 'specifically', 'of note',
            'in particular', 'significantly', 'most importantly'
        ];

        return transitionStarters.some(starter => words.startsWith(starter));
    }

    private extractTerminology(text: string) {
        const patterns = [
            /\b[A-Z][a-z]+(itis|osis|emia|algia|opathy|ectomy|otomy|plasty)\b/g,
            /\b(cervical|thoracic|lumbar|dorsal|ventral|lateral|medial|proximal|distal)\b/gi,
            /\b(chronic|acute|trauma|diagnosis|prognosis|etiology|pathology)\b/gi,
            /\b(mobility|gait|balance|coordination|strength|endurance|tolerance)\b/gi
        ];

        patterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            matches.forEach(term => this.state.terminology.add(term.toLowerCase()));
        });
    }

    private async saveSummaryAnalysis(filename: string) {
        const analysisPath = path.join(this.outputDir, `${filename}_analysis.json`);
        const analysis = {
            filename,
            patterns: this.state.patterns,
            transitions: Array.from(this.state.transitions.entries()),
            terminology: Array.from(this.state.terminology)
        };
        
        await fsPromises.writeFile(
            analysisPath,
            JSON.stringify(analysis, null, 2)
        );
    }

    private async saveFinalAnalysis() {
        const finalAnalysis = {
            statistics: {
                totalProcessed: this.state.processedFiles.length,
                totalPatterns: this.state.patterns.length,
                patternsByType: this.state.patterns.reduce((acc, pattern) => {
                    acc[pattern.type] = (acc[pattern.type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
                mostCommonTransitions: Array.from(this.state.transitions.values())
                    .sort((a, b) => b.frequency - a.frequency)
                    .slice(0, 10),
                termCount: this.state.terminology.size
            },
            patterns: this.state.patterns,
            transitions: Array.from(this.state.transitions.entries()),
            terminology: Array.from(this.state.terminology)
        };

        await fsPromises.writeFile(
            path.join(this.outputDir, 'final_analysis.json'),
            JSON.stringify(finalAnalysis, null, 2)
        );
    }
}

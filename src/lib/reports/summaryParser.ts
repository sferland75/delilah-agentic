import { readFile, readdir, mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

class SummaryAnalyzer {
    private patterns: SummaryPattern[] = [];
    private transitions: Map<string, TransitionPhrase> = new Map();
    private terminology: Set<string> = new Set();
    private processedCount = 0;
    private totalFiles = 0;

    async analyzeSummaries(directoryPath: string): Promise<void> {
        try {
            console.log('\nStarting summary analysis...');
            console.log('Input directory:', directoryPath);

            // Create output directory first
            const outputDir = join(__dirname, 'output');
            console.log('Creating output directory:', outputDir);
            await mkdir(outputDir, { recursive: true });

            const files = await readdir(directoryPath);
            const reports = files.filter(file => 
                file.endsWith('.docx') && 
                !file.startsWith('~$') &&
                !file.startsWith('.')
            );

            this.totalFiles = reports.length;
            console.log(`Found ${this.totalFiles} reports to analyze`);

            for (const report of reports) {
                try {
                    const filePath = join(directoryPath, report);
                    console.log(`\n[${++this.processedCount}/${this.totalFiles}] Analyzing: ${report}`);
                    await this.analyzeSummary(filePath);
                } catch (error) {
                    console.error(`Error processing ${report}:`, error);
                }
            }

            await this.saveAnalysis();
            
            console.log('\nAnalysis complete!');
            console.log('- Processed files:', this.processedCount);
            console.log('- Patterns found:', this.patterns.length);
            console.log('- Transitions identified:', this.transitions.size);
            console.log('- Medical terms collected:', this.terminology.size);
        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        }
    }

    private async analyzeSummary(filePath: string): Promise<void> {
        const buffer = await readFile(filePath);
        const result = await mammoth.extractRawText({ buffer });
        const text = result.value;

        // Extract Summary of Findings section
        const summaryMatch = text.match(/SUMMARY OF FINDINGS(.*?)(?=\n[A-Z\s]{5,}:|$)/si);
        if (!summaryMatch) {
            console.log('  No summary section found');
            return;
        }

        const summary = summaryMatch[1].trim();
        console.log('  Found summary section:', summary.length, 'characters');
        
        console.log('  Analyzing structure...');
        this.analyzeStructure(summary);
        
        console.log('  Finding transitions...');
        this.findTransitions(summary);
        
        console.log('  Extracting terminology...');
        this.extractTerminology(summary);
    }

    private analyzeStructure(summary: string): void {
        // Split into paragraphs
        const paragraphs = summary.split(/\n\n+/).filter(p => p.trim().length > 0);
        console.log(`  Found ${paragraphs.length} paragraphs`);

        paragraphs.forEach((paragraph, index) => {
            if (index === 0) {
                this.analyzeIntroduction(paragraph);
            } else if (index === paragraphs.length - 1) {
                this.analyzeConclusion(paragraph);
            } else {
                this.analyzeBody(paragraph);
            }
        });
    }

    private analyzeIntroduction(text: string): void {
        const pattern: SummaryPattern = {
            type: 'introduction',
            pattern: this.extractPattern(text),
            examples: [text]
        };

        const existingPattern = this.patterns.find(p => 
            p.type === 'introduction' && p.pattern === pattern.pattern);

        if (existingPattern) {
            existingPattern.examples.push(text);
        } else {
            this.patterns.push(pattern);
        }
    }

    private analyzeBody(text: string): void {
        const type = this.identifyParagraphType(text);
        
        const pattern: SummaryPattern = {
            type,
            pattern: this.extractPattern(text),
            examples: [text]
        };

        const existingPattern = this.patterns.find(p => 
            p.type === type && p.pattern === pattern.pattern);

        if (existingPattern) {
            existingPattern.examples.push(text);
        } else {
            this.patterns.push(pattern);
        }
    }

    private analyzeConclusion(text: string): void {
        const pattern: SummaryPattern = {
            type: 'conclusion',
            pattern: this.extractPattern(text),
            examples: [text]
        };

        const existingPattern = this.patterns.find(p => 
            p.type === 'conclusion' && p.pattern === pattern.pattern);

        if (existingPattern) {
            existingPattern.examples.push(text);
        } else {
            this.patterns.push(pattern);
        }
    }

    private identifyParagraphType(text: string): 'baseline' | 'impact' | 'current' {
        if (text.match(/prior to|before|previously|historically|pre-accident/i)) {
            return 'baseline';
        }
        if (text.match(/impact|affect|limit|restrict|change|alter|modify/i)) {
            return 'impact';
        }
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

    private findTransitions(text: string): void {
        const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        
        for (let i = 1; i < sentences.length; i++) {
            const words = sentences[i].split(' ').slice(0, 3).join(' ').toLowerCase();
            
            if (this.isTransitionPhrase(words)) {
                const phrase = this.transitions.get(words) || {
                    phrase: words,
                    frequency: 0,
                    context: []
                };

                phrase.frequency++;
                phrase.context.push(sentences[i]);
                this.transitions.set(words, phrase);
            }
        }
    }

    private isTransitionPhrase(words: string): boolean {
        const transitionStarters = [
            'additionally', 'furthermore', 'moreover',
            'however', 'consequently', 'as a result',
            'in terms of', 'with regard to', 'notably',
            'in addition', 'specifically', 'of note',
            'in particular', 'significantly', 'most importantly',
            'despite', 'although', 'while',
            'these', 'this', 'such',
            'the', 'following', 'currently'
        ];

        return transitionStarters.some(starter => words.startsWith(starter));
    }

    private extractTerminology(text: string): void {
        // Medical terminology patterns
        const medicalTerms = text.match(/\b[A-Z][a-z]+(itis|osis|emia|algia|opathy|ectomy|otomy|plasty)\b/g) || [];
        const anatomicalTerms = text.match(/\b(cervical|thoracic|lumbar|dorsal|ventral|lateral|medial|proximal|distal)\b/gi) || [];
        const clinicalTerms = text.match(/\b(chronic|acute|trauma|diagnosis|prognosis|etiology|pathology)\b/gi) || [];
        const functionalTerms = text.match(/\b(mobility|gait|balance|coordination|strength|endurance|tolerance)\b/gi) || [];

        [...medicalTerms, ...anatomicalTerms, ...clinicalTerms, ...functionalTerms].forEach(term => {
            this.terminology.add(term.toLowerCase());
        });
    }

    private async saveAnalysis(): Promise<void> {
        const outputDir = join(__dirname, 'output');
        console.log('\nSaving analysis to:', outputDir);

        const analysis = {
            patterns: this.patterns,
            transitions: Array.from(this.transitions.entries()).map(([key, value]) => value),
            terminology: Array.from(this.terminology),
            statistics: {
                totalProcessed: this.processedCount,
                totalPatterns: this.patterns.length,
                patternsByType: this.patterns.reduce((acc, pattern) => {
                    acc[pattern.type] = (acc[pattern.type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
                mostCommonTransitions: Array.from(this.transitions.values())
                    .sort((a, b) => b.frequency - a.frequency)
                    .slice(0, 10),
                termCount: this.terminology.size
            }
        };

        const outputPath = join(outputDir, 'summary_analysis.json');
        await writeFile(outputPath, JSON.stringify(analysis, null, 2));
        console.log('Analysis saved to:', outputPath);
    }
}

export const analyzeSummaries = async (directoryPath: string) => {
    const analyzer = new SummaryAnalyzer();
    await analyzer.analyzeSummaries(directoryPath);
};
import { readFile, readdir, mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

interface ReportSection {
    title: string;
    content: string;
    patterns: string[];
}

interface NarrativePattern {
    type: string;
    examples: string[];
    transitions: string[];
}

type SectionPatterns = Record<string, NarrativePattern[]>;

export class ReportParser {
    private sectionPatterns: SectionPatterns = {};
    private transitionPhrases: Set<string> = new Set();

    async parseReports(directoryPath: string): Promise<void> {
        console.log('Starting report parsing...');
        const files = await readdir(directoryPath);
        const reports = files.filter(file => file.endsWith('.docx') && !file.startsWith('~$'));

        console.log(`Found ${reports.length} reports to process`);

        for (const report of reports) {
            try {
                console.log(`\nProcessing report: ${report}`);
                const filePath = join(directoryPath, report);
                await this.parseReport(filePath);
            } catch (error) {
                console.error(`Error processing ${report}:`, error);
            }
        }

        console.log('\nReport parsing complete.');
        await this.saveLearningResults();
    }

    private async parseReport(filePath: string): Promise<void> {
        try {
            const buffer = await readFile(filePath);
            const result = await mammoth.extractRawText({ buffer });
            const text = result.value;

            const sections = this.identifySections(text);
            sections.forEach(section => {
                console.log(`Found section: ${section.title}`);
                this.analyzeSectionPatterns(section);
            });
        } catch (error) {
            throw new Error(`Failed to parse ${filePath}: ${error}`);
        }
    }

    private identifySections(text: string): ReportSection[] {
        const sections: ReportSection[] = [];
        const sectionRegexes = [
            {
                title: 'SUMMARY OF FINDINGS',
                regex: /SUMMARY OF FINDINGS(.*?)(?=\n[A-Z\s]{5,}:|$)/si
            },
            {
                title: 'PRE-ACCIDENT MEDICAL HISTORY',
                regex: /PRE-ACCIDENT MEDICAL HISTORY(.*?)(?=\n[A-Z\s]{5,}:|$)/si
            },
            {
                title: 'MECHANISM OF INJURY',
                regex: /MECHANISM OF INJURY(.*?)(?=\n[A-Z\s]{5,}:|$)/si
            },
            {
                title: 'FUNCTIONAL ASSESSMENT',
                regex: /FUNCTIONAL(?: AND BEHAVIOURAL)? OBSERVATIONS(.*?)(?=\n[A-Z\s]{5,}:|$)/si
            }
        ];

        for (const { title, regex } of sectionRegexes) {
            const match = text.match(regex);
            if (match && match[1]) {
                sections.push({
                    title,
                    content: match[1].trim(),
                    patterns: this.extractPatterns(match[1].trim())
                });
            }
        }

        return sections;
    }

    private extractPatterns(text: string): string[] {
        const patterns: string[] = [];
        const sentences = text.split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        sentences.forEach((sentence, i) => {
            if (i > 0) {
                const words = sentence.split(' ').slice(0, 3).join(' ').toLowerCase();
                if (this.isTransitionPhrase(words)) {
                    this.transitionPhrases.add(words);
                }
            }

            if (sentence.length > 20) {
                patterns.push(this.generalizePattern(sentence));
            }
        });

        return patterns;
    }

    private isTransitionPhrase(words: string): boolean {
        const transitionStarters = [
            'additionally', 'furthermore', 'moreover',
            'however', 'consequently', 'as a result',
            'in terms of', 'with regard to', 'notably',
            'in addition', 'specifically', 'with respect to'
        ];
        return transitionStarters.some(starter => words.startsWith(starter));
    }

    private generalizePattern(sentence: string): string {
        return sentence
            .replace(/\d+/g, '[NUMBER]')
            .replace(/(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}/g, '[DATE]')
            .replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[NAME]')
            .replace(/\d{1,3}(?:\.\d)?°/g, '[ANGLE]')
            .replace(/\d+\/10/g, '[PAIN_SCALE]')
            .replace(/\d+ (?:minutes?|hours?|days?|weeks?|months?|years?)/g, '[DURATION]')
            .replace(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g, '[AMOUNT]');
    }

    private analyzeSectionPatterns(section: ReportSection): void {
        if (!this.sectionPatterns[section.title]) {
            this.sectionPatterns[section.title] = [];
        }

        for (const pattern of section.patterns) {
            const patternType = this.categorizePattern(pattern);
            let existingPattern = this.sectionPatterns[section.title]
                .find(p => p.type === patternType);

            if (existingPattern) {
                if (!existingPattern.examples.includes(pattern)) {
                    existingPattern.examples.push(pattern);
                }
            } else {
                this.sectionPatterns[section.title].push({
                    type: patternType,
                    examples: [pattern],
                    transitions: []
                });
            }
        }
    }

    private categorizePattern(pattern: string): string {
        if (pattern.match(/(?:demonstrates?|shows?|exhibits?|presents?)/i)) return 'observation';
        if (pattern.match(/(?:impacts?|affects?|limits?|restricts?)/i)) return 'impact';
        if (pattern.match(/(?:requires?|needs?|necessitates?)/i)) return 'requirement';
        if (pattern.match(/(?:prior to|before|previously|historically)/i)) return 'historical';
        if (pattern.match(/(?:currently|presently|now|at this time)/i)) return 'current_status';
        if (pattern.match(/(?:reports?|states?|indicates?|describes?)/i)) return 'subjective';
        if (pattern.match(/(?:measured|tested|assessed|evaluated)/i)) return 'objective';
        return 'general';
    }

    private async saveLearningResults(): Promise<void> {
        const __filename = fileURLToPath(import.meta.url);
        const outputDir = join(dirname(__filename), 'output');
        
        try {
            await mkdir(outputDir, { recursive: true });
        } catch (error) {
            console.error('Error creating output directory:', error);
        }

        const learningResults = {
            sectionPatterns: this.sectionPatterns,
            transitionPhrases: Array.from(this.transitionPhrases)
        };

        try {
            const outputPath = join(outputDir, 'narrative-patterns.json');
            await writeFile(outputPath, JSON.stringify(learningResults, null, 2));
            console.log(`\nLearning results saved to: ${outputPath}`);

            const stats = {
                totalPatterns: Object.values(this.sectionPatterns)
                    .reduce((sum, patterns) => sum + patterns.length, 0),
                patternsPerSection: Object.fromEntries(
                    Object.entries(this.sectionPatterns)
                        .map(([section, patterns]) => [section, patterns.length])
                ),
                transitionPhrasesCount: this.transitionPhrases.size
            };

            const statsPath = join(outputDir, 'learning-stats.json');
            await writeFile(statsPath, JSON.stringify(stats, null, 2));
            console.log(`Statistics saved to: ${statsPath}`);
        } catch (error) {
            console.error('Error saving results:', error);
        }
    }
}
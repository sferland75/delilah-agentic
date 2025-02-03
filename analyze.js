const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

class SummaryAnalyzer {
    constructor() {
        this.outputDir = path.join(__dirname, 'analysis');
        this.summariesDir = path.join(this.outputDir, 'summaries');
        this.state = {
            processedFiles: [],
            patterns: [],
            transitions: new Map(),
            terminology: new Set()
        };
    }

    async analyze(reportsDir) {
        try {
            console.log('\nStarting summary analysis...');
            console.log('Reports directory:', reportsDir);
            
            // Create output directories
            await fs.promises.mkdir(this.outputDir, { recursive: true });
            await fs.promises.mkdir(this.summariesDir, { recursive: true });

            // Get list of reports
            const files = await fs.promises.readdir(reportsDir);
            const reports = files.filter(f => f.endsWith('.docx') && !f.startsWith('~$'));

            console.log(`\nFound ${reports.length} reports to analyze`);

            // Process each report
            for (const report of reports) {
                try {
                    console.log(`\nAnalyzing: ${report}`);
                    await this.analyzeReport(path.join(reportsDir, report));
                    this.state.processedFiles.push(report);
                    await this.saveProgress(report);
                } catch (error) {
                    console.error(`Error processing ${report}:`, error);
                }
            }

            // Save final analysis
            await this.saveFinalAnalysis();

            console.log('\nAnalysis complete!');
            console.log(`Results saved in: ${this.outputDir}`);
        } catch (error) {
            console.error('Analysis failed:', error);
        }
    }

    async analyzeReport(filePath) {
        // Read and convert DOCX
        const buffer = await fs.promises.readFile(filePath);
        const result = await mammoth.extractRawText({ buffer });
        const text = result.value;

        // Find Summary section
        const summaryMatch = text.match(/SUMMARY OF FINDINGS(.*?)(?=\n[A-Z\s]{5,}:|$)/si);
        if (!summaryMatch) {
            console.log('  No summary section found');
            return;
        }

        const summary = summaryMatch[1].trim();
        console.log(`  Found summary section (${summary.length} chars)`);

        // Analyze summary content
        const paragraphs = summary.split(/\n\n+/).filter(p => p.trim());
        console.log(`  Analyzing ${paragraphs.length} paragraphs`);

        paragraphs.forEach((para, i) => {
            this.analyzeParagraph(para, i === 0, i === paragraphs.length - 1);
        });
    }

    analyzeParagraph(text, isIntro, isConclusion) {
        // Extract pattern
        const pattern = {
            text: this.generalizeText(text),
            type: this.getPatternType(text, isIntro, isConclusion),
            examples: [text]
        };

        // Add to patterns
        const existingPattern = this.state.patterns.find(p => 
            p.type === pattern.type && p.text === pattern.text);
        if (existingPattern) {
            existingPattern.examples.push(text);
        } else {
            this.state.patterns.push(pattern);
        }

        // Find transitions
        this.findTransitions(text);

        // Extract terminology
        this.findTerminology(text);
    }

    generalizeText(text) {
        return text
            .replace(/\b\d+\b/g, '[NUMBER]')
            .replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[NAME]')
            .replace(/(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}/g, '[DATE]')
            .replace(/\d{1,3}(?:\.\d)?°/g, '[ANGLE]')
            .replace(/\d+\/10/g, '[PAIN_SCALE]')
            .replace(/\d+ (?:minutes?|hours?|days?|weeks?|months?|years?)/g, '[DURATION]')
            .replace(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g, '[AMOUNT]');
    }

    getPatternType(text, isIntro, isConclusion) {
        if (isIntro) return 'introduction';
        if (isConclusion) return 'conclusion';
        if (text.match(/prior to|before|previously|historically/i)) return 'baseline';
        if (text.match(/impact|affect|limit|restrict|change/i)) return 'impact';
        return 'current';
    }

    findTransitions(text) {
        const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s);
        sentences.forEach((sentence, i) => {
            if (i === 0) return;
            
            const words = sentence.split(' ').slice(0, 3).join(' ').toLowerCase();
            if (this.isTransitional(words)) {
                const transition = this.state.transitions.get(words) || {
                    phrase: words,
                    count: 0,
                    examples: []
                };
                transition.count++;
                transition.examples.push(sentence);
                this.state.transitions.set(words, transition);
            }
        });
    }

    isTransitional(phrase) {
        const transitions = [
            'additionally', 'furthermore', 'moreover',
            'however', 'consequently', 'as a result',
            'in terms of', 'with regard to', 'notably',
            'in addition', 'specifically', 'of note',
            'in particular', 'significantly', 'most importantly'
        ];
        return transitions.some(t => phrase.startsWith(t));
    }

    findTerminology(text) {
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

    async saveProgress(reportName) {
        const analysis = {
            file: reportName,
            patterns: this.state.patterns.length,
            transitions: this.state.transitions.size,
            terms: this.state.terminology.size
        };

        await fs.promises.writeFile(
            path.join(this.summariesDir, `${reportName}.json`),
            JSON.stringify(analysis, null, 2)
        );
    }

    async saveFinalAnalysis() {
        const analysis = {
            statistics: {
                filesProcessed: this.state.processedFiles.length,
                totalPatterns: this.state.patterns.length,
                transitions: this.state.transitions.size,
                terminology: this.state.terminology.size
            },
            patterns: this.state.patterns,
            transitions: Array.from(this.state.transitions.entries()),
            terminology: Array.from(this.state.terminology)
        };

        await fs.promises.writeFile(
            path.join(this.outputDir, 'analysis.json'),
            JSON.stringify(analysis, null, 2)
        );
    }
}

// Run the analysis
const analyzer = new SummaryAnalyzer();
analyzer.analyze(path.join(__dirname, 'IHAs'))
    .catch(console.error);
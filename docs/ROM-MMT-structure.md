# ROM and MMT Assessment Structure

## Data Structure
[Previous ROM/MMT structure content would remain here...]

## Report Generation Integration

### ROM/MMT Section Template
```typescript
const functionalTemplate = {
  system: `You are an experienced occupational therapist writing a medical-legal report.
Focus on objective measurements, functional implications, and clinical significance
of range of motion and muscle strength findings.`,
  human: `Based on the following ROM and MMT assessment data, generate a comprehensive analysis:

{data}

Include:
1. ROM measurements with functional implications
2. Muscle strength findings and impacts
3. Movement pattern analysis
4. Bilateral comparisons
5. Functional limitations
6. Treatment recommendations`
};
```

### Data Transformation
```typescript
interface ROMMMTTransform {
  rangeOfMotion: {
    cervical: Record<string, {
      active: number;
      passive: number;
      normal: number;
      percentage: number;
    }>;
    shoulder: Record<string, {
      active: number;
      passive: number;
      normal: number;
      percentage: number;
    }>;
    // Other joints...
  };
  muscleStrength: {
    upperExtremity: Record<string, {
      right: number;
      left: number;
      comments: string;
    }>;
    lowerExtremity: Record<string, {
      right: number;
      left: number;
      comments: string;
    }>;
  };
  functionalImplications: {
    reaching: string[];
    lifting: string[];
    carrying: string[];
    posture: string[];
  };
}

// Transform assessment data for report
const transformedData = transformROMMMTData(assessment.functional);
```

### Validation Schema
```typescript
const rommmtValidationSchema = z.object({
  rangeOfMotion: z.record(z.object({
    active: z.number(),
    passive: z.number(),
    normal: z.number(),
    percentage: z.number()
  })),
  muscleStrength: z.record(z.object({
    right: z.number().min(0).max(5),
    left: z.number().min(0).max(5),
    comments: z.string()
  })),
  functionalImplications: z.object({
    reaching: z.array(z.string()),
    lifting: z.array(z.string()),
    carrying: z.array(z.string()),
    posture: z.array(z.string())
  })
});
```

### Report Section Structure
```typescript
interface ROMMMTReportSection {
  title: string;
  content: string;
  subsections: {
    rangeOfMotion: {
      cervical: string;
      shoulder: string;
      elbow: string;
      wrist: string;
      hip: string;
      knee: string;
      ankle: string;
    };
    muscleStrength: {
      upperExtremity: string;
      lowerExtremity: string;
      trunk: string;
    };
    functionalImplications: string;
  };
}
```

### Data Analysis Functions
```typescript
// Calculate ROM percentage from normal
function calculateROMPercentage(
  measured: number, 
  normal: number
): number {
  return (measured / normal) * 100;
}

// Format MMT grade with comments
function formatMMTGrade(
  grade: number, 
  comments?: string
): string {
  const gradeText = grade.toFixed(1);
  return comments 
    ? `${gradeText}/5 - ${comments}`
    : `${gradeText}/5`;
}

// Analyze bilateral differences
function analyzeBilateralDifference(
  right: number,
  left: number
): string {
  const difference = Math.abs(right - left);
  if (difference <= 0.5) return 'Symmetrical';
  return `${difference.toFixed(1)} grade difference`;
}
```

### Integration Example
```typescript
// Generate ROM/MMT section
interface FunctionalSectionOptions {
  includeGraphs?: boolean;
  includeTables?: boolean;
  compareToNorms?: boolean;
}

async function generateFunctionalSection(
  assessment: Assessment,
  options: FunctionalSectionOptions = {}
): Promise<ROMMMTReportSection> {
  const { functional } = assessment;
  
  // Transform data
  const transformedData = transformROMMMTData(functional);
  
  // Validate data
  const validationResult = rommmtValidationSchema.safeParse(transformedData);
  if (!validationResult.success) {
    throw new Error('Invalid ROM/MMT data');
  }

  // Generate section with customized prompt
  const customPrompt = buildFunctionalPrompt(options);
  return await generator.generateSection('functional', {
    data: transformedData,
    prompt: customPrompt
  });
}

// Preview ROM/MMT section
<SectionPreview
  sectionKey="functional"
  title="Physical Function Assessment"
  content={functionalSection.content}
  originalPrompt={functionalTemplate}
  onRegenerateSection={handleRegenerate}
  onLockSection={handleLock}
  onUpdateContent={handleUpdate}
/>
```

### Custom Analysis Components
```typescript
// ROM Comparison Chart
function ROMComparisonChart({ data }) {
  return (
    <BarChart data={data}>
      <XAxis dataKey="movement" />
      <YAxis label="Degrees" />
      <Bar dataKey="active" fill="#8884d8" name="Active ROM" />
      <Bar dataKey="passive" fill="#82ca9d" name="Passive ROM" />
      <Bar dataKey="normal" fill="#ffc658" name="Normal ROM" />
    </BarChart>
  );
}

// MMT Summary Table
function MMTSummaryTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Muscle Group</TableCell>
          <TableCell>Right</TableCell>
          <TableCell>Left</TableCell>
          <TableCell>Comments</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([muscle, grades]) => (
          <TableRow key={muscle}>
            <TableCell>{muscle}</TableCell>
            <TableCell>{formatMMTGrade(grades.right)}</TableCell>
            <TableCell>{formatMMTGrade(grades.left)}</TableCell>
            <TableCell>{grades.comments}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Report Generation Hooks
```typescript
// Custom hook for ROM/MMT data management
function useROMMMTReport(assessment: Assessment) {
  const [section, setSection] = useState<ROMMMTReportSection>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const generateSection = async (options?: FunctionalSectionOptions) => {
    try {
      setLoading(true);
      const newSection = await generateFunctionalSection(assessment, options);
      setSection(newSection);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    section,
    loading,
    error,
    generateSection
  };
}
```
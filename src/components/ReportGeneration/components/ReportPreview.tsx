import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionPreview } from './SectionPreview';
import { GenerationProgressUI } from './GenerationProgress';
import { TransformedSection } from '@/lib/reports/sectionTransformer';
import { promptTemplates } from '@/lib/reports/promptTemplates';
import ReportGenerator, { GenerationProgress } from '@/lib/reports/ReportGenerator';

interface ReportPreviewProps {
  assessment: any;
  onComplete: (report: string) => void;
  onClose: () => void;
}

interface SectionState {
  content: string;
  isLocked: boolean;
  isEditing: boolean;
  customPrompt?: {
    system: string;
    human: string;
  };
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  assessment,
  onComplete,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<string>('demographics');
  const [sections, setSections] = useState<Record<string, TransformedSection>>({});
  const [sectionStates, setSectionStates] = useState<Record<string, SectionState>>({});
  const [progress, setProgress] = useState<Record<string, GenerationProgress>>({});
  const [error, setError] = useState<string | null>(null);

  // Initialize report generation
  useEffect(() => {
    const initializeReport = async () => {
      try {
        const generator = new ReportGenerator(assessment);
        const initialSections = await generator.transformSections();
        setSections(initialSections);
        
        // Initialize section states
        const initialStates = Object.keys(initialSections).reduce((acc, key) => ({
          ...acc,
          [key]: {
            content: initialSections[key].content,
            isLocked: false,
            isEditing: false
          }
        }), {});
        setSectionStates(initialStates);

        // Begin generation
        await generator.generateReport({
          onProgress: (sectionProgress) => {
            setProgress(prev => ({
              ...prev,
              [sectionProgress.section]: sectionProgress
            }));
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error initializing report');
      }
    };

    initializeReport();
  }, [assessment]);

  const handleRegenerateSection = async (
    sectionKey: string,
    newPrompt: { system: string; human: string }
  ) => {
    try {
      setError(null);
      setProgress(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], status: 'processing', progress: 0 }
      }));

      const generator = new ReportGenerator(assessment);
      const newContent = await generator.regenerateSection(sectionKey, newPrompt);

      setSectionStates(prev => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          content: newContent,
          customPrompt: newPrompt
        }
      }));

      setProgress(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], status: 'complete', progress: 100 }
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error regenerating section');
    }
  };

  const handleLockSection = (sectionKey: string) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        isLocked: !prev[sectionKey].isLocked,
        isEditing: false
      }
    }));
  };

  const handleUpdateContent = (sectionKey: string, content: string) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        content
      }
    }));
  };

  const handleToggleEdit = (sectionKey: string) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        isEditing: !prev[sectionKey].isEditing
      }
    }));
  };

  const handleSaveReport = () => {
    // Combine all section content into final report
    const reportContent = Object.entries(sections)
      .sort(([,a], [,b]) => (a.order || 0) - (b.order || 0))
      .map(([key, section]) => {
        const state = sectionStates[key];
        return `# ${section.title}\n\n${state?.content || section.content}`;
      })
      .join('\n\n');

    onComplete(reportContent);
  };

  return (
    <Card className="w-full">
      <div className="p-4 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Report Preview</h2>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveReport}>
              Save Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Progress Panel */}
          <div className="col-span-1">
            <GenerationProgressUI
              sections={progress}
              currentSection={activeSection}
              error={error}
            />
          </div>

          {/* Section Preview */}
          <div className="col-span-3">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList>
                {Object.entries(sections).map(([key, section]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className={`
                      ${sectionStates[key]?.isLocked ? 'border-green-500' : ''}
                      ${progress[key]?.status === 'error' ? 'border-red-500' : ''}
                    `}
                  >
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(sections).map(([key, section]) => (
                <TabsContent key={key} value={key}>
                  <SectionPreview
                    sectionKey={key}
                    title={section.title}
                    content={sectionStates[key]?.content || section.content}
                    originalPrompt={promptTemplates[key]}
                    onRegenerateSection={(newPrompt) => handleRegenerateSection(key, newPrompt)}
                    onLockSection={() => handleLockSection(key)}
                    onUpdateContent={(content) => handleUpdateContent(key, content)}
                    isLocked={sectionStates[key]?.isLocked || false}
                    isEditing={sectionStates[key]?.isEditing || false}
                    onToggleEdit={() => handleToggleEdit(key)}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </Card>
  );
};
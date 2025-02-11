import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Check, Edit2, Lock, Unlock, History } from 'lucide-react';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { PromptEditor } from './PromptEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionHistory } from '@/lib/reports/sectionHistory';

interface SectionPreviewProps {
  sectionKey: string;
  title: string;
  content: string;
  originalPrompt: {
    system: string;
    human: string;
  };
  onRegenerateSection: (newPrompt: { system: string; human: string }) => Promise<void>;
  onLockSection: () => void;
  onUpdateContent: (content: string) => void;
  isLocked: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const SectionPreview: React.FC<SectionPreviewProps> = ({
  sectionKey,
  title,
  content,
  originalPrompt,
  onRegenerateSection,
  onLockSection,
  onUpdateContent,
  isLocked,
  isEditing,
  onToggleEdit
}) => {
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [versionContent, setVersionContent] = useState<string | null>(null);

  // Initialize history
  const history = new SectionHistory();

  const handleRegenerateWithPrompt = async (newPrompt: { system: string; human: string }) => {
    try {
      setError(null);
      // Save current version before regenerating
      history.addVersion(sectionKey, content, originalPrompt);
      await onRegenerateSection(newPrompt);
      setShowPromptEditor(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error regenerating section');
    }
  };

  const handleContentChange = (value: string) => {
    setEditedContent(value);
    onUpdateContent(value);
  };

  const handleSaveContent = () => {
    // Save version before applying changes
    history.addVersion(sectionKey, content);
    onUpdateContent(editedContent);
    onToggleEdit();
  };

  const handleRevertToVersion = (version: string) => {
    onUpdateContent(version);
    setShowHistory(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex space-x-2">
          {isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveContent}
            >
              <Check className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleEdit}
              disabled={isLocked}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPromptEditor(true)}
            disabled={isLocked}
          >
            Customize Prompt
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            disabled={isLocked}
          >
            <History className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLockSection}
          >
            {isLocked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {showHistory ? (
            <div className="space-y-4">
              <h3 className="font-medium">Previous Versions</h3>
              {history.getVersions(sectionKey).map((version, index) => (
                <div key={version.timestamp} className="space-y-2">
                  <div className="flex justify-between">
                    <span>Version {index + 1}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevertToVersion(version.content)}
                    >
                      Revert to this version
                    </Button>
                  </div>
                  <div className="p-2 border rounded bg-muted">
                    {version.content.slice(0, 200)}...
                  </div>
                </div>
              ))}
            </div>
          ) : isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[350px] resize-none"
              placeholder="Enter section content..."
            />
          ) : (
            <div className="prose max-w-none whitespace-pre-wrap">
              {content}
            </div>
          )}
        </ScrollArea>

        {showPromptEditor && (
          <PromptEditor
            sectionKey={sectionKey}
            originalPrompt={originalPrompt}
            onSubmit={handleRegenerateWithPrompt}
            onClose={() => setShowPromptEditor(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};
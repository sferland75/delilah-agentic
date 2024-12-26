import React, { useState } from 'react';
import { AssessmentTemplate, AssessmentSection, TemplateStatus } from '../../types/template';
import SectionEditor from './SectionEditor';

interface TemplateEditorProps {
  template?: Partial<AssessmentTemplate>;
  onSave: (template: AssessmentTemplate) => void;
  onCancel: () => void;
}

const defaultScoring = {
  method: 'sum' as const,
  ranges: [],
  customLogic: ''
};

const defaultTemplate: Partial<AssessmentTemplate> = {
  name: '',
  description: '',
  version: '1.0.0',
  sections: [],
  status: 'draft' as TemplateStatus,
  scoring: defaultScoring
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [editingTemplate, setEditingTemplate] = useState<Partial<AssessmentTemplate>>({
    ...defaultTemplate,
    ...template,
    scoring: {
      ...defaultScoring,
      ...(template?.scoring || {})
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidTemplate()) {
      onSave({
        ...editingTemplate,
        scoring: editingTemplate.scoring || defaultScoring
      } as AssessmentTemplate);
    }
  };

  const isValidTemplate = () => {
    return (
      editingTemplate.name &&
      editingTemplate.description &&
      editingTemplate.sections &&
      editingTemplate.sections.length > 0 &&
      editingTemplate.sections.every(section => 
        section.title && section.fields.length > 0
      )
    );
  };

  const handleAddSection = () => {
    const newSection: AssessmentSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      description: '',
      fields: [],
      order: ((editingTemplate.sections || []).length || 0) + 1,
    };
    
    setEditingTemplate(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
  };

  const handleUpdateSection = (index: number, updatedSection: AssessmentSection) => {
    const sections = editingTemplate.sections || [];
    const updatedSections = [...sections];
    updatedSections[index] = updatedSection;
    
    setEditingTemplate(prev => ({
      ...prev,
      sections: updatedSections,
    }));
  };

  const handleDeleteSection = (index: number) => {
    const sections = editingTemplate.sections || [];
    const updatedSections = sections.filter((_, i) => i !== index);
    
    setEditingTemplate(prev => ({
      ...prev,
      sections: updatedSections,
    }));
  };

  const handleScoringMethodChange = (method: 'sum' | 'average' | 'custom') => {
    setEditingTemplate(prev => ({
      ...prev,
      scoring: {
        ...prev.scoring,
        method
      }
    }));
  };

  const handleCustomLogicChange = (customLogic: string) => {
    setEditingTemplate(prev => ({
      ...prev,
      scoring: {
        ...(prev.scoring || defaultScoring),
        customLogic
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Template Details</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Template Name</label>
              <input
                type="text"
                value={editingTemplate.name || ''}
                onChange={e => setEditingTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editingTemplate.description || ''}
                onChange={e => setEditingTemplate(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Version</label>
                <input
                  type="text"
                  value={editingTemplate.version || '1.0.0'}
                  onChange={e => setEditingTemplate(prev => ({ ...prev, version: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingTemplate.status || 'draft'}
                  onChange={e => setEditingTemplate(prev => ({ 
                    ...prev, 
                    status: e.target.value as TemplateStatus 
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Assessment Sections</h2>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Section
            </button>
          </div>

          {(editingTemplate.sections || []).map((section, index) => (
            <SectionEditor
              key={section.id}
              section={section}
              onChange={(updatedSection) => handleUpdateSection(index, updatedSection)}
              onDelete={() => handleDeleteSection(index)}
            />
          ))}
        </div>

        {/* Scoring Configuration */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Scoring Configuration</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Scoring Method</label>
              <select
                value={editingTemplate.scoring?.method || defaultScoring.method}
                onChange={e => handleScoringMethodChange(e.target.value as 'sum' | 'average' | 'custom')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="sum">Sum of Scores</option>
                <option value="average">Average Score</option>
                <option value="custom">Custom Logic</option>
              </select>
            </div>

            {(editingTemplate.scoring?.method || defaultScoring.method) === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Scoring Logic</label>
                <textarea
                  value={editingTemplate.scoring?.customLogic || ''}
                  onChange={e => handleCustomLogicChange(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter custom scoring logic..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateEditor;
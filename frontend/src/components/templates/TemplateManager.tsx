import React, { useState, useEffect } from 'react';
import { AssessmentTemplate } from '../../types/template';

interface TemplateManagerProps {
  onTemplateSelect?: (template: AssessmentTemplate) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (!response.ok) {
          throw new Error('Failed to load templates');
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error('Error loading templates:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading templates...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessment Templates</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {/* TODO: Implement new template creation */}}
        >
          New Template
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <div 
            key={template.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onTemplateSelect?.(template)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{template.name}</h3>
              <span className={`px-2 py-1 rounded-full text-sm ${
                template.status === 'active' ? 'bg-green-100 text-green-800' :
                template.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {template.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">{template.description}</p>
            
            <div className="text-sm text-gray-500">
              <div>Version: {template.version}</div>
              <div>Last updated: {new Date(template.updatedAt).toLocaleDateString()}</div>
              <div>Sections: {template.sections.length}</div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="text-blue-500 hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement edit template
                }}
              >
                Edit
              </button>
              <button 
                className="text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement delete template
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateManager;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Template {
  id: string;
  title: string;
  version: string;
  type: string;
  sections: {
    [key: string]: {
      title: string;
      metrics: Array<{
        name: string;
        observation_required: boolean;
      }>;
    };
  };
}

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const response = await fetch('/api/assessment/templates', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      setTemplates(await response.json());
    }
  };

  const createNewVersion = async (template: Template) => {
    const response = await fetch(`/api/assessment/templates/${template.id}/version`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(template)
    });
    if (response.ok) {
      await fetchTemplates();
      setIsEditing(false);
    }
  };

  const handleSectionChange = (sectionKey: string, newData: any) => {
    if (!selectedTemplate) return;
    
    setSelectedTemplate({
      ...selectedTemplate,
      sections: {
        ...selectedTemplate.sections,
        [sectionKey]: newData
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assessment Templates</h2>
        {hasRole('admin') && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Template
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div 
            key={template.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold">{template.title}</h3>
            <p className="text-gray-600">Version {template.version}</p>
            <div className="mt-4">
              <h4 className="font-medium">Sections:</h4>
              <ul className="list-disc list-inside">
                {Object.entries(template.sections).map(([key, section]) => (
                  <li key={key}>{section.title}</li>
                ))}
              </ul>
            </div>
            {hasRole('admin') && (
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsEditing(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => createNewVersion(template)}
                  className="text-green-500 hover:text-green-700"
                >
                  New Version
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {selectedTemplate.id ? 'Edit Template' : 'Create Template'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              createNewVersion(selectedTemplate);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={selectedTemplate.title}
                    onChange={e => setSelectedTemplate({
                      ...selectedTemplate,
                      title: e.target.value
                    })}
                    className="w-full border rounded p-2"
                  />
                </div>

                {Object.entries(selectedTemplate.sections).map(([key, section]) => (
                  <div key={key} className="border rounded p-4">
                    <h4 className="font-medium mb-2">{section.title}</h4>
                    <div className="space-y-2">
                      {section.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={metric.name}
                            onChange={e => {
                              const newMetrics = [...section.metrics];
                              newMetrics[idx].name = e.target.value;
                              handleSectionChange(key, {
                                ...section,
                                metrics: newMetrics
                              });
                            }}
                            className="border rounded p-1"
                          />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={metric.observation_required}
                              onChange={e => {
                                const newMetrics = [...section.metrics];
                                newMetrics[idx].observation_required = e.target.checked;
                                handleSectionChange(key, {
                                  ...section,
                                  metrics: newMetrics
                                });
                              }}
                              className="mr-1"
                            />
                            Required
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
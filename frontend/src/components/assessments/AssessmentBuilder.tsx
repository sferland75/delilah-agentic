import React, { useState, useEffect } from 'react';
import { AssessmentTemplate } from '../../types/template';
import { AssessmentData, AssessmentResponse } from '../../types/assessmentData';
import { templateApi } from '../../api/templateApi';

interface AssessmentBuilderProps {
  templateId: string;
  patientId: string;
  therapistId: string;
  initialData?: AssessmentData;
  onSave: (assessment: AssessmentData) => void;
  onCancel: () => void;
}

const AssessmentBuilder: React.FC<AssessmentBuilderProps> = ({
  templateId,
  patientId,
  therapistId,
  initialData,
  onSave,
  onCancel,
}) => {
  const [template, setTemplate] = useState<AssessmentTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, AssessmentResponse>>({});
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const templateData = await templateApi.getTemplate(templateId);
        setTemplate(templateData);
        
        if (initialData) {
          const responseMap: Record<string, AssessmentResponse> = {};
          initialData.sections.forEach(section => {
            section.responses.forEach(response => {
              responseMap[response.fieldId] = response;
            });
          });
          setResponses(responseMap);
          setNotes(initialData.notes || '');
        }
      } catch (err) {
        console.error('Error loading template:', err);
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, initialData]);

  const handleResponseChange = (fieldId: string, value: string | number | boolean | string[]) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: {
        fieldId,
        value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    const assessment: AssessmentData = {
      id: initialData?.id || crypto.randomUUID(),
      templateId,
      patientId,
      therapistId,
      status: 'draft',
      sections: template.sections.map(section => ({
        sectionId: section.id,
        responses: section.fields
          .map(field => responses[field.id])
          .filter((response): response is AssessmentResponse => !!response),
      })),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes,
    };

    onSave(assessment);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading template...</div>;
  }

  if (error || !template) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error: {error || 'Template not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{template.name}</h1>
          <p className="text-gray-600 mb-6">{template.description}</p>

          {template.sections.map(section => (
            <div key={section.id} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              {section.description && (
                <p className="text-gray-600 mb-4">{section.description}</p>
              )}

              <div className="space-y-6">
                {section.fields.map(field => {
                  const response = responses[field.id];
                  const value = response?.value ?? '';

                  return (
                    <div key={field.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === 'text' && (
                        <input
                          type="text"
                          value={value as string}
                          onChange={e => handleResponseChange(field.id, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required={field.required}
                        />
                      )}

                      {field.type === 'number' && (
                        <input
                          type="number"
                          value={value as number}
                          onChange={e => handleResponseChange(field.id, parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required={field.required}
                        />
                      )}

                      {field.type === 'textarea' && (
                        <textarea
                          value={value as string}
                          onChange={e => handleResponseChange(field.id, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={4}
                          required={field.required}
                        />
                      )}

                      {field.type === 'select' && (
                        <select
                          value={value as string}
                          onChange={e => handleResponseChange(field.id, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required={field.required}
                        >
                          <option value="">Select an option</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === 'radio' && (
                        <div className="space-y-2">
                          {field.options?.map(option => (
                            <label key={option} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={field.id}
                                value={option}
                                checked={value === option}
                                onChange={e => handleResponseChange(field.id, e.target.value)}
                                required={field.required}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {field.type === 'checkbox' && (
                        <div className="space-y-2">
                          {field.options?.map(option => (
                            <label key={option} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                value={option}
                                checked={(value as string[])?.includes(option)}
                                onChange={e => {
                                  const currentValues = (value as string[]) || [];
                                  const newValues = e.target.checked
                                    ? [...currentValues, option]
                                    : currentValues.filter(v => v !== option);
                                  handleResponseChange(field.id, newValues);
                                }}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Assessment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentBuilder;
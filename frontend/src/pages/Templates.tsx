import React, { useState, useEffect } from 'react';
import TemplateList from '../components/templates/TemplateList';
import TemplateEditor from '../components/templates/TemplateEditor';
import { AssessmentTemplate, TemplateStatus } from '../types/template';
import { templateApi } from '../api/templateApi';
import { ApiError } from '../api/templateApi';

const Templates: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<AssessmentTemplate> | undefined>(undefined);
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateApi.listTemplates();
      setTemplates(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError(err instanceof ApiError ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: AssessmentTemplate) => {
    setEditingTemplate(template);
    setIsEditing(true);
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateApi.deleteTemplate(templateId);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      } catch (err) {
        console.error('Failed to delete template:', err);
        alert(err instanceof ApiError ? err.message : 'Failed to delete template');
      }
    }
  };

  const handleStatusChange = async (templateId: string, status: TemplateStatus) => {
    try {
      const updatedTemplate = await templateApi.updateTemplateStatus(templateId, status);
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? updatedTemplate : t
      ));
    } catch (err) {
      console.error('Failed to update template status:', err);
      alert(err instanceof ApiError ? err.message : 'Failed to update template status');
    }
  };

  const handleCreateNew = () => {
    setEditingTemplate(undefined);
    setIsEditing(true);
  };

  const handleSave = async (template: AssessmentTemplate) => {
    try {
      if ('id' in template) {
        const updatedTemplate = await templateApi.updateTemplate(template.id, template);
        setTemplates(prev => prev.map(t => 
          t.id === template.id ? updatedTemplate : t
        ));
      } else {
        const newTemplate = await templateApi.createTemplate(template);
        setTemplates(prev => [...prev, newTemplate]);
      }
      setIsEditing(false);
      setEditingTemplate(undefined);
    } catch (err) {
      console.error('Failed to save template:', err);
      alert(err instanceof ApiError ? err.message : 'Failed to save template');
    }
  };

  if (isEditing) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setEditingTemplate(undefined);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assessment Templates</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Template
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200 p-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Template Library
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your assessment templates and their versions
            </p>
          </div>
        </div>
        
        <TemplateList
          templates={templates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default Templates;
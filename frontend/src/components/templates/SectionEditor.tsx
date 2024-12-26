import React from 'react';
import { AssessmentSection, AssessmentField } from '../../types/template';
import FieldEditor from './FieldEditor';

interface SectionEditorProps {
  section: AssessmentSection;
  onChange: (section: AssessmentSection) => void;
  onDelete: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onChange, onDelete }) => {
  const handleFieldChange = (index: number, updatedField: AssessmentField) => {
    const newFields = [...section.fields];
    newFields[index] = updatedField;
    onChange({ ...section, fields: newFields });
  };

  const handleAddField = () => {
    const newField: AssessmentField = {
      id: crypto.randomUUID(),
      label: 'New Field',
      type: 'text',
      required: false,
      description: '',
    };
    onChange({
      ...section,
      fields: [...section.fields, newField],
    });
  };

  const handleDeleteField = (index: number) => {
    const newFields = section.fields.filter((_, i) => i !== index);
    onChange({ ...section, fields: newFields });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={section.title}
            onChange={(e) => onChange({ ...section, title: e.target.value })}
            className="block w-full text-xl font-semibold border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Section Title"
          />
          <textarea
            value={section.description || ''}
            onChange={(e) => onChange({ ...section, description: e.target.value })}
            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Section Description"
            rows={2}
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="ml-4 p-2 text-gray-400 hover:text-red-500"
        >
          Delete Section
        </button>
      </div>

      <div className="space-y-4">
        {section.fields.map((field, index) => (
          <FieldEditor
            key={field.id}
            field={field}
            onChange={(updatedField) => handleFieldChange(index, updatedField)}
            onDelete={() => handleDeleteField(index)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddField}
        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Field
      </button>
    </div>
  );
};

export default SectionEditor;
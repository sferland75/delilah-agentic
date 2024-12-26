import React from 'react';
import { AssessmentField, FieldType } from '../../types/template';

interface FieldEditorProps {
  field: AssessmentField;
  onChange: (field: AssessmentField) => void;
  onDelete: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onChange, onDelete }) => {
  const fieldTypes: FieldType[] = ['text', 'number', 'select', 'radio', 'checkbox', 'textarea', 'scale'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...field, [name]: value });
  };

  const handleOptionsChange = (value: string) => {
    const options = value.split(',').map(opt => opt.trim()).filter(opt => opt);
    onChange({ ...field, options });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Field Label</label>
          <input
            type="text"
            name="label"
            value={field.label}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Field Type</label>
          <select
            name="type"
            value={field.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            {fieldTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Options (comma-separated)
            </label>
            <input
              type="text"
              value={field.options?.join(', ') || ''}
              onChange={(e) => handleOptionsChange(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Option 1, Option 2, Option 3"
            />
          </div>
        )}

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={field.description || ''}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {field.type === 'scale' && (
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Value</label>
              <input
                type="number"
                name="minValue"
                value={field.scoring?.scoreMap?.min || 0}
                onChange={(e) => onChange({
                  ...field,
                  scoring: {
                    ...field.scoring,
                    scoreMap: { ...field.scoring?.scoreMap, min: parseInt(e.target.value) }
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Value</label>
              <input
                type="number"
                name="maxValue"
                value={field.scoring?.scoreMap?.max || 10}
                onChange={(e) => onChange({
                  ...field,
                  scoring: {
                    ...field.scoring,
                    scoreMap: { ...field.scoring?.scoreMap, max: parseInt(e.target.value) }
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`required-${field.id}`}
            checked={field.required}
            onChange={(e) => onChange({ ...field, required: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor={`required-${field.id}`} className="ml-2 block text-sm text-gray-900">
            Required field
          </label>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
        >
          Delete Field
        </button>
      </div>
    </div>
  );
};

export default FieldEditor;
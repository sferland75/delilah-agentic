import React from 'react';
import { Link } from 'react-router-dom';
import { AssessmentTemplate } from '../../types/template';

interface TemplateListProps {
  templates: AssessmentTemplate[];
  onEdit: (template: AssessmentTemplate) => void;
  onDelete: (templateId: string) => void;
  onStatusChange: (templateId: string, status: 'draft' | 'active' | 'archived') => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {templates.map((template) => (
          <li key={template.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    <Link to={`/templates/${template.id}`} className="hover:text-blue-800">
                      {template.name}
                    </Link>
                  </p>
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                    {template.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={template.status}
                    onChange={(e) => onStatusChange(template.id, e.target.value as any)}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    onClick={() => onEdit(template)}
                    className="text-sm bg-white hover:bg-gray-50 text-gray-700 px-3 py-1 border rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(template.id)}
                    className="text-sm bg-white hover:bg-red-50 text-red-700 px-3 py-1 border border-red-300 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Version: {template.version}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Sections: {template.sections.length}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Updated: {new Date(template.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{template.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateList;
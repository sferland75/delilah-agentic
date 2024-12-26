import React, { useState } from 'react';

export interface AssessmentFormData {
  functional_mobility: {
    score: number;
    notes: string;
  };
  cognitive_status: {
    score: number;
    notes: string;
  };
  activities_daily_living: {
    score: number;
    notes: string;
  };
}

export interface AssessmentFormProps {
  patientId: string;
  onSubmit: (data: AssessmentFormData) => void;
  initialData?: AssessmentFormData;
}

const initialFormData: AssessmentFormData = {
  functional_mobility: { score: 0, notes: '' },
  cognitive_status: { score: 0, notes: '' },
  activities_daily_living: { score: 0, notes: '' },
};

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  patientId,
  onSubmit,
  initialData = initialFormData
}) => {
  const [data, setData] = useState<AssessmentFormData>(initialData);

  const handleScoreChange = (category: keyof AssessmentFormData, value: string) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        score: parseInt(value) || 0
      }
    }));
  };

  const handleNotesChange = (category: keyof AssessmentFormData, value: string) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        notes: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.entries(data).map(([category, values]) => (
        <div key={category} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">
            {category.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={values.score}
                onChange={e => handleScoreChange(category as keyof AssessmentFormData, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={values.notes}
                onChange={e => handleNotesChange(category as keyof AssessmentFormData, e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Assessment
        </button>
      </div>
    </form>
  );
};

export default AssessmentForm;
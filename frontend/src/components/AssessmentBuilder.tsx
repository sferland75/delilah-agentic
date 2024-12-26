import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface AssessmentTemplate {
  id: string;
  title: string;
  sections: {
    [key: string]: {
      title: string;
      metrics: Array<{
        name: string;
        observation_required: boolean;
        score_range: [number, number];
      }>;
    };
  };
}

interface AssessmentData {
  template_id: string;
  patient_id: string;
  sections: {
    [key: string]: {
      [metric: string]: {
        score: number;
        observation: string;
        pre_accident?: string;
        post_accident?: string;
      };
    };
  };
}

const AssessmentBuilder: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    template_id: '',
    patient_id: patientId || '',
    sections: {}
  });

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
      const data = await response.json();
      setTemplates(data);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setAssessmentData({
        ...assessmentData,
        template_id: templateId,
        sections: Object.fromEntries(
          Object.keys(template.sections).map(section => [
            section,
            Object.fromEntries(
              template.sections[section].metrics.map(metric => [
                metric.name,
                { score: 0, observation: '' }
              ])
            )
          ])
        )
      });
    }
  };

  const handleMetricChange = (
    section: string,
    metric: string,
    field: 'score' | 'observation' | 'pre_accident' | 'post_accident',
    value: string | number
  ) => {
    setAssessmentData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          [metric]: {
            ...prev.sections[section][metric],
            [field]: value
          }
        }
      }
    }));
  };

  const validateAssessment = (): boolean => {
    if (!selectedTemplate) return false;

    for (const [section, sectionData] of Object.entries(selectedTemplate.sections)) {
      for (const metric of sectionData.metrics) {
        const metricData = assessmentData.sections[section]?.[metric.name];
        if (!metricData) return false;
        
        if (metric.observation_required && !metricData.observation) {
          return false;
        }
        
        if (metricData.score < metric.score_range[0] || 
            metricData.score > metric.score_range[1]) {
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateAssessment()) {
      alert('Please complete all required fields');
      return;
    }

    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assessmentData)
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/assessments/${result.id}`);
      } else {
        throw new Error('Failed to create assessment');
      }
    } catch (error) {
      alert('Error creating assessment');
    }
  };

  const renderMetricInput = (
    section: string,
    metric: {
      name: string;
      observation_required: boolean;
      score_range: [number, number];
    }
  ) => (
    <div key={metric.name} className="border rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Score ({metric.score_range[0]}-{metric.score_range[1]})
          </label>
          <input
            type="number"
            min={metric.score_range[0]}
            max={metric.score_range[1]}
            value={assessmentData.sections[section]?.[metric.name]?.score || 0}
            onChange={e => handleMetricChange(section, metric.name, 'score', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Observation {metric.observation_required && '*'}
          </label>
          <textarea
            value={assessmentData.sections[section]?.[metric.name]?.observation || ''}
            onChange={e => handleMetricChange(section, metric.name, 'observation', e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pre-Accident Status</label>
          <textarea
            value={assessmentData.sections[section]?.[metric.name]?.pre_accident || ''}
            onChange={e => handleMetricChange(section, metric.name, 'pre_accident', e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Post-Accident Status</label>
          <textarea
            value={assessmentData.sections[section]?.[metric.name]?.post_accident || ''}
            onChange={e => handleMetricChange(section, metric.name, 'post_accident', e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  if (!selectedTemplate) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Select Assessment Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className="border rounded-lg p-4 text-left hover:bg-gray-50"
            >
              <h3 className="font-medium">{template.title}</h3>
              <p className="text-sm text-gray-500">
                {Object.keys(template.sections).length} sections
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedTemplate.title}</h2>
        <button
          onClick={() => setSelectedTemplate(null)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Change Template
        </button>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
        {Object.entries(selectedTemplate.sections).map(([sectionKey, section]) => (
          <div key={sectionKey} className="space-y-4">
            <h3 className="text-xl font-medium">{section.title}</h3>
            {section.metrics.map(metric => renderMetricInput(sectionKey, metric))}
          </div>
        ))}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Assessment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentBuilder;
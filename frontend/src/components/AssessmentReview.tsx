import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Assessment {
  id: string;
  template_id: string;
  patient_id: string;
  created_by: {
    id: string;
    full_name: string;
  };
  reviewed_by?: {
    id: string;
    full_name: string;
  };
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
  review_notes?: {
    [section: string]: {
      comments: string;
      recommendations: string[];
    };
  };
  status: 'draft' | 'in_review' | 'completed';
  created_at: string;
  updated_at: string;
}

const AssessmentReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, { comments: string; recommendations: string[] }>>({});

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    const response = await fetch(`/api/assessments/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setAssessment(data);
      setReviewNotes(data.review_notes || {});
    }
  };

  const handleReviewSubmit = async () => {
    const response = await fetch(`/api/assessments/${id}/review`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ review_notes: reviewNotes })
    });

    if (response.ok) {
      navigate(`/assessments/${id}`);
    }
  };

  if (!assessment) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Assessment Review</h2>
            <p className="text-gray-600">Created by {assessment.created_by.full_name}</p>
            <p className="text-gray-600">
              {new Date(assessment.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            assessment.status === 'completed' ? 'bg-green-100 text-green-800' :
            assessment.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {assessment.status}
          </span>
        </div>
      </div>

      {Object.entries(assessment.sections).map(([sectionKey, sectionData]) => (
        <div key={sectionKey} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 capitalize">
            {sectionKey.replace(/_/g, ' ')}
          </h3>

          <div className="space-y-6">
            {Object.entries(sectionData).map(([metricKey, metricData]) => (
              <div key={metricKey} className="border-t pt-4">
                <h4 className="font-medium capitalize mb-2">
                  {metricKey.replace(/_/g, ' ')}
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Score</p>
                    <p className="mt-1">{metricData.score}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Observation</p>
                    <p className="mt-1">{metricData.observation}</p>
                  </div>
                </div>

                {(metricData.pre_accident || metricData.post_accident) && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pre-Accident</p>
                      <p className="mt-1">{metricData.pre_accident}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Post-Accident</p>
                      <p className="mt-1">{metricData.post_accident}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {hasRole('reviewer') && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium mb-2">Review Notes</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Comments
                    </label>
                    <textarea
                      value={reviewNotes[sectionKey]?.comments || ''}
                      onChange={e => setReviewNotes(prev => ({
                        ...prev,
                        [sectionKey]: {
                          ...prev[sectionKey],
                          comments: e.target.value
                        }
                      }))}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Recommendations
                    </label>
                    <div className="mt-1 space-y-2">
                      {(reviewNotes[sectionKey]?.recommendations || ['']).map((rec, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={rec}
                            onChange={e => {
                              const newRecs = [...(reviewNotes[sectionKey]?.recommendations || [])];
                              newRecs[idx] = e.target.value;
                              setReviewNotes(prev => ({
                                ...prev,
                                [sectionKey]: {
                                  ...prev[sectionKey],
                                  recommendations: newRecs
                                }
                              }));
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newRecs = [...(reviewNotes[sectionKey]?.recommendations || [])];
                              if (newRecs.length > 1) {
                                newRecs.splice(idx, 1);
                              } else {
                                newRecs[0] = '';
                              }
                              setReviewNotes(prev => ({
                                ...prev,
                                [sectionKey]: {
                                  ...prev[sectionKey],
                                  recommendations: newRecs
                                }
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setReviewNotes(prev => ({
                          ...prev,
                          [sectionKey]: {
                            ...prev[sectionKey],
                            recommendations: [...(prev[sectionKey]?.recommendations || []), '']
                          }
                        }))}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Add Recommendation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {hasRole('reviewer') && (
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReviewSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default AssessmentReview;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Assessment {
  id: string;
  assessment_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  data: {
    [key: string]: {
      score: number;
      notes: string;
    };
  };
  created_by: {
    full_name: string;
  };
  reviewed_by?: {
    full_name: string;
  };
}

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch assessment');
      setAssessment(await response.json());
    } catch (err) {
      setError('Error fetching assessment data');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    try {
      const response = await fetch(`/api/assessments/${id}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to review assessment');
      await fetchAssessment();
    } catch (err) {
      setError('Error reviewing assessment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!assessment) return <div>Assessment not found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{assessment.assessment_type}</h2>
            <p className="text-gray-500">Created by {assessment.created_by.full_name}</p>
            <p className="text-gray-500">
              {new Date(assessment.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
              assessment.status === 'reviewed' ? 'bg-green-100 text-green-800' :
              assessment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {assessment.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Assessment Details</h3>
        <div className="space-y-6">
          {Object.entries(assessment.data).map(([category, data]) => (
            <div key={category} className="border-t pt-4">
              <h4 className="font-medium capitalize">{category.replace(/_/g, ' ')}</h4>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-lg">{data.score}/10</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-gray-700">{data.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasRole('reviewer') && assessment.status !== 'reviewed' && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleReview}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Mark as Reviewed
          </button>
        </div>
      )}
    </div>
  );
};

export default AssessmentDetail;
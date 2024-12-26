import React, { useState, useEffect } from 'react';
import { AssessmentData } from '../../types/assessmentData';
import { AssessmentTemplate } from '../../types/template';
import { assessmentApi } from '../../api/assessmentApi';
import { templateApi } from '../../api/templateApi';

interface AssessmentReviewProps {
  assessmentId: string;
  reviewerId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const AssessmentReview: React.FC<AssessmentReviewProps> = ({
  assessmentId,
  reviewerId,
  onComplete,
  onCancel,
}) => {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [template, setTemplate] = useState<AssessmentTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [approved, setApproved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const assessmentData = await assessmentApi.getAssessment(assessmentId);
        setAssessment(assessmentData);

        const templateData = await templateApi.getTemplate(assessmentData.templateId);
        setTemplate(templateData);
      } catch (err) {
        console.error('Error loading assessment data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment) return;

    setSubmitting(true);
    try {
      await assessmentApi.reviewAssessment(
        assessmentId,
        reviewerId,
        reviewNotes,
        approved
      );
      onComplete();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading assessment...</div>;
  }

  if (error || !assessment || !template) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error: {error || 'Assessment or template not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Review Assessment</h1>

        {/* Assessment Information */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Template</h3>
              <p className="mt-1">{template.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 capitalize">{assessment.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1">{new Date(assessment.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1">{new Date(assessment.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Assessment Sections Review */}
        {template.sections.map(section => {
          const sectionData = assessment.sections.find(s => s.sectionId === section.id);
          
          return (
            <div key={section.id} className="mb-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              
              <div className="space-y-6">
                {section.fields.map(field => {
                  const response = sectionData?.responses.find(r => r.fieldId === field.id);
                  
                  return (
                    <div key={field.id} className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">{field.label}</h3>
                      
                      <div className="text-gray-700">
                        {response ? (
                          Array.isArray(response.value) ? (
                            response.value.join(', ')
                          ) : (
                            String(response.value)
                          )
                        ) : (
                          <span className="text-gray-400">No response provided</span>
                        )}
                      </div>

                      {response?.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Notes:</strong> {response.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Assessment Notes */}
        {assessment.notes && (
          <div className="mb-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Assessment Notes</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              {assessment.notes}
            </div>
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="border-t pt-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Review Notes</label>
              <textarea
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="approved"
                checked={approved}
                onChange={e => setApproved(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="approved" className="ml-2 block text-sm text-gray-900">
                Approve Assessment
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Submit Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentReview;
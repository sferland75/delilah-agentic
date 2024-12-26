import React, { useState, useEffect } from 'react';
import { Assessment } from '../types/assessment';
import { fetchAssessments } from '../api/api';

const DetailedDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const data = await fetchAssessments();
        console.log('Loaded assessments:', data);
        setAssessments(data);
      } catch (error) {
        console.error('Error loading assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, []);

  const filteredAssessments = filterStatus === 'all'
    ? assessments
    : assessments.filter(a => a.status === filterStatus);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading assessments...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assessment Explorer</h1>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Assessments List */}
        <div className="col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Assessments</h2>
          <div className="space-y-2">
            {filteredAssessments.map(assessment => (
              <div
                key={assessment.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors
                  ${selectedAssessment?.id === assessment.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50 border-gray-200'
                  }`}
                onClick={() => setSelectedAssessment(assessment)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{assessment.assessment_type}</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(assessment.status)}`}>
                    {assessment.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Patient: {assessment.patient_info.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Details */}
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Assessment Details</h2>
          {selectedAssessment ? (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3">Patient Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <div className="mt-1 text-sm">{selectedAssessment.patient_info.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Age</label>
                    <div className="mt-1 text-sm">{selectedAssessment.patient_info.age}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Gender</label>
                    <div className="mt-1 text-sm">{selectedAssessment.patient_info.gender}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Assessment ID</label>
                  <div className="mt-1 text-sm">{selectedAssessment.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Type</label>
                  <div className="mt-1 text-sm">{selectedAssessment.assessment_type}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Created</label>
                  <div className="mt-1 text-sm">
                    {new Date(selectedAssessment.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Updated</label>
                  <div className="mt-1 text-sm">
                    {new Date(selectedAssessment.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(selectedAssessment.status)}`}>
                    {selectedAssessment.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Select an assessment to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedDashboard;
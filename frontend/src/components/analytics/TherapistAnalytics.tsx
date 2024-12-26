import React, { useState, useEffect } from 'react';
import { TherapistMetrics, analyticsApi } from '../../api/analyticsApi';

interface TherapistAnalyticsProps {
  therapistId: string;
}

const TherapistAnalytics: React.FC<TherapistAnalyticsProps> = ({ therapistId }) => {
  const [metrics, setMetrics] = useState<TherapistMetrics | null>(null);
  const [timeframeDays, setTimeframeDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await analyticsApi.getTherapistMetrics(therapistId, timeframeDays);
        setMetrics(data);
      } catch (err) {
        console.error('Error loading therapist metrics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [therapistId, timeframeDays]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-600">Loading therapist metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Therapist Analytics</h2>
        <div className="flex space-x-2">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeframeDays(days)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                timeframeDays === days
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Last {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assessments Assigned */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Assessments Assigned</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.assessments_assigned}
          </p>
        </div>

        {/* Assessments Completed */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Assessments Completed</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.assessments_completed}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {((metrics.assessments_completed / metrics.assessments_assigned) * 100).toFixed(1)}% completion rate
          </p>
        </div>

        {/* Average Review Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Average Review Time</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.average_review_time} min
          </p>
        </div>

        {/* Patient Count */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Patients</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.patient_count}
          </p>
        </div>

        {/* Average Patient Score */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Average Patient Score</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.average_patient_score.toFixed(1)}
          </p>
        </div>

        {/* Efficiency Score */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Efficiency Score</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {calculateEfficiencyScore(metrics)}%
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Based on completion rate and review time
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate efficiency score
const calculateEfficiencyScore = (metrics: TherapistMetrics): number => {
  const completionRate = metrics.assessments_completed / metrics.assessments_assigned;
  const reviewTimeScore = Math.max(0, 1 - (metrics.average_review_time - 20) / 40); // Assumes 20min is ideal, 60min is poor
  return Math.round((completionRate * 0.6 + reviewTimeScore * 0.4) * 100);
};

export default TherapistAnalytics;
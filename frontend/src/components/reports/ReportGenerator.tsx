import React, { useState } from 'react';
import { ReportConfig, reportingApi } from '../../api/reportingApi';

const reportTypes = [
  { value: 'assessment', label: 'Assessment Report' },
  { value: 'patient', label: 'Patient Report' },
  { value: 'therapist', label: 'Therapist Report' },
  { value: 'summary', label: 'Summary Report' },
];

const availableMetrics = {
  assessment: [
    { value: 'completion_time', label: 'Completion Time' },
    { value: 'score', label: 'Score' },
    { value: 'score_improvement', label: 'Score Improvement' },
    { value: 'review_time', label: 'Review Time' },
  ],
  patient: [
    { value: 'assessments_count', label: 'Number of Assessments' },
    { value: 'average_score', label: 'Average Score' },
    { value: 'progress', label: 'Progress' },
    { value: 'completion_rate', label: 'Completion Rate' },
  ],
  therapist: [
    { value: 'assessments_completed', label: 'Assessments Completed' },
    { value: 'average_review_time', label: 'Average Review Time' },
    { value: 'patients_count', label: 'Number of Patients' },
    { value: 'average_patient_score', label: 'Average Patient Score' },
  ],
  summary: [
    { value: 'total_assessments', label: 'Total Assessments' },
    { value: 'active_patients', label: 'Active Patients' },
    { value: 'average_completion_time', label: 'Average Completion Time' },
    { value: 'average_score', label: 'Average Score' },
  ],
};

interface ReportGeneratorProps {
  onReportGenerated: (report: any) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onReportGenerated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'assessment' | 'patient' | 'therapist' | 'summary'>('assessment');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config: ReportConfig = {
        id: crypto.randomUUID(),
        name,
        type,
        filters: {
          date_range: {
            start: dateRange.start,
            end: dateRange.end,
          },
        },
        metrics: selectedMetrics,
      };

      const report = await reportingApi.generateReport(config);
      onReportGenerated(report);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Report Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Report Type</label>
        <select
          value={type}
          onChange={e => {
            setType(e.target.value as any);
            setSelectedMetrics([]);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          {reportTypes.map(reportType => (
            <option key={reportType.value} value={reportType.value}>
              {reportType.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Metrics</label>
        <div className="space-y-2">
          {availableMetrics[type].map(metric => (
            <label key={metric.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric.value)}
                onChange={() => handleMetricToggle(metric.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="ml-2 text-sm text-gray-700">{metric.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || selectedMetrics.length === 0}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </form>
  );
};

export default ReportGenerator;
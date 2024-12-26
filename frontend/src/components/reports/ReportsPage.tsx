import React, { useState, useEffect } from 'react';
import { ReportResult, reportingApi } from '../../api/reportingApi';
import ReportGenerator from './ReportGenerator';
import ReportViewer from './ReportViewer';

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportResult[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportResult | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportingApi.listReports();
      setReports(data);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleReportGenerated = (report: ReportResult) => {
    setReports(prev => [report, ...prev]);
    setSelectedReport(report);
    setShowGenerator(false);
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await reportingApi.deleteReport(reportId);
      setReports(prev => prev.filter(report => report.id !== reportId));
      if (selectedReport?.id === reportId) {
        setSelectedReport(null);
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      // Show error message to user
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading reports...</div>
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

  if (selectedReport) {
    return (
      <ReportViewer
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  if (showGenerator) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Generate New Report</h1>
          <button
            onClick={() => setShowGenerator(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Reports
          </button>
        </div>
        <ReportGenerator onReportGenerated={handleReportGenerated} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button
          onClick={() => setShowGenerator(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Generate New Report
        </button>
      </div>

      {/* Reports List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No reports generated yet</p>
            <button
              onClick={() => setShowGenerator(true)}
              className="mt-4 text-blue-600 hover:text-blue-500"
            >
              Generate your first report
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reports.map(report => (
              <li key={report.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {report.configId}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {report.data.length} records
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500">
                          Generated {new Date(report.generatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-sm text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;